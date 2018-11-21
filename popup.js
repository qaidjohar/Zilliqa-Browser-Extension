/*
Old Testnets
dev-test-api: https://dev-test-api.aws.z7a.xyz
dev-test-explorer: https://dev-test-explorer.aws.z7a.xyz
* 
* 
New Testnets - Tested on Zilliqa-js-monorepo
* https://api-scilla.zilliqa.com/
* https://explorer-scilla.zilliqa.com/

 * */


var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js
//background.status = 0;
//background.status = parseInt(background.status)+1;
//console.log(background.status);

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

//$("#popupMessage").delay(5000).fade();
//$("#popupMessage").show().delay(5000).fadeOut();


$(function(){

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
        loadZilAccount(btn.target.name);
        
    });
    
    $("#showPrKey").click(function() {
        showPrivateKey(1);
    });
    $("#hidePrKey").click(function() {
        showPrivateKey(0);
    });
    $("#confirmDelAcBtn").click(function() {
        deleteAccount();
    });
    
    $("#createAccountBtn").click(function() {
        createAccount();
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
