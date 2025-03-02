import Phaser from "phaser";
export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene");
    }
    preload(){
        this.load.spritesheet("character", "assets/spritesheets/character1.png",{
             frameWidth: 29,
             frameHeight: 37,
        });
        this.load.image("mainroom", "assets/backgrounds/background.png");
    }
    create(){
        const scene = this;
        let bg = this.add.image(0,0,"mainroom").setOrigin(0);
        bg.scale=1.25;
        this.socket=io();
        scene.scene.launch("WaitingRoom", {socket: scene.socket});
    }
    update(){
        
    }
}