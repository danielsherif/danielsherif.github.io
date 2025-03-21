@echo off
echo Creating dist directory...
if not exist dist mkdir dist

echo Copying files to dist...
xcopy /E /I /Y index.html dist\
xcopy /E /I /Y about.html dist\
xcopy /E /I /Y Html dist\Html\
xcopy /E /I /Y css dist\css\
xcopy /E /I /Y js dist\js\
xcopy /E /I /Y Material dist\Material\
xcopy /E /I /Y MugImages dist\MugImages\

echo Build completed successfully!