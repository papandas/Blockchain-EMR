/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", 
      gas: 6000000,
      gasPrice: 100000000000
    },
    rinkeby: {
      host:"localhost",
      port:8545,
      from: "0x2d62771cb1bbb9fc81289276014b76954a57b648",
      network_id: 4,
      gas: 6000000,
      gasPrice: 100000000000
    }
  }
};
