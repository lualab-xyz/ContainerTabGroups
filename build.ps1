# Build Script for Container Tab Groups
# Creates a distributable ZIP package

param(
    [string]$Version = "1.0.0",
    [switch]$IncludeSource = $false
)

Write-Host "`n🔨 Building Container Tab Groups v$Version`n" -ForegroundColor Cyan

# Create dist directory if it doesn't exist
$distDir = "dist"
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir | Out-Null
    Write-Host "✅ Created dist directory" -ForegroundColor Green
}

# Files to include in the extension package
$extensionFiles = @(
    "manifest.json",
    "background.js",
    "options.html",
    "options.js",
    "options.css",
    "i18n.js",
    "icons"
)

# Output filename
$outputFile = "$distDir/ContainerTabGroups-v$Version.zip"

# Remove old package if exists
if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
    Write-Host "🗑️  Removed old package" -ForegroundColor Yellow
}

# Verify all files exist
Write-Host "`n📋 Checking files..." -ForegroundColor Cyan
$allFilesExist = $true
foreach ($file in $extensionFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file - NOT FOUND!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`n❌ Build failed: Some files are missing" -ForegroundColor Red
    exit 1
}

# Create the package
Write-Host "`n📦 Creating package..." -ForegroundColor Cyan
try {
    Compress-Archive -Path $extensionFiles -DestinationPath $outputFile -Force
    Write-Host "✅ Package created: $outputFile" -ForegroundColor Green
    
    # Show package size
    $size = (Get-Item $outputFile).Length
    $sizeKB = [math]::Round($size / 1KB, 2)
    Write-Host "📊 Package size: $sizeKB KB" -ForegroundColor Cyan
    
    # List contents
    Write-Host "`n📄 Package contents:" -ForegroundColor Cyan
    Add-Type -Assembly System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $outputFile))
    $zip.Entries | ForEach-Object {
        $entrySize = [math]::Round($_.Length / 1KB, 2)
        Write-Host "  • $($_.FullName) ($entrySize KB)"
    }
    $zip.Dispose()
    
} catch {
    Write-Host "❌ Failed to create package: $_" -ForegroundColor Red
    exit 1
}

# Create source package if requested
if ($IncludeSource) {
    Write-Host "`n📚 Creating source package..." -ForegroundColor Cyan
    $sourceFile = "$distDir/ContainerTabGroups-v$Version-source.zip"
    
    # Files to exclude from source package
    $excludePatterns = @("dist", ".git", "node_modules", "*.zip", "*.xpi")
    
    # Get all files except excluded ones
    $allFiles = Get-ChildItem -Recurse -File | Where-Object {
        $file = $_
        $include = $true
        foreach ($pattern in $excludePatterns) {
            if ($file.FullName -like "*$pattern*") {
                $include = $false
                break
            }
        }
        $include
    }
    
    # Create temporary directory structure
    $tempDir = "$distDir/temp-source"
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    # Copy files maintaining structure
    foreach ($file in $allFiles) {
        $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
        $targetPath = Join-Path $tempDir $relativePath
        $targetDir = Split-Path $targetPath -Parent
        
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        Copy-Item $file.FullName -Destination $targetPath
    }
    
    # Create source zip
    Compress-Archive -Path "$tempDir/*" -DestinationPath $sourceFile -Force
    
    # Clean up temp directory
    Remove-Item $tempDir -Recurse -Force
    
    $sourceSize = (Get-Item $sourceFile).Length
    $sourceSizeKB = [math]::Round($sourceSize / 1KB, 2)
    Write-Host "✅ Source package created: $sourceFile ($sourceSizeKB KB)" -ForegroundColor Green
}

# Summary
Write-Host "`n✨ Build complete!`n" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Test the package in Firefox (about:debugging)" -ForegroundColor White
Write-Host "  2. Upload to AMO: https://addons.mozilla.org/developers/" -ForegroundColor White
Write-Host "  3. See PUBLISHING.md for detailed instructions`n" -ForegroundColor White
