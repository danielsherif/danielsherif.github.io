@echo off
echo Creating dist directory structure...
if not exist dist mkdir dist
if not exist dist\css mkdir dist\css
if not exist dist\js mkdir dist\js

echo Copying files to dist...
xcopy /E /I /Y index.html dist\ 2>nul
xcopy /E /I /Y about.html dist\ 2>nul
xcopy /E /I /Y Html dist\Html\ 2>nul
xcopy /E /I /Y Material dist\Material\ 2>nul
xcopy /E /I /Y MugImages dist\MugImages\ 2>nul

echo Copying JS files...
if exist js\*.* (
    xcopy /E /I /Y js dist\js\ 2>nul
) else (
    echo Warning: js directory is empty or doesn't exist
)

echo Copying CSS files...
if exist css\*.* (
    xcopy /E /I /Y css dist\css\ 2>nul
) else (
    echo Warning: css directory is empty or doesn't exist
)

echo Build completed successfully!