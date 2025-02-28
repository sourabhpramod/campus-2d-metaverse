module.exports = (io) => {
    io.on("connection", (socket) => {
      console.log("A user connected");
  
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
  
      // Add your Socket.IO event handlers here
      socket.on("chat message", (msg) => {
        io.emit("chat message", msg); // Broadcast message to all connected clients
      });
    });
  };


  //DUMMY FILE RUN CHEYYAN VENDI ADD AAKKIYATHA