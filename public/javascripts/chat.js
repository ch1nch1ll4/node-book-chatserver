var Chat = (socket) => { //create 'JavaScript class'
  this.socket = socket;
};

Chat.prototype.sendMessage = (room,text) => { //send chat messages
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
};

Chat.prototype.changeRoom = (room) => { //change rooms
  this.socket.emit('join', {newRoom: room});
};

Chat.prototype.processCommand = (command) => { //process chat commands
  var words = command.split(' ');
  var command = words[0]
                  .substring(1, words[0].length)
                  .toLowerCase();
  var message = false;
  switch(command) {
    case 'join':
      words.shift();
      var room = words.join(' ');
      this.changeRoom(room);
      break;

    case 'nick':
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name);
      break;

    default:
      message = 'Unrecognized command.';
      break;
  }

  return message;
};
