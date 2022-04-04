
/*  ==========================================
    SHOW UPLOADED IMAGE
* ========================================== */
var image_content;
var fileName;
function readURL(input) {
    var size = input.files[0].size; // размер в байтах
    document.getElementById('big_pic').style.display = "none";
    if(1000000<size){
        // файл больше 1 мегабайт
        document.getElementById('big_pic').style.display = "block";
    }
    else if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult').attr('src', e.target.result);
            image_content = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);

    }
}

$(function () {
    $('#upload').on('change', function () {
        readURL(input);
    });
});

/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementById( 'upload' );
var infoArea = document.getElementById( 'upload-label' );

input.addEventListener( 'change', showFileName );
function showFileName( event ) {
  var input = event.srcElement;
  fileName = input.files[0].name;
  infoArea.textContent = 'Файл: ' + fileName;
}

function pass_image(){
    set_pic(image_content, fileName);
}