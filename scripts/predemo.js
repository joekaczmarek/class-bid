var fs = require('fs');

function copyAbi(src, dest) {
    try {
        var src = fs.readFileSync(src);
        var abi = JSON.parse(src).abi
        fs.writeFileSync(dest, JSON.stringify(abi, null, 4));
    } catch (error) {
        console.log(error);
    }
}

if (!fs.existsSync('./demo/abi')) {
    fs.mkdirSync('./demo/abi');
}

try {
    copyAbi('./build/contracts/BidToken.json', './demo/abi/BidToken.json');
    copyAbi('./build/contracts/Course.json', './demo/abi/Course.json');
}
catch (error) {
    console.log("Unable to install contract abi.", error);
}

if (!fs.existsSync('./demo/data')) {
    fs.mkdirSync('./demo/data');
}

try {
    fs.copyFileSync('./demo-data/contract-addresses.json', './demo/data/contract-addresses.json');
    fs.copyFileSync('./demo-data/courses.json', './demo/data/courses.json');
}
catch (error) {
    console.log("Unable to copy data to demo", error);
}