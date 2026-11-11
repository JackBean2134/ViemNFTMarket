// 02-approve-nft.mjs
import { publicClient, sellerWalletClient, TEST_NFT, NFT_MARKET } from './config.js'

const abi = [
    {
        name: 'setApprovalForAll',
        type: 'function',
        inputs: [
            { type: 'address', name: 'operator' },
            { type: 'bool', name: 'approved' }
        ],
        outputs: [],
        stateMutability: 'nonpayable'
    }
]

async function approve() {
    const hash = await sellerWalletClient.writeContract({
        address: TEST_NFT,
        abi,
        functionName: 'setApprovalForAll',
        args: [NFT_MARKET, true]
    })
    console.log('Approve tx hash: ', hash)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log('Approve success, status: ', receipt.status)
}
approve()
