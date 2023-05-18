jQuery(function(){
    $("#search_btn").on('click', function(event){
        hideRandom();
        showResultSpinner();
        event.preventDefault();
        event.stopPropagation();
        $.ajax({
            url: "/api/search?q=" + $("#search_str").val(),
            type: "GET" 
        }).done(function(result) {
            showResults(result);
        }).fail(function(err) {
            console.log(err);
        })
    });

    $(".random_btn").on('click', function(event){
        showResultSpinner();
        event.preventDefault();
        event.stopPropagation();
        $.ajax({
            url: "/api/random",
            type: "GET" 
        }).done(function(result) {
            showResults(result);
            changeRandomText();
        }).fail(function(err) {
            console.log(err);
        })
    });

    $(window).on('shown.bs.modal', function() { 
        var id = $("div.modal.show").attr('id').split('_')[1];
        // alert(id);
        $.ajax({
            url: "/api/detail?id=" + id,
            type: "GET" 
        }).done(function(result) {
            showDetail(result, id);
        }).fail(function(err) {
            console.log(err);
        })
    });
});

let spinner = '<div class="spinner-border" role="status">    <span class="visually-hidden">Loading...</span>   </div>';

var hideRandom = function() {
    var div = document.getElementById("random_section");
    div.classList += " visually-hidden";
}

var showResultSpinner = function() {
    var div = document.getElementById("search_result");
    div.innerHTML = spinner;
}

var showResults = function(result) {
    var div = document.getElementById("search_result");
    div.innerHTML = result;
}

var changeRandomText = function() {
    var span = document.getElementById("random_txt");
    span.innerHTML = "Get another one ";
}

var showDetail = function(result, id) {
    var div = document.getElementById("content"+id);
    div.innerHTML = result;
}