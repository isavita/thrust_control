import Phaser from '../lib/phaser.js';
import GameEngine from '../game/GameEngine.js';

export default class LandingScene extends Phaser.Scene {
    constructor() {
        super('LandingScene');
        this.boostActive = false; // Initialize boostActive as a class property
    }

    preload() {
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('flame', 'assets/flame-low.png');
        // If adding flame animation
        // this.load.spritesheet('flame', 'assets/flame-animated.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.ground = this.add.tileSprite(400, 580, 800, 40, 'ground');
        this.rocket = this.physics.add.sprite(400, 100, 'rocket').setScale(0.5);

        // Center of the rocket sprite (assuming pivot is at center)
        this.rocket.setOrigin(0.5, 0.5);

        this.rocket.setCollideWorldBounds(true);
        this.physics.add.collider(this.rocket, this.ground, this.landRocket, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Pointer (mouse/touchpad) input handlers
        this.input.on('pointerdown', this.startThrust, this);
        this.input.on('pointerup', this.stopThrust, this);

        this.gameEngine = new GameEngine(this);

        // Add a flame sprite for thrust
        this.flame = this.add.sprite(0, 0, 'flame').setVisible(false);
        this.flame.setOrigin(0.5, 0); // Align top center of flame with rocket's base

        // Optional: Add flame animation
        /*
        this.anims.create({
            key: 'flameAnim',
            frames: this.anims.generateFrameNumbers('flame', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        */

        // Optional: Add fuel display
        /*
        this.fuelText = this.add.text(10, 10, 'Fuel: 1000', { font: '16px Arial', fill: '#ffffff' });
        */
    }

    update() {
        // Determine if boost (Shift key) is active
        this.boostActive = this.shiftKey.isDown;

        // Show flame when boosting
        if (this.boostActive) {
            this.flame.setVisible(true);
            // Calculate flame position based on rocket's angle and size
            const flameOffset = {
                x: Math.sin(Phaser.Math.DegToRad(this.rocket.angle)) * (this.rocket.height / 2),
                y: Math.cos(Phaser.Math.DegToRad(this.rocket.angle)) * (this.rocket.height / 2)
            };
            this.flame.x = this.rocket.x + flameOffset.x;
            this.flame.y = this.rocket.y + flameOffset.y;
            this.flame.rotation = Phaser.Math.DegToRad(this.rocket.angle);
            
            // Play flame animation if implemented
            // this.flame.play('flameAnim');

            // Optional: Visual feedback (e.g., scaling)
            this.rocket.setScale(0.505); // Slightly larger when boosting
        } else {
            this.flame.setVisible(false);
            // Stop flame animation if implemented
            // this.flame.stop();

            // Reset scale when not boosting
            this.rocket.setScale(0.5);
        }

        // Update rocket physics with the boost flag
        this.gameEngine.updateRocket(this.rocket, this.cursors, this.boostActive);

        // Optional: Update fuel display
        // this.fuelText.setText(`Fuel: ${this.gameEngine.fuel}`);
    }

    /**
     * Handles pointer (mouse/touchpad) down events to initiate thrust.
     * Only applies rotation if boost is active.
     * @param {Phaser.Input.Pointer} pointer
     */
    startThrust(pointer) {
        if (!this.boostActive) return; // Only rotate if boost is active

        if (pointer.x < this.game.config.width / 2) {
            this.rocket.setAngularVelocity(-150);
        } else {
            this.rocket.setAngularVelocity(150);
        }
    }

    /**
     * Handles pointer (mouse/touchpad) up events to stop thrust.
     * Only stops rotation if boost is active.
     */
    stopThrust() {
        if (!this.boostActive) return; // Only stop rotation if boost is active
        this.rocket.setAngularVelocity(0);
    }

    landRocket(rocket, ground) {
        this.gameEngine.landRocket(rocket, ground);
    }
}
