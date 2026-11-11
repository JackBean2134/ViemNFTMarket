import { publicClient, TEST_NFT, TOKEN_ID } from './config.js'
import { parseAbi } from 'viem'

const nftAbi = parseAbi([
    'function ownerOf(uint256 tokenId) view returns (address)'
])

async function main() {
    const owner = await publicClient.readContract({
        address: TEST_NFT,
        abi: nftAbi,
        functionName: 'ownerOf',
        args: [TOKEN_ID]
    })
    console.log('NFT owner:', owner)
}
main()
