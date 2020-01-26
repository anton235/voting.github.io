var Admin = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  contractAddress: null,

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

      Admin.initContractParams();

    });
  },

  initContractParams: function() {
    var electionName = $("#nameInput").val();
    var electionDescription = $("#descriptionInput").val();

    var initialSupply = $("#supplyInput").val();   // get input from html input element
    initialSupply = Number(initialSupply);

    var voterAddresses = $("#votersInput").val();
    voterAddresses = JSON.parse(voterAddresses);
    var startDate = $("#dateTimeStart").val();   // get input from html input element
    var endDate = $("#dateTimeEnd").val();
    
    startDate = new Date(startDate);      // convert to date format
    endDate = new Date(endDate);
   
    startDate = Math.floor(startDate/1000); // omit last 3 digits
    endDate = Math.floor(endDate/1000);
    $(".chart").attr("enddate", endDate);

    
    Admin.contracts.ElectionToken.new(electionName, electionDescription, initialSupply, voterAddresses, startDate, endDate).then(function(instance) {

      Admin.contractAddress = instance.address;
      // When the transaction ends, open the modal 
      modal.style.display = "block";
      document.getElementById("contractAdd").innerHTML = instance.address;
    });
  },

  addNewCandidate: function() {
    var candidateAddress = $("#newCandidateAddress").val();   
    var candidateName = $("#newCandidateName").val();
    var candidateDescription = $("#newCandidateDescription").val();
    var candidateImageLink = document.getElementById("newCandidateImageLink").value;
 
    Admin.contracts.ElectionToken.at(Admin.contractAddress).then(function(instance) {
      instance.addCandidate(candidateAddress, candidateName, candidateDescription, candidateImageLink);
      
    });
  }
};

$(document).ready(function () {
  $('#electionForm').on("submit",function(event) {
    event.preventDefault();
    Admin.init();
  
  });
});

// Get the modal
var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
// copy contract address to clipboard
function myCopy() {
  var copyText = document.getElementById("contractAdd");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  showDiv();
}

function addCandidate(){
  Admin.addNewCandidate();
}

function showDiv() {
  var mainFormElement = document.getElementById('mainContractForm');
  var addCandidatesElement = document.getElementById('addCandidatesForm');
  if (addCandidatesElement.style.display === 'none') {
    mainFormElement.style.display = 'none';
    addCandidatesElement.style.display = 'block';
  }
}