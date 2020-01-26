const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "doctor estate detect lobster print typical element cliff twin latin maple dry";
module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/ee7f14f8e4ef43dab2769edfcda8445f")
      },
      network_id: 3
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas:"4700000" // Match any network id
    }
  }
};

