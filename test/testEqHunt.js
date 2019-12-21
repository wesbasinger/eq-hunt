const truffleAssert = require('truffle-assertions');

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
    let equation = await eqHunt.getEquation("AAAA");
    assert.equal(equation, "2x=10");
  })

  it("will not allow duplicate equation creation", async() => {
    let eqHunt = await EqHunt.deployed();
    await truffleAssert.reverts(eqHunt.create("AAAA", "2x=10", 5));
  })

  it("can check an equation with correct answer", async() => {
    let eqHunt = await EqHunt.deployed();
    const result = await eqHunt.check("AAAA", 5);
    assert.equal(result, true);
  })

  it("can check an equation with an incorrect answer", async() => {
    let eqHunt = await EqHunt.deployed();
    const result = await eqHunt.check("AAAA", -4);
    assert.equal(result, false);
  })

  it("will revert when checking a nonexistent equation", async() => {
    let eqHunt = await EqHunt.deployed();
    await truffleAssert.reverts(eqHunt.check("ZZZZ", 10));
  })

  it("will generate a random number between 1 and 10 inclusive", async() => {
    let eqHunt = await EqHunt.deployed();
    for(let i=0; i<100; i++) {
      const result = await eqHunt.testRand();
      const numResult = Number(result);
      assert.isAtLeast(numResult, 0);
      assert.isAtMost(numResult,10);
    }
  })

  it("will generate a payout between 4000000000000000 and 40000000000000000 inclusive", async() => {
    let eqHunt = await EqHunt.deployed();
    for(let i=0; i<100; i++) {
      const result = await eqHunt.testPayout();
      const numResult = Number(result);
      assert.isAtLeast(numResult, 4000000000000000);
      assert.isAtMost(numResult, 40000000000000000);
    }
  })

  it("is funded with an initial balance", async () => {
    let eqHunt = await EqHunt.deployed();
    const result = await eqHunt.getBalance();
    const numResult = Number(result);
    assert.isAbove(numResult, 0);
  })

  it("can send reward", async () => {

    let eqHunt = await EqHunt.deployed();

    let initialContractBalance = await eqHunt.getBalance();
    initialContractBalance = Number(initialContractBalance);
    let initialAccountBalance = await web3.eth.getBalance(accounts[0]);
    initialAccountBalance = Number(initialAccountBalance);

    await eqHunt.testReward(accounts[0]);

    let postContractBalance = await eqHunt.getBalance();
    postContractBalance = Number(postContractBalance);
    let postAccountBalance = await web3.eth.getBalance(accounts[0]);
    postAccountBalance = Number(postAccountBalance);

    assert.isAbove(postAccountBalance, initialAccountBalance);
    assert.isBelow(postContractBalance, initialContractBalance);

  })

})
