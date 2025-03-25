#!/bin/bash
mkdir -p dist/css dist/js
[ -f index.html ] && cp index.html dist/
[ -f about.html ] && cp about.html dist/
[ -d Html ] && cp -r Html dist/
[ -d Material ] && cp -r Material dist/
[ -d MugImages ] && cp -r MugImages dist/
[ -d js ] && cp -r js/* dist/js/
[ -d css ] && cp -r css/* dist/css/