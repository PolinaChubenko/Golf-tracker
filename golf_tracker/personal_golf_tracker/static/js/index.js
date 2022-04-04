
var signUpButton = document.getElementById('signUp');
var signInButton = document.getElementById('signIn');
var container = document.getElementById('container');
var action_check_btn = document.getElementById('action_check');

signUpButton.addEventListener('click', function() {
    container.classList.add("right-panel-active");
    action_check_btn.value = "reg";
});

signInButton.addEventListener('click', function() {
    container.classList.remove("right-panel-active");
    action_check_btn.value = "auth";
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


var login_check_true = document.getElementById('login_check_true');
var email_check_true = document.getElementById('email_check_true');
var login_check_false = document.getElementById('login_check_false');
var email_check_false = document.getElementById('email_check_false');

var login_input = document.getElementById('inputLogin1');
var email_input = document.getElementById('id_email');

function CheckLogin(){
    var csrftoken = getCookie('csrftoken');
    $.ajax({
            url: "/check-login/",
            type: "POST",
            data: {
                "csrfmiddlewaretoken": csrftoken,
                "login": document.getElementById('inputLogin1').value,
            },
            success: function (result) {
                var json = result;

                if (json["success"] == "False"){
                    login_check_false.style.color = "red";
                    login_check_true.style.color = '#2D3436';
                    login_check_true.classList.add("sign_display_false");
                    login_check_false.classList.remove("sign_display_false");
                }
                else {
                    login_check_true.style.color = "green";
                    login_check_false.style.color = '#2D3436';
                    login_check_true.classList.remove("sign_display_false");
                    login_check_false.classList.add("sign_display_false");
                }

                if (login_input.value == ""){
                    login_check_true.style.color = '#2D3436';
                    login_check_false.style.color = '#2D3436';
                    login_check_true.classList.remove("sign_display_false");
                    login_check_false.classList.add("sign_display_false");
                }
            }
        });
}

function CheckEmail(){
    var csrftoken = getCookie('csrftoken');
    $.ajax({
            url: "/check-email/",
            type: "POST",
            data: {
                "csrfmiddlewaretoken": csrftoken,
                "email": document.getElementById('id_email').value,
            },
            success: function (result) {
                var json = result;

                if (json["success"] == "False"){
                    email_check_false.style.color = "red";
                    email_check_true.style.color = '#2D3436';
                    email_check_true.classList.add("sign_display_false");
                    email_check_false.classList.remove("sign_display_false");
                }
                else {
                    email_check_true.style.color = "green";
                    email_check_false.style.color = '#2D3436';
                    email_check_true.classList.remove("sign_display_false");
                    email_check_false.classList.add("sign_display_false");
                }

                if (email_input.value == ""){
                    email_check_true.style.color = '#2D3436';
                    email_check_false.style.color = '#2D3436';
                    email_check_true.classList.remove("sign_display_false");
                    email_check_false.classList.add("sign_display_false");
                }
            }
        });
}

// Функция удаления пробелов
function del_spaces(str){
    str = str.replace(/\s/g, '');
    return str;
}


var close_message = document.getElementById('close_message');
var message = document.getElementById('message');

var content = message.textContent;

content = del_spaces(content);

if (content == "Некорректныеданные!") {
    message.style.backgroundColor = "#ff6666";
}
else if (content == "Паролинесовпали") {
    message.style.backgroundColor = "#ff6666";
}
else if (content == "Выуспешносоздалиаккаунт!") {
    message.style.backgroundColor = "#4ca64c";
}


close_message.addEventListener('click', function() {
    message.style.display = "none";
});



