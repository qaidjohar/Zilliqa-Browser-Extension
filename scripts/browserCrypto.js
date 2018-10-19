const laksa=new Laksa('https://api-scilla.zilliqa.com');
laksa.setProvider("https://api-scilla.zilliqa.com");

var extLoginKey;
var extAccountArray = {};

function zilStats(){
	$.getJSON('https://api.coinmarketcap.com/v2/ticker/2469/?convert=EUR', function(jsondata) {
		var zilTime = formattedDate(jsondata.data.last_updated);
		//$( "#div-stats" ).html( "<p><b> Currency Name:</b> " + jsondata.data.name + "<p><b> Last Updated:</b> " +  zilTime  +"</p> <p><b>USD Price $: </b>" +  jsondata.data.quotes.USD.price + "</p> <p><b>EUR Price &euro;: </b>" +  jsondata.data.quotes.EUR.price + "</p>");
		//$("#tbl-zildata").html("<b> Currency Name:</b> " + jsondata.data.name);
		$("#tbl-zilTime").html("<b> Last Updated Time:</b> " + zilTime);
		$("#tbl-zilCirSupply").html("<b> Circulating Supply:</b> " + jsondata.data.circulating_supply);
		$("#tbl-zilTotalSupply").html("<b> Total Supply:</b> " + jsondata.data.total_supply);
		
		$("#tbl-zilUSDprice").html("<b> USD Price:</b> $" + jsondata.data.quotes.USD.price);
		$("#tbl-zilUSD24hVol").html("<b> Volume 24hrs:</b> $" + jsondata.data.quotes.USD.volume_24h);
		$("#tbl-zilUSDmktCap").html("<b> Market Cap:</b> $" + jsondata.data.quotes.USD.market_cap);
		$("#tbl-zilUSD1hChng").html("<b> Percent Change in 1Hr:</b> $" + jsondata.data.quotes.USD.percent_change_1h);
		
		$("#tbl-zilEURprice").html("<b> EUR Price:</b> &euro;" + jsondata.data.quotes.EUR.price);
		$("#tbl-zilEUR24hVol").html("<b> Volume 24hrs:</b> $" + jsondata.data.quotes.EUR.volume_24h);
		$("#tbl-zilEURmktCap").html("<b> Market Cap:</b> $" + jsondata.data.quotes.EUR.market_cap);
		$("#tbl-zilEUR1hChng").html("<b> Percent Change in 1Hr:</b> $" + jsondata.data.quotes.EUR.percent_change_1h);
   // alert(jsondata.data.name);
    });
}

