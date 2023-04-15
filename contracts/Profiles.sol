// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "https://raw.githubusercontent.com/MichaelHDesigns/HTHWorld/main/contracts/Donation.sol";

contract Profiles {
    struct Profile {
        address walletAddress;
        string username;
        string bio;
        string email;
        string[] socialLinks;
        string image;
        address[] follows;
        uint256[] posts;
        uint256[] comments;
        uint256[] nfts;
        bool hasDonated; // new field to track whether a user has donated
    }

    mapping (address => Profile) private profiles;
    mapping (uint256 => address) private nftOwners;

    event ProfileUpdated(address indexed walletAddress, string indexed username);
    event NftAdded(address indexed walletAddress, uint256 indexed tokenId);
    event NftRemoved(address indexed walletAddress, uint256 indexed tokenId);

    function updateProfile(string memory _username, string memory _bio, string memory _email, string[] memory _socialLinks, string memory _image) public {
        Profile storage profile = profiles[msg.sender];
        profile.username = _username;
        profile.bio = _bio;
        profile.email = _email;
        profile.socialLinks = _socialLinks;
        profile.image = _image;
        emit ProfileUpdated(msg.sender, _username);
    }

    function getProfile(address _walletAddress) public view returns (
    string memory username,
    string memory bio,
    string memory email,
    string[] memory socialLinks,
    string memory image,
    address[] memory follows,
    uint256[] memory posts,
    uint256[] memory comments,
    uint256[] memory nfts,
    bool hasDonated,
    uint256 donationAmount // new return value
) {
   Profile storage profile = profiles[_walletAddress];
    uint256 amount = Donation(0x7afe38e0a012EAEbAfA2d56c49830E137742144A).donations(_walletAddress);
    return (
        profile.username,
        profile.bio,
        profile.email,
        profile.socialLinks,
        profile.image,
        profile.follows,
        profile.posts,
        profile.comments,
        profile.nfts,
        profile.hasDonated,
        amount // set the return value to the user's donation amount
    );
}

    function addNft(uint256 _tokenId) public {
        IERC721 nft = IERC721(msg.sender);
        require(nft.ownerOf(_tokenId) == msg.sender, "Only the owner of the NFT can add it to their profile");
        Profile storage profile = profiles[msg.sender];
        profile.nfts.push(_tokenId);
        nftOwners[_tokenId] = msg.sender;
        emit NftAdded(msg.sender, _tokenId);
    }

    function removeNft(uint256 _tokenId) public {
        require(nftOwners[_tokenId] == msg.sender, "Only the owner of the NFT can remove it from their profile");
        Profile storage profile = profiles[msg.sender];
        uint256[] storage nfts = profile.nfts;
        for (uint i = 0; i < nfts.length; i++) {
            if (nfts[i] == _tokenId) {
                nfts[i] = nfts[nfts.length - 1];
                nfts.pop();
                break;
            }
        }
        delete nftOwners[_tokenId];
        emit NftRemoved(msg.sender, _tokenId);
    }

    function markDonated() public {
        Profile storage profile = profiles[msg.sender];
        profile.hasDonated = true;
    }
}