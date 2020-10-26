var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//app.use(cors());

const users = {}; 

io.on('connection', function(socket) {
    socket.on('new-user-joined', function(name){
        //if(name != null){
         console.log("new user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
        //}

    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message , name: users[socket.id]})
    });

    socket.on('disconnect', name =>{
        
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
        
    });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
