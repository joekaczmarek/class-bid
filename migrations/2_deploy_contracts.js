const fs = require('fs');
const courses = JSON.parse(fs.readFileSync('../demo-data/courses.json'));

var CourseRegister = artifacts.require("CourseRegister");
var BidToken = artifacts.require("BidToken");
var Course = artifacts.require("Course");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(CourseRegister).then(function (CourseRegister) {
        return deployer.deploy(BidToken, 2000, CourseRegister.address).then(function (BidToken) {
            var coursesAddresses = {};
            var coursesDeployPromises = [];
            courses.forEach(element => {
                const courseDeployPromise = Course.new(BidToken.address,
                    element['name'], element['min_students'], element['max_students']);
                courseDeployPromise.then(function (courseDeploy) {
                    coursesAddresses[element['name']] = courseDeploy.address;
                    return CourseRegister.register(courseDeploy.address).then(function (result) {
                        console.log(result);
                    });
                });
                coursesDeployPromises.push(courseDeployPromise);
            });

            return Promise.all(coursesDeployPromises).then(function () {
                var addresses = {};
                addresses['CourseRegister'] = CourseRegister.address;
                addresses['BidToken'] = BidToken.address;

                addresses['courses'] = {};
                for (var key in coursesAddresses) {
                    addresses['courses'][key] = coursesAddresses[key];
                }

                fs.writeFileSync('./demo-data/contract-addresses.json', JSON.stringify(addresses, null, 4));
            });
        });
    });
}