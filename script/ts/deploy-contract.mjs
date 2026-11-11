// script/ts/deploy-contract.mjs
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { anvil } from 'viem/chains'
import fs from 'fs'

// 配置
const RPC_URL = 'http://127.0.0.1:8545'
const DEPLOYER_PK = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const deployerAccount = privateKeyToAccount(DEPLOYER_PK)

const publicClient = createPublicClient({
    chain: anvil,
    transport: http(RPC_URL)
})
const deployerWalletClient = createWalletClient({
    account: deployerAccount,
    chain: anvil,
    transport: http(RPC_URL)
})

// 读取artifact
function loadArtifact(path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
}

async function main() {
    // 1. 部署 MyERC20WithTransferAndCall
    const erc20Artifact = loadArtifact('./out/MyERC20WithTransferAndCall.sol/MyERC20WithTransferAndCall.json')
    console.log('部署 MyERC20WithTransferAndCall...')
    const erc20Hash = await deployerWalletClient.deployContract({
        abi: erc20Artifact.abi,
        bytecode: erc20Artifact.bytecode.object
    })
    const erc20Receipt = await publicClient.waitForTransactionReceipt({ hash: erc20Hash })
    const PAY_TOKEN = erc20Receipt.contractAddress
    console.log('✅ PAY_TOKEN:', PAY_TOKEN)

    // 2. 部署 NFTMarket（构造参数：ERC20地址）
    const marketArtifact = loadArtifact('./out/NFTMarket.sol/NFTMarket.json')
    console.log('部署 NFTMarket...')
    const marketHash = await deployerWalletClient.deployContract({
        abi: marketArtifact.abi,
        bytecode: marketArtifact.bytecode.object,
        args: [PAY_TOKEN]
    })
    const marketReceipt = await publicClient.waitForTransactionReceipt({ hash: marketHash })
    const NFT_MARKET = marketReceipt.contractAddress
    console.log('✅ NFT_MARKET:', NFT_MARKET)

    // 3. 部署 TestNFT
    const nftArtifact = loadArtifact('./out/TestNFT.sol/TestNFT.json')
    console.log('部署 TestNFT...')
    const nftHash = await deployerWalletClient.deployContract({
        abi: nftArtifact.abi,
        bytecode: nftArtifact.bytecode.object
    })
    const nftReceipt = await publicClient.waitForTransactionReceipt({ hash: nftHash })
    const TEST_NFT = nftReceipt.contractAddress
    console.log('✅ TEST_NFT:', TEST_NFT)

    console.log('\n===== 复制下面地址更新 config.js =====')
    console.log(`export const PAY_TOKEN = '${PAY_TOKEN}'`)
    console.log(`export const NFT_MARKET = '${NFT_MARKET}'`)
    console.log(`export const TEST_NFT = '${TEST_NFT}'`)
}

main().catch(e => console.error(e))
