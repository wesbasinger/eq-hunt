pragma solidity >=0.4.21 <0.6.0;

contract EqHunt {

  mapping(string => string) public equations;
  mapping(string => int) private answers;

  function create(string memory id, string memory repr, int answer) public {
    equations[id] = repr;
    answers[id] = answer;
  }

  function() payable external {}

}
