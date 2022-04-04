from django.contrib.auth.models import User
from django.test import TestCase, Client


class IndexTest(TestCase):
    fixtures = ['db.json']

    def test_lol(self):
        response = self.client.post(
            "/", secure=True)
        self.assertEqual(response.status_code, 200)

    def setUp(self):
        """
        Создание клиента

        :return: None
        """
        self.client = Client()

    def test_loading(self):
        """
        Проверка загрузки стартовой станицы

        :return: None
        """
        response = self.client.get("", secure=True)
        self.assertEqual(response.status_code, 200)

    def test_login_context(self):
        """
        Проверка авторизации

        :return: None
        """
        self.client.login(username='prom', password='q1a1z1w2s2x2')
        response = self.client.get('', secure=True)
        self.assertEqual(str(response.context['request'].user), 'prom')

    def test_registration(self):
        """
        Проверка регистрации

        :return: None
        """
        response = self.client.post(
            "/reg/",
            data={
                "username": "fish",
                "email": "fish@mail.ru",
                "password1": "hsif",
                "password2": "hsif"}, secure=True)
        self.assertEqual(response.status_code, 302)

    def test_my_login(self):
        """
        Проверка моей авторизации

        :return: None
        """
        response = self.client.post(
            "/auth/",
            data={
                "login": "cat",
                "password": "tac"}, secure=True)
        self.assertEqual(response.status_code, 302)

    def test_my_login_by_email(self):
        """
        Проверка моей авторизации по email

        :return: None
        """
        response = self.client.post(
            "/auth/",
            data={
                "login": "cat",
                "password": "cat@mail.ru"}, secure=True)
        self.assertEqual(response.status_code, 302)

    def test_logout(self):
        """
        Тестирование выхода из системы

        :return: None
        """
        self.client.login(username='prom', password='q1a1z1w2s2x2')
        response = self.client.get("/login-exit/", secure=True)
        self.assertEqual(response.status_code, 302)

    def test_check_login(self):
        """
        Проверка существования логина

        :return: None
        """
        response = self.client.post("/check-login/", data={"login": "i"}, secure=True)
        self.assertEqual(response.json()['success'], "True")

        response = self.client.post("/check-login/", data={"login": "rat"}, secure=True)
        self.assertEqual(response.json()['success'], "False")

    def test_check_email(self):
        """
        Проверка существования почты

        :return: None
        """
        response = self.client.post(
            "/check-email/", data={"email": "i@mail.ru"}, secure=True)
        self.assertEqual(response.json()['success'], "True")

        response = self.client.post(
            "/check-email/",
            data={
                "email": "cat@mail.ru"}, secure=True)
        self.assertEqual(response.json()['success'], "False")



