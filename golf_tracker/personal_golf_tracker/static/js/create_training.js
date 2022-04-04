var max_fields = 15; //maximum input boxes allowed
var wrapper = $(".input_fields_wrap"); //Fields wrapper
var add_button = $(".add_field_button"); //Add button ID
console.log(add_button);

var count_inputs = 1; //initial text box count

$(wrapper).on("click",".remove_field", function(e){ //user click on remove text
    e.preventDefault(); $(this).parent('div').remove(); count_inputs--;
});

function add_task() {
    if(count_inputs < max_fields){ //max input box allowed
        count_inputs++; //text box increment
        $(wrapper).append('<div><input type="text" class="create_task_input" name="mytext[]"/><a href="#" class="remove_field">Х</a></div>'); //add input box
    }
}

function save_training() {
    var tasks = document.querySelectorAll('.create_task_input');
    var result = "";
    for (var i = 0; i < tasks.length; i++) {
        result += tasks[i].value + '/';
    }

    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/create-training/',
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "tasks": result,
            "name": document.getElementById("name").value,
            "coordinates": document.getElementById("coordinates").value,
            "game_date": document.getElementById("game-date").value,
        },
        success: function (result) {
            if (!result['success']) {
                console.log("Error");
            }
            else {
                console.log("Данные сохранены!");
                window.location.reload();
            }
        }
    });
}

function save_tasks() {
    var tasks = document.getElementById("task_container").querySelectorAll('.train_block');
    var names = document.getElementById("task_container").querySelectorAll('.task_name');
    var dates = document.getElementById("task_container").querySelectorAll('.task_date');

    console.log(tasks);
    var result = "";
    for (var i = 0; i < tasks.length; i++) {
        checked_tasks = tasks[i].querySelectorAll('.tasks_checkbox');
        labels = tasks[i].querySelectorAll('.tasks_label--checkbox');
        console.log(labels);
        result += names[i].textContent + '/' + dates[i].textContent + '/';

        for (var j = 0; j < checked_tasks.length; j++) {
            if (checked_tasks[j].checked) {
                result += labels[j].textContent + '/';
            }
        }
        result += '\\';
    }
    console.log(result);

    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/set-training-tasks/',
        data: {
            "csrfmiddlewaretoken": csrftoken,
            "tasks": result,
        },
        success: function (result) {
            if (!result['success']) {
                console.log("Error");
            }
            else {
                console.log("Данные сохранены!");
                window.location.reload();
            }
        }
    });
}