// script/ts/05-transfer-and-call-buy.mjs
import { publicClient, buyerWalletClient, PAY_TOKEN, NFT_MARKET } from './config.js'
import { encodeAbiParameters } from 'viem'

const tokenAbi = [
    {
        name: 'transferAndCall',
        type: 'function',
        inputs: [
            { type: 'address', name: 'recipient' },
            { type: 'uint256', name: 'amount' },
            { type: 'bytes', name: 'data' }
        ],
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable'
    }
]

async function buyByTransferAndCall() {
    const listingId = 1n
    const price = 100n * 10n ** 18n
    const data = encodeAbiParameters([{ type: 'uint256' }], [listingId])


    const hash = await buyerWalletClient.writeContract({
        address: PAY_TOKEN,
        abi: tokenAbi,
        functionName: 'transferAndCall',
        args: [NFT_MARKET, price, data]
    })
    console.log('transferAndCall tx hash: ', hash)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log('transferAndCall buy success, status: ', receipt.status)
}
buyByTransferAndCall()
