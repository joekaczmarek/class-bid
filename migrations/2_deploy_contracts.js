var ClassRegister = artifacts.require("ClassRegister");
module.exports = function (deployer) {
    deployer.deploy(ClassRegister);
};

var BidToken = artifacts.require("BidToken");
module.exports = function (deployer) {
    deployer.deploy(BidToken, 2000, ClassRegister.address);
};

var InstructionalClass = artifacts.require("InstructionalClass");
module.exports = function (deployer) {
    deployer.deploy(InstructionalClass, BidToken.address, "LAWSTUDY 100", 5, 30);
};
// ClassRegister.deployed().then(inst => { inst.registerClass(InstructionalClass.address) });