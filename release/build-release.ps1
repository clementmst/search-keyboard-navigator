param(
  [string]$OutputPath = "dist/arrowkey-search-navigator-0.2.0.zip"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$allowlistPath = Join-Path $PSScriptRoot "ALLOWLIST.txt"
$releaseFiles = Get-Content -LiteralPath $allowlistPath | Where-Object { $_.Trim() }
$resolvedOutput = [System.IO.Path]::GetFullPath((Join-Path $projectRoot $OutputPath))
$distRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot "dist"))
$distPrefix = $distRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
if (-not $resolvedOutput.StartsWith($distPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Release output must stay inside the project dist directory."
}
$outputDirectory = Split-Path -Parent $resolvedOutput
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

foreach ($relativePath in $releaseFiles) {
  $sourcePath = Join-Path $projectRoot $relativePath
  if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
    throw "Missing allowlisted file: $relativePath"
  }
}

if (Test-Path -LiteralPath $resolvedOutput) {
  Remove-Item -LiteralPath $resolvedOutput
}

$stream = [System.IO.File]::Open($resolvedOutput, [System.IO.FileMode]::CreateNew)
try {
  $archive = [System.IO.Compression.ZipArchive]::new(
    $stream,
    [System.IO.Compression.ZipArchiveMode]::Create,
    $false
  )
  try {
    foreach ($relativePath in $releaseFiles) {
      $entryName = $relativePath.Replace("\", "/")
      $entry = $archive.CreateEntry(
        $entryName,
        [System.IO.Compression.CompressionLevel]::NoCompression
      )
      $entry.LastWriteTime = [System.DateTimeOffset]::new(2000, 1, 1, 0, 0, 0, [System.TimeSpan]::Zero)
      $entryStream = $entry.Open()
      try {
        $bytes = [System.IO.File]::ReadAllBytes((Join-Path $projectRoot $relativePath))
        $entryStream.Write($bytes, 0, $bytes.Length)
      } finally {
        $entryStream.Dispose()
      }
    }
  } finally {
    $archive.Dispose()
  }
} finally {
  $stream.Dispose()
}

$hash = (Get-FileHash -LiteralPath $resolvedOutput -Algorithm SHA256).Hash.ToLowerInvariant()
Write-Output "$hash  $resolvedOutput"
