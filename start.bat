@echo off
start "Backend" cmd /k "cd /d back && npm install && npm run start"
start "Frontend" cmd /k "cd /d front && npm install && npm start"
exit
