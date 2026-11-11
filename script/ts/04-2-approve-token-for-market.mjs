// 04-2-approve-token-for-market.mjs
import { publicClient, buyerWalletClient, PAY_TOKEN, NFT_MARKET } from './config.js'

const erc20Abi = [
    {
        name: 'approve',
        type: 'function',
        inputs: [
            { type: 'address', name: 'spender' },
            { type: 'uint256', name: 'amount' }
        ],
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable'
    }
]

async function approveToken() {
    const amount = 100n * 10n ** 18n
    const hash = await buyerWalletClient.writeContract({
        address: PAY_TOKEN,
        abi: erc20Abi,
        functionName: 'approve',
        args: [NFT_MARKET, amount]
    })
    console.log('token approve hash: ', hash)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log('token approve success, status: ', receipt.status)
}
approveToken()
