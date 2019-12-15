const EqHunt = artifacts.require("EqHunt");

contract("EqHunt", async (accounts) => {

  it("should deploy", async () => {
    let eqHunt = await EqHunt.deployed();
    console.log(eqHunt.address);
    assert.notEqual(eqHunt.address, "0x0");
  })

  it("will accept ether", async () => {
    let eqHunt = await EqHunt.deployed();
    let priorBal = await web3.eth.getBalance(eqHunt.address);
    await web3.eth.sendTransaction({from: accounts[0], to: eqHunt.address, value: web3.utils.toWei("1")});
    let newBal = await web3.eth.getBalance(eqHunt.address);
    assert.isAbove(Number(newBal), Number(priorBal));
  })

  it("will create an equation", async () => {
    let eqHunt = await EqHunt.deployed();
    await eqHunt.create("AAAA", "2x=10", 5);
    let equation = await eqHunt.equations("AAAA");
    assert.equal(equation, "2x=10");
  })

})
