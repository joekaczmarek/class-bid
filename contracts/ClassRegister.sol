// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

contract ClassRegister {
    address public _admin;
    mapping(address => bool) public _classes;

    constructor() public {
        _admin = msg.sender;
    }

    function register(address address_) public {
        require(_admin == msg.sender, "Unauthorized");
        _classes[address_] = true;
    }

    function isRegistered(address address_) public view returns (bool) {
        return _classes[address_];
    }
}
