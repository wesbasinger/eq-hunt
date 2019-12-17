pragma solidity >=0.4.21 <0.6.0;

contract EqHunt {

  struct Equation {
    string repr;
    int answer;
    bool exists;
  }

  mapping(string => Equation) equations;

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

  function() payable external {}

}
