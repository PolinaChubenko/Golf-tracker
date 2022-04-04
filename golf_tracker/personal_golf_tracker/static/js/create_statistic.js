var type_of_competition = "";
var url_comp = "";
var date_type = "";

//объявление перепенных
var statistic_second_question = document.getElementById("statistic_second_question");
var statistic_second_question_addition = document.getElementById("statistic_second_question_addition");
var statistic_third_question = document.getElementById("statistic_third_question");
var statistic_fourth_question = document.getElementById("statistic_fourth_question");
var yes_button = document.getElementById("yes_button");
var no_button = document.getElementById("no_button");

var first_nine = document.getElementById("first_nine");
var second_nine = document.getElementById("second_nine");
var final_result = document.getElementById("final_result");
var save_statistics_div = document.getElementById("save_statistics_div");


var nine_button = document.getElementById('nine_button');
var eighteen_button = document.getElementById('eighteen_button');
var inputs = document.getElementsByClassName('input__number');



//сколько девяток играл человек
nine_button.onclick = show_one_nine;
eighteen_button.onclick = show_two_nine;
//подсчет в сумму для первой девятки
var fairway_tr_nine = document.getElementById('fairway_tr_nine');
fairway_tr_nine.onclick = count_fairways;
var green_tr_nine = document.getElementById('green_tr_nine');
green_tr_nine.onclick = count_greens;
var updown_tr_nine = document.getElementById('updown_tr_nine');
updown_tr_nine.onclick = count_updowns;
var putting_tr_nine = document.getElementById('putting_tr_nine');
putting_tr_nine.onclick = count_puttings;
var shots_tr_nine = document.getElementById('shots_tr_nine');
shots_tr_nine.onclick = count_shots;
var par_tr_nine = document.getElementById('par_tr_nine');
par_tr_nine.onclick = count_pars;


//подсчет в сумму для второй девятки
var second_nine_exist = false;

var fairway_tr_eighteen = document.getElementById('fairway_tr_eighteen');
fairway_tr_eighteen.onclick = count_fairways_two;
var green_tr_eighteen = document.getElementById('green_tr_eighteen');
green_tr_eighteen.onclick = count_greens_two;
var updown_tr_eighteen = document.getElementById('updown_tr_eighteen');
updown_tr_eighteen.onclick = count_updowns_two;
var putting_tr_eighteen = document.getElementById('putting_tr_eighteen');
putting_tr_eighteen.onclick = count_puttings_two;
var shots_tr_eighteen = document.getElementById('shots_tr_eighteen');
shots_tr_eighteen.onclick = count_shots_two;
var par_tr_eighteen = document.getElementById('par_tr_eighteen');
par_tr_eighteen.onclick = count_pars_two;

function cutter(i) {
    if (inputs[i-1].value.length > 1){
        inputs[i-1].value = inputs[i-1].value.substr(0, 1); // в поле можно ввести только 1 символ
        console.log(inputs[i-1].value.length);
    }
    inputs[i-1].click();
}

function show_one_nine() {
    second_nine_exist = false;
    first_nine.style.display = "block";
    second_nine.style.display = "none";
    final_result.style.display = "block";
    save_statistics_div.style.display = "block";
}

function show_two_nine() {
    second_nine_exist = true;
    first_nine.style.display = "block";
    second_nine.style.display = "block";
    final_result.style.display = "block";
    save_statistics_div.style.display = "block";
}

//функция подсчета fairways на 1 девятке
function count_fairways(){
    var sum_of_fairways = 0;
    var fairway_checkboxes = document.querySelectorAll(".fairway_nine:checked");
    for (var i = 0; i < fairway_checkboxes.length; i++) {
          sum_of_fairways += 1;
    }
    var fairway_sum = document.getElementById('fairway_sum');
    fairway_sum.innerHTML = sum_of_fairways;
}

//функция подсчета green regulation на 1 девятке
function count_greens(){
    var sum_of_greens = 0;
    var green_checkboxes = document.querySelectorAll(".green_nine:checked");
    for (var i = 0; i < green_checkboxes.length; i++) {
          sum_of_greens += 1;
    }
    var green_sum = document.getElementById('green_sum');
    green_sum.innerHTML = sum_of_greens;

}

//функция подсчета up&down на 1 девятке
function count_updowns(){
    var sum_of_updowns = 0;
    var updown_checkboxes = document.querySelectorAll(".updown_nine:checked");
    for (var i = 0; i < updown_checkboxes.length; i++) {
          sum_of_updowns += 1;
    }
    var updown_sum = document.getElementById('updown_sum');
    updown_sum.innerHTML = sum_of_updowns;
}

