# ![лого](/golf_tracker/personal_golf_tracker/static/imgs/logo_text.jpg)

### Описание:
“Персональный трекер для гольфистов” - это веб-приложение, где игроки в гольф могут анализировать свои продвижения в тренировках и сыгранных ими играх на основании предложенной им статистики, создавать и редактировать календарь своих соревнований и планировать свои тренировки. Основная цель разрабатываемого сайта - облегчить процесс подготовки гольфистов и помочь им в улучшении своих навыков.

### Детали реализации:
Это Single Page Application, написанный с помощью Python-фреймворк Django. Для взаимодействия серверной и клиентской частей был использован подход AJAX, поэтому значимая часть кода написана на JavaScript, jQuery. В качестве баз данных был использован SQLite3. Документация проекта создана с помощью Sphinx. Также в процессе разработки были использованы различные паттерны проектирования [(описание лежит тут)](/patterns.md).

### Что мы имеем сейчас:
- Видео-презентация проекта доступна по [ссылке](https://drive.google.com/file/d/13gk31ck9SUJkVKQunnzZRqERwwGj--oJ/view).
- На данный момент сайт не размещен в интернете, но планируется возобновить его поддержку на ScaleWay сервере, а хранение статики в S3 хранилище.

#### Для сборки проекта в дебаге:

- Проверьте наличие пакетов, в противном случае установите их:
    - ```sudo apt install python3-pip```
    - ```sudo apt-get install python3-venv```

- При скачивании этого репозитория в настройках флаг дебага истинен, но вы можете проверить это вручную:
    - Откройте файл ```settings.py```, который лежит в ```golf_tracker/golf_tracker/```
    - Проверьте, что параменной DEBUG присвоено значение True: ```DEBUG = True```

- Создайте виртуальное окружение в корне проекта: ```python3 -m venv golf_venv```

- Активируйте его: ```source golf_venv/bin/activate```

- После этого подгрузите все необходимые зависимости: ```pip install -r requirements.txt```

- Далее перейдите в приложение golf_traker: ```cd golf_tracker/```

- Загрузите статику и накатите все необходимые миграции:
    - ```python3 manage.py collectstatic``` 
    - ```python3 manage.py makemigrations```
    - ```python3 manage.py migrate```

- Для запуска на 8080 порту выполните: ```python3 manage.py runserver 8080```

#### Для открытия документации:
- Из корня проекта перейдите в папку docs: ```cd golf_tracker/docs```
- В ```_build/html``` должен лежать index.html, при открытие которого, мы получаем доступ к документации
- Если же этого файла нет, то нужно его создать командой: ```make html```

#### Маленький ньюанс:
Проект был перенесен из GitLab с закрытым доступом, поэтому в данный момент в проекте не настроен CI. В будущем планируется вернуть эту автоматизацию с помощью GitHub Actions.

*Проект создали Чубенко Полина и Антипов Владислав*
