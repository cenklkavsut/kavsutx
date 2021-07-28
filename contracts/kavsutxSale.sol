pragma solidity ^0.5.16;

import "./kavsutx.sol";
import "./kavsutxSale.sol";

contract kavsutxSale {
    address admin;
    kavsutx public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address indexed _buyer, uint256 _amount);

    constructor(kavsutx _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender; //assign admin to contract deployer
        tokenContract = _tokenContract; //token contract
        tokenPrice = _tokenPrice; //token price
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice)); //require that value is equal to toke price
        require(tokenContract.balanceOf(this) >= _numberOfTokens); //require that there are enought tokens
        require(tokenContract.transfer(msg.sender, _numberOfTokens)); //require succesfull transfer

        tokensSold += _numberOfTokens; //keep track of tokens sold

        emit Sell(msg.sender, _numberOfTokens); //trigger the sell event
    }

    function endSale() public {
        //require admin to end sale
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        selfdestruct(admin);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        //address payable adminAddress = address(uint160(admin));
        selfdestruct(admin);
    }
}
