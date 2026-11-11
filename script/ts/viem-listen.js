import { createPublicClient, http, parseAbiItem } from 'viem'
import { anvil } from 'viem/chains'

// ========== 配置，改成你自己部署的 NFTMarket 地址 ==========
const NFT_MARKET_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
const RPC_URL = 'http://127.0.0.1:8545'

// 事件ABI
const NFTListedAbi = parseAbiItem(`
  event NFTListed(
    uint256 indexed listingId,
    address indexed seller,
    address indexed nftContract,
    uint256 tokenId,
    uint256 price
  )
`)

const NFTSoldAbi = parseAbiItem(`
  event NFTSold(
    uint256 indexed listingId,
    address indexed buyer,
    address indexed seller,
    address nftContract,
    uint256 tokenId,
    uint256 price,
    bool viaTransferAndCall
  )
`)

// 创建客户端
const publicClient = createPublicClient({
    chain: anvil,
    transport: http(RPC_URL)
})

console.log('✅ 开始监听 NFTMarket 事件...')
console.log(`📌 合约地址: ${NFT_MARKET_ADDRESS}`)
console.log('--------------------------------------------')

// 监听上架
publicClient.watchEvent({
    address: NFT_MARKET_ADDRESS,
    event: NFTListedAbi,
    onLogs: (logs) => {
        for (const log of logs) {
            const { listingId, seller, nftContract, tokenId, price } = log.args
            console.log('🟢【NFT 上新上架】')
            console.log(`listingId: ${listingId}`)
            console.log(`卖家: ${seller}`)
            console.log(`NFT合约: ${nftContract}`)
            console.log(`tokenId: ${tokenId}`)
            console.log(`定价: ${price}`)
            console.log('--------------------------------------------')
        }
    }
})

// 监听成交（buyNFT / tokensReceived 都会触发这个事件，靠 viaTransferAndCall 区分）
publicClient.watchEvent({
    address: NFT_MARKET_ADDRESS,
    event: NFTSoldAbi,
    onLogs: (logs) => {
        for (const log of logs) {
            const { listingId, buyer, seller, nftContract, tokenId, price, viaTransferAndCall } = log.args
            console.log('🔵【NFT 成交】')
            console.log(`listingId: ${listingId}`)
            console.log(`卖家: ${seller}`)
            console.log(`买家: ${buyer}`)
            console.log(`NFT合约: ${nftContract}`)
            console.log(`tokenId: ${tokenId}`)
            console.log(`成交价格: ${price}`)
            console.log(`购买方式: ${viaTransferAndCall ? "✅ transferAndCall(tokensReceived)" : "✅ buyNFT 直接调用"}`)
            console.log('--------------------------------------------')
        }
    }
})
