
var mongoInterface = require('./lib/mongo-interface')


var sidechainCore = require('./lib/sidechain-core')


var web3Interface = require('./lib/web3-interface')




async function init()
{
  console.log('Booting inferno sidechain node :)')

  await mongoInterface.init('inferno_sidechain')

  await sidechainCore.init(mongoInterface)
}

init();
