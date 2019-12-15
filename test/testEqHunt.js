const EqHunt = artifacts.require("EqHunt");

contract("EqHunt", accounts => {

  it("should deploy", async () => {
    let eqHunt = await EqHunt.deployed();
    console.log(eqHunt.address);
    assert.notEqual(eqHunt.address, "0x0");
  })

})
