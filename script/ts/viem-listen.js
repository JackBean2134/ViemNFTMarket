import { createPublicClient, http } from 'viem'
import { localhost } from 'viem/chains'

const client = createPublicClient({
    chain: localhost,
    transport: http('http://127.0.0.1:8545')
})

const NFT_MARKET = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

const marketAbi = [
    {
        name: "NFTListed",
        type: "event",
        inputs: [
            { name: "listingId", type: "uint256", indexed: true },
            { name: "seller", type: "address", indexed: true },
            { name: "nftContract", type: "address", indexed: true },
            { name: "tokenId", type: "uint256", indexed: false },
            { name: "price", type: "uint256", indexed: false },
        ]
    },
    {
        name: "NFTBought",
        type: "event",
        inputs: [
            { name: "listingId", type: "uint256", indexed: true },
            { name: "buyer", type: "address", indexed: true },
            { name: "seller", type: "address", indexed: true },
            { name: "tokenId", type: "uint256", indexed: false },
            { name: "price", type: "uint256", indexed: false },
        ]
    }
]

console.log("✅ 开始监听 NFTListed / NFTBought")

client.watchContractEvent({
    address: NFT_MARKET,
    abi: marketAbi,
    onLogs: (logs) => {
        for (const log of logs) {
            console.log("\n===== 事件：", log.eventName, "=====")
            console.log("listingId:", log.args.listingId.toString())
            console.log("seller:", log.args.seller)
            if (log.args.buyer) console.log("buyer:", log.args.buyer)
            console.log("nftContract:", log.args.nftContract)
            console.log("tokenId:", log.args.tokenId.toString())
            console.log("price:", log.args.price.toString())
        }
    }
})
