var events = {};

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

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function draw_calendar() {
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url: "/calendar/",
        type: "POST",
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "delta": delta.value,
        },
        success: function (result) {
            var json = result;
            var calendar = document.getElementsByClassName("calendar_block")[0];
            var content = "";
            numbers = json["success"].split(';');

            var month_year_p = document.getElementById("month_year_p");
            month_year_p.textContent = Month_return(String(json['month'][1])) + " " + String(json['year'][1]);

            for (var i = 0; i < 6; ++i) {
                content += '<tr class="hk-calendar__dates hk-calendar__row">';
                for (var j = 0; j < 7; ++j) {
                    state = numbers[i * 7 + j].split(',')[0];
                    num = numbers[i * 7 + j].split(',')[1];

                    num_status = "";

                    if (state == 0) {
                        num_status = " previous-month"
                    }
                    else if (state == 2) {
                        num_status = " next-month"
                    }

                    key = json['year'][state] + '-' + json['month'][state] + '-' + pad(String(num), 2);
                    var rez = events[key];

                    if (!(key in events)) {
                        rez = "";
                    }
                    if (rez == "") {
                        content += '<td class="hk-calendar__date ' + num_status + '"><a class="hk-calendar__date-link ' + num_status + '">' + String(num) + '</a></td>';
                    }
                    else {
                        content += '<td class="hk-calendar__date ' + num_status + '"><a class="hk-calendar__date-link -has-event ' + num_status + '">' + String(num) + '</a><p style="display:none">' + rez +'</p></td>';
                    }
                }
                content += '</tr>';
            }

            calendar.innerHTML = content;

            $(".hk-calendar__date").unbind();
            $('.hk-calendar__date').bind('click', function() {
                name = $('p', $(this)).html();

                content = '';
                day_event = document.getElementById("day_event");

                if (name != 'undefined') {
                    $.ajax({
                        url: "/get-event/",
                        type: "POST",
                        data: {
                            "csrfmiddlewaretoken": csrftoken,
                            "names": name,
                        },
                        success: function (result) {
                            var json = result;

                            console.log(json);

                            data = json['data'];
                            for (var i = 0; i < data.length; i++){
                                content += '<div class="task-box yellow"><div class="description-task">';
                                content += '<div class="cal_time">' + data[i][1] + ' - ' + data[i][2] + '</div>';
                                content += '<div class="cal_task-name">' + data[i][0] + '</div>';
                                content += '<div class="cal_loc"><svg class="bi bi-geo-alt" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 16s6-5.686 6-10A6 6 0 002 6c0 4.314 6 10 6 10zm0-7a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>' + data[i][3] + '</div>';
                                content += '</div><div class="more-button"></div><div class="members"></div></div>';
                            }
                            day_event.innerHTML = content;
                        }
                    });
                }
                else {
                    day_event.innerHTML = content;
                }
            });
        }
    });
}

function get_events() {
    var csrftoken = getCookie('csrftoken');
    $.ajax({
            url: "/get-events-for-each-day/",
            type: "GET",
            data: {
                "csrfmiddlewaretoken": csrftoken,
            },
            success: function (result) {
                var json = result;

                for (date in json['data']) {
                    events[date] = json['data'][date];
                }

                draw_calendar();
            }
        });

}

function get_prev_month(){
    var delta = document.getElementById("delta");
    delta.value = parseInt(delta.value) - 1;
    delta.innerHTML = delta;

    get_events();
}

function get_next_month(){
    var delta = document.getElementById("delta");
    delta.value = parseInt(delta.value) + 1;
    delta.innerHTML = delta;

    get_events();
}

function now_calendar() {
    get_events();
}

function Month_return(s) {
    if (s == "01")
        return "Январь";
    else if (s == "02")
        return "Февраль";
    else if (s == "03")
        return "Март";
    else if (s == "04")
        return "Апрель";
    else if (s == "05")
        return "Май";
    else if (s == "06")
        return "Июнь";
    else if (s == "07")
        return "Июль";
    else if (s == "08")
        return "Август";
    else if (s == "09")
        return "Сентябрь";
    else if (s == "10")
        return "Октябрь";
    else if (s == "11")
        return "Ноябрь";
    else if (s == "12")
        return "Декабрь";
}
