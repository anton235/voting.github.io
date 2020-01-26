const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "avocado denial drive tortoise regular crawl torch question eternal proud trap garment";
module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/ee7f14f8e4ef43dab2769edfcda8445f")
      },
      network_id: 3
    }
  }
};
// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // for more about customizing your Truffle configuration!
//   networks: {
//     development: {
//       host: "127.0.0.1",
//       port: 7545,
//       network_id: "*" // Match any network id
//     }
//   }
// };
