// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./BidToken.sol";

contract Course {
    address public _admin;

    BidToken public _bidToken;
    string public _name;
    uint256 public _minStudents;
    uint256 public _maxStudents;

    struct Bid {
        address bidder;
        uint256 amount;
    }

    Bid[] public _sortedBids;
    mapping(address => uint256) public _return;

    bool ended;
    event BiddingEnded();

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

        ended = false;
    }

    function bid(uint256 amount) public {
        uint256 currentBidAmount = 0;
        uint256 bidIndex = getBidIndexForAddress(msg.sender);
        if (bidIndex != _sortedBids.length) {
            currentBidAmount = _sortedBids[bidIndex].amount;
        }

        if (currentBidAmount > amount) {
            uint256 diff = currentBidAmount - amount;
            _return[msg.sender] = diff;
            _sortedBids[bidIndex].amount = amount;
            reSort(bidIndex);

            // retract bid
            if (amount == 0) {
                delete _sortedBids[getBidIndexForAddress(msg.sender)];
            }
        } else {
            uint256 diff = amount - currentBidAmount;
            uint256 allowance = _bidToken.allowance(msg.sender, address(this));
            require(allowance >= diff, "Insufficient funds allowed");
            _bidToken.transferFrom(msg.sender, address(this), diff);

            if (currentBidAmount == 0) {
                // new bid
                _sortedBids.push(Bid({bidder: msg.sender, amount: amount}));
            } else {
                // update bid
                _sortedBids[bidIndex].amount = amount;
                reSort(bidIndex);
            }
        }
    }

    function getBidIndexForAddress(address bidder)
        private
        view
        returns (uint256)
    {
        uint256 i;
        for (i = 0; i < _sortedBids.length; i++) {
            if (_sortedBids[i].bidder == bidder) {
                return i;
            }
        }
        return _sortedBids.length;
    }

    function reSort(uint256 index) private {
        Bid memory newBid = _sortedBids[index];

        if (index > 0) {
            Bid memory prev = _sortedBids[index - 1];

            while (prev.amount < newBid.amount) {
                _sortedBids[index - 1] = newBid;
                _sortedBids[index] = prev;

                index -= 1;
                if (index > 0) {
                    prev = _sortedBids[index - 1];
                } else {
                    break;
                }
            }
        }
        if (index < _sortedBids.length - 1) {
            Bid memory next = _sortedBids[index + 1];

            while (next.amount > newBid.amount) {
                _sortedBids[index + 1] = newBid;
                _sortedBids[index] = next;

                index += 1;
                if (index < _sortedBids.length - 1) {
                    next = _sortedBids[index + 1];
                } else {
                    break;
                }
            }
        }
    }

    function getBid() public view returns (uint256) {
        uint256 index = getBidIndexForAddress(msg.sender);
        if (index == _sortedBids.length) {
            return 0;
        } else {
            assert(_sortedBids[index].bidder == msg.sender);
            return _sortedBids[index].amount;
        }
    }

    function reclaim() public {
        uint256 amount = _return[msg.sender];
        require(amount > 0, "No tokens to reclaim");
        _bidToken.transfer(msg.sender, amount);
    }

    function close() public {
        require(msg.sender == _admin, "Account unauthorized to close bidding");
        ended = true;
        emit BiddingEnded();
    }

    function bidSuccess() public view returns (bool) {
        require(ended, "Bidding hasn't ended");
        uint256 index = getBidIndexForAddress(msg.sender);

        if (index != _sortedBids.length && (index + 1) < _maxStudents) {
            return true;
        } else {
            return false;
        }
    }
}
