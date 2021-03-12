web3Provider = null;
contracts = {};
account = null;

$(window).on('load', function () {
    web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    web3 = new Web3(web3Provider);

    var privateKey = Cookies.get("private-key");
    if (privateKey != null)
        account = web3.eth.accounts.privateKeyToAccount(privateKey);

    var abis = {};
    var courses = null;
    var addresses = null;

    var loadJSONPromises = [];

    loadJSONPromises.push($.getJSON('abi/BidToken.json', function (data) {
        abis['BidToken'] = data;
    }));

    loadJSONPromises.push($.getJSON('abi/Course.json', function (data) {
        abis['Course'] = data;
    }));

    loadJSONPromises.push($.getJSON('data/courses.json', function (data) {
        courses = data;
    }));

    loadJSONPromises.push($.getJSON('data/contract-addresses.json', function (data) {
        addresses = data;
    }));

    Promise.all(loadJSONPromises).then(function () {
        var BidToken = new web3.eth.Contract(abis['BidToken'], addresses['BidToken']);
        if (account != null)
            BidToken.defaultAccount = account.address;
        contracts['BidToken'] = BidToken;

        courses.forEach(courseData => {
            var Course = new web3.eth.Contract(abis['Course'], addresses['courses'][courseData.name]);
            if (account != null)
                Course.defaultAccount = account.address;
            contracts[courseData.name] = Course;
        });
    });
});

// for demo purposes, provides account with ether for transactions
function initAccountBalance(user_account) {
    return web3.eth.getAccounts().then(server_accounts => {
        tx = {
            from: server_accounts[0],
            to: user_account.address,
            gas: 2000000,
            value: web3.utils.toWei('5', 'ether')
        };
        return web3.eth.sendTransaction(tx).on('receipt', result => {
            console.log("iab result", result);
        });
    });
}

function sendSignedTransaction(user_account, tx) {
    const signTx = web3.eth.accounts.signTransaction(tx, user_account.privateKey);

    return signTx.then(signedTx => {
        console.log("rawTx", signedTx.rawTransaction);
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', result => {
            console.log("sendSignedTransaction result", result);
        });
    });
}