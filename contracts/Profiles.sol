// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Profile {
    string public name;
    string public bio;
    string public facebook;
    string public twitter;
    string public email;
    string public website;
    address public owner;
    mapping(address => bool) public authorizedViewers;
    mapping(address => bool) public likedBy;
    mapping(address => bool) public followedBy;
    mapping(address => string) public comments;
    mapping(address => uint256) public reputationScores;

    constructor(
        string memory _name, 
        string memory _bio, 
        string memory _facebook, 
        string memory _twitter, 
        string memory _email,
        string memory _website
    ) {
        name = _name;
        bio = _bio;
        facebook = _facebook;
        twitter = _twitter;
        email = _email;
        website = _website;
        owner = msg.sender;
        authorizedViewers[owner] = true;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    function updateProfile(
        string memory _name, 
        string memory _bio, 
        string memory _facebook, 
        string memory _twitter, 
        string memory _email,
        string memory _website
    ) public onlyOwner {
        name = _name;
        bio = _bio;
        facebook = _facebook;
        twitter = _twitter;
        email = _email;
        website = _website;
    }

    function updateEmail(string memory _email) public onlyOwner {
        email = _email;
    }

    function authorizeViewer(address viewer) public onlyOwner {
        authorizedViewers[viewer] = true;
    }

    function revokeViewer(address viewer) public onlyOwner {
        authorizedViewers[viewer] = false;
    }

    function getProfile() public view returns (
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        string memory,
        string memory
    ) {
        require(authorizedViewers[msg.sender], "Unauthorized viewer");
        return (
            name, 
            bio, 
            facebook, 
            twitter, 
            email, 
            website
        );
    }

    function likeProfile() public {
        require(!likedBy[msg.sender], "Already liked");
        likedBy[msg.sender] = true;
        reputationScores[owner] += 1;
    }

    function unlikeProfile() public {
        require(likedBy[msg.sender], "Not liked");
        likedBy[msg.sender] = false;
        reputationScores[owner] -= 1;
    }

    function followProfile() public {
        require(!followedBy[msg.sender], "Already following");
        followedBy[msg.sender] = true;
        reputationScores[owner] += 5;
    }

    function unfollowProfile() public {
        require(followedBy[msg.sender], "Not following");
        followedBy[msg.sender] = false;
        reputationScores[owner] -= 5;
    }

    function deleteComment(address commenter) public onlyOwner {
        require(bytes(comments[commenter]).length > 0, "Comment does not exist");
        delete comments[commenter];
        reputationScores[owner] -= 2;
    }

    function updateReputationScore(address user, uint256 score) public onlyOwner {
        reputationScores[user] = score;
    }

    function getReputationScore() public view returns (uint256) {
        return reputationScores[owner];
    }
}