//функция подсчета putting на 1 девятке
function count_puttings(){
    var sum_of_puttings = 0;
    var putting_checkboxes = document.querySelectorAll(".putting_nine");
    for (var i = 0; i < putting_checkboxes.length; i++) {
          sum_of_puttings += Number(putting_checkboxes[i].value);
    }
    var putting_sum = document.getElementById('putting_sum');
    putting_sum.innerHTML = sum_of_puttings;
}


//функция подсчета shots на 1 девятке
function count_shots(){
    var sum_of_shots = 0;
    var shots_checkboxes = document.querySelectorAll(".shots_nine");
    for (var i = 0; i < shots_checkboxes.length; i++) {
          sum_of_shots += Number(shots_checkboxes[i].value);
    }
    var shots_sum = document.getElementById('shots_sum');
    shots_sum.innerHTML = sum_of_shots;

    if(second_nine_exist == false){
        var result = document.getElementById('result');
        var par_sum = document.getElementById('par_sum');
        if (sum_of_shots - par_sum.innerHTML > 0){
            result.innerHTML = "+" + String(sum_of_shots - par_sum.innerHTML);
        }
        else{
            result.innerHTML = String(sum_of_shots - par_sum.innerHTML);
        }
    }
    else if(second_nine_exist == true){
        var result = document.getElementById('result');
        var par_sum_second = document.getElementById('par_sum_second');
        var par_sum = document.getElementById('par_sum');
        var shots_sum_second = document.getElementById('shots_sum_second');
        if ((sum_of_shots+Number(shots_sum_second.innerHTML)) - (Number(par_sum.innerHTML) + Number(par_sum_second.innerHTML)) > 0 ){
            result.innerHTML = "+" + String((sum_of_shots+Number(shots_sum_second.innerHTML)) - (Number(par_sum.innerHTML) + Number(par_sum_second.innerHTML)) );
        }
        else{
            result.innerHTML = String((sum_of_shots+Number(shots_sum_second.innerHTML)) - (Number(par_sum.innerHTML) + Number(par_sum_second.innerHTML)) );
        }
    }

}

//функция подсчета par на 1 девятке
function count_pars(){
    var sum_of_pars = 0;
    var par_checkboxes = document.querySelectorAll(".par_nine");
    for (var i = 0; i < par_checkboxes.length; i++) {
          sum_of_pars += Number(par_checkboxes[i].value);
    }
    var par_sum = document.getElementById('par_sum');
    par_sum.innerHTML = sum_of_pars;

    if(second_nine_exist==false) {
        var result = document.getElementById('result');
        var shots_sum = document.getElementById('shots_sum');
        if (shots_sum.innerHTML - sum_of_pars > 0){
            result.innerHTML = "+" + String(shots_sum.innerHTML - sum_of_pars);
        }
        else{
            result.innerHTML = String(shots_sum.innerHTML - sum_of_pars);
        }
    }
    else if(second_nine_exist==true){
        var result = document.getElementById('result');
        var shots_sum_second = document.getElementById('shots_sum_second');
        var par_sum_second = document.getElementById('par_sum_second');
        var shots_sum = document.getElementById('shots_sum');
        if ((Number(shots_sum_second.innerHTML)+Number(shots_sum.innerHTML)) - (Number(par_sum_second.innerHTML) + sum_of_pars) > 0 ){
            result.innerHTML = "+" + String((Number(shots_sum_second.innerHTML)+Number(shots_sum.innerHTML)) - (Number(par_sum_second.innerHTML) + sum_of_pars));
        }
        else{
            result.innerHTML = String((Number(shots_sum_second.innerHTML)+Number(shots_sum.innerHTML)) - (Number(par_sum_second.innerHTML) + sum_of_pars));
        }
     }

}


//функция подсчета fairways на 2 девятке
function count_fairways_two(){
    var sum_of_fairways_second = 0;
    var fairway_checkboxes_second = document.querySelectorAll(".fairway_eighteen:checked");
    for (var i = 0; i < fairway_checkboxes_second.length; i++) {
          sum_of_fairways_second += 1;
    }
    var fairway_sum_second = document.getElementById('fairway_sum_second');
    fairway_sum_second.innerHTML = sum_of_fairways_second;
}

//функция подсчета green regulation на 2 девятке
function count_greens_two(){
    var sum_of_greens_second = 0;
    var green_checkboxes_second = document.querySelectorAll(".green_eighteen:checked");
    for (var i = 0; i < green_checkboxes_second.length; i++) {
          sum_of_greens_second += 1;
    }
    var green_sum_second = document.getElementById('green_sum_second');
    green_sum_second.innerHTML = sum_of_greens_second;

}

