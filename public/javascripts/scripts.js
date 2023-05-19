const localFav = "fav";

jQuery(function(){

    // for nav-link
    var current = location.pathname;
    $('#header-nav li a').each(function(){
        var $this = $(this);
        // if the current path is like this link, make it active
        if(current === '/') current = '/search';
        if($this.attr('href').indexOf(current) !== -1){
            $this.addClass('active');
        }
    })

    $("#search_btn").on('click', function(event){
        hideRandom();
        showResultSpinner();
        event.preventDefault();
        event.stopPropagation();
        $.ajax({
            url: "/api/search?q=" + $("#search_str").val(),
            type: "GET" 
        }).done(function(result) {
            showResults(result, "search_result");
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
            showResults(result, "search_result");
            changeRandomText();
        }).fail(function(err) {
            console.log(err);
        })
    });

    $(window).on('shown.bs.modal', function() { 
        var id = $("div.modal.show").attr('id').split('_')[1];
        var content = $("#content"+id);
        if(content.hasClass("rendered")){
            console.log("rendered");
            return;
        } 
            
        
        $.ajax({
            url: "/api/detail?id=" + id,
            type: "GET" 
        }).done(function(result) {
            showDetail(result, id);
            initFavBtn(id);
        }).fail(function(err) {
            console.log(err);
        })
    });

    // for /favorite
    $(window).on('hidden.bs.modal', updateFavPage);
    updateFavPage();

    // for /country
    $(".area-btn").on('click', function(event) {
        showResultSpinner();
        var area = $(this).attr('id');
        $(".area-btn").removeClass("active");
        $(this).addClass("active");
        $.ajax({
            url: "/api/area?a="+area,
            type: "GET"
        }).done(function(result) {
            showResults(result, "search_result");
        }).fail(function(err) {
            console.log(err);
        })
    });

    // for /category
    $(".cate-btn").on('click', function(event) {
        showResultSpinner();
        var cat = $(this).attr('id');
        $(".cate-btn").removeClass("active");
        $(this).addClass("active");
        $.ajax({
            url: "/api/cat?c="+cat,
            type: "GET"
        }).done(function(result) {
            showResults(result, "search_result");
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
var showResults = function(result, result_section_id) {
    var div = document.getElementById(result_section_id);
    div.innerHTML = result;

    if(document.getElementById("pagination") != null) {
        setMaxPage();
        setCurrentPage(1);
        $(".pagination-button").on("click", function(event) {
            var id = $(this).attr("id");
            if($(this).hasClass("disable")) {
                return;
            }
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
}

var setMaxPage = function() {
    var anchors = document.getElementsByClassName("pagination-numeric");
    maxPage = anchors.length;
}

var setCurrentPage = function(page) {
    currentPage = page;

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
    div.classList.add("rendered");
}

var initFavBtn = function(id) {
    var fav = localStorage.getItem(localFav);
    var favbtn = document.getElementById("fav_"+id);
    if(fav != null) {
        fav = JSON.parse(fav);
        if(fav.idList.includes(id)) {
            favbtn.classList.remove("bi-heart");
            favbtn.classList.add("bi-heart-fill");
        }
    }

    // setup fav btn
    $(".fav-btn").on('click', function(event) {
        if(favbtn.classList.contains("bi-heart-fill")) {
            favbtn.classList.remove("bi-heart-fill");
            favbtn.classList.add("bi-heart");
            // remove from localstorage
            removeFavRecipe(id);

        } else {
            favbtn.classList.remove("bi-heart");
            favbtn.classList.add("bi-heart-fill");
            // add to localstorage
            addFavRecipe(id);
        }
    });
}

let favChanged = true;
var addFavRecipe = function(id) {
    var fav = localStorage.getItem(localFav);
    if(fav == null) {
        var favJson = {
            "idList":[],
            "meals":[]
        };

        localStorage.setItem(localFav, JSON.stringify(favJson));
        fav = localStorage.getItem(localFav);
    }

    var parseFav = JSON.parse(fav);

    var strMeal = document.getElementById("name_"+id).innerText;
    var strMealThumb = document.getElementById("img_"+id).getAttribute("src");
    var favItem = {
        "strMeal": strMeal,
        "strMealThumb": strMealThumb,
        "idMeal": id
    }
    
    parseFav.idList.push(id);
    parseFav.meals.push(favItem);

    var updateFav = JSON.stringify(parseFav);
    // console.log(updateFav);

    localStorage.setItem(localFav, updateFav);
    favChanged = true;
}

var removeFavRecipe = function(id) {
    var fav = localStorage.getItem(localFav);
    var parseFav = JSON.parse(fav);
    
    parseFav.idList = parseFav.idList.filter(ele => ele !== id);
    parseFav.meals = parseFav.meals.filter(item => item.idMeal !== id);

    var updateFav = JSON.stringify(parseFav);
    // console.log(updateFav);

    localStorage.setItem(localFav, updateFav);
    favChanged = true;
}

var updateFavPage = function() {
    if(favChanged) {
        favChanged = false;
        var fav = document.getElementById("fav_result");
        if(fav != null){
            var favJSON = localStorage.getItem(localFav);

            if(favJSON == null) {
                favJSON = {
                    'idList':[],
                    'meals':[]
                };
            } else {
                favJSON = JSON.parse(favJSON);
            }

            var data = JSON.stringify(favJSON);
            data = encodeURIComponent(data);
            console.log(data);
            $.ajax({
                url: "/favData?data="+data,
                type: "GET",
            }).done(function(result) {
                showResults(result, "fav_result");
            }).fail(function(err){
                console.log(err);
            })
        }
    }
}