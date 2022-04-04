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

function draw_graf(s) {
    document.getElementById("result_statistic").innerHTML = '';
    document.getElementById("date_statistic_1").innerHTML = '';
    document.getElementById("date_statistic_2").innerHTML = '';
    if (s == '1') {
        get_dates('/get-true-dates/');
    }

    var csrftoken = getCookie('csrftoken');
    var key = '';
    var n = document.getElementById("game_selector").value.replace(/_/g," ");
    if (n[n.length - 1] == 'l') {
        key = 'local';
    }
    else if (n[n.length - 1] == 'o') {
        key = 'own';
    }
    n = n.slice(0, n.length - 2);
    console.log(n);

    $.ajax({
        type: 'POST',
        url: '/show-statistic/',
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "name": n,
            "act": key,
        },
        success: function (result) {
            var json = result;

            if (!result['success']) {
                // сообщение об ошибке
                document.getElementById('no_statistics_table').style.display = 'block';
                $("#date_selection").css('display', 'none');
                $("#show_graf").css('display', 'none');
                $("#table_for_statistic").css('display', 'none');
            }
            else {
                document.getElementById('no_statistics_table').style.display = 'none';
                document.getElementById("result_statistic").innerHTML = '';
                document.getElementById("table_for_statistic").innerHTML = '';
                $("#date_selection").css('display', 'block');

                $("#table_for_statistic").css('display', 'block');

                var data = [];
                var mas = json['data']['result'].split(';');
                const keys = Object.keys(json['data']);
                for (var i = 0; i < mas.length - 1; i++) {
                    data.push({x: keys[i], value: Number(mas[i + 1])})
                }

                var chart = anychart.line();
                chart.data(data);

                chart.title("Статистика");
                chart.container("result_statistic").draw();

                if (s == "2") {
                    var data_1 = [];
                    var data_2 = [];
                    var chart_1 = anychart.column();
                    var chart_2 = anychart.line();

                    console.log(document.getElementById("date_selector").value);

                    var date = document.getElementById("date_selector").value.split('.');
                    var true_date = date[2] + '-' + date[1] + '-' + date[0];

                    const keys = Object.keys(json['data']);
                    console.log(true_date);
                    console.log(date);
                    console.log(json['data']);
                    console.log(json['data'][true_date]);
                    var fairway = json['data'][true_date]['fairway'].split(';');
                    var green_regulation = json['data'][true_date]['green regulation'].split(';');
                    var up_down = json['data'][true_date]['up & down'].split(';');
                    var putting = json['data'][true_date]['putting'].split(';');
                    var shots = json['data'][true_date]['shots'].split(';');
                    var par = json['data'][true_date]['par'].split(';');
                    var l = json['data'][true_date]['count']
                    for (var i = 0; i < l; i++) {
                        data_1.push({x: i + 1, fairway: fairway[i], green_regulation: green_regulation[i], up_down: up_down[i]});
                        data_2.push({x: i + 1, putting: putting[i], shots: shots[i], par: par[i]});
                    }

                    chart_1.data({header: ["#", "fairway", "green regulation", "up & down"], rows: data_1})

                    chart_1.title("Детализация");
                    chart_1.legend(true);

                    chart_2.data({header: ["#", "putting", "shots", "par"], rows: data_2})

                    chart_2.title("Баланс");

                    chart_1.container("date_statistic_1").draw();
                    chart_2.container("date_statistic_2").draw();
                }

                console.log("table");
                show_statistic_table();
            }
        }
    });
}

function show_statistic_table() {
    $("#show_graf").css('display', 'block');

    var csrftoken = getCookie('csrftoken');
    var key = '';
    var n = document.getElementById("game_selector").value.replace(/_/g," ");
    if (n[n.length - 1] == 'l') {
        key = 'local';
    }
    else if (n[n.length - 1] == 'o') {
        key = 'own';
    }
    n = n.slice(0, n.length - 2);
    console.log(n);
    $.ajax({
        type: 'POST',
        url: '/show-statistic/',
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "name": n,
            "act": key,
        },
        success: function (result) {
            var json = result;

            if (!result['success']) {
                // сообщение об ошибке
                console.log("Error");
            }
            else {
                console.log(json);
                var rows = ['Fairway', 'Green Regulation', 'Up & Down', 'Putting', 'Shots', 'Par'];
                var date = document.getElementById("date_selector").value.split('.');
                var true_date = date[2] + '-' + date[1] + '-' + date[0];
                var data = [
                    json['data'][true_date]['fairway'].split(';'),
                    json['data'][true_date]['green regulation'].split(';'),
                    json['data'][true_date]['up & down'].split(';'),
                    json['data'][true_date]['putting'].split(';'),
                    json['data'][true_date]['shots'].split(';'),
                    json['data'][true_date]['par'].split(';')
                ]

                content = '';

                //console.log(json['data'][true_date]['count'] / 9);

                for (var q = 0; q < json['data'][true_date]['count'] / 9; q++){
                    content += '<div><table class="table table-sm"><thead style="background-color: #196625; color: #dfe9e9;"><tr><th scope="col">№</th><th scope="col" style="min-width: 28px;">'+ (q * 9 + 1) + '</th><th scope="col" style="min-width: 28px;">'+ (q * 9 + 2) + '</th><th scope="col" style="min-width: 28px;">'+ (q * 9 + 3) + '</th><th scope="col" style="min-width: 28px;">'+ (q * 9 + 4) + '</th><th scope="col" style="min-width: 28px;">'+ (q * 9 + 5) + '</th><th scope="col" style="min-width: 28px;">'+ (q * 9 + 6) + '</th><th scope="col" style="min-width: 28px;">'+ (q * 9 + 7) + '</th><th scope="col" style="min-width: 28px;">'+ (q * 9 + 8) + '</th><th scope="col" style="min-width: 28px;">'+ (q * 9 + 9) + '</th><th scope="col">sum</th></tr></thead><tbody>';

                    for (var i = 0; i < 6; i++) {
                        content += '<tr><th scope="row">' + rows[i] + '</th>';
                        for (var j = 0; j < 9; j++) {
                            content += '<td>' + data[i][q * 9 + j] + '</td>';
                        }
                        content += '<td>' + data[i][json['data'][true_date]['count']].split('/')[q] + '</td>'
                        content += '</tr>';
                    }

                    content += '</tbody></table></div>';
                }


                document.getElementById("table_for_statistic").innerHTML = content;
            }
        }
    });
}
