export default {
    type: Phaser.AUTO,
    width: 800, 
    height: 600, 
    render: {
      pixelArt: false,
    },
    scale: {
      parent: "mygame",
      autoCenter: true,
      mode: Phaser.Scale.FIT,
    },
    // We will be expanding physics later
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }, // Game objects will be pulled down along the y-axis
                          // The number 1500 is arbitrary. The higher, the stronger the pull.
                          // A negative value will pull game objects up along the y-axis
        debug: false, // Whether physics engine should run in debug mode
      },
    },
    dom: {
      createContainer: true,
    },
    scene: [],
  };