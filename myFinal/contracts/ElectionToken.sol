pragma solidity >=0.4.22 <0.6.0;

import  "./erc20.sol";
import  "./erc20Detailed.sol";
import  "./Owned.sol";

contract ElectionToken is erc20, erc20Detailed, Owned{

    address[] public voterAddresses;
    address[] public candidateAddresses;

    mapping (address => bool) voterAddressInitialized;
    mapping (address => bool) candidateAddressInitialized;

    mapping (address => bool) voted;

    /*https://www.unixtimestamp.com/index.php*/
    uint256 private expiration;    // contract expiration time *** 1577971200 =2/1/2020 13:20:00
    uint256 private start;         // contract start time

    /*constructor(uint256 _initialSupply, address[] memory _voterAddresses, address[] memory _candidateAddresses, uint256 _start, uint256 _end) erc20Detailed("VotingToken", "VTC", 0)public{    //_initialTokenSupply = number of voters
        mint(msg.sender, _initialSupply);
        addVotersList(_voterAddresses);
        addCandidatesList(_candidateAddresses);
        distributeTokens();
        setElectionStartTime(_start);
        setElectionExpirationTime(_end);
    }*/
    constructor() erc20Detailed("VotingToken", "VTC", 0)public onlyOwner{    //_initialTokenSupply = number of voters
    }

    function initializeContract(uint256 _initialSupply, address[] memory _voterAddresses, address[] memory _candidateAddresses, uint256 _start, uint256 _end) public onlyOwner{
        _mint(msg.sender, _initialSupply);
        addVotersList(_voterAddresses);
        addCandidatesList(_candidateAddresses);
        distributeTokens();
        setElectionStartTime(_start);
        setElectionExpirationTime(_end);
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

    function addCandidateAddress(address _address) internal onlyOwner{
        candidateAddressInitialized[_address] = true;
        candidateAddresses.push(_address);
    }

    function addCandidatesList(address[] memory addresses) public onlyOwner{
        //require(now < (start * 1 seconds), "Poll started c");
        for(uint i = 0; i < addresses.length; i++){
            if(!candidateAddressInitialized[addresses[i]]){
                addCandidateAddress(addresses[i]);
            }
        }
    }

    function distributeTokens() public onlyOwner{
        for(uint i = 0; i < voterAddresses.length; i++){
            require(totalSupply() > 0,"Supply is over");
            transfer(voterAddresses[i],1);
        }
    }

    function vote(address candidateAddress) public {
        //require(!timeLimit,"Election ended");
        require(now >= (start * 1 seconds), "This poll not yet started");
        if(now > (expiration * 1 seconds)){
            endElection();
        }
        require(now < (expiration * 1 seconds), "This poll has expired.");
        require(candidateAddressInitialized[candidateAddress],"Is not a Candidate");
        require(voterAddressInitialized[msg.sender],"User isn't authorized voter");
        require(!voted[msg.sender],"User already voted");
        require(balanceOf(msg.sender) > 0,"Voter doesn't have a token");
        transfer(candidateAddress,1);
        voted[msg.sender] = true;
    }

    function getResults() public view returns (address[] memory , uint256[] memory ){
        uint256[] memory results = new uint256[](candidateAddresses.length);
        for(uint i = 0; i < candidateAddresses.length; i++){
            results[i] = balanceOf(candidateAddresses[i]);
        }
        return (candidateAddresses,results);
    }

    function getStatistics() public view returns (uint256 , uint256 ){      // return how many voted and didnt how many didn't
        uint256 didVoteAmount = 0;
        for(uint i = 0; i < voterAddresses.length; i++){
            if(voted[voterAddresses[i]]){  // if voter voted
                didVoteAmount += 1;
            }
        }
        uint256 didntVoteAmount = voterAddresses.length - didVoteAmount;
        return (didVoteAmount,didntVoteAmount);
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

    function displayTime() public view returns(uint256, uint256, uint256){
        uint256 timeNow = now;
        return (timeNow, start, expiration);
    }

    //******for test******
    function balanceOFFFF(address _address)public view returns (uint256){
        return balanceOf(_address);
    }
    function balanceOFFF(address _address)public view returns (uint256){
        return balanceOf(_address);
    }
}
