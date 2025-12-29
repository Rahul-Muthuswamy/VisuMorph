# Create images directory
New-Item -ItemType Directory -Force -Path "frontend\public\images" | Out-Null

# Copy all JPG files from images folder to frontend/public/images
Copy-Item -Path "images\*.jpg" -Destination "frontend\public\images\" -Force

# List copied files
Write-Host "`nImages copied to frontend/public/images/:"
Get-ChildItem "frontend\public\images" | Select-Object Name


