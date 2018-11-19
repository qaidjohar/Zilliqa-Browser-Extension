//const laksa=new Laksa('https://api-scilla.zilliqa.com');
//laksa.setProvider("https://api-scilla.zilliqa.com");
const laksa=new Laksa('https://dev-test-api.aws.z7a.xyz/');
laksa.setProvider("https://dev-test-api.aws.z7a.xyz/");

var extLoginKey;
var extAccountArray = {};
var extAccountData = [];

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

function displayErrorPopups(message){
    $("#popupMessage").html(message);
    $( "#popupMessage" ).popup( "open");
    setTimeout( function(){ $( "#popupMessage" ).popup( "close" ); }, 5000 );	 	 
}

function zilStats(){
	$.getJSON('https://api.coinmarketcap.com/v2/ticker/2469/?convert=EUR', function(jsondata) {
		var zilTime = formattedDate(jsondata.data.last_updated);
		//$( "#div-stats" ).html( "<p><b> Currency Name:</b> " + jsondata.data.name + "<p><b> Last Updated:</b> " +  zilTime  +"</p> <p><b>USD Price $: </b>" +  jsondata.data.quotes.USD.price + "</p> <p><b>EUR Price &euro;: </b>" +  jsondata.data.quotes.EUR.price + "</p>");
		//$("#tbl-zildata").html("<b> Currency Name:</b> " + jsondata.data.name);
		$("#tbl-zilTime").html("<b> Last Updated Time:</b> " + zilTime);
		$("#tbl-zilCirSupply").html("<b> Circulating Supply:</b> " + jsondata.data.circulating_supply);
		$("#tbl-zilTotalSupply").html("<b> Total Supply:</b> " + jsondata.data.total_supply);
		
		$("#tbl-zilUSDprice").html("<b> USD Price:</b> $" + jsondata.data.quotes.USD.price);
		//$("#tbl-zilUSD24hVol").html("<b> Volume 24hrs:</b> $" + jsondata.data.quotes.USD.volume_24h);
		$("#tbl-zilUSDmktCap").html("<b> Market Cap:</b> $" + jsondata.data.quotes.USD.market_cap);
		$("#tbl-zilUSD1hChng").html("<b> Percent Change in 1Hr:</b> $" + jsondata.data.quotes.USD.percent_change_1h);
		
		$("#tbl-zilEURprice").html("<b> EUR Price:</b> &euro;" + jsondata.data.quotes.EUR.price);
		//$("#tbl-zilEUR24hVol").html("<b> Volume 24hrs:</b> $" + jsondata.data.quotes.EUR.volume_24h);
		$("#tbl-zilEURmktCap").html("<b> Market Cap:</b> $" + jsondata.data.quotes.EUR.market_cap);
		$("#tbl-zilEUR1hChng").html("<b> Percent Change in 1Hr:</b> $" + jsondata.data.quotes.EUR.percent_change_1h);
   // alert(jsondata.data.name);
    });
}

function emptyInputCheck(word){
    if(word.length == 0){
        return false;
    }
    else{
        return true;
    }
}

