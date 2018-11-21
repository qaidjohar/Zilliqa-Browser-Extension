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
          dbloaded = 1;
    });
}

function getAccount(index){
          return extAccountData[index];
}

function importDBAccount(accountName,privateKey){
    //Validating Private Key
    try{
        let account = laksa.wallet.importAccountFromPrivateKey(privateKey);
        account.privateKey = CryptoJS.AES.encrypt(account.privateKey, extLoginKey);
        extAccountData.push({'address': account.address,'name': accountName,'privateAddress': account.privateKey,'publicAddress': account.publicKey});
        chrome.storage.local.set({userAccounts: extAccountData}, function() {
          $('#accountSelect').ddslick('destroy');
          let index = getAccountIndex(account.address)
          loadAccount(index);
          accountSelector(index);
        });
    } catch(err){ 
        return '-1'; 
    }    
}

function createDBAccount(accountName){
    let newAccount = laksa.wallet.createAccount();
    newAccount.privateKey = CryptoJS.AES.encrypt(newAccount.privateKey, extLoginKey);
    extAccountData.push({'address': newAccount.address,'name': accountName,'privateAddress': newAccount.privateKey,'publicAddress': newAccount.publicKey});      
    console.log(accountName+'  '+newAccount.address+'  '+newAccount.publicKey+'  '+newAccount.privateKey);
    console.log(extAccountData);
    chrome.storage.local.set({userAccounts: extAccountData}, function() {
          console.log('Value is set to ');
          console.log(extAccountData);
    });
    return newAccount.address;
}

function deleteDBAccount(index){
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

function loadAccount(index){
    let timer = setInterval(function(){
        let acDetails = getAccount(index);
        if(acDetails != undefined){
            $("#homeAccName").html(acDetails.name);
            $("#homeAddress").html(acDetails.address);
            let icon = blockies.create({ seed: acDetails.address });
            $("#homeAccIdenticon").html("<img src='"+icon.toDataURL()+"' />");
            $("#homeZilBalance").html("Fetching Balance");
            laksa.zil.getBalance({ address: acDetails.address }, (err, data) => {
              if (err) {
                $("#homeZilBalance").html("Not Connected !!!");
              }
              //console.log(data);
              $("#homeZilBalance").html(data.balance+" Zils");
            });
            background.selectedAccount = index;
            $("#selectedAccountPrivateKey").html("******************************************************<br>**********");
            $("#selectedAccountPublicKey").html(acDetails.publicAddress);
            $("#hidePrKey").hide();
            $("#showPrKeyPopup").show();
            console.log('acDetails');
            console.log(acDetails);
            window.clearInterval(timer);
        }
    }, 100);
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
/*chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
});*/

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
          getAllDBAccounts();
          loadAccount(4);
       }
    };
}
