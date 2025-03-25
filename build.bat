@echo off
mkdir dist 2>nul
mkdir dist\css 2>nul
mkdir dist\js 2>nul
if exist index.html xcopy index.html dist\ /Y
if exist about.html xcopy about.html dist\ /Y
if exist Html xcopy Html dist\ /E /I /Y
if exist Material xcopy Material dist\ /E /I /Y
if exist MugImages xcopy MugImages dist\ /E /I /Y
if exist js xcopy js dist\js\ /E /I /Y
if exist css xcopy css dist\css\ /E /I /Y
