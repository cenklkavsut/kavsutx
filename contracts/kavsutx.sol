pragma solidity ^0.5.16;

//(c) by cenk kavsut 2021. Private Licence.

contract kavsutx {
    string public name = "kavsutx";
    string public symbol = "KTX";
    string public standart = "KTX v1.0";
    uint256 public totalSupply; //Read the total of tokens

    //transfer event
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    //approve event
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    mapping(address => uint256) public balanceOf; //hash tree balanceof and know where it is
    mapping(address => mapping(address => uint256)) public allowance; //allowance approve the other account

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply; //allocat initial supply
        totalSupply = _initialSupply; //set tokens total amount
    }

    //Transfer event
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value); //Exception if not enough
        balanceOf[msg.sender] -= _value; //transfer ballance of token
        balanceOf[_to] += _value; //transfer ballance of token
        emit Transfer(msg.sender, _to, _value); //transfers recursive loop
        return true; //if happens verify true
    }

    //approve transfer
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value; //allowance
        emit Approval(msg.sender, _spender, _value); //approve event
        return true;
    }

    //delegated transfer
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]); //require _from has tokens
        require(_value <= allowance[_from][msg.sender]); //require allowance is big enough
        balanceOf[_from] -= _value; //change ballance
        balanceOf[_to] += _value; //update ballance
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value); //transfer event
        return true; //return a boolean
    }
}
