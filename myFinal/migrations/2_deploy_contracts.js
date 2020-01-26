var Election = artifacts.require("./Election.sol");
var context = artifacts.require("./context.sol");
var ElectionToken = artifacts.require("./ElectionToken.sol");
var erc20 = artifacts.require("./erc20.sol");
var erc20Detailed = artifacts.require("./erc20Detailed.sol");
var ierc20 = artifacts.require("./ierc20.sol");
var Owned = artifacts.require("./Owned.sol");
var safeMath = artifacts.require("./safeMath.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
  deployer.deploy(ElectionToken);
  deployer.deploy(erc20);
  deployer.deploy(safeMath);
};

