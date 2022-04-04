// Кукер
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

// Сохранение игр
function save_game() {
    var csrftoken = getCookie('csrftoken');
    var name = document.getElementById("game_selector").value.replace(/_/g," ");
    var coordinates = document.getElementById("coordinates");
    var game_start = document.getElementById("game-start");
    var game_finish = document.getElementById("game-finish");
    console.log(name)

    $.ajax({
            url: "/create-game/",
            type: "POST",
            data: {
                "csrfmiddlewaretoken": csrftoken,
                "name": name,
                "coordinates": coordinates.textContent,
                "game_start": game_start.textContent,
                "game_finish": game_finish.textContent,
            },
            success: function (result) {
                var json = result;

                if (!result['success']) {
                    // сообщение об ошибке
                }
                else {
                    // сообщение об успехе
                    window.location.reload();
                }
            }
        });
    right_menu();
}

function save_your_game() {
    var csrftoken = getCookie('csrftoken');
    var name = document.getElementById("name");
    var coordinates = document.getElementById("place");
    var game_start = document.getElementById("start");
    var game_finish = document.getElementById("end");

    $.ajax({
            url: "/create-your-game/",
            type: "POST",
            data: {
                "csrfmiddlewaretoken": csrftoken,
                "name": name.value,
                "coordinates": coordinates.value,
                "game_start": game_start.value,
                "game_finish": game_finish.value,
            },
            success: function (result) {
                var json = result;

                if (!result['success']) {
                    // сообщение об ошибке
                }
                else {
                    // сообщение об успехе
                    window.location.reload();
                }
            }
        });

}


// Сохранение данных профиля
function set_pic(p, n) { // Картинка
    var csrftoken = getCookie('csrftoken');
    var pic_content = p;
    var picture_name = n;
    console.log(p);

    $.ajax({
            url: "/settings/",
            type: "POST",
            data: {
                "csrfmiddlewaretoken": csrftoken,
                "act": 1,
                "pic_content": pic_content,
                "picName": picture_name,
            },
            success: function (result) {
                var json = result;

                if (!result['success']) {
                    // сообщение об ошибке
                }
                else {
                    // сообщение об успехе
                    window.location.reload();
                }
            }
        });
}

function set_udata() { // Общая информация
    var csrftoken = getCookie('csrftoken');
    var name = document.getElementById("name");
    var date_birth = document.getElementById("date_birth");
    var place = document.getElementById("location");
    var hpc = document.getElementById("hpc");

    var code = (String(location.href).split('=')[0]).split('?')[1];
    var state = String(location.href).split('=')[1];

    $.ajax({
        url: "/settings/",
        type: "POST",
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "act": 2,
            "name": name.value,
            "date_birth": date_birth.value,
            "location": place.value,
            "hpc": hpc.value,
            "key": '?' + code + '=' + state,
        },
        success: function (result) {
            var json = result;

            if (!result['success']) {
                // сообщение об ошибке
            }
            else {
                // сообщение об успехе
                window.location.reload();
            }
        }
    });
}

function set_status() { // Статус
    var csrftoken = getCookie('csrftoken');
    var status = document.getElementById("status");

    $.ajax({
        url: "/settings/",
        type: "POST",
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "act": 3,
            "status": status.value,
        },
        success: function (result) {
            var json = result;

            if (!result['success']) {
                // сообщение об ошибке
            }
            else {
                // сообщение об успехе
                window.location.reload();
            }
        }
    });
}
