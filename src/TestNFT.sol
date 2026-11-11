// SPDX-License-Identifier: MIT
pragma solidity ^0.8.37;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {
    uint256 public tokenIdCounter;
    constructor() ERC721("TestNFT", "TNFT") {}

    function mint(address to) external {
        _safeMint(to, tokenIdCounter++);
    }
}
