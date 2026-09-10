param(
  [ValidateSet("Status", "Validate", "Release")]
  [string]$Action = "Status",
  [string]$PackagePath = "dist/arrowkey-search-navigator-0.1.2.zip",
  [string]$ApprovedVersion,
  [string]$ExpectedSha256,
  [switch]$ConfirmRelease,
  [ValidateSet("DEFAULT_PUBLISH", "STAGED_PUBLISH")]
  [string]$PublishType,
  [string]$GcloudPath
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$configPath = Join-Path $PSScriptRoot "chrome-web-store-publisher-config.json"
$readOnlyScope = "https://www.googleapis.com/auth/chromewebstore.readonly"
$writeScope = "https://www.googleapis.com/auth/chromewebstore"

function Resolve-GcloudPath {
  param([string]$RequestedPath)

  if ($RequestedPath) {
    $resolved = [System.IO.Path]::GetFullPath($RequestedPath)
    if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
      throw "The supplied gcloud executable does not exist: $resolved"
    }
    return $resolved
  }
  foreach ($commandName in @("gcloud.cmd", "gcloud")) {
    $command = Get-Command $commandName -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }
  }
  $candidatePaths = @()
  if ($env:LOCALAPPDATA) {
    $candidatePaths += Join-Path $env:LOCALAPPDATA "Google/Cloud SDK/google-cloud-sdk/bin/gcloud.cmd"
    $versionedRoots = Get-ChildItem -LiteralPath (Join-Path $env:LOCALAPPDATA "Google") -Directory -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -like "Cloud SDK *" } |
      Sort-Object Name -Descending
    foreach ($root in $versionedRoots) {
      $candidatePaths += Join-Path $root.FullName "google-cloud-sdk/bin/gcloud.cmd"
    }
  }
  foreach ($candidate in $candidatePaths) {
    if (Test-Path -LiteralPath $candidate -PathType Leaf) { return $candidate }
  }
  throw "Google Cloud CLI was not found. Install gcloud or pass -GcloudPath explicitly."
}

function Get-ShortLivedAccessToken {
  param([string]$Executable, [pscustomobject]$Config, [string]$Scope)

  $tokenOutput = & $Executable auth print-access-token `
    "--impersonate-service-account=$($Config.serviceAccountEmail)" `
    "--project=$($Config.projectId)" `
    "--scopes=$Scope" `
    --quiet 2>$null
  if ($LASTEXITCODE -ne 0) {
    throw "Could not obtain a short-lived Store token. Confirm that gcloud is signed in and service-account impersonation is still authorized."
  }
  $token = [string]($tokenOutput | Select-Object -Last 1)
  $token = $token.Trim()
  if ($token.Length -lt 20 -or $token -notmatch '^[A-Za-z0-9._~-]+$') {
    throw "gcloud did not return a valid access token."
  }
  return $token
}

function Get-Sha256 {
  param([byte[]]$Bytes)

  $algorithm = [System.Security.Cryptography.SHA256]::Create()
  try {
    $hashBytes = $algorithm.ComputeHash($Bytes)
    return ([System.BitConverter]::ToString($hashBytes)).Replace("-", "").ToLowerInvariant()
  } finally {
    $algorithm.Dispose()
  }
}

function Get-PackageEvidence {
  param([string]$RequestedPackagePath, [string]$Version, [string]$Sha256, [pscustomobject]$Config)

  if (-not $Version -or $Version -notmatch '^\d+(\.\d+){0,3}$') {
    throw "A valid -ApprovedVersion is required for validation or release."
  }
  if (-not $Sha256 -or $Sha256 -notmatch '^[A-Fa-f0-9]{64}$') {
    throw "A 64-character -ExpectedSha256 is required for validation or release."
  }
  $candidate = if ([System.IO.Path]::IsPathRooted($RequestedPackagePath)) {
    $RequestedPackagePath
  } else {
    Join-Path $projectRoot $RequestedPackagePath
  }
  $resolvedPackage = [System.IO.Path]::GetFullPath($candidate)
  $distRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot "dist"))
  $distPrefix = $distRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
  if (-not $resolvedPackage.StartsWith($distPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "The Store package must be a file inside the project dist directory."
  }
  if (-not (Test-Path -LiteralPath $resolvedPackage -PathType Leaf)) {
    throw "The Store package does not exist: $resolvedPackage"
  }
  if ((Get-Item -LiteralPath $resolvedPackage).Length -gt 50MB) {
    throw "The Store package exceeds the 50 MB local safety limit."
  }
  $packageBytes = [System.IO.File]::ReadAllBytes($resolvedPackage)
  $actualSha256 = Get-Sha256 $packageBytes
  if ($actualSha256 -ne $Sha256.ToLowerInvariant()) {
    throw "The Store package SHA-256 does not match the approved hash."
  }

  Add-Type -AssemblyName System.IO.Compression
  $stream = [System.IO.MemoryStream]::new($packageBytes, $false)
  try {
    $archive = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Read, $false)
    try {
      $manifestEntries = @($archive.Entries | Where-Object { $_.FullName -eq "manifest.json" })
      if ($manifestEntries.Count -ne 1) {
        throw "The Store package must contain exactly one root manifest.json."
      }
      $manifestStream = $manifestEntries[0].Open()
      try {
        $reader = [System.IO.StreamReader]::new($manifestStream)
        try { $manifest = $reader.ReadToEnd() | ConvertFrom-Json } finally { $reader.Dispose() }
      } finally { $manifestStream.Dispose() }
    } finally { $archive.Dispose() }
  } finally { $stream.Dispose() }

  if ($manifest.name -ne $Config.expectedExtensionName) {
    throw "The package name does not match the configured extension name."
  }
  if ($manifest.version -ne $Version) {
    throw "The package manifest version does not match -ApprovedVersion."
  }
  return [pscustomobject]@{
    Path = $resolvedPackage
    Version = $manifest.version
    Name = $manifest.name
    Sha256 = $actualSha256
    Bytes = $packageBytes
  }
}

