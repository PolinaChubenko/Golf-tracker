from django.db import models
import datetime
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserData(models.Model):
    """
    Дополнительная информация о пользователе
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    """Id пользователя из основной таблицы"""
    is_coach = models.BooleanField(default=False)
    """Является ли данный пользователь тренером"""
    bio = models.CharField(max_length=250, default="-", null=False)
    """Краткая биографии пользователя"""
    skill = models.CharField(max_length=250, default="-", null=False)
    """Гандикап пользователя"""
    status = models.CharField(max_length=250, default="-", null=False)
    """Статус пользователя"""
    date_of_birth = models.DateField(null=True)
    """Дата рождения пользователя"""
    city_from = models.CharField(max_length=250, default="-", null=False)
    """Родной город пользователя"""
    photo = models.ImageField(upload_to='profile_imgs', default="icon.png")
    """Фотография профиля"""

    @staticmethod
    def return_field(u, f):
        """
        Получение данных о пользователе

        :param u: id пользователя
        :param f: название поля
        :return: данные
        """
        return UserData.objects.filter(user_id=u).values_list(f)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserData.objects.create(user=instance)


post_save.connect(create_user_profile, sender=User)


class OwnCompetitions(models.Model):
    """
    Модель с собственными соревнованиями
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    """Пользователь"""
    game_name = models.CharField(max_length=100, default="none")
    """Название соревнования"""
    game_start = models.DateField(null=True)
    """Дата начала соревнования"""
    game_end = models.DateField(null=True)
    """Дата конца соревнования"""
    game_coordinates = models.CharField(max_length=250, default="none")
    """Место проведения соревнования"""
    map = models.CharField(max_length=250, default="none")
    """Карта места проведения"""
    result = models.CharField(default='', max_length=250)
    """Результат соревнования"""

    @staticmethod
    def get_events(u_id):
        """
        Словарь с датами и соревнованиями, проходящими в этот день

        :param u_id: id пользователя
        :return: {"date": ['names_of_competition']}
        """
        data = {}

        events = list(OwnCompetitions.objects.filter(user_id=u_id))

        for e in events:
            l_start = e.game_start
            l_end = e.game_end
            name = e.game_name

            s_date = l_start
            e_date = l_end

            while s_date != e_date + datetime.timedelta(days=1):
                try:
                    data[str(s_date)].append(name)
                except KeyError:
                    data[str(s_date)] = list()
                    data[str(s_date)].append(name)

                s_date += datetime.timedelta(days=1)

        return data

    @staticmethod
    def get_comp(u=0, n=""):
        """
        Возвращает собственное соревнование по названию

        :param u: id пользователя
        :param n: название соревнования
        :return: собственное соревнование
        """
        return list(OwnCompetitions.objects.filter(game_name=n))

    @staticmethod
    def get_all_comps(u):
        return list(OwnCompetitions.objects.filter(user_id=u))


class GlobalCompetitions(models.Model):
    """
    Модель с глобальными соревнованиями
    """

    game_name = models.CharField(max_length=100, default="none")
    """Название соревнования"""
    game_start = models.DateField(null=True)
    """Дата начала соревнования"""
    game_end = models.DateField(null=True)
    """Дата конца соревнования"""
    game_coordinates = models.CharField(max_length=250, default="none")
    """Место проведения соревнования"""
    map = models.CharField(max_length=250, default="none")
    """Координаты места проведения"""
    club_name = models.CharField(max_length=250, default="none")
    """Название гольф клуба"""
    address = models.CharField(max_length=250, default="none")
    """Адрес гольф клуба"""

    @staticmethod
    def get_comp(n):
        """
        Получение глобального соревнования по названию

        :param n: название
        :return: глобальное соревнование
        """
        return list(GlobalCompetitions.objects.filter(game_name=n))[0]


