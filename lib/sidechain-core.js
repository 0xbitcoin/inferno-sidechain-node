


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

const MerkleTree = require('merkletreejs')
const crypto = require('crypto')



module.exports =  {



    async init( mongoInterface   )
    {
      var self = this

      await initGenesisBlock( mongoInterface )

      await self.update(mongoInterface)
      setInterval(function(){ self.update(mongoInterface)  }, 30*1000)

    }

    async initBlockchain( mongoInterface )
    {
      var blockCount = mongoInterface.findOne('chainStats',{name: 'blockCount'})

      if(blockCount == nil)
      {
        await this.buildGenesisBlock( mongoInterface )
      }
    }




    async update(mongoInterface)
    {

     var contractData = await this.readContractData()

     await this.addNewCurrentRootHash( contractData.currentRootHash , contractData.epochCount )


     //use this to calc balances 
     var longestChain = await this.calculateLongestChain( mongoInterface )


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


    /*
    Use data in
    submitted_state_root_hashes  & submitted_sidechain_leaves ...

    Start at the genesis block (known) and find all possible children, who have its hash set as their leaf.


    */
    async calculateLongestChain(mongoInterface)
    {
      console.log('calculate longest chain')

      var genesisRootLeaf = 0x0; //make sure this matches up w solidity


       //loop through each possible block
       var submitted_hashes = await mongoInterface.findAll('submitted_state_root_hashes', { })

       for(var i =0; i< submitted_hashes.length; i++)
       {
         let root = submitted_hashes[i].root;
         var chainData = await this.computeChainDataFromRoot(root,mongoInterface)

         await mongoInterface.upsertOne('possible_chains',
          { root: root },
          { root: root,  leaves: chainData.leaves , blockCount: chainData.blockCount }
        )
       }




        //determine the possible_chain with the most blockcount
        var possible_chains = await mongoInterface.findAll('possible_chains', { })

        var highestBlockCount = 0;
        var highestBlockChainRoot;

        for(var i =0; i< possible_chains.length; i++)
        {
          var chainData = possible_chains[i]
          if( chainData.blockCount >  highestBlockCount){
            highestBlockCount = chainData.blockCount
            highestBlockChainRoot = chainData.root
          }
        }

        var longest_chain = await mongoInterface.findOne('possible_chains', {root: highestBlockChainRoot })

        return longest_chain;


    }

    async computeChainDataFromRoot(root, mongoInterface)
    {
      var found_leaf = true
      var chainData = {root:root}

      var blockCount = 1;
      var leaves = [];

      const genesisBlockRoot = 0x0;
      var lastBlockRoot = root;

      //follow leaves back as far as possible, until the genesis block
      while(found_leaf == true)
      {
        var block = await mongoInterface.findOne('submitted_sidechain_leaves',{root: lastBlockRoot})

        if( block )
        {
          lastBlockRoot = block.leaf.
        }else{
          found_leaf = false;
        }
      }

      return {
        valid: (lastBlockRoot == genesisBlockRoot), //make sure this is right
        root: root,
        leaves:leaves,
        blockCount:blockCount

      };
    }


    async buildGenesisBlock(mongoInterface)
    {
      var blocks = []
      await this.addNewBlock(0x0, blocks,     mongoInterface)
    }

    //from web3
   async addNewCurrentRootHash(root, epochCount)
   {
     await mongoInterface.upsertOne(
       'submitted_state_root_hashes',
        { epochCount:epochCount },
        { root: root, epochCount:epochCount}
      )
   }


    async addNewBlock(leaf,  proof , mongoInterface)
    {
      var leaves = []
      leaves.push( leaf )
      leaves.concat( proof )

      var root = await this.getMerkleRoot(leaf,proof);

       await mongoInterface.upsertOne(
         'submitted_sidechain_leaves',
          {root: root},
          {root: root,  leaf: leaf, proof: proof}
        )

    }

    async getMerkleRoot(   array  )
      var leaves = array.map(x => sha256(x))

      var tree = new MerkleTree(leaves, sha256)

      return tree
    }

    function sha256(data) {
      // returns Buffer
      return crypto.createHash('sha256').update(data).digest()
    }





}
