import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.state = {};
    }

    preload() {
        this.load.spritesheet("character", "assets/spritesheets/character1.png", {
            frameWidth: 896,  
            frameHeight: 896   
        });
        this.load.image("mainroom", "assets/backgrounds/background.png");
    }

    create() {
        const scene = this;
        let bg = this.add.image(0, 0, "mainroom").setOrigin(0);
        bg.setScale(0.2);

        this.socket = io();
        scene.scene.launch("WaitingRoom", { socket: scene.socket });

        this.otherPlayers = this.physics.add.group();
        this.cursors = this.input.keyboard.createCursorKeys(); // Arrow key input

        this.socket.on("setState", function (state) {
            const { roomKey, players, numPlayers } = state;
            scene.physics.resume();
            scene.state.roomKey = roomKey;
            scene.state.players = players;
            scene.state.numPlayers = numPlayers;
        });

        this.socket.on("currentPlayers", function (args) {
            const { players, numPlayers } = args;
            scene.state.numPlayers = numPlayers;
            Object.keys(players).forEach(function (id) {
                if (players[id].playerid === scene.socket.id) {
                    scene.addPlayer(scene, players[id]);
                } else {
                    scene.addOtherPlayers(scene, players[id]);
                }
            });
        });

        this.socket.on("newPlayer", function (arg) {
            const { playerInfo, numPlayers } = arg;
            scene.addOtherPlayers(scene, playerInfo);
            scene.state.numPlayers = numPlayers;
        });
        this.socket.on("playerMoved", function(playerInfo){
            scene.otherPlayers.getChildren().forEach(function(otherPlayer){
                if(playerInfo.playerId === otherPlayer.playerId){
                    const oldX = otherPlayer.x;
                    const oldY = otherPlayer.y;
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                }
            });
        });
    }

    addPlayer(scene, playerInfo) {
        scene.joined = true;
        scene.character = scene.physics.add.sprite(
            playerInfo.x, playerInfo.y, "character", 0  
        ).setOrigin(0.5, 0.5).setSize(30, 40).setOffset(0, 24).setScale(0.1);

        scene.character.setCollideWorldBounds(true); // Prevent moving outside the screen
        scene.physics.world.setBounds(0, 0, 800, 600); // Set world boundaries
    }

    addOtherPlayers(scene, playerInfo) {
        const otherPlayer = scene.add.sprite(
            playerInfo.x + 40, playerInfo.y + 40, "character", 0  
        ).setScale(0.1);
        otherPlayer.playerId = playerInfo.playerId;
        scene.otherPlayers.add(otherPlayer);
    }

    update() {
        const scene = this;
        if (!this.joined || !this.character) return; // Prevent errors before joining

        const speed = 200;
        this.character.setVelocity(0); // Reset velocity before applying movement

        if (this.cursors.left.isDown) {
            this.character.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.character.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.character.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.character.setVelocityY(speed);
        }

        this.character.body.velocity.normalize().scale(speed);

        var x = this.character.x;
        var y = this.character.y;
        
        if(
            this.character.oldPosition && (x !== this.character.oldPosition.x ||
                y != this.character.oldPosition.y
            )
        ){
            this.moving = true;
            this.socket.emit("playerMovement", {
                x: this.character.x,
                y: this.character.y,
                roomKey: scene.state.roomKey,
            });
        }

        this.character.oldPosition = {
            x: this.character.x,
            y: this.character.y,
            rotation: this.character.rotation,
        };
        
        
    }
}
