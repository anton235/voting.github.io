// find elements
var Admin = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
  
    init: function() {
      window.ethereum.enable();//saved the world, but doesn't define it self any more :D
    //   Admin.adminUi();
      return Admin.initWeb3();
    },
  
    initWeb3: function() {
      // TODO: refactor conditional
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        Admin.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      //  web3.eth.defaultAccount = web3.eth.accounts[0];
      } else {
        // Specify default instance if no web3 instance provided
        Admin.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(Admin.web3Provider);
        //web3.eth.defaultAccount = web3.eth.accounts[0];
      }
      return Admin.initContract();
    },
  
    initContract: function() {
      $.getJSON("ElectionToken.json", function(electiontoken) {
        // Instantiate a new truffle contract from the artifact
        Admin.contracts.ElectionToken = TruffleContract(electiontoken);
        // Connect provider to interact with contract
        Admin.contracts.ElectionToken.setProvider(Admin.web3Provider);

        //Admin.listenForEvents();
  
        // return Admin.render();
      });
    },

    initContractParams: function() {
      var initialSupply = $("#supplyInput").val();   // get input from html input element
      initialSupply = Number(initialSupply);

      var voterAddresses = $("#votersInput").val();
      voterAddresses = JSON.parse(voterAddresses);
      var candidateAddresses = $("#candidatesInput").val();
      candidateAddresses = JSON.parse(candidateAddresses);

      var startDate = $("#dateTimeStart").val();   // get input from html input element
      var endDate = $("#dateTimeEnd").val();

      startDate = new Date(startDate);      // convert to date format
      endDate = new Date(endDate);
      startDate = Math.floor(startDate/1000); // omit last 3 digits
      endDate = Math.floor(endDate/1000);

      Admin.contracts.ElectionToken.deployed().then(function(instance) {
        instance.initializeContract(initialSupply, voterAddresses, candidateAddresses, startDate, endDate);
      });
    }
  };
  

$(document).ready(function() {
    Admin.init();
  });

$(document).ready(function () {
    $('#electionForm').on("submit",function(event) {
      event.preventDefault();
      Admin.initContractParams();
  });
})
