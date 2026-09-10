$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$releaseScript = Join-Path $projectRoot "release/manage-chrome-web-store-release.ps1"
$packagePath = Join-Path $projectRoot "dist/arrowkey-search-navigator-0.1.2.zip"
$approvedHash = "09C0ED53F0EF49D21F69452AEB339E06DA9D4B81B21C34A7A4B3E674329E0AEA"
$passed = 0

function Assert-Equal {
  param($Actual, $Expected, [string]$Message)
  if ($Actual -ne $Expected) { throw "$Message Expected '$Expected', received '$Actual'." }
}

$validationJson = & $releaseScript -Action Validate -PackagePath $packagePath `
  -ApprovedVersion "0.1.2" -ExpectedSha256 $approvedHash
$validation = $validationJson | ConvertFrom-Json
Assert-Equal $validation.itemId "eifanigljpfnmmdfeefjdioelbkgmeja" "Validate returned the wrong item."
Assert-Equal $validation.name "ArrowKey Search Navigator" "Validate returned the wrong name."
Assert-Equal $validation.version "0.1.2" "Validate returned the wrong version."
Assert-Equal $validation.sha256 $approvedHash.ToLowerInvariant() "Validate returned the wrong hash."
Assert-Equal $validation.externalWrite $false "Validate must report no external write."
$passed++

try {
  & $releaseScript -Action Validate -PackagePath $packagePath `
    -ApprovedVersion "0.1.2" -ExpectedSha256 ("0" * 64) | Out-Null
  throw "Validate accepted an unapproved hash."
} catch {
  if ($_.Exception.Message -notmatch "SHA-256 does not match") { throw }
}
$passed++

try {
  & $releaseScript -Action Release | Out-Null
  throw "Release proceeded without -ConfirmRelease."
} catch {
  if ($_.Exception.Message -notmatch "-ConfirmRelease") { throw }
}
try {
  & $releaseScript -Action Release -ConfirmRelease | Out-Null
  throw "Release proceeded without an explicit publication mode."
} catch {
  if ($_.Exception.Message -notmatch "explicit -PublishType") { throw }
}
$passed++

Write-Output "chrome-web-store-release.execution.tests.ps1 passed=$passed"
