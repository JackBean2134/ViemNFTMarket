// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MyERC20WithTransferAndCall.sol";

contract NFTMarket is ERC721Holder, ReentrancyGuard {
    // ============ 新增事件 ============
    event NFTListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event NFTSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        address nftContract,
        uint256 tokenId,
        uint256 price,
        bool viaTransferAndCall // 标记是不是 tokensReceived 回调购买
    );

    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    Listing[] public listings;
    MyERC20WithTransferAndCall public paymentToken;

    constructor(address _paymentToken) {
        paymentToken = MyERC20WithTransferAndCall(_paymentToken);
    }

    function list(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant returns (uint256 listingId) {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "not nft owner");
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "market not approved"
        );

        listingId = listings.length;
        listings.push(
            Listing({
                seller: msg.sender,
                nftContract: nftContract,
                tokenId: tokenId,
                price: price,
                active: true
            })
        );

        nft.safeTransferFrom(msg.sender, address(this), tokenId);

        // 上架触发事件
        emit NFTListed(listingId, msg.sender, nftContract, tokenId, price);
    }

    function buyNFT(uint256 listingId) external nonReentrant {
        Listing storage listing = _getListing(listingId);
        require(listing.active, "listing not active");
        require(msg.sender != listing.seller, "cannot buy your own");

        // 买家转 token 给卖家
        paymentToken.transferFrom(msg.sender, listing.seller, listing.price);
        _dealNFT(listing, msg.sender, listingId, false);
    }

    // ERC20 transferAndCall 回调入口
    function tokensReceived(
        address from,
        uint256 amount,
        bytes calldata data
    ) external {
        require(msg.sender == address(paymentToken), "only payment token");
        uint256 listingId = abi.decode(data, (uint256));

        Listing storage listing = _getListing(listingId);
        require(listing.active, "listing not active");
        require(from != listing.seller, "cannot buy your own");
        require(amount == listing.price, "price mismatch");

        _dealNFT(listing, from, listingId, true);
    }

    function _dealNFT(
        Listing storage listing,
        address buyer,
        uint256 listingId,
        bool isViaCallback
    ) internal {
        listing.active = false;
        IERC721(listing.nftContract).safeTransferFrom(
            address(this),
            buyer,
            listing.tokenId
        );

        // 成交事件
        emit NFTSold({
            listingId: listingId,
            buyer: buyer,
            seller: listing.seller,
            nftContract: listing.nftContract,
            tokenId: listing.tokenId,
            price: listing.price,
            viaTransferAndCall: isViaCallback
        });
    }

    function _getListing(uint256 id) internal view returns (Listing storage) {
        require(id < listings.length, "listing not exist");
        return listings[id];
    }

    function getListing(uint256 id) external view returns (Listing memory) {
        return _getListing(id);
    }
}
