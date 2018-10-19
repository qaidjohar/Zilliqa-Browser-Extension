//prefixes of implementation that we want to test
 window.indexedDB = window.indexedDB || window.mozIndexedDB || 
 window.webkitIndexedDB || window.msIndexedDB;
        
//prefixes of window.IDB objects
 window.IDBTransaction = window.IDBTransaction || 
 window.webkitIDBTransaction || window.msIDBTransaction;
 window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
 window.msIDBKeyRange
         
 if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB.")
 } else {
    console.log("IndexDB support is available");
 }

         
 var db;
 var request = window.indexedDB.open("extLocalDatabase", 1);
        
 request.onerror = function(event) {
	console.log("error: database can not be opened: ");
  };
	 
 request.onsuccess = function(event) {
	db = request.result;
	console.log("database open success: " + db);
 };
	 
 request.onupgradeneeded = function(event) {
	var db = event.target.result;
	var objectStore = db.createObjectStore("userAccounts", {keyPath: "address"});
	
	/*for (var i in employeeData) {
	   objectStore.add(employeeData[i]);
	}
	console.log('onupgradeneeded executed: employee table created');
	* */
 }


function addAccount(addr, accName, pAddr, priAddr, extLoginKey) {
	
			let encPrivateKey = CryptoJS.AES.encrypt(priAddr, extLoginKey); 
			//console.log("encryptedPrivateKey: " + encPrivateKey);
	
            var request = db.transaction(["userAccounts"], "readwrite")
            .objectStore("userAccounts")
            .add({ address: addr, name: accName, publicAddress: pAddr, privateAddress: encPrivateKey.toString() });
            
            request.onsuccess = function(event) {
               console.log("Account has been added to your database.");
            };
            
            request.onerror = function(event) {
               console.log("Unable to add data. It is already exist in your database! ");
            }
}

function removeAccount(address) {
            var request = db.transaction(["userAccounts"], "readwrite")
            .objectStore("userAccounts")
            .delete(address);
            
            request.onsuccess = function(event) {
               console.log("Entry has been removed from your database.");
            };
}


function readAllAccounts() {
    var objectStore = db.transaction("userAccounts").objectStore("userAccounts");
    $("#panelAccountNames").html("");
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       
       if (cursor) {
          console.log("Key " + cursor.key + " is " + cursor.value);
          extAccountArray[cursor.key] = cursor.value;
          
          $("#panelAccountNames").append("<button id='accBtn' class='ui-btn ui-icon-user ui-btn-icon-left ui-corner-all'>"+cursor.key+"</button>");
          
          cursor.continue();
       } else {
          console.log(extAccountArray);
       }
    };
}
