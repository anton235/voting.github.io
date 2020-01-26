pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;   

import  "./erc20.sol";
import  "./erc20Detailed.sol";
import  "./Owned.sol";

contract ElectionToken is erc20, erc20Detailed, Owned{

    struct Candidate{
        uint id;                        // the candidate associated number in this pool
        string name;                    // candidate name
        string description;             // short description of the candidate
        address candidateAdd;
        string image;                   // candidate image link
        bool candidateInitialized;      // true if candidate exist
    }

    mapping (uint => Candidate) public candidates;
    uint public candidatesCount;

    string public electionName;
    string public electionDescription;

    address[] public voterAddresses;
    address[] public candidateAddresses;

    mapping (address => bool) voterAddressInitialized;
    mapping (address => bool) candidateAddressInitialized;

    mapping (address => bool) voted;

    /*https://www.unixtimestamp.com/index.php*/
    uint256 private expiration;    // contract expiration time *** 1577971200 =2/1/2020 13:20:00
    uint256 private start;         // contract start time

    event votedEvent (
        address indexed _candidateId
    );

    //constructor(uint256 _initialSupply, address[] memory _voterAddresses, address[] memory _candidateAddresses, uint256 _start, uint256 _end) erc20Detailed("VotingToken", "VTC", 0)public{    //_initialTokenSupply = number of voters
    constructor(string memory _name, string memory _description, uint256 _initialSupply, address[] memory _voterAddresses, uint256 _start, uint256 _end) erc20Detailed("VotingToken", "VTC", 0)public{    //_initialTokenSupply = number of voters
        _mint(msg.sender, _initialSupply);
        setElectionName(_name);
        setElectionDescription(_description);
        addVotersList(_voterAddresses);
        distributeTokens();
        setElectionStartTime(_start);
        setElectionExpirationTime(_end);
    }

    function getElectionData() public view returns (string memory, string memory ,uint ){
        return (electionName, electionDescription, candidatesCount);
    }

    function setElectionName(string memory _name)public onlyOwner{
        electionName = _name;
    }

    function getElectionName()public view returns (string memory){
        return electionName;
    }

    function setElectionDescription(string memory _description)public onlyOwner{
        electionDescription = _description;
    }

    function getElectionDescription()public view returns (string memory){
        return electionDescription;
    }

    function addVoterAddress(address _address) internal onlyOwner{
        voterAddressInitialized[_address] = true;
        voterAddresses.push(_address);
    }

    function addVotersList(address[] memory addresses) public onlyOwner{
        //require(now < (start * 1 seconds), "Poll started v");
        for(uint i = 0; i < addresses.length; i++){
            if(!voterAddressInitialized[addresses[i]]){
                addVoterAddress(addresses[i]);
            }
        }
    }

    function addCandidate(address _address, string memory _name, string memory _description, string memory _image) public onlyOwner{
        require(now <= (start * 1 seconds),"This poll already started");
        require(!candidateAddressInitialized[_address], "This candidate address already exist");

        candidateAddressInitialized[_address] = true;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _description, _address, _image, true);
        candidatesCount++;
        candidateAddresses.push(_address);
    }

    function editCandidateByAddress(address _address, string memory _name, string memory _description, string memory _image) public onlyOwner{
        require(now <= (start * 1 seconds),"This poll already started");
        require(candidateAddressInitialized[_address], "This candidate address doesn't exist");

        for(uint i = 0; i < candidatesCount; i++){      // find candidate index
            if(candidates[i].candidateAdd == _address){
                candidates[i] = Candidate(candidatesCount, _name, _description, _address, _image, true);
            }
        }
    }

    function deleteCandidateByAddress(address _address) public onlyOwner returns(bool){
        require(now <= (start * 1 seconds),"This poll already started");
        require(candidateAddressInitialized[_address], "This candidate address doesn't exist");

        for(uint i = 0; i < candidatesCount; i++){      // find candidate index
            if(candidateAddressInitialized[_address]){
                candidates[i].candidateInitialized = false;
                candidateAddressInitialized[_address] = false;
                return true;
            }
        }
        return false;
    }

    function distributeTokens() public onlyOwner{
        for(uint i = 0; i < voterAddresses.length; i++){
            //require(totalSupply() > 0,"Supply is over");
            require(balanceOf(msg.sender) > 0,"Supply is over");
            transfer(voterAddresses[i],1);
        }
    }

    function vote(address candidateAddress) public {
        /*require(now >= (start * 1 seconds), "This poll not yet started");
        if(now > (expiration * 1 seconds)){
            endElection();
        }*/
        require(now < (expiration * 1 seconds), "This poll has expired.");
        require(candidateAddressInitialized[candidateAddress],"Is not a Candidate");
        require(voterAddressInitialized[msg.sender],"User isn't authorized voter");
        require(!voted[msg.sender],"User already voted");
        require(balanceOf(msg.sender) > 0,"Voter doesn't have a token");
        transfer(candidateAddress,1);
        voted[msg.sender] = true;

        emit votedEvent(candidateAddress);
    }



    function getResults() public view returns (uint256[] memory ){
        uint256[] memory results = new uint256[](candidateAddresses.length);
        for(uint i = 0; i < candidateAddresses.length; i++){
            if(candidates[i].candidateInitialized == true)
                results[i] = balanceOf(candidateAddresses[i]);
        }
        return results;
    }

    function getCandidateData() public view returns (string[] memory, string[] memory ){
        string[] memory candidateName = new string[](candidatesCount);
        string[] memory candidateDescription = new string[](candidatesCount);
        for(uint i = 0; i < candidateAddresses.length; i++){
            if(candidates[i].candidateInitialized == true)
                candidateName[i] = candidates[i].name;
                candidateDescription[i] = candidates[i].description;
        }
        return (candidateName,candidateDescription);
    }

    function endElection() private {        // if voter didnt vote set him as if he did
        for(uint i = 0; i < voterAddresses.length; i++){
            if(!voted[voterAddresses[i]]){
                voted[voterAddresses[i]] = true;
            }
        }
    }

    function setElectionStartTime(uint _start) public onlyOwner{
        start = _start;
    }

    function setElectionExpirationTime(uint _expiration) public onlyOwner{
        expiration = _expiration;
    }

    function changeElectionStartTime(uint _start) public onlyOwner{
        require(now <= (start * 1 seconds), "This poll already started");
        start = _start;
    }

    function changeElectionExpirationTime(uint _expiration) public onlyOwner{
        require(now <= (start * 1 seconds), "This poll already started");
        expiration = _expiration;
    }

    function displayTime() public view returns(uint256, uint256, uint256){
        uint256 timeNow = now;
        return (timeNow, start, expiration);
    }

    function displayEndTime() public view returns(uint256){
        return (expiration);
    }
}
