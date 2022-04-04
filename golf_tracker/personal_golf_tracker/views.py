"""
Программа для гольф трекера
"""


import datetime
import json
import base64
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.core.files.storage import default_storage
from django.core.exceptions import ValidationError
from .forms import *
from .models import *


@login_required
def main_page(request):
    """
    Возвращает основную страницу

    :param request: запрос
    :return: main_page.html
    """
    if request.method == "GET":
        context = {"user_id": request.user.id}

        return render(request, 'main_page.html', context)

    return HttpResponse("Ошибка")


def data_processing(data, t):
    """
    Обработчик для разных типов данных, получаемых из базы данных

    :param data: данные
    :param t: тип данных
    :return: данные в корректном формате
    """
    if t == "s":
        try:
            return str(list(data)[0])[2:-3]
        except IndexError:
            pass
    if t == "i":
        try:
            return int(str(list(data)[0])[1:-2])
        except IndexError:
            pass
    if t == "d":
        try:
            this_date = list(
                reversed(list(str(list(data)[0])[15:-3].split(', '))))
            if len(str(this_date[0])) != 2:
                this_date[0] = "0" + this_date[0]
            if len(str(this_date[1])) != 2:
                this_date[1] = "0" + this_date[1]
            return this_date[0] + '.' + this_date[1] + '.' + this_date[2]
        except IndexError:
            pass
    if t == "j":
        try:
            result = list(str(list(data)[0])[19:-6].split(', '))
            if len(str(result[2])) != 2:
                result[2] = "0" + result[2]
            if len(str(result[1])) != 2:
                result[1] = "0" + result[1]
            return result[2] + '.' + result[1] + '.' + result[0]
        except IndexError:
            pass

    return ''


def doted_date(date):
    """
    Преобразователь дат

    :param date: дата
    :return: дата, которая нравится Полине
    """
    return str('.'.join(list(reversed(list(str(date).split('-'))))))


def show_profile(request):
    """
    Отображение профиля игрока

    :param request: запрос
    :return: полный профиль игрока (ФИО, логин, навык, статус,
    день рождения, родной город, дата регистрации, изображение профиля)
    """
    data = None
    user_id = request.POST.get("user_id")
    pic_name = data_processing(
        UserData.return_field(
            user_id,
            'photo'),
        's')
    print(pic_name)
    if request.POST.get("act") == '1':
        first_name = data_processing(User.objects.filter(
            id=user_id).values_list('first_name'), 's')
        last_name = data_processing(User.objects.filter(
            id=user_id).values_list('last_name'), 's')

        data = {
            'owner': request.user.id,
            'full_name': first_name + " " + last_name,
            'login': data_processing(
                User.objects.filter(
                    pk=user_id).values_list('username'),
                's'),
            'skill': data_processing(
                UserData.return_field(
                    user_id,
                    'skill'),
                's'),
            'status': data_processing(
                UserData.return_field(
                    user_id,
                    'status'),
                's'),
            'birth_date': data_processing(
                UserData.return_field(
                    user_id,
                    'date_of_birth'),
                'd'),
            'city_from': data_processing(
                UserData.return_field(
                    user_id,
                    'city_from'),
                's'),
            'picture': default_storage.url('profile_imgs/' + pic_name),
            'date_joined': doted_date(
                str(list(User.objects.filter(
                    pk=user_id))[0].date_joined)[:10]),
        }
    elif request.POST.get("act") == '2':
        small_pic_name = data_processing(
            UserData.return_field(
                request.user.id,
                'photo'),
            's')
        data = {
            'picture': default_storage.url('profile_imgs/' + small_pic_name)
        }
        
    return JsonResponse({'success': True, "data": data})


def get_html(request):
    """
    Возвращает контент для главной страницы

    :param request: запрос
    :return: .html
    """
    try:
        f = open(
            'personal_golf_tracker/templates/{}'.format(request.POST.get("page_name")), 'r')
        page = ''.join(f.readlines())
        f.close()
    except FileExistsError:
        return HttpResponseNotFound('<h1>Page not found</h1>')
    else:
        return JsonResponse({'success': True, 'page': page})


