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

var currentPage = 1;
var maxPage = 1;
var showResults = function(result) {
    var div = document.getElementById("search_result");
    div.innerHTML = result;

    setMaxPage();
    setCurrentPage(1);
    $(".pagination-button").on("click", function(event) {
        var id = $(this).attr("id");
        if(id === "prev-button") {
            setCurrentPage(-1+parseInt(currentPage));
        } else if(id === "next-button") {
            setCurrentPage(1+parseInt(currentPage));
        } else {
            var toPage = id.split('_')[1];
            setCurrentPage(parseInt(toPage));
        }
    });
}

var setMaxPage = function() {
    var anchors = document.getElementsByClassName("pagination-numeric");
    maxPage = anchors.length;
}

var setCurrentPage = function(page) {
    currentPage = page;
    // console.log(currentPage);
    // show current page
    var divs = document.getElementsByClassName("pages");
    for(var i = 0; i < divs.length; i++) {
        divs[i].classList.add("visually-hidden");
    }
    var div = document.getElementById("page"+currentPage);
    div.classList.remove("visually-hidden");

    // make current page button active
    var anchors = document.getElementsByClassName("pagination-numeric");
    for(var i = 0; i < anchors.length; i++) {
        anchors[i].classList.remove("active");
    }
    var anchor = document.getElementById("toPage_"+currentPage);
    anchor.classList.add("active");

    // check prev disable status
    var prev = document.getElementById("prev-button");
    if(currentPage == 1) {
        prev.classList.add("disable");
    } else {
        prev.classList.remove("disable");
    }

    // check next disable status
    var next = document.getElementById("next-button");
    if(currentPage == maxPage) {
        next.classList.add("disable");
    } else {
        next.classList.remove("disable");
    }
}

var changeRandomText = function() {
    var span = document.getElementById("random_txt");
    span.innerText = "Get another one ";
}

var showDetail = function(result, id) {
    var div = document.getElementById("content"+id);
    div.innerHTML = result;
}