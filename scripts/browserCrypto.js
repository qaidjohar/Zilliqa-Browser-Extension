//const laksa=new Laksa('https://api-scilla.zilliqa.com');
//laksa.setProvider("https://api-scilla.zilliqa.com");
//const laksa=new Laksa('https://dev-test-api.aws.z7a.xyz/');
//laksa.setProvider("https://dev-test-api.aws.z7a.xyz/");
const laksa = new Laksa()
const nodeProvider = new laksa.Modules.HttpProvider('https://api-scilla.zilliqa.com');
const scillaProvider = new laksa.Modules.HttpProvider('https://scilla-runner.zilliqa.com');
laksa.setNodeProvider(nodeProvider);
laksa.setScillaProvider(scillaProvider);


var extLoginKey;
var extAccountArray = {};
var extAccountData = [];
var dbloaded = 0;


function copyToClipboard(element) {
  let $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

function displayErrorPopups(message){
    $("#popupMessage").html(message);
    $( "#popupMessage" ).popup( "open");
    setTimeout( function(){ $( "#popupMessage" ).popup( "close" ); }, 3000 );	 	 
}
function displaySuccessPopups(message){
    $("#popupMessageSuccess").html(message);
    $( "#popupMessageSuccess" ).popup( "open");
    setTimeout( function(){ $( "#popupMessageSuccess" ).popup( "close" ); }, 3000 );	 	 
}

function shortAddress(address){
    let s1 = address.slice(0,4);
    let s2 = address.slice(-4,-1)+address.slice(-1);
    return (s1+'...'+s2); //=> '12345678'
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

function loginSetup(seedPhrase,newPassword,newConfirmPassword){
    //let seedPhrase = $('#newSeedPhrase').val();
    //let newPassword = $('#newPassword').val();
    //let newConfirmPassword = $('#newConfirmPassword').val();
    
    ////console.log(seedPhrase.replace(/\s\s+/g, ' '));
    //Trimming all extra spaces and storing count of words
    let seedPhraseTrimmed = seedPhrase.replace(/\s\s+/g, ' ');
    let seedPhraseLen = ($.trim(seedPhraseTrimmed).split(" ")).length;
    //console.log(seedPhraseLen);
    
    if(seedPhraseLen != 12){
       //console.log("Phrase is not of 12 words");
        return -3; 
    }
    
    if(!emptyInputCheck(newPassword)){
        //console.log("Empty Password");
        return -2;
    }
    if(newPassword != newConfirmPassword){
        //console.log("Password doesn't Match");
        return -1;
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
        chrome.storage.local.set({extLoginKey: setPwd}, function() {
			extLoginKey = newPassword;
            //console.log("Password Set.");            
        });  // local.set function
        
        let setSeed = $.sha1(seedPhraseTrimmed);
        seedPhraseEncrypted = CryptoJS.AES.encrypt(seedPhraseTrimmed, newPassword)
        chrome.storage.local.set({extSeedPhrase: seedPhraseEncrypted}, function() {
            //console.log("Seed Phrase Set.");            
        });  // local.set function
        //Setting seed phrase Hash
        chrome.storage.local.set({extSeedPhraseHash: $.sha1(seedPhraseTrimmed)}, function() {
            //console.log("Seed Phrase in Hash Set.");            
        });  // local.set function
        
        //Create an initial account 
        createInitialAccount(newPassword);
        return 0;
    }
}

function resetExtPassword(){    
    let seedPhrase = $('#resetSeedPhrase').val();
    let resetPassword = $('#resetPassword').val();
    let resetConfirmPassword = $('#resetConfirmPassword').val();
    
    //Retriveing the HASH of Seed Phrase
    chrome.storage.local.get(['extSeedPhraseHash'], function(result) {
        //console.log('Seed Phrase currently is ' + result.extSeedPhraseHash);
        
        //Checking of Seed Phrase entered matches with seed phrase hash in DB
        if(result.extSeedPhraseHash != $.sha1(seedPhrase)){
           //console.log("Seed Phrase Mismatched");
           displayErrorPopups("Seed Phrase not correct!");
           return;
        }
        //Check if password not empty
        if(!emptyInputCheck(resetPassword)){
            displayErrorPopups("Empty Password!");
            //console.log("Empty Password");
            return;
        }
        //Check if password and confirm password are same
        if(resetPassword != resetConfirmPassword){
            displayErrorPopups("Password doesn't Match");
            //console.log("Password doesn't Match");
            return;
        }
        
        //setting new password in db
        $('#resetSeedPhrase').val('');
        $('#resetPassword').val('');
        $('#resetConfirmPassword').val('');
        let setPwd = $.sha1(resetPassword);
        chrome.storage.local.set({extLoginKey: setPwd}, function() {
			extLoginKey = newPassword;
            //console.log("Reset Password Set."); 
            hideall();
            $("#login").show(); 
            setTimeout(function(){displaySuccessPopups("Password Reset Complete");},100);         
        });  // local.set function
      
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
                getAllDBAccounts();
                loadAccount(background.selectedAccount);
                setTimeout(function(){accountSelector(background.selectedAccount);},100);
            }
        } else {
            hideall();
            let mnemonic = bip39.generateMnemonic();
            $('#newSeedPhrase').html(mnemonic);
            $("#setPass").show();
        }
    });
}