def show_users(request):
    """
    Выводит список существующих пользователей

    :param request: запрос
    :return: список пользователей (ник, ФИО, id)
    """
    data_list = []
    for u in User.objects.exclude(id=request.user.id):
        first_name = u.first_name
        last_name = u.last_name
        if first_name == '':
            first_name = '-'
        if last_name == '':
            last_name = '-'
        list_of_user = {
            'username': u.username,
            'first_name': first_name,
            'last_name': last_name,
            'id': u.id
        }

        data_list.append(list_of_user)

    return JsonResponse({'success': True, 'data': data_list})


def settings(request):
    """
    Сохранение настроек профиля пользователя

    :param request: запрос
    :return: None
    """
    if request.POST.get('act') == '1':
        pic = request.POST.get("pic_content").split(',')[1]
        pic_name = str(request.POST.get("picName")).split('\\')[-1]
        if len(pic) % 4:
            pic += '=' * (4 - len(pic) % 4)
        pic = base64.b64decode(pic.encode("UTF-8"))
        f = default_storage.open("profile_imgs/" + pic_name, 'wb')
        f.write(pic)
        f.close()
        UserData.objects.filter(
            user_id=request.user.id).update(
                photo=pic_name)
    if request.POST.get('act') == '2':
        full_name = list(str(request.POST.get("name")).split())
        first_name = full_name[0]
        last_name = "" if len(full_name) == 1 else full_name[1]

        if not first_name.isalpha() or not first_name.isalpha() or not request.POST.get(
                'hpc').isdigit() or not request.POST.get('location').isalpha():
            messages.add_message(
                request, messages.ERROR, "Некорректные данные!")
            return JsonResponse({'success': False})

        User.objects.filter(
            id=request.user.id).update(
                first_name=first_name,
                last_name=last_name)

        try:
            UserData.objects.filter(
                user_id=request.user.id).update(
                    date_of_birth=request.POST.get('date_birth'),
                    city_from=request.POST.get('location'),
                    skill=request.POST.get('hpc'))
        except ValidationError:
            messages.add_message(
                request, messages.ERROR, "Некорректные данные!")
            return JsonResponse({'success': False})

    if request.POST.get('act') == '3':
        status = request.POST.get('status')
        UserData.objects.filter(user_id=request.user.id).update(status=status)
    messages.add_message(
        request, messages.SUCCESS, "Данные профиля изменены")
    return JsonResponse({'success': True})


def exit(request):
    """
    Выход из системы

    :param request: запрос
    :return: None
    """
    logout(request)

    return redirect('/')


@login_required
def about_us(request):
    """
    Возвращает страницу о нас

    :param request: запрос
    :return: about_us.html
    """
    if request.method == "GET":
        context = {"user_id": request.user.id}
        return render(request, 'about_us.html', context)
    return HttpResponse("Ошибка")


def documentation(request):
    """
    Возвращает страницу с пользовательской документацией

    :param request: запрос
    :return: documentation.html
    """
    if request.method == "GET":
        context = {"user_id": request.user.id}
        return render(request, 'documentation.html', context)
    return HttpResponse("Ошибка")


def auth(request):
    """
    Авторизация пользователя

    :param request: запрос
    :return: переход на главную страницу
    """
    if request.method == "POST":
        form = AuthForm(request.POST)

        fix_email = form.data['login']
        if User.objects.filter(email=fix_email):
            in_login = data_processing(User.objects.filter(
                email=fix_email).values_list('username'), 's')
        else:
            in_login = form.data['login']

        if form.is_valid():
            in_password = form.data['password']
            user = authenticate(
                request,
                username=in_login,
                password=in_password)

            if user is not None:
                login(request, user)
                messages.add_message(
                    request, messages.ERROR, "Вы вошли в свой аккаунт!")
                return redirect('/main/?page=3')

        messages.add_message(
            request, messages.ERROR, "Некорректные данные!")
    return redirect("/")


def reg(request):
    """
    Регистрация пользователя

    :param request: запрос
    :return: None
    """
    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            if form.data['password1'] == form.data['password2']:
                user = form.save(commit=False)
                user.email = form.data['email']
                user.save()

                messages.add_message(
                    request, messages.SUCCESS, "Вы успешно создали аккаунт!"
                )
            else:
                messages.add_message(
                    request, messages.ERROR, "Пароли не совпали")
        else:
            messages.add_message(
                request,
                messages.ERROR,
                "Некорректные данные!")

    return redirect('/')


