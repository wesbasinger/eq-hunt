const EqHunt = artifacts.require("EqHunt");

module.exports = function(deployer) {
  deployer.deploy(EqHunt, { value: 1000000000000000000 });
};
