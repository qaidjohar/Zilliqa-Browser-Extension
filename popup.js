/*function myFunction() {
    //console.log("Function Called");
    var x = document.getElementById("sec1");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}*/
/*var str = '087D1996982063B65C50687DA7874BD70A79F5F3';
var s1 = str.slice(0,4);
var s2 = str.slice(-4,-1)+str.slice(-1);
console.log(s1+'...'+s2); //=> '12345678'
*/
var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js
background.status = parseInt(background.status)+1;
console.log(background.status);

function hideall(){
    $("#login").hide();
    $("#restore").hide();
    $("#setPass").hide();
    $("#home").hide();
    $("#createAccount").hide();
    $("#importAccount").hide();
}

/*$( "#body" ).load(function() {
  //console.log("Function InitCheck called!!!");
});*/
$(window).load(initCheck());

function formattedDate(unixTimeStamp) {
	//var unixTimeStamp = 983112343;
	var timestampInMilliSeconds = unixTimeStamp*1000;
	var date = new Date(timestampInMilliSeconds);

	var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
	var month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
	var year = date.getFullYear();

	var hours = ((date.getHours() % 12 || 12) < 10 ? '0' : '') + (date.getHours() % 12 || 12);
	var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
	var meridiem = (date.getHours() >= 12) ? 'pm' : 'am';

	var formattedDate = day + '-' + month + '-' + year + ' at ' + hours + ':' + minutes + ' ' + meridiem;

	return(formattedDate);
}



$(function(){
    
    /*$('#button1').click(function(){
        $("#login").show();
        $("#sec1").hide();
        $("#sec2").hide();
    });
    $('#button2').click(function(){
        $("#sec1").show();
        $("#sec2").hide();
    });*/
    $('#setPass-ok').click(function(){
        //hideall();
        loginSetup();
        //$("#login").show();
    });
    
    $('#logout').click(function(){
        hideall();
        $("#login").show();
    });
    
    $('#login-seed').click(function(){
        hideall();
        $("#restore").show();
    });
    
    $('#login-btn').click(function(){
        loginAuth();

    });
    
    $('#restore-cancel').click(function(){
        hideall();
        $("#login").show();
    });
    
    $('#restore-ok').click(function(){
        resetExtPassword();
        //hideall();
        //$("#login").show();
    });  
      
    $('#createAccountBack').click(function(){
        readAllAccounts()
        hideall();
        $("#home").show();
    });
      
    $('#zil-stats').click(function(){
       zilStats();        
    });
    
    $('#create-account').click(function(){
        hideall();
        $("#createAccount").show();
    });
    
    $('#createAccountOk').click(function(){
        createAccount();
    });
    
    $('#import-account').click(function(){
        hideall();
        $("#importAccount").show();
    });
    
    $('#importAccountOk').click(function(){
        importAccount();
        hideall();
        $("#home").show();
    });
    
    $('#importAccountBack').click(function(){
        hideall();
        $("#home").show();
    });
    
    $(document).on("click","#accBtn",function(btn){
        ////console.log(btn);
        ////console.log("Value = " + btn.target.innerText);
        loadZilAccount(btn.target.name);
        
    });
    
    $("#tab-sending").click(function() {
        sendTabLoader();
    });
            
    $("#tab-receive").click(function() {
        receiveTabLoader();
    });
    
    $("#receive-addrDisp").click(function() {
        copyToClipboard('#receive-addrDisp');
    });
    $("#accbtnTry").click(function() {
        $('#accountSelect').ddslick('select', {index: '0'});
    });
            
});
