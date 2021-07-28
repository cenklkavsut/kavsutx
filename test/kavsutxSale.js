var kavsutxSale=artifacts.require("../contracts/kavsutxSale.sol");
var kavsutx=artifacts.require("../contracts/kavsutx.sol");

contracts('kavsutxSale', function(accounts){
var tokenInstance;
var tokenSaleInstance;
var admin =accounts[0];
var buyer = accounts[1];
var tokenPrice = 3000000000000000//in wei
var tokenAvailable = 2750000;
var numberOfTokens;
  it('initializes the contract with the correct values', function() {
  return kavsutxSale.deployed().then(function(instance){
  tokenSaleInstance = accounts;
  return tokenInstance.address;
  }).then(function(address){
  assert.notequal(address,0x0,'has contracts address');
  return tokenInstance.tokenContract();
  })}).then(function(address){
  assert.notequal(address,0x0,'has token contracts address');
  return tokenSaleInstance.tokenPrice();
  }).then(function(price){
  assert.equal(price, tokenPrice,'token price is correct');
  });

  it('facilitates token buying', function() {
  return kavsutx.deployed().then(function(instance){
    tokenInstance = instance;//grab token instance
    return kavsutxSale.deployed();
    }).then(function(instance){
    tokenSaleInstance = instance;//then grab  token sale instance
    //provision tokens 75% to the token sale
    return tokenInstance.transfer(tokenSaleInstance.address, tokenAvailable , {from:admin});
      }).then(function(receipt){
    numberOfTokens = 10;
    return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer ,value : numberOfTokens * tokenPrice });
  });
  }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account the tokens and purchased tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
  return tokenSaleInstance.tokensSold();
  }).then(function(amount){
    assert.equal(amount.toNumber(),numberOfTokens,'increment the number of tokens sold');
    return tokenInstance.balanceOf(buyer);
    }).then(function(balance){
    assert.equal(balance.toNumber(),numberOfTokens);
    return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance){
    assert.equal(balance.toNumber(),TokenAvailable - numberOfTokens);
    return tokenSaleInstance.buyTokens(numberOfTokens ,{from: buyer, value : 1});//Try to buy tokens different from the ether value
   }).then(assert.fail).catch(function(error){
   assert(error.message.indexOf('revert')>=0,'msg.value must equal tokens in wei')
    return tokenSaleInstance.buyTokens(2800000, {from: buyer ,value : numberOfTokens * tokenPrice });
  }).then(assert.fail).catch(function(error){
  assert(error.message.indexOf('revert')>=0,' cannot purchase more tokens')
  });
});

 it('ends token sale',function(){
  return kavsutx.deployed().then(function(instance){
    tokenInstance = instance;//grab token instance
    return kavsutxSale.deployed();
    }).then(function(instance){
    tokenSaleInstance = instance;// grab the token sale instance
    //Test that someone else not admin can end the sale
    return tokenSaleInstance.endSale({from:buyer});
    }).then(assert.fail).catch(function(error){
    assert(error.message.indexOf('revert' >=0 ,'must be admin to end the sale'));
    //end sale as admin 
    return tokenInstance.endSale({from:admin});
    }).then(function(receipt){
    //receipt
    tokenInstance.endSale({from:admin});  
    }).then(function(balance) {
        assert.equal(balance.toNumber(), 999990, 'returns all unsold kavsutx to admin');
      return tokenSaleInstance.tokenPrice();// Check that token price was reset when selfDestruct was called
    }).then(function(price) {
      assert.equal(price.toNumber(), 0, 'token price was reset');
    });
 });
 