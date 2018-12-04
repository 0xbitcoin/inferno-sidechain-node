


/*

MONGO TABLES

-submitted_state_root_hashes  //get from web3
-submitted_sidechain_leaves   //proposed blocks... like mempool ... get from p2p... must sync


// By matching up the submitted_state_root_hashes datatable and the
// submitted_sidechain_leaves datatable together, we determine which historic
// sequential branch of leaves with fully filled leaf data  has the highest proof
// of work (most hashes) and we then store this in validated_sidechain_leaves
// and master_state_root_hashes as our main chain data


-master_state_root_hashes   //a full history of all seen contract root hashes

-validated_sidechain_leaves   //'mined' blocks, proved to be part of contracts state root hash






*/


module.exports =  {



    async init(    )
    {
      var self = this

      setInterval(function(){self.update()  }, 30*1000)
      self.update()
    }



    async update()
    {

     var contractData = await this.readContractData()

     await this.addNewCurrentRootHash( contractData.currentRootHash , contractData.epochCount )

    }

    /*
    Use web3 to pull new data into Mongo (contract state root hash)
    */
    async readContractData()
    {

    }

    async submitBlockToSidechain()
    {


    }






}
