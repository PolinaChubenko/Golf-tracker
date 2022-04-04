#!/bin/bash


cd golf_tracker
echo "======Собираем статику======"
#if [ "$DEBUG" == "False" ]; then
    echo "======Загружаем в S3 облако, это займет некоторое время======"
#fi
python3 manage.py collectstatic --noinput


#echo "======Таки ждем, пока постгра поднимется======"
#while ! curl http://web_db:5432/ 2>&1 | grep '52'
#do
#  echo "Таки ждем....."
#  sleep 1
#done
#echo "Таки дождались..........."

echo "======Накатываем миграции======"
python3 manage.py makemigrations
python3 manage.py migrate


echo "======Стартуем сервер======"
if [ "$DEBUG" == "True" ]; then
    python3 manage.py runserver 8080
else
    daphne -e ssl:443:privateKey=../config/ssl_keys/privkey.pem:certKey=../config/ssl_keys/fullchain.pem -b 0.0.0.0 -p 80 golf_tracker.asgi:application
fi
