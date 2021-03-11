// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./CourseRegister.sol";

contract BidToken is ERC20("BidToken", "BT") {
    uint256 public _initialBidPoints;
    CourseRegister public _courseRegister;

    mapping(address => string) private nameRegister;

    constructor(uint256 initialBidPoints_, CourseRegister courseRegister_)
        public
    {
        _initialBidPoints = initialBidPoints_;
        _courseRegister = courseRegister_;
        _setupDecimals(0);
    }

    function register(string calldata name_) public {
        require(bytes(name_).length > 0, "Invalid name");
        require(
            bytes(nameRegister[msg.sender]).length == 0,
            "Name already registered"
        );
        nameRegister[msg.sender] = name_;
        _mint(msg.sender, _initialBidPoints);
    }

    function getRegistration() public view returns (string memory) {
        return nameRegister[msg.sender];
    }

    // Only allow token transfer to or from class contracts
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(
            _courseRegister.isRegistered(to) ||
                _courseRegister.isRegistered(from) ||
                from == address(0), // mint
            "Invalid address"
        );
    }
}
