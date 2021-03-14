web3Provider = null;
contracts = {};
account = null;
courses = null;

function init() {
    web3Provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:7545');
    web3 = new Web3(web3Provider);

    web3.eth.getAccounts().then(accounts => {
        account = accounts[0];
    });

    var abis = {};
    var addresses = null;
    contracts['courses'] = {};

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

    return Promise.all(loadJSONPromises).then(function () {
        var BidToken = new web3.eth.Contract(abis['BidToken'], addresses['BidToken']);
        if (account != null)
            BidToken.defaultAccount = account.address;
        contracts['BidToken'] = BidToken;

        courses.forEach(courseData => {
            var Course = new web3.eth.Contract(abis['Course'], addresses['courses'][courseData.name]);
            if (account != null)
                Course.defaultAccount = account.address;
            contracts['courses'][courseData.name] = Course;
        });
    });
}

function sendSignedTransactionFromData(user_account, contract_address, data) {
    const tx = {
        from: user_account.address,
        to: contract_address,
        gas: 2000000,
        data: data
    };
    return sendSignedTransaction(user_account, tx);
}

function sendSignedTransaction(user_account, tx) {
    const signTx = web3.eth.accounts.signTransaction(tx, user_account.privateKey);

    return signTx.then(signedTx => {
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    });
}

function endBidding(private_key) {
    var user_account = web3.eth.accounts.privateKeyToAccount(private_key);
    console.log(user_account);

    var presult = Promise.resolve();
    courses.map(course => {
        var courseContract = contracts['courses'][course.name];

        return presult = presult.then(() => {
            return sendSignedTransactionFromData(user_account, courseContract._address,
                courseContract.methods.closeBidding().encodeABI()).then(function (result) {
                    console.log("Closed bidding", course.name, result);
                });
        });
    });
    return presult;
}