var id_of_user = 0;

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);

            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var myMap;
var localMap;
function init () {
    myMap = new ymaps.Map(
        // ID DOM-элемента, в который будет добавлена карта.
        'YMapsGlob',
        // Параметры карты.
        {
            // Географические координаты центра отображаемой карты.
            center: [55.76, 37.64],
            // Масштаб.
            zoom: 8,
        }, {
            // Поиск по организациям.
            searchControlProvider: 'yandex#search'
        }
    );
}
function local_init () {
    localMap = new ymaps.Map(
        // ID DOM-элемента, в который будет добавлена карта.
        'LocalMap',
        // Параметры карты.
        {
            // Географические координаты центра отображаемой карты.
            center: [55.01, 55.01],
            // Масштаб.
            zoom: 4,
        }, {
            // Поиск по организациям.
            searchControlProvider: 'yandex#search'
        }
    );
}


function switcher(page, name) {
    var m_b = document.getElementById('m_b');
    var context = "";
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url: "/get-html/",
        type: "POST",
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "page_name": page,
        },
        success: function (result) {
            var json = result;

            if (!result['success']) {
                // сообщение об ошибке
            }
            else {
                // сообщение об успехе
                context = json['page'];
                m_b.innerHTML = context;

                console.log(document.getElementById("changer"));
                console.log("switcher");

                if (page == "create_game.html"){
                    if (myMap == null){
                        ymaps.ready(init);
                    }
                    else {
                        myMap.destroy();
                        ymaps.ready(init);
                    }
                }

                if (page == "games_on_map.html"){
                    if (localMap == null){
                        ymaps.ready(local_init);
                    }
                    else {
                        localMap.destroy();
                        ymaps.ready(local_init);
                    }
                }

                if (typeof name != "undefined") {
                    document.getElementById("changer").innerHTML = name;
                }
                else {
                    document.getElementById("changer").innerHTML = "0";
                }
            }
        }
    });
}

function show_profile(user_id) {
    id_of_user = user_id;

    switcher("profile_show.html");
    history.pushState({page: 13}, "title 13", "?user=" + user_id);
}

function set_profile() {
    switcher('profile_settings.html');
    history.pushState({page: 1}, "title 1", "?page=1");
}

$('#create_game').click(function() {
    switcher('create_game.html');
    history.pushState({page: 2}, "title 2", "?page=2");
});

$('#main').click(function() {
    switcher('main_in_main.html');
    history.pushState({page: 3}, "title 3", "?page=3");
});

$('#my_games').click(function() {
    switcher('show_your_games.html');
    history.pushState({page: 4}, "title 4", "?page=4");
});

$('#achives').click(function() {
    switcher('sorry.html');
    history.pushState({page: 5}, "title 5", "?page=5");
});

$('#training').click(function() {
    switcher('create_training.html');
    history.pushState({page: 6}, "title 6", "?page=6");
});

$('#calendar').click(function() {
    switcher('calendar.html');
    history.pushState({page: 7}, "title 7", "?page=7");
});

$('#tasks').click(function() {
    switcher('tasks.html');
    history.pushState({page: 8}, "title 8", "?page=8");
});

$('#general_statistic').click(function() {
    switcher('show_statistic.html');
    history.pushState({page: 9}, "title 9", "?page=9");
});

$('#users').click(function() {
    switcher('show_users.html');
    console.log("users");
    history.pushState({page: 10}, "title 10", "?page=10");
});

$('#places').click(function() {
    switcher('games_on_map.html');
    history.pushState({page: 11}, "title 11", "?page=11");
});

$('#create_statistic').click(function() {
    switcher('create_statistic.html');
    history.pushState({page: 12}, "title 12", "?page=12");
});


function get_info_about_global_game () {
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        url: "/get-global-games/",
        type: "POST",
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "act": '2',
            "game_name": document.getElementById("game_selector").value.replace(/_/g," "),
        },
        success: function (result) {
            var json = result;

            if (!result['success']) {
                // сообщение об ошибке
            }
            else {
                // сообщение об успехе
                document.getElementById("game-start").innerHTML = json["date_start"];
                document.getElementById("game-finish").innerHTML = json["date_end"];
                document.getElementById("coordinates").innerHTML = json["coordinates"];
                var club_name = json["club_name"];
                var address = json["address"];
                var latlong = String(json["map"]).split(", ");
                var lat = parseFloat(latlong[0]);
                var long = parseFloat(latlong[1]);

                myMap.geoObjects.removeAll();
                var myPlacemark;
                myMap.setCenter([lat, long]);
                myMap.geoObjects
                    .add(new ymaps.Placemark([lat, long], {
                        hintContent: club_name,
                        balloonContent: address
                    }, {
                        preset: 'islands#greenDotIconWithCaption'
                    }))
            }
        }
    });
}

