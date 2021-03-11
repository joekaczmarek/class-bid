# Class Bid

Solidity smart contracts for implementing a university course bidding system.

## Architecture

* **BidToken.sol** - ERC20 style token for use in course bidding
* **CourseRegister.sol** - course registry. Used to limit BidToken transfers. Tokens can be transferred from students to courses (bidding) or from courses to students (reclaim after unsuccessful bid).
* **Course.sol** - contract for each course. Students transfer tokens to this contract to bid for the course.