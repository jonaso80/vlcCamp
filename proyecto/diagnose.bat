@echo off
echo Diagnosing... > diagnosis_log.txt
docker ps -a > docker_status.txt 2>&1
echo Docker logs... >> diagnosis_log.txt
docker logs vlccamp_backend > backend_logs.txt 2>&1
echo Node version... >> diagnosis_log.txt
node -v > node_version.txt 2>&1
echo Checking Brevo... >> diagnosis_log.txt
cd backend
call npm list @getbrevo/brevo > brevo_installed.txt 2>&1
echo Done. >> diagnosis_log.txt
