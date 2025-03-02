import Phaser from "phaser";

export default class WaitingRoom extends Phaser.Scene {
  constructor() {
    super("WaitingRoom");
    this.state = {};
    this.hasBeenSet = false;
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    this.load.html("codeform", "assets/text/codeform.html");
  }

  create() {
    const scene = this;

    // Background gradient
    scene.cameras.main.setBackgroundColor("#0c0c14");

    scene.popUp = scene.add.graphics();
    scene.boxes = scene.add.graphics();

    // Popup window styles
    scene.popUp.fillStyle(0x1e1e2e, 0.95);
    scene.popUp.fillRoundedRect(25, 25, 750, 500, 20);

    // Title text
    scene.title = scene.add.text(100, 75, "Campus EduVerse", {
      fill: "#ffffff",
      fontSize: "66px",
      fontFamily: "Arial Black, sans-serif",
      fontStyle: "bold",
      shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 4, fill: true },
    });

    // Button Styles
    const buttonStyle = {
      fill: "#ffffff",
      fontSize: "20px",
      fontFamily: "Arial, sans-serif",
      fontStyle: "bold",
    };

    // Left popup (Request Room Key)
    scene.boxes.fillStyle(0x6c5ce7, 1);
    scene.boxes.fillRoundedRect(100, 200, 275, 100, 15);
    scene.requestButton = scene.add.text(140, 240, "Request Room Key", buttonStyle).setOrigin(0, 0.5);

    // Right popup (Enter Room Key)
    scene.boxes.fillStyle(0x311b92, 1);
    scene.boxes.fillRoundedRect(425, 200, 275, 100, 15);
    scene.inputElement = scene.add.dom(562.5, 250).createFromCache("codeform");

    scene.inputElement.addListener("click");
    scene.inputElement.on("click", function (event) {
      if (event.target.name === "enterRoom") {
        const input = scene.inputElement.getChildByName("code-form");
        scene.socket.emit("isKeyValid", input.value);
      }
    });

    // Button interaction
    scene.requestButton.setInteractive();
    scene.requestButton.on("pointerdown", () => {
      scene.socket.emit("getRoomCode");
    });

    scene.requestButton.setStyle({
      fill: "#ffffff",
      backgroundColor: "#6c5ce7",
      padding: { x: 10, y: 5 },
    });

    scene.requestButton.on("pointerover", () => {
      scene.requestButton.setStyle({ fill: "#311b92" });
    });
    scene.requestButton.on("pointerout", () => {
      scene.requestButton.setStyle({ fill: "#ffffff" });
    });

    // Error and Room Key Texts
    scene.notValidText = scene.add.text(670, 295, "", {
      fill: "#ff4c4c",
      fontSize: "15px",
      fontFamily: "Arial, sans-serif",
    });

    scene.roomKeyText = scene.add.text(210, 250, "", {
      fill: "#00ff00",
      fontSize: "22px",
      fontStyle: "bold",
      fontFamily: "Arial, sans-serif",
    });

    // Socket Events
    scene.socket.on("roomCreated", function (roomKey) {
      scene.roomKey = roomKey;
      scene.roomKeyText.setText(scene.roomKey);
    });

    scene.socket.on("keyNotValid", function () {
      scene.notValidText.setText("Invalid Room Key");
    });

    scene.socket.on("keyIsValid", function (input) {
      scene.socket.emit("joinRoom", input);
      scene.scene.stop("WaitingRoom");
    });
  }
  update() {}
}