def index(request):
    """
    Возвращает стартовую страницу с авторизацией и регистрацией

    :param request: запрос
    :return: index.html
    """
    if request.method == "GET":
        return render(request, 'index.html')

    return HttpResponse("Егог")


def check_login(request):
    """
    Проверка существования логина при регистрации

    :param request: запрос
    :return: True or False
    """
    if len(User.objects.filter(username=request.POST.get("login"))) != 0:
        return JsonResponse({'success': "False"})

    return JsonResponse({'success': "True"})


def check_email(request):
    """
    Проверка существования почты в базе данных

    :param request: запрос
    :return: True or False
    """
    if len(User.objects.filter(email=request.POST.get("email"))) != 0:
        return JsonResponse({'success': "False"})

    return JsonResponse({'success': "True"})


def calendar(request):
    """
    Создание календаря на любой месяц

    :param request: запрос
    :return: список с днями календаря
    """
    delta = int(request.POST.get("delta"))
    s = ""

    m = datetime.date.today().month
    y = datetime.date.today().year

    if delta < 0:
        for _ in range(abs(delta)):
            m -= 1
            if m == 0:
                y -= 1
                m = 12
    if delta > 0:
        for _ in range(abs(delta)):
            m += 1
            if m == 13:
                y += 1
                m = 1

    years = [0, 0, 0]
    monthes = [0, 0, 0]

    iday = datetime.datetime(y, m, 1)
    start_day = iday

    while iday.isoweekday() != 1:
        delta = datetime.timedelta(days=1)
        iday -= delta

    for _ in range(42):
        if iday.month < start_day.month:
            state = 0
        elif iday.month == start_day.month:
            state = 1
        else:
            state = 2

        years[state] = str(iday.year)
        monthes[state] = str(iday.month).zfill(2)

        s += str(state) + ',' + str(iday.day) + ';'

        iday += datetime.timedelta(days=1)

    return JsonResponse(
        {
            'success': s[:-1],
            'year': years,
            'month': monthes
        }
    )


def get_games(request):
    """
    Получение всех соревнований пользоветеля

    :param request: запрос
    :return: список с названиями соревнований
    """
    data = LocalCompetitions.get_events(request.user.id)
    other_data = OwnCompetitions.get_events(request.user.id)

    for i in other_data:
        try:
            data[i].extend(other_data[i])
        except KeyError:
            data[i] = other_data[i]

    return JsonResponse({'success': True, "data": data})


def new_local_game(request):
    """
    Создание локального соревнования для пользователя из глобального

    :param request: запрос
    :return: None
    """
    game_name = request.POST.get("name")

    lc = LocalCompetitions(
        user_id=request.user.id,
        g_competition=GlobalCompetitions.get_comp(game_name),
        result=0
    )

    lc.save()
    messages.add_message(
        request, messages.ERROR, "Вы успешно запланировали игру")

    return JsonResponse({'success': True})


def save_compit_statistic(request):
    """
    Сохранение статистики для своего соревнования

    :param request: запрос
    :return: None
    """
    type_comp = request.POST.get("type")
    obj = ""
    comp = ""
    if type_comp == "local":
        obj = Statistics_of_competitions
        comp = LocalCompetitions
    elif type_comp == "own":
        obj = Statistics_of_own_competitions
        comp = OwnCompetitions
    else:
        return JsonResponse({"success": False})

    name = request.POST.get("name")
    date = request.POST.get("date")

    mas = [list(request.POST.get('fairway').split(';')),
           list(request.POST.get('green_regulation').split(';')),
           list(request.POST.get('up_down').split(';')),
           list(request.POST.get('putting').split(';')),
           list(request.POST.get('shots').split(';')),
           list(request.POST.get('par').split(';'))]
    for num in mas:
        cs = obj()

        try:
            cs.competition = (comp.get_comp(request.user.id, name))[0]
        except IndexError:
            return JsonResponse({"success": False})

        try:
            cs.date = '-'.join(reversed(list(date.split('.'))))

            cs.one = num[0]
            cs.two = num[1]
            cs.three = num[2]
            cs.four = num[3]
            cs.five = num[4]
            cs.six = num[5]
            cs.seven = num[6]
            cs.eight = num[7]
            cs.nine = num[8]

            if len(num) == 20:
                cs.ten = num[9]
                cs.eleven = num[10]
                cs.twelve = num[11]
                cs.thirteen = num[12]
                cs.fourteen = num[13]
                cs.fifteen = num[14]
                cs.sixteen = num[15]
                cs.seventeen = num[16]
                cs.eighteen = num[17]

                cs.sum = str(num[18]) + '/' + str(num[19])

                cs.is_eighteen = True
            else:
                cs.sum = str(num[9]) + '/'

            cs.save()
        except ValidationError:
            return JsonResponse({"success": False})

    res = request.POST.get("result")

    updater = comp.get_comp(request.user.id, name)[0]
    summa = updater.result

    updater.result = summa + ';' + res
    updater.save()

    messages.add_message(
        request, messages.ERROR, "Вы успешно сохранили статистику")
    return JsonResponse({'success': True})


