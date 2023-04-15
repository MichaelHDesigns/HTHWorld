// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Fundraiser {
        address creator;
        uint fundingGoal;
        uint deadline;
        uint amountRaised;
        bool isOpen;
        string title; // New field for title
        string description;
    }

    Fundraiser[] public fundraisers;
    address public withdrawAddress; // address that can withdraw funds
    uint public totalAmountRaised; // total amount raised by all fundraisers

    constructor() {
        withdrawAddress = 0x52eE1DFb4ca6ba23F54Ad43480864C9c7D3E964c;
    }

    function createFundraiser(uint _fundingGoal, uint _deadline, string memory _title, string memory _description) public {
        fundraisers.push(Fundraiser(msg.sender, _fundingGoal, _deadline, 0, true, _title, _description)); // Set title in new Fundraiser instance
    }
    
    function contribute(uint _fundraiserIndex) public payable {
        require(_fundraiserIndex < fundraisers.length && fundraisers[_fundraiserIndex].isOpen, "Fundraiser does not exist or is not open");
        Fundraiser storage fundraiser = fundraisers[_fundraiserIndex];
        fundraiser.amountRaised += msg.value;
        totalAmountRaised += msg.value;
        if (fundraiser.amountRaised >= fundraiser.fundingGoal) {
            fundraiser.isOpen = false;
        }
    }
    
    function getFundraiserCount() public view returns (uint) {
        return fundraisers.length;
    }
    
    function getFundraiserDetails(uint _fundraiserIndex) public view returns (address, uint, uint, uint, bool, string memory, string memory) {
    require(_fundraiserIndex < fundraisers.length, "Fundraiser does not exist");
    Fundraiser storage fundraiser = fundraisers[_fundraiserIndex];
    return (fundraiser.creator, fundraiser.fundingGoal, fundraiser.deadline, fundraiser.amountRaised, fundraiser.isOpen, fundraiser.title, fundraiser.description);
}
    
    function getAllFundraisers() public view returns (Fundraiser[] memory) {
        return fundraisers;
    }
    
    function withdraw() public {
        require(msg.sender == withdrawAddress, "Only the withdrawal address can withdraw funds");
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function getTotalAmountRaised() public view returns (uint) {
        return totalAmountRaised;
    }
    
    function getFundraiserAmountRaised(uint _fundraiserIndex) public view returns (uint) {
        require(_fundraiserIndex < fundraisers.length, "Fundraiser does not exist");
        Fundraiser storage fundraiser = fundraisers[_fundraiserIndex];
        return fundraiser.amountRaised;
    }
    function closeFundraiser(uint _fundraiserIndex) public {
        require(_fundraiserIndex < fundraisers.length, "Fundraiser does not exist");
        Fundraiser storage fundraiser = fundraisers[_fundraiserIndex];
        require(fundraiser.isOpen, "Fundraiser is already closed");
        require(fundraiser.amountRaised >= fundraiser.fundingGoal, "Fundraiser has not reached its funding goal");
        fundraiser.isOpen = false;
    }

    function getFundraiserPercentComplete(uint _fundraiserIndex) public view returns (uint) {
       require(_fundraiserIndex < fundraisers.length, "Fundraiser does not exist");
       Fundraiser storage fundraiser = fundraisers[_fundraiserIndex];
       require(fundraiser.isOpen, "Fundraiser is not open");
       uint percentComplete = (fundraiser.amountRaised * 100) / fundraiser.fundingGoal;
       return (percentComplete > 100) ? 100 : percentComplete;
    }

    function getTotalAmountRaisedByCreator(address _creator) public view returns (uint) {
      uint totalAmount = 0;
      for (uint i = 0; i < fundraisers.length; i++) {
        if (fundraisers[i].creator == _creator) {
            totalAmount += fundraisers[i].amountRaised;
        }
    }
      return totalAmount;
    }

    function getFundraiserDeadline(uint _fundraiserIndex) public view returns (string memory) {
      require(_fundraiserIndex < fundraisers.length, "Fundraiser does not exist");
      Fundraiser storage fundraiser = fundraisers[_fundraiserIndex];
      return formatDateTime(fundraiser.deadline);
    }



struct DateTime {
    uint256 year;
    uint256 month;
    uint256 day;
    uint256 hour;
    uint256 minute;
    uint256 second;
    uint256 weekday;

}

function timestampToDateTime(uint256 _timestamp) private pure returns (DateTime memory) {
    uint256 secondsInDay = 86400;
    uint256 secondsInHour = 3600;
    uint256 secondsInMinute = 60;
    uint256 sec = _timestamp % secondsInDay;
    uint256 min = (sec % secondsInHour) / secondsInMinute;
    uint256 hrs = sec / secondsInHour;
    uint256 daysSinceEpoch = (_timestamp - sec) / secondsInDay;
    uint256 weekday = (daysSinceEpoch + 4) % 7; // Sunday == 0, Monday == 1, etc.

    uint256 year = 1970;
    while (daysSinceEpoch >= 365) {
        bool isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
        uint256 daysInYear = isLeapYear ? 366 : 365;
        if (daysSinceEpoch < daysInYear) break;
        daysSinceEpoch -= daysInYear;
        year += 1;
    }

    uint256 month = 1;
    uint256 daysInMonth = 31;
    while (daysSinceEpoch >= daysInMonth) {
        daysSinceEpoch -= daysInMonth;
        month += 1;
        if (month == 2) {
            bool isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
            daysInMonth = isLeapYear ? 29 : 28;
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
            daysInMonth = 30;
        } else {
            daysInMonth = 31;
        }
    }

    return DateTime(year, month, daysSinceEpoch + 1, hrs, min, sec, weekday);
}

function formatDateTime(uint256 _timestamp) private pure returns (string memory) {
    DateTime memory dt = timestampToDateTime(_timestamp);
    bytes memory dtString = abi.encodePacked(
        dt.day, "/", dt.month, "/", dt.year, " ",
        dt.hour, ":", dt.minute, ":", dt.second
    );
    return string(dtString);
}

}