function passCheck(password){
    if(password.length == 0){
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
    
    //console.log(seedPhrase.replace(/\s\s+/g, ' '));
    //Trimming all extra spaces and storing count of words
    let seedPhraseTrimmed = seedPhrase.replace(/\s\s+/g, ' ');
    let seedPhraseLen = ($.trim(seedPhraseTrimmed).split(" ")).length;
    console.log(seedPhraseLen);
    
    if(seedPhraseLen != 12){
       console.log("Phrase is not of 12 words");
        return; 
    }
    
    if(!passCheck(newPassword)){
        console.log("Empty Password");
        return;
    }
    if(newPassword != newConfirmPassword){
        console.log("Password doesn't Match");
        return;
    }
    else{
        
        chrome.storage.local.get(['initialSetup'], function(result) {
            if(!result.initialSetup){
                chrome.storage.local.set({initialSetup: true}, function() {
                  console.log("Zilliqa Browser Extension - Password encrypted storage initialized.");
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
            console.log("Password Set.");            
        });  // sync.set function
        
        //let setSeed = $.sha1(seedPhraseTrimmed);
        //console.log(CryptoJS.AES.encrypt(seedPhraseTrimmed, extLoginKey)).toString();
        chrome.storage.sync.set({extSeedPhrase: seedPhraseTrimmed}, function() {
            console.log("Seed Phrase Set.");            
        });  // sync.set function
        //Setting seed phrase Hash
        chrome.storage.sync.set({extSeedPhraseHash: $.sha1(seedPhraseTrimmed)}, function() {
            console.log("Seed Phrase in Hash Set.");            
        });  // sync.set function
    }
}

function resetExtPassword(){
    chrome.storage.sync.get(['extSeedPhrase'], function(result) {
      console.log('Seed Phrase currently is ' + result.extSeedPhrase);
      console.log('SHA Seed Phrase currently is ' + $.sha1(result.extSeedPhrase));
    });
    
    let seedPhrase = $('#resetSeedPhrase').val();
    let resetPassword = $('#resetPassword').val();
    let resetConfirmPassword = $('#resetConfirmPassword').val();
    console.log(seedPhrase);
    console.log(resetPassword);
    console.log(resetConfirmPassword);
    
    //Retriveing the HASH of Seed Phrase
    chrome.storage.sync.get(['extSeedPhraseHash'], function(result) {
        console.log('Seed Phrase currently is ' + result.extSeedPhraseHash);
        
        if(result.extSeedPhraseHash != $.sha1(seedPhrase)){
           console.log("Seed Phrase Mismatched");
           return;
        }

        if(!passCheck(resetPassword)){
            console.log("Empty Password");
            return;
        }
        if(resetPassword != resetConfirmPassword){
            console.log("Password doesn't Match");
            return;
        }
        
        let setPwd = $.sha1(resetPassword);
        chrome.storage.sync.set({extLoginKey: setPwd}, function() {
			extLoginKey = newPassword;
            console.log("Reset Password Set.");            
        });  // sync.set function
      
    });
    
    

    
}

function initCheck(){
    console.log("Function InitCheck called!!!");
    chrome.storage.local.get(['initialSetup'], function(result) {
        if(result.initialSetup){
              hideall();
              $("#login").show();
        } else {
            hideall();
            $("#setPass").show();
        }
    });
}

function loadZilAccount(key='9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a'){
    
    // use callback to get the result
    laksa.zil.getBalance({ address: key }, (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(data);
      $("#homeZilBalance").html(data.balance+" Zils");
    });
    
    $("#homeAccName").html('Account');
    $("#homeAddress").html(key);
    
}

// Store/Retrieve user data in extension
function passPhrase(thePassValue){
	// SHA1 encryption algorithm
	let theLoginPassSHA1 = $.sha1(thePassValue);
	//alert(thePassValue + " = " + theLoginPassSHA1);
   
    let theStoredPassSHA1;
   
   //console.log('Value is set to ' + theLoginPassSHA1);  
	
	chrome.storage.sync.get(['extLoginKey'], function(result) {
        // console.log('Value currently is ' + result.extLoginKey);
         
         theStoredPassSHA1 = result.extLoginKey; 
         //console.log('theStoredPassSHA1=' + theStoredPassSHA1);
         
         // Case 1: default Key doesn't exists
         if (!result.extLoginKey) {
			 /*let defPwd =  $.sha1('zilliqa');
			 chrome.storage.sync.set({extLoginKey: defPwd}, function() {
				theStoredPassSHA1 = defPwd;	*/			
            hideall();
            $("#setPass").show();
				
			/*});  // sync.set function*/
		 }		
		 
		 // Case 2: default key exists : ensure it is correct for development testing
		 if (theStoredPassSHA1 != theLoginPassSHA1) {
			 console.log('Wrong Seed Phase. Please try again...');			 	 
		 } else{
			extLoginKey = thePassValue;
			hideall();
			$("#home").show();
            readAllAccounts();
            loadZilAccount('7af0bcb44835a6917d5b6ad237ad8e04ff38a956');
		 }
		 
     }); // sync.get function
}

function createAccount(){
    console.log(laksa.getProvider());
    
    laksa.isConnected((err, data) => {
      if (err) {
        console.log(err);
      }
      //console.log(data);
    });
    
    // use then to get the result
    laksa.isConnected().then(console.log);
    

    // now do the createAccount()
    const newAccount = laksa.wallet.createAccount();
    
    // check the account that created
    console.log(newAccount);
    $("#address").html("<b>Address:</b><br>"+newAccount.address);
    $("#public").html("<br><b>Public Key:</b><br>"+newAccount.publicKey);
    $("#private").html("<br><b>Private Key:</b><br>"+newAccount.privateKey);
    addAccount(newAccount.address, "account1", newAccount.publicKey, newAccount.privateKey, extLoginKey)
}
