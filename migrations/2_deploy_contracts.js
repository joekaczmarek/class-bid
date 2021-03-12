var CourseRegister = artifacts.require("CourseRegister");
var BidToken = artifacts.require("BidToken");
var Course = artifacts.require("Course");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(CourseRegister).then(function () {
        return deployer.deploy(BidToken, 2000, CourseRegister.address).then(function (BidToken) {
            return deployer.deploy(Course, BidToken.address, "LAWSTUDY 100", 5, 30);
        });
    });
}