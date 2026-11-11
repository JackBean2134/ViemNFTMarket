// 04-buy-nft.mjs
import { publicClient, buyerWalletClient, NFT_MARKET, PAY_TOKEN } from './config.js'

const marketAbi = [
    {
        name: 'buyNFT',
        type: 'function',
        inputs: [{ type: 'uint256', name: 'listingId' }],
        outputs: [],
        stateMutability: 'nonpayable'
    }
]

async function buy() {
    // 这里你需要替换成list返回的listingId
    const listingId = 0n;
    const hash = await buyerWalletClient.writeContract({
        address: NFT_MARKET,
        abi: marketAbi,
        functionName: 'buyNFT',
        args: [listingId]
    })
    console.log('buyNFT tx hash: ', hash)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log('buyNFT success, status: ', receipt.status)
}
buy()