//функция подсчета up&down на 2 девятке
function count_updowns_two(){
    var sum_of_updowns_second = 0;
    var updown_checkboxes_second = document.querySelectorAll(".updown_eighteen:checked");
    for (var i = 0; i < updown_checkboxes_second.length; i++) {
          sum_of_updowns_second += 1;
    }
    var updown_sum_second = document.getElementById('updown_sum_second');
    updown_sum_second.innerHTML = sum_of_updowns_second;
}

//функция подсчета putting на 2 девятке
function count_puttings_two(){
    var sum_of_puttings_second = 0;
    var putting_checkboxes_second = document.querySelectorAll(".putting_eighteen");
    for (var i = 0; i < putting_checkboxes_second.length; i++) {
          sum_of_puttings_second += Number(putting_checkboxes_second[i].value);
    }
    var putting_sum_second = document.getElementById('putting_sum_second');
    putting_sum_second.innerHTML = sum_of_puttings_second;
}


//функция подсчета shots на 2 девятке
function count_shots_two(){
    var sum_of_shots_second = 0;
    var shots_checkboxes_second = document.querySelectorAll(".shots_eighteen");
    for (var i = 0; i < shots_checkboxes_second.length; i++) {
          sum_of_shots_second += Number(shots_checkboxes_second[i].value);
    }
    var shots_sum_second = document.getElementById('shots_sum_second');
    shots_sum_second.innerHTML = sum_of_shots_second;

    if(second_nine_exist == true){
        var result = document.getElementById('result');
        var par_sum_second = document.getElementById('par_sum_second');
        var par_sum = document.getElementById('par_sum');
        var shots_sum = document.getElementById('shots_sum');
        if ((sum_of_shots_second+Number(shots_sum.innerHTML)) - (Number(par_sum.innerHTML) + Number(par_sum_second.innerHTML)) > 0 ){
            result.innerHTML = "+" + String((sum_of_shots_second+Number(shots_sum.innerHTML)) - (Number(par_sum.innerHTML) + Number(par_sum_second.innerHTML) ));
        }
        else{
            result.innerHTML = String((sum_of_shots_second+Number(shots_sum.innerHTML)) - (Number(par_sum.innerHTML) + Number(par_sum_second.innerHTML) ));
        }
    }

}

//функция подсчета par на 2 девятке
function count_pars_two(){
    var sum_of_pars_second = 0;
    var par_checkboxes_second = document.querySelectorAll(".par_eighteen");
    for (var i = 0; i < par_checkboxes_second.length; i++) {
          sum_of_pars_second += Number(par_checkboxes_second[i].value);
    }
    var par_sum_second = document.getElementById('par_sum_second');
    par_sum_second.innerHTML = sum_of_pars_second;

    var result = document.getElementById('result');
    var shots_sum_second = document.getElementById('shots_sum_second');
    var par_sum = document.getElementById('par_sum');
    var shots_sum = document.getElementById('shots_sum');
    if ((Number(shots_sum_second.innerHTML)+Number(shots_sum.innerHTML)) - (Number(par_sum.innerHTML) + sum_of_pars_second) > 0 ){
        result.innerHTML = "+" + String((Number(shots_sum_second.innerHTML)+Number(shots_sum.innerHTML)) - (Number(par_sum.innerHTML) + sum_of_pars_second));
    }
    else{
        result.innerHTML = String((Number(shots_sum_second.innerHTML)+Number(shots_sum.innerHTML)) - (Number(par_sum.innerHTML) + sum_of_pars_second));
    }
}


document.getElementById("date_selection").addEventListener("DOMSubtreeModified", function() {
    $("#statistic_fourth_question").show();
});

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


