# PowerShell script to download face-api.js models
# Run this script from the frontend directory

$modelsDir = "public\models"
$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# Create models directory if it doesn't exist
if (-not (Test-Path $modelsDir)) {
    New-Item -ItemType Directory -Path $modelsDir | Out-Null
    Write-Host "Created directory: $modelsDir"
}

# List of model files to download
$modelFiles = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_expression_model-weights_manifest.json",
    "face_expression_model-shard1"
)

Write-Host "Downloading face-api.js models..."
Write-Host ""

foreach ($file in $modelFiles) {
    $url = "$baseUrl/$file"
    $outputPath = Join-Path $modelsDir $file
    
    Write-Host "Downloading: $file"
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -ErrorAction Stop
        Write-Host "  ✅ Successfully downloaded: $file" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed to download: $file" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Download complete! Check $modelsDir for all model files."
Write-Host ""
Write-Host "Verify all files are present:"
Get-ChildItem $modelsDir | Select-Object Name, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}}

