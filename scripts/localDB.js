function setAllDBAccounts(){
    chrome.storage.local.set({userAccounts: extAccountData}, function() {
          //console.log(extAccountData);
    });
}

function getAllDBAccounts(){
    chrome.storage.local.get(['userAccounts'], function(result) {
          //console.log(result.userAccounts);
          extAccountData = result.userAccounts;
          dbloaded = 1;
    });
}

function getAccount(index){
          return extAccountData[index];
}

function importDBAccount(accountName,privateKey,test=0){
    //Validating Private Key
    try{
        let account = acc.importAccount(privateKey);
        account.privateKey = CryptoJS.AES.encrypt(account.privateKey, extLoginKey);
        extAccountData.push({'address': account.address,'name': accountName,'privateAddress': account.privateKey,'publicAddress': account.publicKey});
        if(test == 0){
            chrome.storage.local.set({userAccounts: extAccountData}, function() {
              $('#accountSelect').ddslick('destroy');
              let index = getAccountIndex(account.address)
              console.log(index);
              loadAccount(index);
              accountSelector(index);
            });
        }
        return 0
    } catch(err){ 
        console.log(err);
        return -1; 
    }    
}

function createInitialAccount(key,test=0){
    try{
        let accountName = 'First Account'
        let newAccount = laksa.wallet.createAccount();
        newAccount.privateKey = CryptoJS.AES.encrypt(newAccount.privateKey, key);
        extAccountData.push({'address': newAccount.address,'name': accountName,'privateAddress': newAccount.privateKey,'publicAddress': newAccount.publicKey});      
        //console.log(accountName+'  '+newAccount.address+'  '+newAccount.publicKey+'  '+newAccount.privateKey);
        //console.log(extAccountData);
        if(test==0){
            chrome.storage.local.set({userAccounts: extAccountData}, function() {
                  //console.log('Value is set to ');
                  //console.log(extAccountData);
            });
        }
        return newAccount.address;
    } catch(err){ 
        //console.log(err);
        return -1; 
    }   
}

function createDBAccount(accountName,test=0){
    try {
        let newAccount = laksa.wallet.createAccount();
        newAccount.privateKey = CryptoJS.AES.encrypt(newAccount.privateKey, extLoginKey);
        extAccountData.push({'address': newAccount.address,'name': accountName,'privateAddress': newAccount.privateKey,'publicAddress': newAccount.publicKey});      
        //console.log(accountName+'  '+newAccount.address+'  '+newAccount.publicKey+'  '+newAccount.privateKey);
        //console.log(extAccountData);
        if(test==0){
            chrome.storage.local.set({userAccounts: extAccountData}, function() {
                  //console.log('Value is set to ');
                  //console.log(extAccountData);
            });
        }
        return newAccount.address;
    } catch(err){ 
        //console.log(err);
        return -1; 
    }
}

function deleteDBAccount(index,test=0){
    try {
        if (index > -1) {
          extAccountData.splice(index, 1);
          //console.log(index);
        }
        else{
            return -1;
            //console.log("No such index");
        }
        //console.log(extAccountData);
        if(test==0){
            chrome.storage.local.set({userAccounts: extAccountData}, function() {
                  //console.log('Value is set to ');
                  //console.log(extAccountData);
            });
        }
        return 0;
    } catch(err){
        return -1;
    }
}

function loadAccount(index){
    let timer = setInterval(function(){
        let acDetails = getAccount(index);
        if(acDetails != undefined){
            $("#homeAccName").html(acDetails.name);

            $("#homeAddress").html(acDetails.address);
            $("#homeAddress").append('<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1.4em" width="1.4em" viewBox="0 0 40 40" style="vertical-align:middle;cursor:pointer"><g><path d="m30 35h-25v-22.5h25v7.5h2.5v-12.5c0-1.4-1.1-2.5-2.5-2.5h-7.5c0-2.8-2.2-5-5-5s-5 2.2-5 5h-7.5c-1.4 0-2.5 1.1-2.5 2.5v27.5c0 1.4 1.1 2.5 2.5 2.5h25c1.4 0 2.5-1.1 2.5-2.5v-5h-2.5v5z m-20-27.5h2.5s2.5-1.1 2.5-2.5 1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5 1.3 2.5 2.5 2.5h2.5s2.5 1.1 2.5 2.5h-20c0-1.5 1.1-2.5 2.5-2.5z m-2.5 20h5v-2.5h-5v2.5z m17.5-5v-5l-10 7.5 10 7.5v-5h12.5v-5h-12.5z m-17.5 10h7.5v-2.5h-7.5v2.5z m12.5-17.5h-12.5v2.5h12.5v-2.5z m-7.5 5h-5v2.5h5v-2.5z"></path></g></svg>');
            
            let icon = blockies.create({ seed: acDetails.address });
            $("#homeAccIdenticon").html("<img src='"+icon.toDataURL()+"' />");
            $("#homeZilBalance").html("Fetching Balance");
            laksa.zil.getBalance({ address: acDetails.address }).then(data=>{
                $("#homeZilBalance").html(data.balance+" Zils");
            }).catch(e=>{
                $("#homeZilBalance").html("Not Connected !!!");
            });
            background.selectedAccount = index;
            $("#selectedAccountPrivateKey").html("******************************************************<br>**********");
            $("#selectedAccountPublicKey").html(acDetails.publicAddress);
            $("#hidePrKey").hide();
            $("#showPrKeyPopup").show();
            //console.log('acDetails');
            //console.log(acDetails);
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

