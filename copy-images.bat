@echo off
echo Copying images to frontend/public/images/
if not exist "frontend\public\images" mkdir "frontend\public\images"
copy "images\*.jpg" "frontend\public\images\"
echo Done! Images copied to frontend/public/images/