class LocalCompetitions(models.Model):
    """
    Модель хранение локальных соревнований
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    """Пользователь"""
    g_competition = models.ForeignKey(
        GlobalCompetitions, on_delete=models.CASCADE)
    """Глобальное соревнование"""
    result = models.CharField(default='', max_length=250)
    """Результат соревнования"""

    @staticmethod
    def get_events(u_id):
        """
        Словарь с датами и соревнованиями, проходящими в этот день

        :param u_id: id пользователя
        :return: {"date": ['names_of_competition']}
        """
        data = {}

        events = list(LocalCompetitions.objects.filter(user_id=u_id))

        for e in events:
            l_start = list(GlobalCompetitions.objects.filter(
                id=e.g_competition_id).values_list('game_start'))
            l_end = list(GlobalCompetitions.objects.filter(
                id=e.g_competition_id).values_list('game_end'))
            name = list(GlobalCompetitions.objects.filter(
                id=e.g_competition_id).values_list('game_name'))

            event = str(name)[3:-4]
            s_date = l_start[0][0]
            e_date = l_end[0][0]

            while s_date != e_date + datetime.timedelta(days=1):
                try:
                    data[str(s_date)].append(event)
                except KeyError:
                    data[str(s_date)] = list()
                    data[str(s_date)].append(event)

                s_date += datetime.timedelta(days=1)

        return data

    @staticmethod
    def get_comp(u, n):
        """
        Получение локального соревнования по названию

        :param u: id пользователя
        :param n: название глобального соревнования
        :return: локальное соревнование
        """
        n = n.replace('_', ' ')
        return list(
            LocalCompetitions.objects.filter(
                user_id=u,
                g_competition_id=GlobalCompetitions.get_comp(n)))

    @staticmethod
    def get_all_comps(u):
        """
        Получение всех локальных соревнований пользователя

        :param u: id пользователя
        :return: список локальных соревнований
        """
        return list(LocalCompetitions.objects.filter(
            user_id=u).values_list('g_competition_id'))

    @staticmethod
    def get_all_coordinates(u):
        """
        Получение всех координат

        :return: координаты соревнований
        """
        all_competitions = LocalCompetitions.objects.filter(user_id=u)
        names = sorted(list(set([i.g_competition.club_name for i in all_competitions])))
        data = {}

        for n in names:
            data[n] = list(GlobalCompetitions.objects.filter(club_name=n).values_list("map"))

        print(data)

        return data


class Trainings(models.Model):
    """
    Тренировки пользователей
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    """Пользователь"""
    name = models.CharField(max_length=100, default="none")
    """Название тренировки"""
    date = models.DateField(null=True)
    """Дата тренировки"""
    game_coordinates = models.CharField(max_length=250, default="none")
    """Место проведения тренировки"""
    list_of_tasks = models.CharField(max_length=750, default="none")
    """Список задач пользователя"""
    solved_tasks = models.CharField(max_length=750, default="none")
    """Список сделаных задач пользователя"""

    @staticmethod
    def get_all_information(u):
        """
        Полная информация о тренировках пользователя

        :param u: id пользователя
        :return: список с информацией по каждой тренировке
        """
        inf = list(Trainings.objects.filter(user_id=u))
        data = []
        flag = False

        for d in inf:
            tasks = list(d.list_of_tasks.split('/'))
            exist_tasks = list(d.solved_tasks.split('/'))
            true_tasks = []
            for i in tasks:
                if i in exist_tasks:
                    true_tasks.append([i, ' checked'])
                else:
                    true_tasks.append([i, ''])
            data.append({"name": d.name, "date": d.date, "tasks": true_tasks})

        if len(data) != 0:
            flag = True

        return flag, data

    @staticmethod
    def update_information(u, info):
        """
        Обновление информации о выполненных заданиях

        :param u: id пользователя
        :param info: информация
        :return: None
        """
        data = list(info.split('\\'))

        for d in data:
            mini_data = list(d.split('/'))
            if len(mini_data) > 2:
                Trainings.objects.filter(user_id=u, name=mini_data[0], date='-'.join(reversed(
                    list(mini_data[1].split('.'))))).update(solved_tasks='/'.join(mini_data[2:]))


class Statistics_of_competitions(models.Model):
    """
    Статистика по локальному соревнованию
    """
    competition = models.ForeignKey(
        LocalCompetitions, on_delete=models.CASCADE)
    """Локальное соревнование"""
    date = models.DateField(null=True)
    """День игры"""

    one = models.IntegerField(default=0, null=True)
    """Поле 1"""
    two = models.IntegerField(default=0, null=True)
    """Поле 2"""
    three = models.IntegerField(default=0, null=True)
    """Поле 3"""
    four = models.IntegerField(default=0, null=True)
    """Поле 4"""
    five = models.IntegerField(default=0, null=True)
    """Поле 5"""
    six = models.IntegerField(default=0, null=True)
    """Поле 6"""
    seven = models.IntegerField(default=0, null=True)
    """Поле 7"""
    eight = models.IntegerField(default=0, null=True)
    """Поле 8"""
    nine = models.IntegerField(default=0, null=True)
    """Поле 9"""

    ten = models.IntegerField(default=0, null=True)
    """Поле 10"""
    eleven = models.IntegerField(default=0, null=True)
    """Поле 11"""
    twelve = models.IntegerField(default=0, null=True)
    """Поле 12"""
    thirteen = models.IntegerField(default=0, null=True)
    """Поле 13"""
    fourteen = models.IntegerField(default=0, null=True)
    """Поле 14"""
    fifteen = models.IntegerField(default=0, null=True)
    """Поле 15"""
    sixteen = models.IntegerField(default=0, null=True)
    """Поле 16"""
    seventeen = models.IntegerField(default=0, null=True)
    """Поле 17"""
    eighteen = models.IntegerField(default=0, null=True)
    """Поле 18"""

    sum = models.CharField(default='0', max_length=10)
    """Итог для каждого параметра"""

    is_eighteen = models.BooleanField(default=False)
    """18 ли лунок в игре"""

    @staticmethod
    def get_dates(lc):
        """
        Получение сыгранных дней

        :param lc: локальное соревнование
        :return: список с сыгранными днями
        """
        return set(
            Statistics_of_competitions.objects.filter(
                competition_id=lc).values_list('date'))

    @staticmethod
    def get_info_by_date(d, n, u):
        print(LocalCompetitions.get_comp(u, n)[0].id)
        print(str(d))
        return list(
            Statistics_of_competitions.objects.filter(
                competition_id=LocalCompetitions.get_comp(
                    u, n)[0].id, date=d).values_list())


