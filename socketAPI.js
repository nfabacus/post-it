module.exports = function(io) {
  var socketioJwt   = require("socketio-jwt");
  var messages = [];
  var connections = [];

  // io.use(socketioJwt.authorize({
  //   secret: 'SECRET',
  //   handshake: true
  // }));

    io.on('connection', function(socket){
      connections = connections.filter(function (data){
        return data !== socket;
      });
      connections.push(socket);
      // if(messages.length) {
      //   io.sockets.emit('new message', messages);
      // }
      console.log('connection: %s socket(s) connected',connections.length);

      // socket.emit.... I do not need to authenticate every time I emit.

      // get chat message
      socket.on('message',(data)=>{
        console.log(`MEssage from user : ${data}`)
      })
      
      // disconnect
      socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected: %s socket(s) connected', connections.length);
      });

    });

    io.sockets
      .on('connection', socketioJwt.authorize({
        //this secret should be same as the one used in expressKS
        secret: 'SECRET',
        //this is the amount of time sever waits for the jwt token from the client
        //after this the server issues a disconnect form the session
        timeout: 15000
      })).on('authenticated', function(socket) {
        //this socket is authenticated, we are good to handle more events from it.
        console.log('this is the decoded token: ', socket.decoded_token)
        console.log('hello! ' + socket.decoded_token.username);

      });
};
