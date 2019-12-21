pragma solidity >=0.4.21 <0.6.0;

contract EqHunt {

  struct Equation {
    string repr;
    int answer;
    bool exists;
  }

  mapping(string => Equation) equations;
  mapping(string => address[]) public solvers;
  uint256 private balance;
  address private owner;

  constructor() public payable {
    owner = msg.sender;
    balance = msg.value;
  }

  function create(string memory _id, string memory _repr, int _answer) public {

    require(!equations[_id].exists);

    Equation memory e = Equation(_repr, _answer, true);

    equations[_id] = e;

  }

  function getEquation(string memory _id) public view returns(string memory) {
    return equations[_id].repr;
  }

  function check(string memory _id, int _answer) public view returns(bool) {

    require(equations[_id].exists);

    if(equations[_id].answer == _answer) {
      return true;
    } else {
      return false;
    }
  }

  function rand() internal view returns(uint256) {
    return uint256(uint256(keccak256(abi.encode(block.timestamp)))%10) + 1;
  }

  function payout() internal view returns(uint256) {
    return 40000000000000000/rand();
  }

  function reward(address payable _payee) internal {

    uint256 r = payout();

    require(balance>=r);

    _payee.transfer(r);
    balance -= r;
  }

  function solve(string memory _id, int256 _answer) public returns(bool) {
    require(!hasSolved(_id));
    bool correct = check(_id, _answer);
    require(correct);
    if(correct) {
      addSolver(_id);
      reward(msg.sender);
    }
  }

  function addSolver(string memory _id) internal {
    solvers[_id].push(msg.sender);
  }

  function hasSolved(string memory _id) internal view returns(bool) {
    address[] memory _solvers = solvers[_id];
    for(uint256 i=0; i<_solvers.length; i++) {
      if(_solvers[i] == msg.sender) {
        return true;
      }
    }
    return false;
  }

  function getNumSolvers(string memory _id) public view returns(uint256) {
    address[] memory _solvers = solvers[_id];
    return _solvers.length;
  }

  function() payable external {}

  // TEST CODE

  function testRand() public view returns(uint256) {
    return rand();
  }

  function testPayout() public view returns(uint256) {
    return payout();
  }

  function testReward(address payable _payee) public {
    reward(_payee);
  }

  function getBalance() public view returns (uint256) {
    return balance;
  }

  function testHasSolved(string memory _id) public view returns(bool) {
    return hasSolved(_id);
  }

}
