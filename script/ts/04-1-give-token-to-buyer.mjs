// 04-1-give-token-to-buyer.mjs
import { publicClient, sellerWalletClient, PAY_TOKEN } from './config.js'

const erc20Abi = [
    {
        name: 'transfer',
        type: 'function',
        inputs: [
            { type: 'address' },
            { type: 'uint256' }
        ],
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable'
    }
]

async function sendToken() {
    const buyer = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    const amount = 100n * 10n ** 18n
    const hash = await sellerWalletClient.writeContract({
        address: PAY_TOKEN,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [buyer, amount]
    })
    console.log('send token hash: ', hash)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log('send token success, status: ', receipt.status)
}
sendToken()