def create_training(request):
    """
    Создание тренировки пользователя

    :param request: запрос
    :return: None
    """

    tr = Trainings(
        name=request.POST.get("name"),
        user=list(User.objects.filter(id=request.user.id))[0],
        date=request.POST.get("game_date"),
        list_of_tasks=request.POST.get("tasks"),
        game_coordinates=request.POST.get("coordinates")
    )

    tr.save()
    messages.add_message(
        request, messages.ERROR, "Ваша тренировка была создана")
    return JsonResponse({'success': True})


def get_global_games(request):
    """
    Получение данных о глобальных играх

    :param request: запрос
    :return: 1 - названия незарегистрированных глобальных игр пользователя
    :return: 2 - полные данные о незарегистрированных глобальных игр пользователя
    """
    act = request.POST.get("act")
    games = list(GlobalCompetitions.objects.all())
    your_games = [i[0]
                  for i in LocalCompetitions.get_all_comps(request.user.id)]

    if act == '1':
        names = list()

        for el in games:
            if el.id not in your_games:
                names.append(el.game_name)

        if len(names) != 0:
            return JsonResponse({'success': True, "data": names})
    if act == '2':
        if request.POST.get("game_name") != '':
            comp = GlobalCompetitions.get_comp(request.POST.get("game_name"))

            return JsonResponse(
                {
                    'success': True,
                    "coordinates": comp.game_coordinates,
                    "map": comp.map,
                    "date_start": doted_date(str(comp.game_start)),
                    "date_end": doted_date(str(comp.game_end)),
                    "club_name": comp.club_name,
                    "address": comp.address
                }
            )

    return JsonResponse({'success': False})


def get_dates_for_statistic(request):
    """
    Получение данных локальных и собственных соревнований

    :param request: запрос
    :return: 1 - Даты проведения локальных соревнований
    :return: 2 - Даты проведения собственных соревнований
    """
    act = request.POST.get("act")
    data = list()

    try:
        if act == "local":
            if request.POST.get("game_name") != '':
                try:
                    name = request.POST.get("game_name")
                    game = GlobalCompetitions.get_comp(name)

                    lc = LocalCompetitions.get_comp(request.user.id, name)[0]
                    data = filter_dates(
                        game.game_start,
                        game.game_end,
                        Statistics_of_competitions,
                        lc)
                except IndexError:
                    act = '4'
        if act == "own":
            if request.POST.get("game_name") != '':
                name = request.POST.get("game_name")
                game = (OwnCompetitions.get_comp(0, name))[0]

                data = filter_dates(
                    game.game_start,
                    game.game_end,
                    Statistics_of_own_competitions,
                    game)
    except IndexError:
        return JsonResponse({"success": False, "data": data})

    return JsonResponse({"success": True, "data": data})


def filter_dates(start, end, statistic_class, obj):
    """
    Фильтрует даты, отсеивая сыгранные

    :param start: дата начала игры
    :param end: дата конца игры
    :param statistic_class: модель статистики
    :param obj: класс игры
    :return: список несыгранных дат
    """
    dates = []
    exist_dates = statistic_class.get_dates(obj)
    exist_dates_true = list()

    for d in exist_dates:
        exist_dates_true.append(d[0])

    while start != end + datetime.timedelta(days=1):
        if start not in exist_dates_true:
            dates.append(doted_date(start))
        start += datetime.timedelta(days=1)

    return dates


