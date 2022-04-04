function traveller (state) {
    switch (state){
        case '0':
        {
            switcher('main_in_main.html');
            document.getElementById("section-1").checked = true;
            break;
        }
        case '1':
        {
            switcher('profile_settings.html');
            break;
        }
        case '2':
        {
            switcher('create_game.html');
            document.getElementById("section-2").checked = true;
            break;
        }
        case '3':
        {
            switcher('main_in_main.html');
            document.getElementById("section-1").checked = true;
            break;
        }
        case '4':
        {
            switcher('show_your_games.html');
            document.getElementById("section-2").checked = true;
            break;
        }
        case '5':
        {
            switcher('sorry.html');
            document.getElementById("section-2").checked = true;
            break;
        }
        case '6':
        {
            switcher('create_training.html');
            document.getElementById("section-3").checked = true;
            break;
        }
        case '7':
        {
            switcher('calendar.html');
            document.getElementById("section-3").checked = true;

            break;
        }
        case '8':
        {
            switcher('tasks.html');
            document.getElementById("section-3").checked = true;
            break;
        }
        case '9':
        {
            document.getElementById("section-4").checked = true;
            switcher('show_statistic.html');

            break;
        }
        case '10':
        {
            switcher('show_users.html');
            document.getElementById("section-5").checked = true;
            break;
        }
        case '11':
        {
            switcher('games_on_map.html');
            document.getElementById("section-6").checked = true;
            break;
        }
        case '12':
        {
            switcher('create_statistic.html');
            break;
        }
    }
}

function profile (user_id) {
    var m_b = document.getElementById('m_b');
        var context = "";
        var csrftoken = getCookie('csrftoken');

        $.ajax({
                url: "/get-html/",
                type: "POST",
                data: {
                    "csrfmiddlewaretoken": csrftoken,
                    "page_name": 'profile_show.html',
                },
                success: function (result) {
                    var json = result;

                    if (!result['success']) {
                        // сообщение об ошибке
                    }
                    else {
                        // сообщение об успехе

                        context = json['data'];
                        m_b.innerHTML = context;
                    }
                }
            });

        $.ajax({
                url: "/show-profile/",
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

                        if (json['success']['owner'] == user_id){
                            var avatar = document.getElementById('avatar_img_in_bar');
                            avatar.style.backgroundImage = 'url(' + json['data']['picture'] + ')';
                        }
                    }
                }
            });
}

function mini_photo () {
    var csrftoken = getCookie('csrftoken');

    $.ajax({
            url: "/show-profile/",
            type: "POST",
            data: {
                "csrfmiddlewaretoken": csrftoken,
                "act": '2',
            },
            success: function (result) {
                var json = result;

                if (!result['success']) {
                    // сообщение об ошибке
                }
                else {
                    // сообщение об успехе

                    context = json['data'];

                    var avatar = document.getElementById('avatar_img_in_bar');
                    avatar.style.backgroundImage = 'url(' + json['data']['picture'] + ')';
                }
            }
        });
}

window.onpopstate = function(event) {
    console.log("location: " + location.href + ", state: " + JSON.stringify(event.state));
    var code = (location.href.split('=')[0]).split('?')[1];
    var state = location.href.split('=')[1];

    if (code == "page") {
        traveller(state);
    }
    else if (code == "user") {
        show_profile(state);
    }
    mini_photo();
};

window.onload = function(event) {
    console.log("location: " + location.href + ", state: " + JSON.stringify(event.state));
    var code = String(String(location.href).split('=')[0]).split('?')[1];
    var state = String(location.href).split('=')[1];

    right_menu();
    mini_photo();

    if (code == "page") {
        traveller(state);
    }
    else if (code == "user") {
        show_profile(state);
    }
};
