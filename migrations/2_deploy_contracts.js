var kavsutx = artifacts.require("./kavsutx.sol");
var kavsutxSale = artifacts.require("./kavsutxSale.sol");
var tokenPrice =3000000000000000;// in wei
module.exports = function (deployer) {
  deployer.deploy(kavsutx,3000000).then(function(){
    return deployer.deploy(kavsutxSale,kavsutx.address,tokenPrice);
  });
};

