// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "forge-std/Script.sol";
import "../src/MyERC20WithTransferAndCall.sol";
import "../src/NFTMarket.sol";

contract DeployNFTMarket is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 部署ERC20代币：名称、符号、初始总量
        MyERC20WithTransferAndCall paymentToken = new MyERC20WithTransferAndCall("PayToken", "PAY", 10000 * 1e18);
        console.log("PaymentToken: ", address(paymentToken));

        // NFTMarket 只传 paymentToken 这一个参数！
        NFTMarket market = new NFTMarket(address(paymentToken));
        console.log("NFTMarket:    ", address(market));

        vm.stopBroadcast();
    }
}
