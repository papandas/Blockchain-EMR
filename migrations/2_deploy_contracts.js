var EMR = artifacts.require("./EMRContract.sol");

module.exports = function(deployer) {
  deployer.deploy(EMR);
};
