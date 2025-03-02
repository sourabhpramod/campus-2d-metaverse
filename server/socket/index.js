const gameRooms = {
  // [roomKey]: {
  // users: [],
  // randomTasks: [],
  // scores: [],
  // gameScore: 0,
  // players: {},
  // numPlayers: 0
  // }
};


module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    socket.on("joinRoom", (roomKey)=>{

      if (!gameRooms[roomKey]) {
        gameRooms[roomKey] = {
          roomKey,
          randomTasks: [],
          gameScore: 0,
          scores: {},
          players: {},
          numPlayers: 0,
        };
      }
     
      socket.join(roomKey);
      const roomInfo = gameRooms[roomKey];
      console.log("roomInfo", roomInfo);
      roomInfo.players[socket.id]={
        rotation: 0,
        x: 400,
        y: 300,
        playerid: socket.id,
      };
      roomInfo.numPlayers = Object.keys(roomInfo.players).length;
      socket.emit("setState", roomInfo);

      io.to(roomKey).emit("currentPlayers", {
        players: roomInfo.players,
        numPlayers: roomInfo.numPlayers,
      });
      
      socket.to(roomKey).emit("newPlayer", {
        playerInfo: roomInfo.players[socket.id],
        numPlayers: roomInfo.numPlayers,
      });
    });

    socket.on("isKeyValid", function (input) {
      const keyArray = Object.keys(gameRooms);
      keyArray
        ? socket.emit("keyIsValid", input)
        : socket.emit("keyNotValid");
    });
    socket.on("getRoomCode", async function () {
      let key = codeGenerator();
      Object.keys(gameRooms).includes(key) ? (key = codeGenerator()) : key;
      gameRooms[key] = {
        roomKey: key,
        randomTasks: [],
        gameScore: 0,
        scores: {},
        players: {},
        numPlayers: 0,
      };
      socket.emit("roomCreated", key);
    });
  });

  function codeGenerator() {
    let code = "";
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

};

