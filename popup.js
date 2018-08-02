/*function myFunction() {
    console.log("Function Called");
    var x = document.getElementById("sec1");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}*/

$(function(){
    
    $('#button1').click(function(){
        $("#login").show();
        $("#sec1").hide();
        $("#sec2").hide();
    })
    $('#button2').click(function(){
        $("#sec1").show();
        $("#sec2").hide();
    })
});

