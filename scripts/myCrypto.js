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
