# NFTMarket - ERC20 支付 NFT 市场（Foundry）
> 基于 Foundry 开发的 NFT 交易市场，**使用自定义扩展 ERC20 Token 购买 NFT**，支持两种购买方式：
> 1. 普通购买：`buyNFT()`，需要提前对市场合约授权 ERC20
> 2. 回调购买：`transferAndCall()`，在 `tokensReceived` 中自动完成购买，无需提前授权
>
> 合约文件分离，符合 Foundry 工程化规范

## ✨ 功能清单
- `list(address nftContract, uint256 tokenId, uint256 price)`：NFT持有者上架NFT，设置需要多少自定义ERC20购买
- `buyNFT(uint256 listingId)`：常规购买NFT，买家预先授权Token
- `tokensReceived(address from, uint256 amount, bytes calldata data)`：扩展ERC20回调接收方法，解析listingId自动购买NFT
- 上架状态管理，售出后标记为非活跃，防止重复购买

## 📁 项目结构
├── src/
│   ├── MyERC20WithTransferAndCall.sol   # 扩展 ERC20：transferAndCall + tokensReceived 回调
│   ├── NFTMarket.sol                    # NFT 市场主合约
│   └── TestNFT.sol                      # 测试用 ERC721 NFT
├── script/
│   ├── DeployNFTMarket.s.sol            # 部署市场 + 支付 Token
│   └── DeployTestNFT.s.sol              # 部署测试 NFT
├── test/
│   └── NFTMarket.t.sol                  # Foundry 单元测试
├── lib/                                 # OpenZeppelin 依赖
├── foundry.toml
├── remappings.txt
└── .gitignore

## 🧩 合约依赖
- OpenZeppelin Contracts v5
- Solidity: `^0.8.37`
- Framework: Foundry

## 📦 环境准备
### 1. 安装依赖
```bash
forge install openzeppelin/openzeppelin-contracts
```
2. 编译
```bash
forge build
```
3. 运行单元测试
```bash
forge test -vvv
```
🚀 本地 Anvil 部署 & 交互流程
1. 启动本地节点
```bash
anvil
```
### . 部署 NFTMarket + MyERC20

```bash
forge script script/DeployNFTMarket.s.sol \
--rpc-url http://127.0.0.1:8545 \
--broadcast \
--sender 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

> 
> 记录输出：`PaymentToken`、`NFTMarket` 地址

### 3. 部署测试 NFT

``` bash
forge script script/DeployTestNFT.s.sol:NFTDeployScript \
--rpc-url http://127.0.0.1:8545 \
--broadcast \
--sender 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### 4. 环境变量（方便后续 cast 调用）

``` bash
export PAY_TOKEN=你的支付Token地址
export NFT_MARKET=你的市场地址
export TEST_NFT=你的测试NFT地址
export SELLER=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export BUYER=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
export PRICE=100000000000000000000
```

### 5. 铸造 NFT + 授权市场合约

``` bash
# 铸造 tokenId=1 给卖家
cast send $TEST_NFT "mint(address)" $SELLER --from $SELLER --unlocked --rpc-url http://127.0.0.1:8545
# 授权市场合约操作NFT
cast send $TEST_NFT "setApprovalForAll(address,bool)" $NFT_MARKET true --from $SELLER --unlocked --rpc-url http://127.0.0.1:8545
```

### 6. 卖家上架 NFT

``` bash
cast send $NFT_MARKET "list(address,uint256,uint256)" $TEST_NFT 1 $PRICE --from $SELLER --unlocked --rpc-url http://127.0.0.1:8545
```

### 7. 方式 A：transferAndCall 回调购买（需求重点，走 tokensReceived）

``` bash
cast send $PAY_TOKEN "transferAndCall(address,uint256,bytes)" $NFT_MARKET $PRICE 0x0000000000000000000000000000000000000000000000000000000000000001 --from $BUYER --unlocked --rpc-url http://127.0.0.1:8545
```

> 
> bytes 参数：abi 编码后的 listingId

### 8. 方式 B：buyNFT 普通购买（需要先 approve）

``` bash
# 买家授权市场扣token
cast send $PAY_TOKEN "approve(address,uint256)" $NFT_MARKET $PRICE --from $BUYER --unlocked --rpc-url http://127.0.0.1:8545
# 调用购买
cast send $NFT_MARKET "buyNFT(uint256)" 1 --from $BUYER --unlocked --rpc-url http://127.0.0.1:8545
```

### 9. 查询 NFT 持有者

``` bash
cast call $TEST_NFT "ownerOf(uint256)" 1 --rpc-url http://127.0.0.1:8545
```

### 10. 查询上架信息

``` bash
cast call $NFT_MARKET "listings(uint256)" 1 --rpc-url http://127.0.0.1:8545
```

## 📜 合约设计说明

1. **MyERC20WithTransferAndCall.sol**
   - 继承 ERC20
   - 新增 `transferAndCall(address to, uint256 amount, bytes calldata data)`
   - 转账完成后，调用接收合约的 `tokensReceived` 回调
   - 接收合约必须实现 `tokensReceived`，否则转账失败
2. **NFTMarket.sol**
   - 维护上架单 `Listing` 结构体：nft 合约、tokenId、卖家、价格、是否活跃
   - `list`：转移 NFT 到市场合约，生成上架单
   - `buyNFT`：校验授权、扣 Token、转发 NFT 给买家
   - `tokensReceived`：市场合约实现该接口，解析 data 拿到 listingId，完成购买逻辑

## ⚠️ 注意事项

- 本项目仅用于学习演示，**未做生产级安全审计**，不要直接上主网
- Anvil 默认账号是解锁状态，正式链需要传入私钥签名
- 同一个 listing 售出后 active 标记为 false，不能重复购买