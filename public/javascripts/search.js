console.log("TEST");

jQuery(function(){
    $("#search_btn").on('click', function(event){
        console.log("click");
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
});

var showResults = function(result) {
    //display result in innerHTML
    var div = document.getElementById("search_result");
    // var str = "";
    // result.forEach((ele) => {
    //     console.log(ele.name);
    //     str += ele.name;
    // });
    div.innerHTML = result;
}