def get_your_games(request):
    """
    Получение списка зарегистрированных пользователем игр

    :param request: запрос
    :return: список с данными о играх пользователя
    """

    try:
        list_of_obj = [LocalCompetitions, OwnCompetitions]
        names = list()
        coordinates = list()
        date_start = list()
        date_end = list()

        for obj in list_of_obj:
            games = list(
                obj.objects.filter(
                    user_id=list(
                        User.objects.filter(
                            id=request.user.id))[0]))

            for g in games:
                item = g.g_competition if obj == LocalCompetitions else g

                names.append(item.game_name)
                coordinates.append(item.game_coordinates)
                date_start.append(doted_date(item.game_start))
                date_end.append(doted_date(item.game_end))
    except IndexError:
        return JsonResponse({"success": False})
    else:
        return JsonResponse(
            {
                "success": True,
                "names": names,
                "coordinates": coordinates,
                "date_start": date_start,
                "date_end": date_end
            }
        )


def your_new_game(request):
    """
    Создание собственного соревнования

    :param request: запрос
    :return: None
    """
    own = OwnCompetitions(
        user=list(User.objects.filter(id=request.user.id))[0],
        game_name=request.POST.get("name"),
        game_start=request.POST.get("game_start"),
        game_end=request.POST.get("game_finish"),
        game_coordinates=request.POST.get("coordinates")
    )

    own.save()

    messages.add_message(
        request, messages.ERROR, "Вы успешно запланировали игру")
    return JsonResponse({'success': True})


def news(request):
    """
    Анонс ближайших (на месяц) глобальных соревнований

    :param request: запрос
    :return: список списков с данными о каждом соревновании
    """
    gc = GlobalCompetitions.objects.all()
    near_comp = list()

    for data in gc:
        if (datetime.datetime.now().month >= data.game_start.month) and (
                datetime.datetime.now().month <= data.game_end.month):
            if LocalCompetitions.get_comp(request.user.id, data.game_name):
                near_comp.append([data.game_name, doted_date(data.game_start), doted_date(
                    data.game_end), data.game_coordinates, "green"])
            else:
                near_comp.append([data.game_name, doted_date(data.game_start), doted_date(
                    data.game_end), data.game_coordinates, "blue"])

    return JsonResponse(
        {
            'success': True,
            "near": near_comp
        }
    )


def get_event(request):
    """
    Получение событий, запланированных на данный день

    :param request: запрос
    :return: список списков с данными о каждом соревновании
    """
    mas = list(request.POST.get('names').split(','))
    data = list()

    for d in mas:
        try:
            obj = LocalCompetitions.get_comp(request.user.id, d)[0]
        except IndexError:
            try:
                obj = OwnCompetitions.get_comp(0, d)[0]
            except IndexError:
                continue
        else:
            obj = obj.g_competition

        data.append([obj.game_name,
                     doted_date(obj.game_start),
                     doted_date(obj.game_end),
                     obj.game_coordinates])

    return JsonResponse(
        {
            "success": True,
            "data": data,
        }
    )


def show_statistics(request):
    """
    Сбор данных о статистике игр пользователя

    :param request: запрос
    :return: словарь с данными формата: d = {"name": {"date": [[...], ..., [...]], ...}, ...}
    """
    params_of_statistic = [
        "fairway",
        "green regulation",
        "up & down",
        "putting",
        "shots",
        "par"]
    name = request.POST.get("name")
    data = {}
    dates = obj = class_of_object = number_of_lunok = None

    try:
        if request.POST.get("act") == "local":
            class_of_object = LocalCompetitions
            obj = Statistics_of_competitions
            dates = Statistics_of_competitions.get_dates(
                LocalCompetitions.get_comp(request.user.id, name)[0])
        elif request.POST.get("act") == "own":
            class_of_object = OwnCompetitions
            obj = Statistics_of_own_competitions
            dates = Statistics_of_own_competitions.get_dates(
                OwnCompetitions.get_comp(request.user.id, name)[0])
        else:
            return JsonResponse({"success": False})
    except IndexError:
        return JsonResponse({"success": False})

    for i in dates:
        this_day_data = obj.get_info_by_date(d=i[0], u=request.user.id, n=name)
        data[str(i[0])] = dict()

        for j in range(len(params_of_statistic)):
            mas = []
            number_of_lunok = 9 if not this_day_data[j][-1] else 18
            for q in range(number_of_lunok):
                mas.append(str(this_day_data[j][q + 3]))

            mas.append(str(this_day_data[j][-2]))
            data[str(i[0])][params_of_statistic[j]] = ';'.join(mas)
            data[str(i[0])]['count'] = number_of_lunok

    data["result"] = class_of_object.get_comp(request.user.id, name)[0].result
    if len(data) == 1:
        return JsonResponse({"success": False})

    return JsonResponse(
        {
            "success": True,
            "data": data,
        }
    )


