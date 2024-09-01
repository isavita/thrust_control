import GameEngine from './gameEngine.js';

class LandingScene extends Phaser.Scene {
    constructor() {
        super('LandingScene');
    }

    preload() {
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('ground', 'assets/ground.png');
    }

    create() {
        this.ground = this.add.tileSprite(400, 580, 800, 40, 'ground');
        this.rocket = this.physics.add.sprite(400, 100, 'rocket').setScale(0.5); // Make the rocket smaller

        this.rocket.setCollideWorldBounds(true);
        this.physics.add.collider(this.rocket, this.ground, this.landRocket, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Add touch controls for mobile
        this.input.on('pointerdown', this.startThrust, this);
        this.input.on('pointerup', this.stopThrust, this);

        this.gameEngine = new GameEngine(this);
    }

    update() {
        this.gameEngine.updateRocket(this.rocket, this.cursors, this.input);
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

export default LandingScene;
