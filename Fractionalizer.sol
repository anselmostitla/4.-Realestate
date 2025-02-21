// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// createFractionalTokensForNFT - createFractionalTokensForNFT - createFractionalTokensForNFT - 
contract Fractionalizer is ERC20, Ownable{
    using Counters for Counters.Counter;


    // --->  VARIABLES  <--- //
    address usdt;
    Counters.Counter public transactionCounter;


    // --->  STRUCTS  <--- //
    struct Transaction {
        uint256 transactionId;
        uint256 transactionDate;
        uint256 boughtTokens;
        uint256 usdtAmount;
        address user;
    }


    // --->  MAPPINGS  <--- //
    mapping(string => address) public addressOf;
    mapping(uint256 => Transaction) public transactions; 
    mapping(address => uint256[]) public userIds;


    // --->  CONSTRUCTORS  <--- //
    constructor(string memory _name, string memory _symbol, uint256 _amount, address _usdt) ERC20(_name, _symbol) {
        _mint(address(this), _amount);
        usdt = _usdt;
    }


    // --->  FUNCTIONS  <--- //
    function buy(uint256 numTokens, uint256 usdtAmount) public {
        require(numTokens>0);

        uint256 id = transactionCounter.current();
        
        transactions[id].transactionId = id;
        transactions[id].transactionDate = block.timestamp;
        transactions[id].boughtTokens = numTokens;
        transactions[id].usdtAmount = usdtAmount;
        transactions[id].user = msg.sender;

        userIds[msg.sender].push(id);
        transactionCounter.increment();

        // transfers
        IERC20(usdt).transferFrom(msg.sender, address(this), usdtAmount);
        IERC20(address(this)).transfer(msg.sender, numTokens);
    }


    // --->  GETTERS  <--- //
}