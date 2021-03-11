// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

contract CourseRegister {
    address public _admin;
    mapping(address => bool) public _courses;

    constructor() public {
        _admin = msg.sender;
    }

    function register(address address_) public {
        require(_admin == msg.sender, "Unauthorized");
        _courses[address_] = true;
    }

    function isRegistered(address address_) public view returns (bool) {
        return _courses[address_];
    }
}
