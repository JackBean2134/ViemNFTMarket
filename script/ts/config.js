// script/ts/config.js
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { anvil } from 'viem/chains'

export const RPC_URL = 'http://127.0.0.1:8545'
export const CHAIN = anvil

// 合约地址
export const PAY_TOKEN = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const NFT_MARKET = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const TEST_NFT = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

// Anvil 账户1：卖家
export const SELLER = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
export const SELLER_PK = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

// Anvil 账户2：买家（自带ETH！）
export const BUYER = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
export const BUYER_PK = '0x59c6995e5f720994b29c021c21229643e9a412ec7d73b49a203417b6b625c2ad'

export const PRICE = 1000000000000000000n
export const TOKEN_ID = 0n

// 公共读客户端
export const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL)
})

// 账号
export const sellerAccount = privateKeyToAccount(SELLER_PK)
export const buyerAccount = privateKeyToAccount(BUYER_PK)

export const sellerWalletClient = createWalletClient({
    account: sellerAccount,
    chain: CHAIN,
    transport: http(RPC_URL)
})
export const buyerWalletClient = createWalletClient({
    account: buyerAccount,
    chain: CHAIN,
    transport: http(RPC_URL)
})
