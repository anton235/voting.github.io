/*jshint esversion: 6 */
var App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    window.ethereum.enable();//saved the world, but doesn't define it self any more :D
    App.appUi();
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    //  web3.eth.defaultAccount = web3.eth.accounts[0];
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      //web3.eth.defaultAccount = web3.eth.accounts[0];
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event);
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
     }
    });

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>";
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote   /////// shuld be replaced with token withdrawn
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

    appUi:function () {
      let = readMore = () => {
         $(".myBtn").on("click", function () {
          // $(document).on("click",".myBtn" ,function () {
          let parent = $(this).prev("p")[0];
          let dots = $(parent).children(".dots")[0];
          let moreText = $(parent).children(".more")[0];
      
        if (!$(dots).is(":visible")) {
          $(dots).show();
          $(this).text("Read more"); 
          $(moreText).slideUp();
        } else {
          $(dots).hide();
          $(this).text("Read less"); 
          $(moreText).slideDown();
        }
      
      });
      
      };

      readMore();

  }
};

// handle click 
$(".menu button").on("click", function(){
	let id = $(this).attr("id");
  switch (id) {
  case "1":
    	alert("This is first: " + id);
    	break;
    case "2":
    	alert("This is second: " + id);
    	break;
    case "3":
    	alert("This is third: " + id);
      break;
      case "4":
        alert("This is first: " + id);
        break;
      case "5":
        let input=$(this).prev("input").val();
        let param1=input[0];
        App.contracts.VTC.deployed().then(function(instance) {
          electionInstance = instance;
          debugger;
          // return electionInstance.candidatesCount();
          alert("Ninja: "|+" "+  electionInstance.increaseSupply(param1) );
        });
        break;
      case "6":
        alert("This is third: " + id);
        break;
        case "7":
          // let input=$(this).prev("input").val().split(",");
          // let input=$(this).prev("input").val();
          // let param1=input[0];
         
          
          // App.contracts.VTC.deployed().then(function(instance) {
          //   electionInstance = instance;
          //   debugger;
          //   // return electionInstance.candidatesCount();
          //   alert("Ninja: "|+" "+  electionInstance.transferAndAddVoterAddress(param1) );
          // });
        break;
        case "8":
          alert("This is second: " + id);
          break;
        case "9":
          alert("This is third: " + id);
          break;
    default:
    	alert("No id :\(");
    break;
  }

})

$(document).ready(function() {
    App.init();
  });
