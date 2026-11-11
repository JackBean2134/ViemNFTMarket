// 03-list-nft.mjs
import { publicClient, sellerWalletClient, TEST_NFT, NFT_MARKET } from './config.js'

const abi = [
  {
    name: 'list',
    type: 'function',
    inputs: [
      { type: 'address', name: 'nftContract' },
      { type: 'uint256', name: 'tokenId' },
      { type: 'uint256', name: 'price' }
    ],
    outputs: [{ type: 'uint256', name: 'listingId' }],
    stateMutability: 'nonpayable'
  }
]

async function list() {
  // 价格：100 个 ERC20 token，注意带上decimals，假设decimals=18
  const price = 100n * 10n ** 18n
  const hash = await sellerWalletClient.writeContract({
    address: NFT_MARKET,
    abi,
    functionName: 'list',
    args: [TEST_NFT, 0n, price]
  })
  console.log('List tx hash: ', hash)
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  console.log('List success, status: ', receipt.status)
}
list()
