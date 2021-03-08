var ClassRegister = artifacts.require("ClassRegister");
var BidToken = artifacts.require("BidToken");
var InstructionalClass = artifacts.require("InstructionalClass");

module.exports = function (deployer) {
    deployer.deploy(ClassRegister).then(function () {
        return deployer.deploy(BidToken, 2000, ClassRegister.address).then(function () {
            return deployer.deploy(InstructionalClass, BidToken.address, "LAWSTUDY 100", 5, 30);
        });
    });
};