function loginSetup(){
    let seedPhrase = $('#newSeedPhrase').val();
    let newPassword = $('#newPassword').val();
    let newConfirmPassword = $('#newConfirmPassword').val();
    
    ////console.log(seedPhrase.replace(/\s\s+/g, ' '));
    //Trimming all extra spaces and storing count of words
    let seedPhraseTrimmed = seedPhrase.replace(/\s\s+/g, ' ');
    let seedPhraseLen = ($.trim(seedPhraseTrimmed).split(" ")).length;
    //console.log(seedPhraseLen);
    
    if(seedPhraseLen != 12){
       //console.log("Phrase is not of 12 words");
        return; 
    }
    
    if(!emptyInputCheck(newPassword)){
        //console.log("Empty Password");
        return;
    }
    if(newPassword != newConfirmPassword){
        //console.log("Password doesn't Match");
        return;
    }
    else{
        
        chrome.storage.local.get(['initialSetup'], function(result) {
            if(!result.initialSetup){
                chrome.storage.local.set({initialSetup: true}, function() {
                  //console.log("Zilliqa Browser Extension - Password encrypted storage initialized.");
                  hideall();
                  $("#login").show();
                });
            } else {
                hideall();
                $("#login").show();
            }
        });
        
        let setPwd = $.sha1(newPassword);
        chrome.storage.sync.set({extLoginKey: setPwd}, function() {
			extLoginKey = newPassword;
            //console.log("Password Set.");            
        });  // sync.set function
        
        //let setSeed = $.sha1(seedPhraseTrimmed);
        ////console.log(CryptoJS.AES.encrypt(seedPhraseTrimmed, extLoginKey)).toString();
        chrome.storage.sync.set({extSeedPhrase: seedPhraseTrimmed}, function() {
            //console.log("Seed Phrase Set.");            
        });  // sync.set function
        //Setting seed phrase Hash
        chrome.storage.sync.set({extSeedPhraseHash: $.sha1(seedPhraseTrimmed)}, function() {
            //console.log("Seed Phrase in Hash Set.");            
        });  // sync.set function
        
        //Create an initial account 
        let initialAccount = laksa.wallet.createAccount();
        addAccount(initialAccount.address, accountName, initialAccount.publicKey, initialAccount.privateKey, extLoginKey);
    }
}

function resetExtPassword(){    
    let seedPhrase = $('#resetSeedPhrase').val();
    let resetPassword = $('#resetPassword').val();
    let resetConfirmPassword = $('#resetConfirmPassword').val();
    
    //Retriveing the HASH of Seed Phrase
    chrome.storage.sync.get(['extSeedPhraseHash'], function(result) {
        //console.log('Seed Phrase currently is ' + result.extSeedPhraseHash);
        
        //Checking of Seed Phrase entered matches with seed phrase hash in DB
        if(result.extSeedPhraseHash != $.sha1(seedPhrase)){
           //console.log("Seed Phrase Mismatched");
           return;
        }
        //Check if password not empty
        if(!emptyInputCheck(resetPassword)){
            //console.log("Empty Password");
            return;
        }
        //Check if password and confirm password are same
        if(resetPassword != resetConfirmPassword){
            //console.log("Password doesn't Match");
            return;
        }
        
        //setting new password in db
        let setPwd = $.sha1(resetPassword);
        chrome.storage.sync.set({extLoginKey: setPwd}, function() {
			extLoginKey = newPassword;
            //console.log("Reset Password Set."); 
            hideall();
            $("#login").show();           
        });  // sync.set function
      
    });
}

function initCheck(){
    //console.log("Function InitCheck called!!!");
    chrome.storage.local.get(['initialSetup'], function(result) {
        if(result.initialSetup){
            if(background.status == 0){
                hideall();
                $("#login").show();
            } else {
                hideall();
                extLoginKey = background.extLoginKey;
                $("#home").show();
                readAllAccounts();
                loadZilAccount();
            }
        } else {
            hideall();
            let mnemonic = bip39.generateMnemonic();
            $('#newSeedPhrase').html(mnemonic);
            $("#setPass").show();
        }
    });
}

function loginAuth(){
    let password =  $('#password').val();
    let theLoginPassSHA1 = $.sha1(password);
    let theStoredPassSHA1;
    
    chrome.storage.sync.get(['extLoginKey'], function(result) {         
         theStoredPassSHA1 = result.extLoginKey; 
         
         // Case 1: default Key doesn't exists
         if (!result.extLoginKey) {
            hideall();
            $("#setPass").show();
		 }		
		 
		 // Case 2: default key exists : ensure it is correct for development testing
		 if (theStoredPassSHA1 != theLoginPassSHA1) {
			 //console.log('Wrong Seed Phase. Please try again...');	
             displayErrorPopups("Invalid Password!")	
		 } else{
			extLoginKey = password;
            background.extLoginKey = password;
            background.status = 1;
			hideall();
			$("#home").show();
            readAllAccounts();
            loadZilAccount();
		 }
     }); // sync.get function    
}


