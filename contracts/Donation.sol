// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    
    mapping(address => uint256) public donations;
    uint256 public totalDonations;
    uint256 public constant MIN_DONATION = 10000000000000000; // 0.01 ETH
    address payable public donationRecipient = payable(0xAd01e4F9D069618C241405FA96f2b311e7934bd0);
    
    event DonationReceived(address indexed donor, uint256 amount);
    
    function donate() public payable {
        require(msg.value >= MIN_DONATION && msg.value <= 1000 ether, "Donation amount should be between 0.01 and 1000 ETH");
        donations[msg.sender] += msg.value;
        totalDonations += msg.value;
        donationRecipient.transfer(msg.value);
        
        emit DonationReceived(msg.sender, msg.value);
    }
    
    function withdraw() public {
        require(msg.sender == address(this), "Only contract owner can withdraw funds");
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function getUserDonations() public view returns (address[] memory, uint256[] memory) {
        uint256 length = 0;
        for (uint256 i = 0; i < 256; i++) {
            address possibleDonor = address(uint160(uint256(keccak256(abi.encodePacked(msg.sender, i)))));
            if (donations[possibleDonor] > 0) {
                length++;
            }
        }
        
        address[] memory userAddresses = new address[](length);
        uint256[] memory userDonations = new uint256[](length);
        uint256 index = 0;
        for (uint256 i = 0; i < 256; i++) {
            address possibleDonor = address(uint160(uint256(keccak256(abi.encodePacked(msg.sender, i)))));
            if (donations[possibleDonor] > 0) {
                userAddresses[index] = possibleDonor;
                userDonations[index] = donations[possibleDonor];
                index++;
            }
        }
        return (userAddresses, userDonations);
    }
}
