#!/bin/bash
set -e

echo "Starting build process..."
mkdir -p dist/css dist/js

echo "Copying HTML files..."
[ -f index.html ] && cp index.html dist/
[ -f about.html ] && cp about.html dist/

echo "Copying directories..."
[ -d Html ] && cp -r Html dist/
[ -d Material ] && cp -r Material dist/
[ -d MugImages ] && cp -r MugImages dist/
[ -d js ] && cp -r js/* dist/js/
[ -d css ] && cp -r css/* dist/css/

echo "Build completed successfully"
exit 0