@echo off
title Commonplace
cd /d "%~dp0"
echo Starting Commonplace...
start "" http://localhost:8794
node server.mjs