function createAccount(){
    let accountName = $('#createAccountName').val();
    //console.log(accountName);
    if(accountName.length == 0){
        return;
    }
    
    $("#createAccountOk").hide();
    $("#createAccountBack").show();
        
    //console.log(laksa.getProvider());
    
    laksa.isConnected((err, data) => {
      if (err) {
        //console.log(err);
      }
      ////console.log(data);
    });
    
    // use then to get the result
    laksa.isConnected().then(console.log);
    

    // now do the createAccount()
    const newAccount = laksa.wallet.createAccount();
    
    // check the account that created
    //console.log(newAccount);
    $("#zilAccountName").html("<b>Name:</b><br>"+accountName);
    $("#zilAddress").html("<b>Address:</b><br>"+newAccount.address);
    $("#zilPublic").html("<br><b>Public Key:</b><br>"+newAccount.publicKey);
    $("#zilPrivate").html("<br><b>Private Key:</b><br>"+newAccount.privateKey);
    addAccount(newAccount.address, accountName, newAccount.publicKey, newAccount.privateKey, extLoginKey);
}

function importAccount(){
    let importAccountName = $('#importAccountName').val();
    let importAccountAddress = $('#importAccountAddress').val();
    let importAccountPublic = $('#importAccountPublic').val();
    let importAccountPrivate = $('#importAccountPrivate').val();
    addAccount(importAccountAddress, importAccountName, importAccountPublic, importAccountPrivate, extLoginKey);
    readAllAccounts();
}


function sendTabLoader(){
    let fromData = []; // create an empty array    
    //console.log(extAccountArray);
    
    //Filling accounts into From select box in send tab
    //$('#sendFromSelect').html("");
    $.each(extAccountArray, function(key, val) {
        console.log( val.name + " ("+key+")");
        let icon = blockies.create({ // All options are optional
			seed: key, 
		});
        fromData.push({
            text: val.name,
            value: key,
            description: key,
            imageSrc: icon.toDataURL()
        });
    });
    $('#sendFromSelect').ddslick({
        data: fromData,
        width: 300,
        height:150,
        imagePosition: "left",
        selectText: "From",
        onSelected: function(data){
            loadZilAccount(data.selectedData.value);
        }
    });
    
}

function receiveTabLoader(){
    let selectData = []; // create an empty array    
    //console.log(extAccountArray);
    
    //Filling accounts into From select box in send tab
    //$('#sendFromSelect').html("");
    $.each(extAccountArray, function(key, val) {
        console.log( val.name + " ("+key+")");
        let icon = blockies.create({ // All options are optional
			seed: key, 
		});
        selectData.push({
            text: val.name,
            value: key,
            description: key,
            imageSrc: icon.toDataURL()
        });
    });
    $('#receive-selectToQR').ddslick({
        data: selectData,
        width: 300,
        height:150,
        imagePosition: "left",
        selectText: "Receiver Account",
        onSelected: function(data){
            console.log(data.selectedData.value);
            $("#receive-QRGenerator").html("");
            jQuery(function(){
                jQuery('#receive-QRGenerator').qrcode({width: 140,height: 140,text: data.selectedData.value});
            });
            $('#receive-addrDisp').html(data.selectedData.value);
        }
    });
    
}

function accountSelector(selectedVal = '-1'){
    let selectData = []; // create an empty array    
    $.each(extAccountData, function(index, val) {
        console.log( val.name + " ("+index+")");
        let icon = blockies.create({ // All options are optional
			seed: val.address, 
		})
        selectData.push({
            text: val.name,
            value: index,
            description: val.address,
            imageSrc: icon.toDataURL()
        });
    });
    console.log(selectData);
    $('#accountSelect').ddslick({
        data: selectData,
        width: 300,
        height:250,
        imagePosition: "left",
        selectText: "Select Account",
        onSelected: function(data){
            console.log(data);
        }
    });
    if(selectedVal >= 0 && selectedVal < selectData.length){
        $('#accountSelect').ddslick('select', {index: selectedVal});
        console.log(selectedVal);
    }
}

