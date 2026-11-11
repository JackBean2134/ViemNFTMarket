import { publicClient, sellerWalletClient, TEST_NFT } from './config.js'

const abi = [
    {
        name: 'mint',
        type: 'function',
        inputs: [{ type: 'address', name: 'to' }],
        outputs: [],
        stateMutability: 'nonpayable'
    }
]

async function mint() {
    const hash = await sellerWalletClient.writeContract({
        address: TEST_NFT,
        abi,
        functionName: 'mint',
        args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266']
    })
    console.log('Mint tx hash: ', hash)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log('Mint success, status: ', receipt.status)
}
mint()
