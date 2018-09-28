function ajaxCall(){
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

// Store/Retrieve user data in extension
function passPhrase(thePassValue){
	// SHA1 encryption algorithm
	let theLoginPassSHA1 = $.sha1(thePassValue);
	//alert(thePassValue + " = " + theLoginPassSHA1);
   
    let theStoredPassSHA1;
   
   //alert('KRP-Value is set to ' + theLoginPassSHA1);  
	
	chrome.storage.sync.get(['extLoginKey'], function(result) {
        // alert('KRP-Value currently is ' + result.extLoginKey);
         
         theStoredPassSHA1 = result.extLoginKey; 
         //alert('theStoredPassSHA1=' + theStoredPassSHA1);
         
         // Case 1: default Key doesn't exists
         if (!result.extLoginKey) {
			 let defPwd =  $.sha1('zilliqa');
			 chrome.storage.sync.set({extLoginKey: defPwd}, function() {
				// alert('KRP-Value is set to ' + theLoginPassSHA1);
				//alert('case 1: KRP-Value is set to ' + defPwd);
				theStoredPassSHA1 = defPwd;
				
				
				hideall();
				$("#home").show();
				
			});  // sync.set function
		 }		
		 
		 // Case 2: default key exists : ensure it is correct for development testing
		 if (theStoredPassSHA1 != theLoginPassSHA1) {
			 alert('Wrong Seed Phase. Please try again...');			 	 
		 } else{
			hideall();
			$("#home").show();
		 }
		 
     }); // sync.get function
    
}

function createAccount(){
    const laksa=new Laksa('https://api-scilla.zilliqa.com');
    laksa.setProvider("https://api-scilla.zilliqa.com");
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
    const newAccount = LaksaWallet.createAccount();
    
    // check the account that created
    console.log(newAccount);
    $("#address").html("<b>Address:</b><br>"+newAccount.address);
    $("#public").html("<br><b>Public Key:</b><br>"+newAccount.publicKey);
    $("#private").html("<br><b>Private Key:</b><br>"+newAccount.privateKey);
}
