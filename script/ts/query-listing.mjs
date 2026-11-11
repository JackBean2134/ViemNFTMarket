// script/ts/query-listing.mjs
import { publicClient, NFT_MARKET } from './config.js'

const marketAbi = [
    {
        name: 'listings',
        type: 'function',
        inputs: [{ type: 'uint256' }],
        outputs: [
            { type: 'address', name: 'nftContract' },
            { type: 'uint256', name: 'tokenId' },
            { type: 'uint256', name: 'price' },
            { type: 'address', name: 'seller' },
            { type: 'bool', name: 'active' }
        ],
        stateMutability: 'view'
    }
]

async function query(id) {
    const res = await publicClient.readContract({
        address: NFT_MARKET,
        abi: marketAbi,
        functionName: 'listings',
        args: [BigInt(id)]
    })
    console.log('listing', id, ':', res)
}

// 先查 0，再查1
await query(0n)
await query(1n)
