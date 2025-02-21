// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Fractionalizer.sol";


// NFTHouseCreator - NFTHouseCreator - NFTHouseCreator - NFTHouseCreator
contract Nftizer is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    
    // ---> VARIABLES <--- //
    Counters.Counter public _tokenIdCounter;


    // ---> STRUCTS <--- //


    // ---> MAPPINGS <--- //
    mapping( uint256 => address ) public AddressOfErc20AssociatedToNFTid; // setNFTaddress Erc20Address setIdToERC20Address


    // ---> CONSTRUCTORS <--- //
    constructor() ERC721("MyToken", "MTK") {
        // usdt = _usdt;
    }


    // ---> FUNCTIONS <--- //
    function safeMint(string memory uri, uint256 _numTokens, address _usdt) public {
        uint256 nftId = _tokenIdCounter.current();
        _safeMint(msg.sender, nftId);
        _setTokenURI(nftId, uri);

        Fractionalizer fractionalizer =  new Fractionalizer(
            string(abi.encodePacked("Fractional-token-", Strings.toString(nftId))),
            string.concat("NFT-", Strings.toString(nftId) ),
            // msg.sender,// _publisher,
            (_numTokens*10**18),
            _usdt
        );

        AddressOfErc20AssociatedToNFTid[nftId] = address(fractionalizer);        
        _tokenIdCounter.increment();
    }

    // ---> GETTERS <--- //
    function getCurrentId() public view returns(uint256){
        return _tokenIdCounter.current();
    }

    function getErc20AddressAssociatedToNFT(uint256 nftId) public view returns(address) {
        return AddressOfErc20AssociatedToNFTid[nftId];
    }

    
    // ---> OVERRIDE FUNCTIONS REQUIRED BY SOLIDITY <--- //
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool){
        return super.supportsInterface(interfaceId);
    }

}