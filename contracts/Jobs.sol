// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Jobs {
    enum JobType { InPerson, Online }

    struct Job {
        address employer;
        string title;
        string description;
        string location;
        JobType jobType;
        uint256 salary;
        bool isOpen;
        address[] applicants;
        address acceptedApplicant; // new field to track accepted applicant
    }

    struct Applicant {
        string name;
        string[] skills;
        uint256 age;
        string location;
    }

    mapping(address => Job[]) private employerJobs;
    mapping(address => Applicant) private applicants;

    event JobAdded(address indexed employer, uint256 indexed index);
    event JobApplied(address indexed applicant, uint256 indexed index);
    event JobAccepted(address indexed employer, address indexed applicant, uint256 indexed index);
    event JobRejected(address indexed employer, address indexed applicant, uint256 indexed index);

    function addJob(
        string memory _title,
        string memory _description,
        string memory _location,
        JobType _jobType,
        uint256 _salary
    ) public {
        Job memory job = Job({
            employer: msg.sender,
            title: _title,
            description: _description,
            location: _location,
            jobType: _jobType,
            salary: _salary,
            isOpen: true,
            applicants: new address[](0),
            acceptedApplicant: address(0) // initialize to null address
        });

        employerJobs[msg.sender].push(job);

        emit JobAdded(msg.sender, employerJobs[msg.sender].length - 1);
    }

    function applyToJob(address _employer, uint256 _index) public {
        Job storage job = employerJobs[_employer][_index];
        job.applicants.push(msg.sender);

        emit JobApplied(msg.sender, _index);
    }

    function acceptApplicant(address _applicant, address _employer, uint256 _index) public {
        Job storage job = employerJobs[_employer][_index];

        for (uint256 i = 0; i < job.applicants.length; i++) {
            if (job.applicants[i] == _applicant) {
                job.acceptedApplicant = _applicant; // set the accepted applicant
                job.applicants[i] = job.applicants[job.applicants.length - 1];
                job.applicants.pop();
                break;
            }
        }

        job.isOpen = false;

        emit JobAccepted(_employer, _applicant, _index);
    }

    function createApplicantProfile(
        string memory _name,
        string[] memory _skills,
        uint256 _age,
        string memory _location
    ) public {
        Applicant memory applicant = Applicant({
            name: _name,
            skills: _skills,
            age: _age,
            location: _location
        });

        applicants[msg.sender] = applicant;
    }

    function getJobsByEmployer(address _employer) public view returns (Job[] memory) {
        return employerJobs[_employer];
    }

    function getApplicantProfile() public view returns (Applicant memory) {
        return applicants[msg.sender];
    }

    function rejectApplicant(address _applicant, address _employer, uint256 _index) public {
    Job storage job = employerJobs[_employer][_index];

    for (uint256 i = 0; i < job.applicants.length; i++) {
        if (job.applicants[i] == _applicant) {
            job.applicants[i] = job.applicants[job.applicants.length - 1];
            job.applicants.pop();
            break;
        }
    }

    emit JobRejected(_employer, _applicant, _index);
    
    }
    
}
