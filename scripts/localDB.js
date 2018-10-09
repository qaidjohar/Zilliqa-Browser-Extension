//https://www.tutorialspoint.com/html5/html5_indexeddb.htm
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

const employeeData = [
            { id: "00-01", name: "gopal", age: 35, email: "gopal@tutorialspoint.com" },
            { id: "00-02", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" },
            { id: "00-03", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" },
            { id: "00-04", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" }
         ];
         
 var db;
 var request = window.indexedDB.open("localDatabase", 2);
        
 request.onerror = function(event) {
	console.log("error: database can not be opened: ");
  };
	 
 request.onsuccess = function(event) {
	db = request.result;
	console.log("database open success: " + db);
 };
	 
 request.onupgradeneeded = function(event) {
	var db = event.target.result;
	var objectStore = db.createObjectStore("employee1", {keyPath: "id"});
	
	for (var i in employeeData) {
	   objectStore.add(employeeData[i]);
	}
	console.log('onupgradeneeded executed: employee table created');
 }