function logout(){
    background.status = 0;
    background.extLoginKey = null;
    hideall();
    $("#login").show();
}

function loginAuth(password){
    //let password =  $('#password').val();
    //$('#password').val('');
    let theLoginPassSHA1 = $.sha1(password);
    let theStoredPassSHA1;
    
    chrome.storage.local.get(['extLoginKey'], function(result) {         
         theStoredPassSHA1 = result.extLoginKey; 
         
         // Case 1: default Key doesn't exists
         if (!result.extLoginKey) {
            hideall();
            $("#setPass").show();
		 }		
		 
		 // Case 2: default key exists : ensure it is correct for development testing
		 if (theStoredPassSHA1 != theLoginPassSHA1) {
			 //console.log('Wrong Seed Phase. Please try again...');	
             displayErrorPopups("Invalid Password!");
             return -1;
		 } else{
			extLoginKey = password;
            background.extLoginKey = password;
            background.status = 1;
			hideall();
			$("#home").show();
            getAllDBAccounts();
            loadAccount(background.selectedAccount);
            setTimeout(function(){accountSelector(background.selectedAccount);},100);
            return 0;
		 }
     }); // local.get function    
}

function showPrivateKey(flag){
    if(flag){
        let password = $('#prKeyPassInput').val();
        $('#prKeyPassInput').val('');
        if(password != extLoginKey){
            $( "#popupShowPrKey" ).popup( "close" );
            setTimeout( function(){ displayErrorPopups("Invalid Password"); }, 500 );
            return;
        }
        let acDetails = getAccount(background.selectedAccount);
        let decPrivateKey = CryptoJS.AES.decrypt(acDetails.privateAddress, password).toString(CryptoJS.enc.Utf8);
        $("#selectedAccountPrivateKey").html(decPrivateKey);
        $( "#popupShowPrKey" ).popup( "close" );
        $("#hidePrKey").show();
        $("#showPrKeyPopup").hide();
    } else {
        $("#selectedAccountPrivateKey").html("******************************************************<br>**********");
        $("#hidePrKey").hide();
        $("#showPrKeyPopup").show();
    }
}

function deleteAccount(){
    deleteDBAccount(background.selectedAccount);
    $('#accountSelect').ddslick('destroy');
    setTimeout( function(){ 
         loadAccount(0);
         accountSelector(0);
    }, 100 );
}

function createAccount(){
    let accName = $('#createAccInput').val();
    $('#createAccInput').val('');
    if(accName.length == 0){
        setTimeout( function(){ displayErrorPopups("Account Name Invalid"); }, 500 );
        return;
    }
    let address = createDBAccount(accName);
    let index = getAccountIndex(address)
    $('#accountSelect').ddslick('destroy');
    setTimeout( function(){ 
         loadAccount(index);
         accountSelector(index);
    }, 100 );
}

function importAccount(){
    let accName = $('#importAccNameInput').val();
    $('#importAccNameInput').val('');
    if(accName.length == 0){
        setTimeout( function(){ displayErrorPopups("Import Account Name Invalid"); }, 500 );
        return;
    }
    let privatekey = $('#importPrKeyInput').val();
    $('#importPrKeyInput').val('');
    if(privatekey.length == 0){
        setTimeout( function(){ displayErrorPopups("Import Private Key Invalid."); }, 500 );
        return;
    }
    let status = importDBAccount(accName,privatekey)
    if(status == -1){
        setTimeout( function(){ displayErrorPopups("Import Private Key Invalid"); }, 500 );
        return;
    }
}

function sendTabLoader(){
    let account = getAccount(background.selectedAccount);
    $('#sendFromSelect').html("From Account: <b>"+account.name+" ("+shortAddress(account.address)+") </b>");    
}
function sendtoaddrIdenticon(){
    let sendTo = $('#sendToAddress').val();
    let icon = blockies.create({ // All options are optional
			seed: sendTo 
    });
    //$('#sendToAddrIdenticon').html(icon);
    if(sendTo==''){
        $("#sendToAddrIdenticon").attr("src", '');
    }
    else{
        $("#sendToAddrIdenticon").attr("src", icon.toDataURL());
    }
}

