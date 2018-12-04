

import Peer from 'peerjs';

module.exports =  {



async init(){
  var peer = new Peer('pick-an-id', {key: 'myapikey'});
// You can pick your own id or omit the id if you want to get a random one from the server.





  var conn = peer.connect('another-peers-id');
  conn.on('open', function(){
    conn.send('hi!');
  });

  peer.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data);
    });
  });

}




}
