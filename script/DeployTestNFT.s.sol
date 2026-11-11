// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {
    uint256 public tokenIdCounter;
    constructor() ERC721("TestNFT", "TNFT") {}

    function mint(address to) external {
        _safeMint(to, tokenIdCounter++);
    }
}

contract DeployTestNFT is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);
        TestNFT nft = new TestNFT();
        console.log("TestNFT:", address(nft));
        vm.stopBroadcast();
    }
}
