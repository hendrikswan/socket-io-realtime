import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

function subscribeToDrawings(cb) {
  socket.on('drawing', drawing => cb(null, drawing));
  socket.emit('subscribeToDrawings');
}


function createDrawing(name) {
  socket.emit('createDrawing', { name });
}

export {
  subscribeToTimer,
  createDrawing,
  subscribeToDrawings,
};