function Get-RevisionSummary {
  param($Revision)
  if ($null -eq $Revision) { return $null }
  $channels = @($Revision.distributionChannels | ForEach-Object {
    [ordered]@{ crxVersion = $_.crxVersion; deployPercentage = $_.deployPercentage }
  })
  return [ordered]@{ state = $Revision.state; distributionChannels = $channels }
}

function Get-SanitizedStatus {
  param($Status)
  return [ordered]@{
    itemId = $Status.itemId
    published = Get-RevisionSummary $Status.publishedItemRevisionStatus
    submitted = Get-RevisionSummary $Status.submittedItemRevisionStatus
    lastAsyncUploadState = $Status.lastAsyncUploadState
    warned = [bool]$Status.warned
    takenDown = [bool]$Status.takenDown
  }
}

$config = Get-Content -Raw -LiteralPath $configPath | ConvertFrom-Json
$resourceName = "publishers/$($config.publisherId)/items/$($config.itemId)"
$statusUri = "https://chromewebstore.googleapis.com/v2/${resourceName}:fetchStatus"
$uploadUri = "https://chromewebstore.googleapis.com/upload/v2/${resourceName}:upload"
$submitUri = "https://chromewebstore.googleapis.com/v2/${resourceName}:publish"

if ($Action -eq "Release" -and -not $ConfirmRelease) {
  throw "Release requires the release-specific -ConfirmRelease switch."
}
if ($Action -eq "Release" -and -not $PublishType) {
  throw "Release requires an explicit -PublishType choice."
}

$packageEvidence = $null
if ($Action -in @("Validate", "Release")) {
  $packageEvidence = Get-PackageEvidence $PackagePath $ApprovedVersion $ExpectedSha256 $config
}
if ($Action -eq "Validate") {
  [ordered]@{
    itemId = $config.itemId
    name = $packageEvidence.Name
    version = $packageEvidence.Version
    sha256 = $packageEvidence.Sha256
    packagePath = $packageEvidence.Path
    externalWrite = $false
  } | ConvertTo-Json -Depth 4
  return
}

$resolvedGcloud = Resolve-GcloudPath $GcloudPath
$accessToken = $null
try {
  $scope = if ($Action -eq "Status") { $readOnlyScope } else { $writeScope }
  $accessToken = Get-ShortLivedAccessToken $resolvedGcloud $config $scope
  $headers = @{ Authorization = "Bearer $accessToken" }
  if ($Action -eq "Status") {
    $status = Invoke-RestMethod -Method Get -Uri $statusUri -Headers $headers
    Get-SanitizedStatus $status | ConvertTo-Json -Depth 6
    return
  }

  $preReleaseStatus = Invoke-RestMethod -Method Get -Uri $statusUri -Headers $headers
  if ($preReleaseStatus.itemId -and $preReleaseStatus.itemId -ne $config.itemId) {
    throw "The Store returned an unexpected item ID before release."
  }
  if ($preReleaseStatus.takenDown -or $preReleaseStatus.warned) {
    throw "The Store reports a policy warning or takedown. Review the dashboard before release."
  }
  if ($preReleaseStatus.submittedItemRevisionStatus) {
    throw "The Store already has a submitted revision. Review its status before another release."
  }
  if ($preReleaseStatus.lastAsyncUploadState -eq "IN_PROGRESS") {
    throw "A previous Store upload is still processing. Nothing was uploaded or submitted."
  }

  $upload = Invoke-RestMethod -Method Post -Uri $uploadUri -Headers $headers `
    -Body $packageEvidence.Bytes -ContentType "application/zip"
  if ($upload.itemId -ne $config.itemId) {
    throw "The Store returned an unexpected item ID. Nothing was submitted."
  }
  if ($upload.uploadState -ne "SUCCEEDED") {
    throw "The Store did not synchronously confirm the exact upload. Nothing was submitted; check Status before deciding whether to retry."
  }
  if ($upload.crxVersion -ne $packageEvidence.Version) {
    throw "The Store did not confirm the approved extension version. Nothing was submitted."
  }

  $submitBody = [ordered]@{
    publishType = $PublishType
    skipReview = $false
    blockOnWarnings = $true
  } | ConvertTo-Json
  $submission = Invoke-RestMethod -Method Post -Uri $submitUri -Headers $headers `
    -Body $submitBody -ContentType "application/json"
  if ($submission.itemId -ne $config.itemId) {
    throw "The Store returned an unexpected item ID after submission. Check the dashboard immediately."
  }
  [ordered]@{
    itemId = $submission.itemId
    version = $packageEvidence.Version
    sha256 = $packageEvidence.Sha256
    uploadState = $upload.uploadState
    submissionState = $submission.state
    publishType = $PublishType
    skipReview = $false
    blockOnWarnings = $true
    warnings = @($submission.warningInfo.warnings)
  } | ConvertTo-Json -Depth 6
} finally {
  $accessToken = $null
}
