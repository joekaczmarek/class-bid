web3Provider = null;
contracts = {};

$(window).on('load', function () {
    web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    web3 = new Web3(web3Provider);

    $.getJSON('abi/BidToken.json', function (data) {
        var BidToken = new web3.eth.Contract(data, '0x9184e21864450B052B5abE7D6d8137f62491632b');
        contracts['BidToken'] = BidToken;
    });
});

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