function initiateTransaction(){
    //$( "#popupUndismissible" ).popup( "open");
    let sendTo = $('#sendToAddress').val();
    let amount = $('#sendAmount').val();
    let gasPrice = $('#sendGasPrice').val();
    let gasLimit = $('#sendGasLimit').val();
    if(sendTo.length == 0){ displayErrorPopups("Address to Send is Invalid"); return; }
    if(amount.length == 0){ displayErrorPopups("Amount to Send is Invalid"); return; }
    if(gasPrice.length == 0){ displayErrorPopups("Gas Price Invalid"); return; }
    if(gasLimit.length == 0){ $('#sendGasLimit').val('1'); displayErrorPopups("Gas Limit set to 1"); return; }
    let acDetails = getAccount(background.selectedAccount);
    let decPrivateKey = CryptoJS.AES.decrypt(acDetails.privateAddress, extLoginKey).toString(CryptoJS.enc.Utf8);
    //console.log(acDetails);
    //console.log(decPrivateKey);
    let account = laksa.wallet.importAccountFromPrivateKey(decPrivateKey);
    //console.log(account);
    if(account == false){ setTimeout( function(){ displayErrorPopups("Unable to fetch Private Key..Reload Extension"); }, 100 ); return; }
    
    let transaction = new laksa.Modules.Transaction({
        version: 0,
        toAddr: sendTo,
        amount: laksa.util.toBN(parseInt(amount)),
        gasPrice: laksa.util.toBN(parseInt(gasPrice)),
        gasLimit: laksa.util.toBN(parseInt(gasLimit))
    });
    //console.log(transaction);
    account.signTransaction(transaction).then(d=>laksa.zil.createTransaction(d)).then(e=>{
        //console.log(e);
        $('#sendToAddress').val('');
        $('#sendAmount').val('');
        $('#sendGasPrice').val('');
        $('#sendGasLimit').val('');
        if(e.TranID != undefined){
            displaySuccessPopups("Success. TransID: "+e.TranID);
            let tabUrl = 'https://explorer-scilla.zilliqa.com/transactions/'+e.TranID.toString();
            chrome.tabs.create({url: tabUrl, active: false});
        } else {
            displayErrorPopups("Error: "+e.Error);
        }
        return;
    });
}

function receiveTabLoader(){
    let account = getAccount(background.selectedAccount);
    $("#receive-accountName").html(account.name);
    $("#receive-QRGenerator").html("");
    jQuery(function(){
        jQuery('#receive-QRGenerator').qrcode({width: 160,height: 160,text: account.address});
    });
    $('#receive-addrDisp').html(account.address);
    $("#receive-addrDisp").append('<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1.4em" width="1.4em" viewBox="0 0 40 40" style="vertical-align:middle;cursor:pointer"><g><path d="m30 35h-25v-22.5h25v7.5h2.5v-12.5c0-1.4-1.1-2.5-2.5-2.5h-7.5c0-2.8-2.2-5-5-5s-5 2.2-5 5h-7.5c-1.4 0-2.5 1.1-2.5 2.5v27.5c0 1.4 1.1 2.5 2.5 2.5h25c1.4 0 2.5-1.1 2.5-2.5v-5h-2.5v5z m-20-27.5h2.5s2.5-1.1 2.5-2.5 1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5 1.3 2.5 2.5 2.5h2.5s2.5 1.1 2.5 2.5h-20c0-1.5 1.1-2.5 2.5-2.5z m-2.5 20h5v-2.5h-5v2.5z m17.5-5v-5l-10 7.5 10 7.5v-5h12.5v-5h-12.5z m-17.5 10h7.5v-2.5h-7.5v2.5z m12.5-17.5h-12.5v2.5h12.5v-2.5z m-7.5 5h-5v2.5h5v-2.5z"></path></g></svg>');
}

function accountSelector(selectedVal = '-1'){
    let selectData = []; // create an empty array    
    //console.log(extAccountData);
    $.each(extAccountData, function(index, val) {
        //console.log( val.name + " ("+index+")");
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
    //console.log(selectData);
    $('#accountSelect').ddslick({
        data: selectData,
        width: "98%",
        height:220,
        imagePosition: "left",
        background: "#fff",
        selectText: "Select Account",
        onSelected: function(data){
            //console.log(data.selectedIndex);
            loadAccount(data.selectedIndex);
        }
    });
    if(selectedVal >= 0 && selectedVal < selectData.length){
        $('#accountSelect').ddslick('select', {index: selectedVal.toString()});
        //console.log(selectedVal);
    }
}

