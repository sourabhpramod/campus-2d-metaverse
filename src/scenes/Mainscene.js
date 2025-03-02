import Phaser from "phaser";
export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene");
        this.state={};
    }
    preload(){
        this.load.image("character", "assets/spritesheets/character1.png");

        this.load.image("mainroom", "assets/backgrounds/background.png");
    }
    create(){
        const scene = this;
        let bg = this.add.image(0,0,"mainroom").setOrigin(0);
        bg.setScale(0.2);       
        this.socket=io();
        scene.scene.launch("WaitingRoom", {socket: scene.socket});
        this.otherPlayers = this.physics.add.group();

        this.socket.on("setState", function(state){
            const {roomKey, players, numPlayers} = state;
            scene.physics.resume();
            scene.state.roomKey = roomKey;
            scene.state.players = players;
            scene.state.numPlayers = numPlayers;

        });
        this.socket.on("currentPlayers", function(args){
            const { players, numPlayers} = args;
            scene.state.numPlayers = numPlayers;
            Object.keys(players).forEach(function (id){
                if(players[id].playerid === scene.socket.id){
                    scene.addPlayer(scene, players[id]);
                }else{
                    scene.addOtherPlayers(scene, players[id]);
                }
            });
        });

        this.socket.on("newPlayer", function(arg){
            const { playerInfo, numPlayers } = arg;
            scene.addOtherPlayers(scene, playerInfo);
            scene.state.numPlayers = numPlayers;
        });
    }

    addPlayer(scene, playerInfo){
        scene.joined = true;
        scene.character = scene.physics.add.sprite(
            playerInfo.x, playerInfo.y, "character"
        ).setOrigin(0.5,0.5).setSize(30,40).setOffset(0,24);
    }
    addOtherPlayers(scene, playerInfo){
        const otherPlayer = scene.add.sprite(playerInfo.x + 40, playerInfo.y + 40, "character");
        otherPlayer.playerId = playerInfo.playerId;
        scene.otherPlayers.add(otherPlayer);
    }

    update(){
        
    }
}