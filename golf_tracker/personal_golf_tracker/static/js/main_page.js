/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
var changer = 0;
var cur_bar = 0;

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    if (changer == 0) {
        document.getElementById("profile_down").style.display = 'none';
        document.getElementById("profile_up").style.display = 'inline';
        changer = 1;
    }
    else if (changer == 1) {
        document.getElementById("profile_down").style.display = 'inline';
        document.getElementById("profile_up").style.display = 'none';
        changer = 0;
    }


}

// Close the dropdown if the user clicks outside of it

window.onclick = function(event) {
  if (!event.target.matches('.btn_show_settings')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    document.getElementById("profile_down").style.display = 'inline';
    document.getElementById("profile_up").style.display = 'none';
  }
}

// Close or open the menu_bar

function close_navbar() {
    var nav_bar = document.getElementById("nav_bar");
    var close_arrow = document.getElementById("close_arrow");
    var open_arrow = document.getElementById("open_arrow");
    var navbar_check = document.getElementById("navbar_check");
    var nav_titles = document.getElementsByClassName('nav_titles');
    var nav_contents = document.getElementsByClassName('content');
    var logo = document.getElementById('logo');

    if (navbar_check.value == "opened"){
        navbar_check.value = "closed";
        nav_bar.style.width = "50px";
        for ( i = 0; i < nav_titles.length; i++){
            nav_titles[i].style.display = "none";
        }
        for ( i = 0; i < nav_contents.length; i++){
            nav_contents[i].style.display = "none";
        }
        close_arrow.style.display = "none";
        open_arrow.style.display = "inline";
        logo.style.backgroundImage = "url('https://s3.nl-ams.scw.cloud/golf-static/imgs/logo_small.jpg')";
    }

    else if (navbar_check.value == "closed"){
        navbar_check.value = "opened";
        nav_bar.style.width = "260px";
        for ( i = 0; i < nav_titles.length; i++){
            nav_titles[i].style.display = "inline";
        }
        for ( i = 0; i < nav_contents.length; i++){
            nav_contents[i].style.display = "block";
        }
        close_arrow.style.display = "inline";
        open_arrow.style.display = "none";
        logo.style.backgroundImage = "url('https://s3.nl-ams.scw.cloud/golf-static/imgs/logo_new.jpg')";
    }
}

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

function right_menu() {
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        url: "/get-news/",
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

                context = json['near'];

                news_list = document.getElementById("news");
                content = '';
                console.log(context[1]);
                for (var i = 0; i < context.length; i++) {
                    //content = '';
                    content += '<div class="task-box ' + context[i][4] + '"><div class="description-task">';
                    content += '<div class="time">' + context[i][1] + ' - ' + context[i][2] + '</div>';
                    content += '<div class="task-name">' + context[i][0] + '</div>';
                    content += '<div class="loc"><svg class="bi bi-geo-alt" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 16s6-5.686 6-10A6 6 0 002 6c0 4.314 6 10 6 10zm0-7a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>' + context[i][3] + '</div>';
                    content += '</div><div class="members">';
                    if (context[i][4] == "blue") {
                        content += '<div id="advice">Примите участие</div></div></div>';
                    }
                    else {
                        content += '<div id="reminder">Вы запланировали</div></div></div>';
                    }
                    console.log(i);
                    console.log(context[i]);
                }
                news_list.innerHTML = content;
            }
        }
    });
}
$(document).ready( function () {
    $('#news').bind("DOMSubtreeModified",function(){
        $(".task-box.blue").unbind();
        $('.task-box.blue').bind('click', function() {
            var event = $(this);

            name = $('.task-name', $(this)).html();
            switcher("create_game.html", name);

            history.pushState({page: 2}, "title 2", "?page=2");
        });
    });
});



// Функция удаления пробелов
function del_spaces(str){
    str = str.replace(/\s/g, '');
    return str;
}


var close_message_main = document.getElementById('close_message_main');
var message_main = document.getElementById('message_main');

var content = message_main.textContent;

content = del_spaces(content);

if (content == "Некорректныеданные!") {
    message_main.style.backgroundColor = "#ff6666";
}
else {
    message_main.style.backgroundColor = "#6fb76f";
}

$('#close_message_main').click(function(){
    message_main.style.display = "none";
})

setTimeout( function(){
    message_main.style.display = "none";
  }  , 5000 );


// поиск по таблице
function tableSearch(r_search, r_table) {
    var phrase = document.getElementById(r_search);
    var table = document.getElementById(r_table);
    var regPhrase = new RegExp(phrase.value, 'i');
    var flag = false;
    for (var i = 1; i < table.rows.length; i++) {
        flag = false;
        for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }

    }
}

