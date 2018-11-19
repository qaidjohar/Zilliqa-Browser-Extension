//prefixes of implementation that we want to test
 window.indexedDB = window.indexedDB || window.mozIndexedDB || 
 window.webkitIndexedDB || window.msIndexedDB;
        
//prefixes of window.IDB objects
 window.IDBTransaction = window.IDBTransaction || 
 window.webkitIDBTransaction || window.msIDBTransaction;
 window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
 window.msIDBKeyRange
         
 if (!window.indexedDB) {
    //console.log("Your browser doesn't support a stable version of IndexedDB.")
 } else {
    //console.log("IndexDB support is available");
 }

         
 var db;
 var request = window.indexedDB.open("extLocalDatabase", 1);
        
 request.onerror = function(event) {
	//console.log("error: database can not be opened: ");
  };
	 
 request.onsuccess = function(event) {
	db = request.result;
	//console.log("database open success: " + db);
 };
	 
 request.onupgradeneeded = function(event) {
	var db = event.target.result;
	var objectStore = db.createObjectStore("userAccounts", {keyPath: "address"});
	
	/*for (var i in employeeData) {
	   objectStore.add(employeeData[i]);
	}
	//console.log('onupgradeneeded executed: employee table created');
	* */
 }


function addAccount(addr, accName, pAddr, priAddr, extLoginKey) {
	
			let encPrivateKey = CryptoJS.AES.encrypt(priAddr, extLoginKey); 
			////console.log("encryptedPrivateKey: " + encPrivateKey);
	
            var request = db.transaction(["userAccounts"], "readwrite")
            .objectStore("userAccounts")
            .add({ address: addr, name: accName, publicAddress: pAddr, privateAddress: encPrivateKey.toString() });
            
            request.onsuccess = function(event) {
               //console.log("Account has been added to your database.");
            };
            
            request.onerror = function(event) {
               //console.log("Unable to add data. It is already exist in your database! ");
            }
}

function removeAccount(address) {
            var request = db.transaction(["userAccounts"], "readwrite")
            .objectStore("userAccounts")
            .delete(address);
            
            request.onsuccess = function(event) {
               //console.log("Entry has been removed from your database.");
            };
}

function loadZilAccount(addr='f7c08521fc6b50d19f9863a40013db227b72cd2f'){
    let objectStore = db.transaction("userAccounts").objectStore("userAccounts");
    let request = objectStore.get(addr);
    
    //Creating Identicon
    var icon = blockies.create({ // All options are optional
        seed: addr, 
    });
    
    request.onerror = function(event) {
       //console.log("Unable to retrieve data from database!");
    };

    request.onsuccess = function(event) {
        if(request.result) {
            $("#homeAccName").html(request.result.name);
            //$("#homeAccName").append("&nbsp;&nbsp;&nbsp;&nbsp;");
            $("#homeAccIdenticon").html("<img src='"+icon.toDataURL()+"' />");
        }
        else{
            $("#homeAccName").html('Account');
            $("#homeAccIdenticon").html("<img src='"+icon.toDataURL()+"' />");
        }
    };
    
    // use callback to get the Balance
    laksa.zil.getBalance({ address: addr }, (err, data) => {
      if (err) {
        //console.log(err);
      }
      //console.log(data);
      $("#homeZilBalance").html(data.balance+" Zils");
    });
    //let accName = readAccount(addr);
    //console.log("Name is");
    //console.log(readAccount(addr));
    ////console.log(accName.name);
    
    
    $("#homeAccName").html('Account');
    $("#homeAccName").append(icon);
    $("#homeAddress").html(addr);
}

function setAllDBAccounts(){
    chrome.storage.local.set({userAccounts: extAccountData}, function() {
          console.log('Value is set to ');
          console.log(extAccountData);
    });
}

function getAllDBAccounts(){
    chrome.storage.local.get(['userAccounts'], function(result) {
          console.log("Getting Values");
          console.log(result.userAccounts);
          extAccountData = result.userAccounts;
          deleteAccount(7);
    });
}

function addNewAccount(accountName){
    let newAccount = laksa.wallet.createAccount();
    extAccountData.push({'address': newAccount.address,'name': accountName,'privateAddress': newAccount.privateKey,'publicAddress': newAccount.publicKey});      
    console.log(accountName+'  '+newAccount.address+'  '+newAccount.publicKey+'  '+newAccount.privateKey);
    console.log(extAccountData);
    chrome.storage.local.set({userAccounts: extAccountData}, function() {
          console.log('Value is set to ');
          console.log(extAccountData);
    });
}

function deleteAccount(index){
    if (index > -1) {
      extAccountData.splice(index, 1);
      console.log(index);
    }
    else{
        console.log("No such index");
    }
    console.log(extAccountData);
    chrome.storage.local.set({userAccounts: extAccountData}, function() {
          console.log('Value is set to ');
          console.log(extAccountData);
    });
}

function getAccountIndex(accAddress){
    let index = extAccountData.map(function (account) { return account.address; }).indexOf(accAddress);
    //console.log(index);
    return index;
}

function getAccountAddress(accIndex){
    return extAccountData[accIndex].address;
}

//Storage key "userAccounts" in namespace "local" changed. Old value was "Array(6)", new value is "Array(7)".
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
});

function readAllDBAccounts(){
    let objectStore = db.transaction("userAccounts").objectStore("userAccounts");
    extAccountData = [];
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        let i=0;
        if (cursor) {
            //let decPrivateKey = CryptoJS.AES.decrypt(cursor.value.privateAddress, extLoginKey).toString(CryptoJS.enc.Utf8);; 
            //cursor.value.privateAddress = decPrivateKey;
            extAccountData.push(
                cursor.value,
            );            
            cursor.continue();
        } else {
          console.log(extAccountData);
          //addNewAccount("My New Account");
          //deleteAccount(7);
        }
    };
}

function readAllAccounts() {
    let objectStore = db.transaction("userAccounts").objectStore("userAccounts");
    $("#panelAccountNames").html("");
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       let i=0;
       if (cursor) {
          //console.log("Key " + cursor.key + " is " + cursor.value);
          extAccountArray[cursor.key] = cursor.value;
          if (i == 0) {
              i += 1;
              loadZilAccount(cursor.key);
          }
          let icon = blockies.create({ // All options are optional
			seed: cursor.value.address, 
		});
		//$("#panelAccountNames").append(icon);
         // $("#panelAccountNames").append("<button id='accBtn' class='ui-btn ui-icon-user ui-btn-icon-left ui-corner-all'>"+cursor.value.name+"</button>");
          $("#panelAccountNames").append("<button id='accBtn' name='"+cursor.value.address+"' class='ui-btn ui-corner-all'> <img src="+ icon.toDataURL()+" /> "+ cursor.value.name +"</button>");
          cursor.continue();
       } else {
          console.log("Reading Ended");
       }
    };
}
