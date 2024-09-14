import Phaser from '../lib/phaser.js';
import GameEngine from '../game/GameEngine.js';

export default class LandingScene extends Phaser.Scene {
    constructor() {
        super('LandingScene');
    }

    preload() {
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('flame', 'assets/flame-low.png');
    }

    create() {
        this.ground = this.add.tileSprite(400, 580, 800, 40, 'ground');
        this.rocket = this.physics.add.sprite(400, 100, 'rocket').setScale(0.5);
        
        // Calculate flame offset based on rocket's height
        this.rocketFlameOffset = this.rocket.height / 3.5;

        // Initialize flame sprite positioned below the rocket
        this.flame = this.add.sprite(this.rocket.x, this.rocket.y + this.rocketFlameOffset, 'flame').setVisible(false);

        this.rocket.setCollideWorldBounds(true);
        this.physics.add.collider(this.rocket, this.ground, this.landRocket, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.input.on('pointerdown', this.startThrust, this);
        this.input.on('pointerup', this.stopThrust, this);

        this.gameEngine = new GameEngine(this);
    }

    update() {
        // Determine if boost (Shift key) is active
        const boostActive = this.shiftKey.isDown;

        // Show/flame is visible when boosting
        if (boostActive) {
            this.flame.setVisible(true);
            this.flame.x = this.rocket.x;
            this.flame.y = this.rocket.y + this.rocketFlameOffset;
        } else {
            this.flame.setVisible(false);
        }

        // Update rocket physics with the boost flag
        this.gameEngine.updateRocket(this.rocket, this.cursors, boostActive);
    }

    startThrust(pointer) {
        if (pointer.x < this.game.config.width / 2) {
            this.rocket.setAngularVelocity(-150);
        } else {
            this.rocket.setAngularVelocity(150);
        }
    }

    stopThrust() {
        this.rocket.setAngularVelocity(0);
    }

    landRocket(rocket, ground) {
        this.gameEngine.landRocket(rocket, ground);
    }
}
