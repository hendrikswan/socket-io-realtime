import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';
const socket = openSocket('http://localhost:8000');

function subscribeToDrawings(cb) {
  //todo: don't use node style callbacks
  socket.on('drawing', drawing => cb(null, drawing));
  socket.emit('subscribeToDrawings');
}

function createDrawing(name) {
  socket.emit('createDrawing', { name });
}

function publishLine({ drawingId, line }) {
  socket.emit('publishLine', { drawingId, ...line });
}

function subscribeToDrawingLines(drawingId, cb) {

  const lineStream = Rx.Observable.fromEventPattern(
    h => socket.on(`drawingLine:${drawingId}`, h),
    h => socket.off(`drawingLine:${drawingId}`, h),
  );

  const bufferedTimeStream = lineStream
  .bufferTime(100)
  .map(lines => ({ lines }));

  bufferedTimeStream.subscribe(linesEvent => cb(linesEvent));
  socket.emit('subscribeToDrawingLines', drawingId);
}

function subscribeToConnectionEvent(cb) {
  socket.on('connect', () => cb('connected'));
  socket.on('disconnect', () => cb('disconnected'));
  socket.on('connect_error', () => cb('disconnected'));
}

export {
  publishLine,
  createDrawing,
  subscribeToDrawings,
  subscribeToDrawingLines,
  subscribeToConnectionEvent,
};