// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ProfileContract {
    struct Profile {
        string name;
        string bio;
        string facebook;
        string twitter;
        string email;
        string website;
        address owner;
    }

    mapping(address => Profile) public profiles;
    mapping(address => bool) public authorizedViewers;
    mapping(address => bool) public likedBy;
    mapping(address => bool) public followedBy;
    mapping(address => string) public comments;
    mapping(address => uint256) public reputationScores;

    modifier onlyOwner {
        require(msg.sender == profiles[msg.sender].owner, "Only profile owner can call this function");
        _;
    }

    function createProfile(
        string memory _name, 
        string memory _bio, 
        string memory _facebook, 
        string memory _twitter, 
        string memory _email,
        string memory _website
    ) public {
        require(bytes(profiles[msg.sender].name).length == 0, "Profile already exists");

        profiles[msg.sender] = Profile({
            name: _name,
            bio: _bio,
            facebook: _facebook,
            twitter: _twitter,
            email: _email,
            website: _website,
            owner: msg.sender
        });

        authorizedViewers[msg.sender] = true;
    }

    function updateProfile(
        string memory _name, 
        string memory _bio, 
        string memory _facebook, 
        string memory _twitter, 
        string memory _email,
        string memory _website
    ) public onlyOwner {
        profiles[msg.sender].name = _name;
        profiles[msg.sender].bio = _bio;
        profiles[msg.sender].facebook = _facebook;
        profiles[msg.sender].twitter = _twitter;
        profiles[msg.sender].email = _email;
        profiles[msg.sender].website = _website;
    }

    function authorizeViewer(address viewer) public onlyOwner {
        authorizedViewers[viewer] = true;
    }

    function revokeViewer(address viewer) public onlyOwner {
        authorizedViewers[viewer] = false;
    }

    function getProfile(address profileOwner) public view returns (
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        string memory,
        string memory
    ) {
        require(authorizedViewers[msg.sender], "Unauthorized viewer");
        return (
            profiles[profileOwner].name, 
            profiles[profileOwner].bio, 
            profiles[profileOwner].facebook, 
            profiles[profileOwner].twitter, 
            profiles[profileOwner].email, 
            profiles[profileOwner].website
        );
    }

    function likeProfile() public {
    require(!likedBy[msg.sender], "Already liked");
    likedBy[msg.sender] = true;
    reputationScores[profiles[msg.sender].owner] += 1;
}

function unlikeProfile() public {
    require(likedBy[msg.sender], "Not liked");
    likedBy[msg.sender] = false;
    reputationScores[profiles[msg.sender].owner] -= 1;
}

function followProfile() public {
    require(!followedBy[msg.sender], "Already following");
    followedBy[msg.sender] = true;
    reputationScores[profiles[msg.sender].owner] += 5;
}

function unfollowProfile() public {
    require(followedBy[msg.sender], "Not following");
    followedBy[msg.sender] = false;
    reputationScores[profiles[msg.sender].owner] -= 5;
}

function updateReputationScore(address user, uint256 score) public onlyOwner {
    reputationScores[user] = score;
}

function getReputationScore() public view returns (uint256) {
    return reputationScores[profiles[msg.sender].owner];
}
}