class Statistics_of_own_competitions(models.Model):
    """
    Статистика по локальному соревнованию
    """
    competition = models.ForeignKey(OwnCompetitions, on_delete=models.CASCADE)
    """Локальное соревнование"""
    date = models.DateField(null=True)
    """День игры"""

    one = models.IntegerField(default=0, null=True)
    """Поле 1"""
    two = models.IntegerField(default=0, null=True)
    """Поле 2"""
    three = models.IntegerField(default=0, null=True)
    """Поле 3"""
    four = models.IntegerField(default=0, null=True)
    """Поле 4"""
    five = models.IntegerField(default=0, null=True)
    """Поле 5"""
    six = models.IntegerField(default=0, null=True)
    """Поле 6"""
    seven = models.IntegerField(default=0, null=True)
    """Поле 7"""
    eight = models.IntegerField(default=0, null=True)
    """Поле 8"""
    nine = models.IntegerField(default=0, null=True)
    """Поле 9"""

    ten = models.IntegerField(default=0, null=True)
    """Поле 10"""
    eleven = models.IntegerField(default=0, null=True)
    """Поле 11"""
    twelve = models.IntegerField(default=0, null=True)
    """Поле 12"""
    thirteen = models.IntegerField(default=0, null=True)
    """Поле 13"""
    fourteen = models.IntegerField(default=0, null=True)
    """Поле 14"""
    fifteen = models.IntegerField(default=0, null=True)
    """Поле 15"""
    sixteen = models.IntegerField(default=0, null=True)
    """Поле 16"""
    seventeen = models.IntegerField(default=0, null=True)
    """Поле 17"""
    eighteen = models.IntegerField(default=0, null=True)
    """Поле 18"""

    sum = models.CharField(default='0', max_length=10)
    """Итог для каждого параметра"""

    is_eighteen = models.BooleanField(default=False)
    """18 ли лунок в игре"""

    @staticmethod
    def get_dates(ow):
        return set(
            Statistics_of_own_competitions.objects.filter(
                competition_id=ow).values_list('date'))

    @staticmethod
    def get_info_by_date(d, n, u):
        return list(
            Statistics_of_own_competitions.objects.filter(
                competition_id=OwnCompetitions.get_comp(
                    u, n)[0], date=d).values_list())


'''class Statistics_of_trainings(models.Model):
    """
    Статистика тренировки пользователя
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    """Пользователь"""
    date = models.DateField(null=True)
    """День игры"""

    one = models.IntegerField(default=0, null=True)
    """Поле 1"""
    two = models.IntegerField(default=0, null=True)
    """Поле 2"""
    three = models.IntegerField(default=0, null=True)
    """Поле 3"""
    four = models.IntegerField(default=0, null=True)
    """Поле 4"""
    five = models.IntegerField(default=0, null=True)
    """Поле 5"""
    six = models.IntegerField(default=0, null=True)
    """Поле 6"""
    seven = models.IntegerField(default=0, null=True)
    """Поле 7"""
    eight = models.IntegerField(default=0, null=True)
    """Поле 8"""
    nine = models.IntegerField(default=0, null=True)
    """Поле 9"""

    ten = models.IntegerField(default=0, null=True)
    """Поле 10"""
    eleven = models.IntegerField(default=0, null=True)
    """Поле 11"""
    twelve = models.IntegerField(default=0, null=True)
    """Поле 12"""
    thirteen = models.IntegerField(default=0, null=True)
    """Поле 13"""
    fourteen = models.IntegerField(default=0, null=True)
    """Поле 14"""
    fifteen = models.IntegerField(default=0, null=True)
    """Поле 15"""
    sixteen = models.IntegerField(default=0, null=True)
    """Поле 16"""
    seventeen = models.IntegerField(default=0, null=True)
    """Поле 17"""
    eighteen = models.IntegerField(default=0, null=True)
    """Поле 18"""

    sum = models.IntegerField(default=0, null=True)
    """Итог для каждого параметра"""

    is_eighteen = models.BooleanField(default=False)
    """18 ли лунок в игре"""

    @staticmethod
    def get_info_by_date(d, n, u):
        return list(
            Statistics_of_trainings.objects.filter(
                list(
                    Trainings.objects.filter(
                        name=n,
                        user_id=u,
                        date=d))[0]))
'''


class Coaches(models.Model):
    """
    Модель с тренерами и их учениками
    """
    coach = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    """Тренер"""
    trainee = models.ForeignKey(UserData, on_delete=models.CASCADE, null=True)
    """Ученик"""