function save_competition_statistic() {
    var csrftoken = getCookie('csrftoken');
    var fairway = "";
    var checkboxes = document.querySelectorAll(".fairway_nine");
    console.log(checkboxes.length);

    for (var i = 0; i < checkboxes.length; i++){
        console.log(checkboxes[i]);
        if (checkboxes[i].checked){
            console.log(1);
            fairway += "1;";
        }
        else {
            console.log(0);
            fairway += "0;";
        }
    }

    var green_regulation = "";
    var checkboxes = document.querySelectorAll(".green_nine");

    for (var i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].checked){
            green_regulation += "1;"
        }
        else {
            green_regulation += "0;"
        }
    }

    var up_down = "";
    var checkboxes = document.querySelectorAll(".updown_nine");

    for (var i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].checked){
            up_down += "1;";
        }
        else {
            up_down += "0;";
        }
    }

    var putting = "";
    var checkboxes = document.querySelectorAll(".putting_nine");

    for (var i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].value == ""){
            putting += '0;';
        }
        else {
            putting += checkboxes[i].value + ';';
        }
    }

    var shots = "";
    var checkboxes = document.querySelectorAll(".shots_nine");

    for (var i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].value == ""){
            shots += '0;';
        }
        else {
            shots += checkboxes[i].value + ';';
        }
    }

    var par = "";
    var checkboxes = document.querySelectorAll(".par_nine");

    for (var i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].value == ""){
            par += '0;';
        }
        else {
            par += checkboxes[i].value + ';';
        }
    }

    if (document.getElementById('eighteen_button').checked){
        var checkboxes = document.querySelectorAll(".fairway_eighteen");

        for (var i = 0; i < checkboxes.length; i++){
            console.log(checkboxes[i]);
            if (checkboxes[i].checked){
                console.log(1);
                fairway += "1;";
            }
            else {
                console.log(0);
                fairway += "0;";
            }
        }

        var checkboxes = document.querySelectorAll(".green_eighteen");

        for (var i = 0; i < checkboxes.length; i++){
            if (checkboxes[i].checked){
                green_regulation += "1;"
            }
            else {
                green_regulation += "0;"
            }
        }

        var checkboxes = document.querySelectorAll(".updown_eighteen");

        for (var i = 0; i < checkboxes.length; i++){
            if (checkboxes[i].checked){
                up_down += "1;";
            }
            else {
                up_down += "0;";
            }
        }

        var checkboxes = document.querySelectorAll(".putting_eighteen");

        for (var i = 0; i < checkboxes.length; i++){
            if (checkboxes[i].value == ""){
                putting += '0;';
            }
            else {
                putting += checkboxes[i].value + ';';
            }
        }

        var checkboxes = document.querySelectorAll(".shots_eighteen");

        for (var i = 0; i < checkboxes.length; i++){
            if (checkboxes[i].value == ""){
                shots += '0;';
            }
            else {
                shots += checkboxes[i].value + ';';
            }
        }

        var checkboxes = document.querySelectorAll(".par_eighteen");

        for (var i = 0; i < checkboxes.length; i++){
            if (checkboxes[i].value == ""){
                par += '0;';
            }
            else {
                par += checkboxes[i].value + ';';
            }
        }

        fairway += ((document.getElementById("fairway_sum").textContent) + ';' + (document.getElementById("fairway_sum_second").textContent));
        green_regulation += ((document.getElementById("green_sum").textContent) + ';' + (document.getElementById("green_sum_second").textContent));
        up_down += ((document.getElementById("updown_sum").textContent) + ';' + (document.getElementById("updown_sum_second").textContent));
        putting += ((document.getElementById("putting_sum").textContent) + ';' + (document.getElementById("putting_sum_second").textContent));
        shots += ((document.getElementById("shots_sum").textContent) + ';' + (document.getElementById("shots_sum_second").textContent));
        par += ((document.getElementById("par_sum").textContent) + ';' + (document.getElementById("par_sum_second").textContent));
    }
    else {
        fairway += document.getElementById("fairway_sum").textContent;
        green_regulation += document.getElementById("green_sum").textContent;
        up_down += document.getElementById("updown_sum").textContent;
        putting += document.getElementById("putting_sum").textContent;
        shots += document.getElementById("shots_sum").textContent;
        par += document.getElementById("par_sum").textContent;
    }
    var code = (String(location.href).split('=')[0]).split('?')[1];
    var state = String(location.href).split('=')[1];

    var key = '';
    var n = document.getElementById("game_selector").value.replace(/_/g," ");
    if (n[n.length - 1] == 'l') {
        key = 'local';
    }
    else if (n[n.length - 1] == 'o') {
        key = 'own';
    }
    n = n.slice(0, n.length - 2);
    console.log(key);
    console.log(n);

    $.ajax({
        url: "/competition-save/",
        type: "POST",
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "name": n,
            "date": document.getElementById("date_selector").value,
            "fairway": fairway,
            "green_regulation": green_regulation,
            "up_down": up_down,
            "putting": putting,
            "shots": shots,
            "par": par,
            "type": key,
            "result": document.getElementById("result").textContent,
            "key": '?' + code + '=' + state,
        },
        success: function (result) {
            var json = result;

            if (!result["success"]) {
                // Выведите сообщение об ошибке
                console.log("Error");
            }
            else {
                window.location.reload();
                console.log("Success");
            }
        }
    });
}
