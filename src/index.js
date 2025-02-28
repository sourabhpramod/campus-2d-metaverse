/** @type {import("../typings/phaser")} */
/* The above loads the phaser.d.ts file so that VSCode has autocomplete for the Phaser API.
If you experience problems with autocomplete, try opening the phaser.d.ts file and scrolling up and down in
it.

That may fix the problem -- some weird quirk with VSCode. A new typing file is released with
every new release of Phaser. Make sure it's up-to-date!

At some point, the typings will
be officially added to the official release so that all you'll have to do is do:

npm install @types/phaser

But this hasn't happened yet!
*/

import "phaser";
import config from "./config/config";
import WaitingRoom from "./scenes/WaitingRoom"
import MainScene from "./scenes/Mainscene";

class Game extends Phaser.Game{
    constructor(){
        super(config);
        this.scene.add("MainScene", MainScene);
        this.scene.add("WaitingRoom", WaitingRoom);
        this.scene.start("MainScene");
    }
}

window.onload = function(){
    window.game = new Game();
};