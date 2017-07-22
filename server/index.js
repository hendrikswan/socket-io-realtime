const r = require('rethinkdb');
const io = require('socket.io')();

function createDrawing({ connection, name }) {
  return r.table('drawings')
  .insert({
    name,
    timestamp: new Date(),
  })
  .run(connection)
  .then(() => console.log('created a new drawing with name ', name));
}

function subscribeToDrawings({ client, connection }) {
  r.table('drawings')
  .changes({ include_initial: true })
  .run(connection)
  .then((cursor) => {
    cursor.each((err, drawingRow) => client.emit('drawing', drawingRow.new_val));
  });
}


r.connect({
  host: 'localhost',
  port: 28015,
  db: 'awesome_whiteboard_2'
}).then((connection) => {
  io.on('connection', (client) => {
    client.on('createDrawing', ({ name }) => {
      createDrawing({ connection, name });
    });

    client.on('subscribeToDrawings', () => subscribeToDrawings({
      client,
      connection,
    }));



    client.on('subscribeToTimer', (interval) => {
      // console.log('client is subscribing to timer with interval ', interval);
      // setInterval(() => {
      //   client.emit('timer', new Date());
      // }, interval);
      return r.table('timers')
      .changes()
      .run(connection)
      .then((cursor) => {
        cursor.each((err, timerRow) => {
          client.emit('timer', timerRow.new_val.timestamp);
        });
      });
    });

  });
});


const port = 8000;
io.listen(port);
console.log('listening on port ', port);