class MainPageTest(TestCase):
    fixtures = ['db.json']

    def setUp(self):
        """
        Создание клиента

        :return: None
        """
        self.client = Client()
        self.client.login(username='prom', password='q1a1z1w2s2x2')

    def test_main(self):
        response = self.client.get("/main/?page=3", follow=True, secure=True)
        self.assertEqual(response.status_code, 200)

    def test_show_all_pages(self):
        pages = [
            "calendar.html",
            "create_game.html",
            "create_statistic.html",
        ]

        for p in pages:
            response = self.client.post(
                "/get-html/",
                data={
                    "page_name": p},
                follow=True, secure=True)
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.json()["success"])

    def test_news(self):
        response = self.client.post("/get-news/", follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertTrue(len(response.json()["near"]), 4)


class UsersTest(TestCase):
    fixtures = ['db.json']

    def setUp(self):
        self.client = Client()
        self.client.login(username='prom', password='q1a1z1w2s2x2')

    def test_show_profile(self):
        response = self.client.post(
            "/show-profile/",
            data={
                "user_id": 1,
                "act": '1'},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        # r = response.json()["data"]
        # data = {
        #     "owner": 1,
        #     "full_name": ' ',
        #     "login": "prom",
        #     "skill": '-',
        #     "status": '-',
        #     "birth_date": '',
        #     "city_from": '-',
        #     "date_joined": '29.05.2020',
        #     "picture": ''
        # }

        # for k in r:
        #     self.assertEqual(r[k], data[k])

        response = self.client.post(
            "/show-profile/",
            data={
                "user_id": 1,
                "act": '2'},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        # r = response.json()["data"]
        # for k in r:
        #     self.assertEqual(r[k], data[k])

    def test_save_profile(self):
        response = self.client.post(
            "/settings/",
            data={
                "name": "Kvant Crafter",
                "date_birth": '2003-10-18',
                "location": "Moscow",
                "hpc": 16,
                "act": '2'},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

        response = self.client.post(
            "/settings/",
            data={
                "status": "It is me!",
                "act": '3'},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

    def test_show_all_users(self):
        response = self.client.post("/users/", data={}, follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(len(response.json()["data"]), 3)
        self.assertEqual(len(response.json()["data"][0]), 4)


class CompetitionsTest(TestCase):
    fixtures = ['db.json']

    def setUp(self):
        self.client = Client()
        self.client.login(username='prom', password='q1a1z1w2s2x2')

    def test_get_global_competitions_names(self):
        response = self.client.post(
            "/get-global-games/",
            data={
                "act": '1'},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(len(response.json()["data"]), 4)

    def test_get_info_about_global_competition(self):
        response = self.client.post(
            "/get-global-games/",
            data={
                "act": '2',
                "game_name": "Пески"},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(len(response.json()), 7)

    def test_create_local_game(self):
        response = self.client.post(
            "/create-game/",
            data={
                "name": "Пески"},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

    def test_create_own_game(self):
        response = self.client.post(
            "/create-your-game/",
            data={
                "name": "Хочу",
                "game_start": "2020-07-01",
                "game_finish": "2020-07-05",
                "coordinates": "Нигдегород"},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

    def test_dates_for_statistic(self):
        self.client.get("/login_exit/", secure=True)
        self.client.login(username='cat', password='tac')

        response = self.client.post(
            "/get-your-games/",
            data={
                "act": 'local',
                "game_name": "Пески"},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(len(response.json()["data"]), 3)

        response = self.client.post(
            "/get-your-games/",
            data={
                "act": 'own',
                "game_name": "Где хочу"},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(len(response.json()["data"]), 2)

    def test_create_statistic_of_competition(self):
        self.client.get("/login_exit/", secure=True)
        self.client.login(username='cat', password='tac')

        response = self.client.post("/competition-save/", data={
            "type": 'local',
            "name": "Пески",
            "date": "17.05.2020",
            "fairway": "0;1;0;1;1;1;0;0;1;5",
            "green_regulation": "1;0;0;0;1;0;0;0;1;3",
            "up_down": "1;1;0;1;1;1;1;0;1;7",
            "putting": "2;1;5;1;7;2;4;0;1;23",
            "shots": "2;1;5;1;7;2;4;0;1;23",
            "par": "2;1;5;1;7;2;4;0;0;22",
            "result": "+1",
        }, follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

        response = self.client.post("/competition-save/", data={
            "type": 'own',
            "name": "Где хочу",
            "date": "06.05.2020",
            "fairway": "0;1;0;1;1;1;0;0;1;0;1;0;1;1;1;0;0;1;5;5",
            "green_regulation": "1;0;0;0;1;0;0;0;1;1;0;0;0;1;0;0;0;1;3;3",
            "up_down": "1;1;0;1;1;1;1;0;1;1;1;0;1;1;1;1;0;1;7;7",
            "putting": "2;1;5;1;7;2;4;0;1;2;1;5;1;7;2;4;0;1;23;23",
            "shots": "2;1;5;1;7;2;4;0;1;2;1;5;1;7;2;4;0;1;23;23",
            "par": "2;1;5;1;7;2;4;0;0;2;1;5;1;7;2;4;0;0;22;22",
            "result": "+2",
        }, follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

    def test_show_statistic_of_competition(self):
        self.client.get("/login_exit/", secure=True)
        self.client.login(username='rat', password='tar')
        response = self.client.post(
            "/show-statistic/",
            data={
                "act": 'local',
                "name": "Небо"},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(len(response.json()["data"]), 3)

    def test_get_all_competitions(self):
        response = self.client.get("/login_exit/", secure=True)
        self.client.login(username='cat', password='tac')
        response = self.client.post("/get-all-your-games/", follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 5)


class CalendarTest(TestCase):
    fixtures = ['db.json']

    def setUp(self):
        self.client = Client()
        self.client.login(username='cat', password='tac')

    def test_get_calendar(self):
        response = self.client.post(
            "/calendar/",
            data={
                "delta": 0},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["success"].split(';')), 42)

    def test_get_calendar_events(self):
        response = self.client.post("/get-events-for-each-day/", follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(len(response.json()["data"]), 5)


class TrainingTest(TestCase):
    fixtures = ['db.json']

    def setUp(self):
        self.client = Client()
        self.client.login(username='dog', password='god')

    def test_create_training(self):
        response = self.client.post(
            "/create-training/",
            data={
                "name": "Тренировка",
                "game_start": "2020-06-01",
                "coordinates": "Где-то",
                "tasks": "po/iu/yt/mk/"},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

    def test_get_tasks(self):
        response = self.client.post("/get-training-tasks/", follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(len(response.json()["data"]), 1)
        self.assertEqual(len(response.json()["data"][0]["tasks"]), 6)

    def test_save_tasks(self):
        response = self.client.post(
            "/set-training-tasks/",
            data={
                "tasks": "Треша/21.05.2020/2/3\\"},
            follow=True, secure=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
