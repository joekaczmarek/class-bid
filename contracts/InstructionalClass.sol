// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./BidToken.sol";

contract InstructionalClass {
    address public _admin;

    BidToken public _bidToken;
    string public _name;
    uint256 public _minStudents;
    uint256 public _maxStudents;

    uint256 public _bidCount;
    mapping(address => uint256) public _bids;
    mapping(address => uint256) public _return;

    constructor(
        BidToken bidToken_,
        string memory name_,
        uint256 minStudents_,
        uint256 maxStudents_
    ) public {
        _admin = msg.sender;
        _bidToken = bidToken_;
        _name = name_;
        _minStudents = minStudents_;
        _maxStudents = maxStudents_;
        _bidCount = 0;
    }

    function bid(uint256 amount) public {
        uint256 currentAmount = _bids[msg.sender];

        if (currentAmount > amount) {
            uint256 diff = currentAmount - amount;
            _return[msg.sender] = diff;
            _bids[msg.sender] = amount;

            // revoke bid
            if (amount == 0) {
                _bidCount = 0;
            }
        } else {
            uint256 diff = amount - currentAmount;
            uint256 allowance = _bidToken.allowance(msg.sender, address(this));
            require(allowance >= diff, "Insufficient funds allowed");
            _bidToken.transferFrom(msg.sender, address(this), diff);
            _bids[msg.sender] = diff;

            // new bid
            if (currentAmount == 0) {
                _bidCount += 1;
            }
        }
    }

    function reclaim() public {
        uint256 amount = _return[msg.sender];
        require(amount > 0, "No tokens to reclaim");
        _bidToken.transfer(msg.sender, amount);
    }

    function close() public view {
        require(msg.sender == _admin, "Account unauthorized to close bidding");
        // TODO
    }
}
