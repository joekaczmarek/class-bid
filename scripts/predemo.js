var fs = require('fs');

function copyAbi(src, dest) {
    try {
        var src = fs.readFileSync(src);
        var abi = JSON.parse(src).abi
        fs.writeFileSync(dest, JSON.stringify(abi));
    } catch (error) {
        console.log(error);
    }
}

if (!fs.existsSync('./demo/abi')) {
    fs.mkdirSync('./demo/abi');
}

try {
    copyAbi('./build/contracts/BidToken.json', './demo/abi/BidToken.json');
}
catch (error) {
    console.log("Unable to install contract abi.", error);
}