def get_all_names(request):
    """
    Получение списка всех названий соревнований

    :param request: запрос
    :return: список названий соревнований
    """
    data = []
    models = [OwnCompetitions, LocalCompetitions]
    mas = key = None

    for m in models:
        if m == OwnCompetitions:
            mas = list(m.get_all_comps(request.user.id))
            key = 'o'
        elif m == LocalCompetitions:
            mas = [list(GlobalCompetitions.objects.filter(id=i[0]))[0]
                   for i in list(m.get_all_comps(request.user.id))]
            key = 'l'

        try:
            for g in mas:
                if request.POST.get("filter") == '1':
                    if m == LocalCompetitions:
                        if len(filter_dates(
                                g.game_start,
                                g.game_end,
                                Statistics_of_competitions,
                                LocalCompetitions.get_comp(
                                    request.user.id,
                                    g.game_name)[0])) != 0:
                            data.append(g.game_name + ' ' + key)
                    elif m == OwnCompetitions:
                        if len(filter_dates(
                                g.game_start,
                                g.game_end,
                                Statistics_of_own_competitions,
                                g)) != 0:
                            data.append(g.game_name + ' ' + key)
                else:
                    data.append(g.game_name + ' ' + key)
        except TypeError:
            return JsonResponse({"success": False})

    if len(data) != 0:
        return JsonResponse(
            {
                "success": True,
                "data": data,
            }
        )

    return JsonResponse({"success": False})


def get_exist_days(request):
    """
    Получение дней, для которых была создана статистика

    :param request: запрос
    :return: список дней
    """
    name = request.POST.get("game_name")
    data = []
    dates = None

    try:
        if request.POST.get("act") == "local":
            dates = Statistics_of_competitions.get_dates(
                LocalCompetitions.get_comp(request.user.id, name)[0])
        elif request.POST.get("act") == "own":
            dates = Statistics_of_own_competitions.get_dates(
                OwnCompetitions.get_comp(request.user.id, name)[0])
        else:
            return JsonResponse({"success": False})
    except IndexError:
        return JsonResponse({"success": False})

    for d in dates:
        data.append(str(d[0]))

    if len(data) == 0:
        return JsonResponse({"success": False})

    data.sort()

    for d in range(len(dates)):
        data[d] = doted_date(data[d])

    return JsonResponse(
        {
            "success": True,
            "data": data,
        }
    )


def get_training_tasks(request):
    """
    Получение задач пользователя

    :param request: запрос
    :return: список задач на каждый день
    """
    flag, result = Trainings.get_all_information(request.user.id)

    if flag:
        date = [d["date"] for d in result]
        date.sort()
        data = []
        for d in range(len(date)):
            for i in range(len(result)):
                if date[d] == result[i]["date"]:
                    result[i]["date"] = doted_date(result[i]["date"])
                    data.append(result[i])

        return JsonResponse(
            {
                "success": True,
                "data": data,
            }
        )

    return JsonResponse({"success": False})


def set_training_tasks(request):
    """
    Сохранение задач тренировки

    :param request: запрос
    :return: True
    """
    data = request.POST.get("tasks")
    Trainings.update_information(request.user.id, data)

    return JsonResponse({"success": True})


def get_all_places(request):
    """
    Получение всех координат соревнований

    :param request: запрос
    :return: словарь с координатами
    """
    return JsonResponse(
        {
            "success": True,
            "data": LocalCompetitions.get_all_coordinates(request.user.id),
        }
    )
