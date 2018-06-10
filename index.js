const app = require('express')();
const fs = require('fs');
const net = require('net');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));
const formatter = require('./lib/formatter');
const alias     = require('./lib/alias');
const createResponse = (command, data) => {
  return { command: command, data: data }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  const mud = net.createConnection(config.port, config.host);
  mud.setEncoding('utf8');
  console.log("connected");
  
  mud.addListener('data', (data) => {
    const formatted = formatter.go(data);
    const splitted = formatted.split("<br>");
    let i = 0;
    console.log("data: ", formatted);
    
    //for (;i < splitted.length;i++) {
    //  socket.emit('message', createResponse('update', splitted[i]));
    //}
    
    socket.emit('message', createResponse('update', formatted))

  })  
  
  /*
  socket.on('message', (msg) => {
    console.log("received: ", msg);
    io.emit('message', msg);
  });
  */
  socket.on('command', (data) => {    
    if (data.match(/^;alias add/i)) {
      alias.create(data)
    } else if (data.match(/^;alias ls/i)) {
      socket.send(createResponse('listAliases', alias.list()))
    } else if (data.match(/^;alias rm/i)) {
      alias.remove(data)
    }    else {
      mud.write(alias.format(data))
    }
  });          
});

/*

  socket.on('message', function(data) {

      mud.write(alias.format(data))
    }
  })
})
*/

http.listen(port, () => {
  console.log('listening on *:' + port);
});