function get_dates(dates_url) {
    var csrftoken = getCookie('csrftoken');

    var key = '';
    var n = document.getElementById("game_selector").value.replace(/_/g," ");
    if (n[n.length - 1] == 'l') {
        key = 'local';
    }
    else if (n[n.length - 1] == 'o') {
        key = 'own';
    }

    console.log(dates_url);

    $.ajax({
        url: dates_url,
        type: "POST",
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "act": key,
            "game_name": document.getElementById("game_selector").value.replace(/_/g," ").slice(0, -2),
        },
        success: function (result) {
            var json = result;

            if (!result['success']) {
                // сообщение об ошибке
                console.log("bug");
            }
            else {
                // сообщение об успехе
                console.log(json);
                listic = document.getElementById("date_selection");

                var names = json['data'];
                console.log(names);
                console.log(names);
                content = '<select id="date_selector"';
                if (dates_url == '/get-true-dates/') {
                    content += ' onchange="show_statistic_table();"';
                }
                content += ' class="game_selector_cst">';
                for (var i = 0; i < names.length; i++) {
                    content += "<option value=" + names[i] + ">" + names[i] + "</option>";
                }
                content += '</select>';

                listic.innerHTML = content;
            }
        }
    });
}

document.getElementById("changer").addEventListener("DOMSubtreeModified", function(e) {
    var code = String(String(location.href).split('=')[0]).split('?')[1];
    var state = String(location.href).split('=')[1];

    var csrftoken = getCookie('csrftoken');

    console.log(state);

    if (code == "page") {
        switch(state) {
            case '1':
            {
                $.getScript("/collected_static/js/profile_settings.js");

                break;
            }
            case '2':
            {
                $.ajax({
                    url: '/get-global-games/',
                    type: "POST",
                    data: {
                        "csrfmiddlewaretoken": csrftoken,
                        "act": '1',
                    },
                    success: function (result) {
                        var json = result;

                        if (!json['success']) {
                            // сообщение об ошибке
                            content = "<option value='' selected='selected' disabled='disabled'>Игр нет</option>";
                            document.getElementById("game_selector").innerHTML = content;

                            document.getElementById("game-start").innerHTML = '-';
                            document.getElementById("game-finish").innerHTML = '-';
                            document.getElementById("coordinates").innerHTML = '-';
                        }
                        else {
                            // сообщение об успехе

                            listic = document.getElementById("game_selector");
                            console.log(listic);
                            content = "";

                            var names = json['data'];

                            for (var i = 0; i < names.length; i++) {
                                content += "<option value=" + names[i].replace(/ /g,"_");

                                if (document.getElementById("changer").textContent == names[i]) {
                                    content += " selected='selected'";
                                }
                                else if (i == 0) {
                                    content += " selected='selected'";
                                }

                                content += ">" + names[i] + "</option>";
                            }

                            listic.innerHTML = content;
                            console.log(listic);
                            //if (myMap == null){
                            //    ymaps.ready(init);
                            //}
                            get_info_about_global_game();
                        }
                    }
                });

                break;
            }
            case '4':
            {
                $.ajax({
                    type: 'GET',
                    url: '/get-all-your-games/',
                    data: {
                        "csrfmiddlewaretoken": csrftoken,
                    },
                    success: function (result) {
                        var json = result;
                        if (json['names'].length == 0){
                            document.getElementById('games_table').style.display = 'none';
                            document.getElementById('no_games_table').style.display = 'block';
                        }
                        else {
                            content = "";
                            document.getElementById('games_table').style.display = 'block';
                            document.getElementById('no_games_table').style.display = 'none';
                            var info = document.getElementById("info");
                            for (var i = 0; i < json['names'].length; i++) {
                                content += "<tr><th scope='row'>"+ (i+1) +"</th><td class='text-break'>" + json["names"][i] + "</td><td class='text-break'>" + json["coordinates"][i] + "</td><td>" + json["date_start"][i] + "</td><td>" + json["date_end"][i] + "</td></tr>";
                            }
                            info.innerHTML = content;
                        }
                    }
                });

                break;
            }
            case '6':
            {
                $.getScript("/collected_static/js/create_training.js");

                break;
            }
            case '7':
            {
                get_events();

                break;
            }
            case '8':
            {
                $.getScript("/collected_static/js/create_training.js");

                $.ajax({
                    type: 'GET',
                    url: '/get-training-tasks/',
                    data: {
                        "csrfmiddlewaretoken": csrftoken,
                    },
                    success: function (result) {
                        var json = result;

                        if(!json['success']) {
                            document.getElementById('no_trainings_table').style.display = 'block';
                            document.getElementById('save_tasks').style.display = 'none';
                        }
                        else {
                            document.getElementById('no_trainings_table').style.display = 'none';
                            document.getElementById('save_tasks').style.display = 'block';
                            var tasks = document.getElementById("task_container");
                            var data = json['data'];

                            content = "";
                            for (var i = 0; i < data.length; i++) {
                                content += '<div id="training-' + i + '" style="width: 95%;" class="train_block"><div class="header upcoming"><div class="row"><div class="col-8 task_name">' + data[i]["name"] + '</div><div class="col-4 task_date">' + data[i]["date"] +'</div></div></div><div class="task"><ul class="tasks_list">';
                                for (var j = 0; j < data[i]["tasks"].length - 1; j++) {
                                    content += '<li class="tasks_list__item"><label class="tasks_label--checkbox"><input type="checkbox" class="tasks_checkbox"' + data[i]["tasks"][j][1] + '>' + data[i]["tasks"][j][0] + '</label></li>';
                                }
                                content += '</ul></div></div>';
                            }

                            tasks.innerHTML = content;
                        }
                    }
                });

                break;
            }
            case '9':
            {
                $.ajax({
                    type: 'GET',
                    url: '/get-all-names/',
                    data: {
                        "csrfmiddlewaretoken": csrftoken,
                    },
                    success: function (result) {
                        var json = result;

                        if (!result['success']) {
                            // сообщение об ошибке
                            document.getElementById('no_games_to_show_table').style.display = 'block';
                        }
                        else {
                            // сообщение об успехе
                            document.getElementById('no_games_to_show_table').style.display = 'none';
                            content = '<select id="game_selector" onchange="draw_graf(1);" class="game_selector_cst">';
                            var names = json['data'];
                            for(var j = 0; j < json['data'].length; j++) {
                                //console.log(names[j].slice(0, names[j].length - 3));
                                content += "<option value=" + names[j].replace(/ /g,"_");
                                if (j == 0) {
                                    content += " selected='selected'";
                                }
                                content += ">" + names[j].slice(0, names[j].length - 2) + "</option>";
                            }
                            content += '</select>';

                            document.getElementById("game_selection").innerHTML = content;
                            draw_graf(1);
                        }
                    }
                });

                break;
            }
            case '10':
            {
                $.ajax({
                    type: 'GET',
                    url: '/users/',
                    data: {
                        "csrfmiddlewaretoken": csrftoken,
                    },
                    success: function (result) {
                        var json = result;

                        if (!result['success']) {
                            document.getElementById('users_table').style.display = 'none';
                        }
                        else {
                            content = '';
                            document.getElementById('users_table').style.display = 'block';
                            for (var i = 0; i < json['data'].length; i++) {
                                content += "<tr style='cursor: pointer;'><th scope='row' onclick='show_profile(" + json['data'][i]['id'] + ")'>"+ (i+1) +"</th><td class='text-break' onclick='show_profile(" + json['data'][i]['id'] + ")'>" + json['data'][i]['username'] + "</td><td class='text-break' onclick='show_profile(" + json['data'][i]['id'] + ")'>" + json['data'][i]['last_name'] + "</td><td class='text-break' onclick='show_profile(" + json['data'][i]['id'] + ")'>" + json['data'][i]['first_name'] + "</td></tr>";
                            }

                            document.getElementById("users_table_info").innerHTML = content;
                        }
                    }
                });

                break;
            }
            case '11':
            {
                $.ajax({
                    url: "/get-all-places/",
                    type: "POST",
                    data: {
                        "csrfmiddlewaretoken": csrftoken,
                    },
                    success: function (result) {
                        var json = result;

                        if (!result['success']) {
                            // сообщение об ошибке
                        }
                        else {
                            context = json['data'];

                            localMap.geoObjects.removeAll();
                            for (el in context){
                                var game_name = el;
                                var latlong = String(context[el]).split(", ");
                                var lat = parseFloat(latlong[0]);
                                var long = parseFloat(latlong[1]);
                                console.log(game_name);
                                console.log(lat);
                                console.log(long);

                                var myPlacemark;
                                localMap.geoObjects
                                    .add(new ymaps.Placemark([lat, long], {
                                        hintContent: game_name,
                                        //balloonContent: address
                                    }, {
                                        preset: 'islands#greenDotIconWithCaption'
                                    }))
                                }
                            }
                    }
                });

                break;
            }
            case '12':
            {
                $.getScript("/collected_static/js/create_statistic.js");

                $.ajax({
                    url: '/get-all-names/',
                    type: "POST",
                    data: {
                        "csrfmiddlewaretoken": csrftoken,
                        "filter": '1',
                    },
                    success: function (result) {
                        var json = result;

                        console.log(json['data']);

                        if (!json['success']) {
                            // сообщение об ошибке

                            $("#statistic_second_question").css('display', 'none');
                            $("#statistic_second_question_addition").css('display', 'none');
                            $("#statistic_fourth_question").css('display', 'none');
                            $("#first_nine").css('display', 'none');
                            $("#final_result").css('display', 'none');
                            $("#save_statistics_div").css('display', 'none');

                            document.getElementById('no_games_for_st_table').style.display = 'block';
                        }
                        else {
                            // сообщение об успехе
                            document.getElementById('no_games_for_st_table').style.display = 'none';
                            listic = document.getElementById("game_selection");
                            console.log(listic);
                            content = '<select id="game_selector" onchange="get_dates(/get-your-games/);" class="game_selector_cst">';

                            var names = json['data'];

                            for (var i = 0; i < names.length; i++) {
                                content += "<option value=" + names[i].replace(/ /g,"_");
                                if (i == 0) {
                                    content += " selected='selected'";
                                }
                                content += ">" + names[i].slice(0, -2) + "</option>";
                                console.log(names[i]);
                            }
                            content += '</select>';

                            listic.innerHTML = content;
                            console.log(listic);

                            get_dates('/get-your-games/', ' ');
                        }
                    }
                });

                break;
            }
        }
    }
    else if (code == "user") {
        $.ajax({
            url: "/show-profile/",
            type: "POST",
            data: {
                "csrfmiddlewaretoken": csrftoken,
                "user_id": id_of_user,
                "act": '1',
            },
            success: function (result) {
                var json = result;

                if (!result['success']) {
                    // сообщение об ошибке
                }
                else {
                    // сообщение об успехе

                    context = json['data'];
                    console.log(context)
                    var f_name = document.getElementById('full_name');
                    f_name.innerHTML = json['data']['full_name'];

                    var login = document.getElementById('login');
                    login.innerHTML = json['data']['login'];

                    var skill = document.getElementById('skill');
                    skill.innerHTML = json['data']['skill'];

                    var status = document.getElementById('status');
                    status.innerHTML = json['data']['status'];

                    var date_of_birth = document.getElementById('date_of_birth');
                    date_of_birth.innerHTML = json['data']['birth_date'];

                    var city_from = document.getElementById('city_from');
                    city_from.innerHTML = json['data']['city_from'];

                    var date_of_registration = document.getElementById('date_of_registration');
                    date_of_registration.innerHTML = json['data']['date_joined'];

                    var photo = document.getElementById('photo');
                    photo.style.backgroundImage = 'url(' + json['data']['picture'] + ')';

                    if (json['success']['owner'] == id_of_user) {
                        var avatar = document.getElementById('avatar_img_in_bar');
                        avatar.style.backgroundImage = 'url(' + json['data']['picture'] + ')';
                    }
                }
            }
        });
    }
    console.log("polpol");
}, false);
