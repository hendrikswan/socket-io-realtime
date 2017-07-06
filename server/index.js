const io = require('socket.io')();

const port = process.argv[2] || 8000;

io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
});

io.listen(port);

console.log('listening on port ', port);

