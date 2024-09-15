import Phaser from '../lib/phaser.js';
import GameEngine from '../game/GameEngine.js';

export default class LandingScene extends Phaser.Scene {
    static MESSAGE_DURATION = 3000; // Duration in milliseconds
    static MAX_LANDING_ANGLE = 5;   // Maximum angle in degrees for successful landing

    constructor() {
        super('LandingScene');
        this.boostActive = false; // Initialize boostActive as a class property

        // Flame offset
        this.flameOffset = 160;

        // State Tracking
        this.hasLaunched = false;     // To ensure launch message is shown only once per launch
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
        this.rocket = this.physics.add.sprite(400, 500, 'rocket').setScale(0.5);

        // Center of the rocket sprite (pivot at center)
        this.rocket.setOrigin(0.5, 0.5);

        this.rocket.setCollideWorldBounds(true);

        // Initialize GameEngine before setting up collider
        this.gameEngine = new GameEngine(this);

        // Bind the collision callback to LandingScene's handleLanding method
        this.physics.add.collider(this.rocket, this.ground, this.handleLanding.bind(this), null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Pointer (mouse/touchpad) input handlers
        this.input.on('pointerdown', this.startThrust, this);
        this.input.on('pointerup', this.stopThrust, this);

        // Add a flame sprite for thrust
        this.flame = this.add.sprite(400, 500, 'flame').setScale(0.75).setVisible(true);
        this.flame.setOrigin(0.5, 0.5);
        this.flameOffset = 160;

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

        // Add message text object (initially invisible)
        this.messageText = this.add.text(400, 300, '', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 10, y: 10 },
            align: 'center',
        }).setOrigin(0.5).setVisible(false);
    }

    update() {
        // Determine if boost (Shift key) is active
        const previousBoost = this.boostActive;
        this.boostActive = this.shiftKey.isDown;

        // Detect launch initiation
        if (this.boostActive && !previousBoost && !this.hasLaunched) {
            this.hasLaunched = true;
            this.showMessage("Liftoff! The rocket soars into the sky.");
        }

        // Show flame when boosting
        if (this.boostActive) {
            this.flame.setVisible(true);

            // Convert rocket's angle from degrees to radians
            const angle = Phaser.Math.DegToRad(this.rocket.angle);

            // Set flame rotation to match the rocket's angle
            this.flame.rotation = angle;

            // Calculate the new position for the flame
            // **Adjusted:** Swapped sin and cos, inverted x offset
            this.flame.x = this.rocket.x + this.flameOffset * Math.sin(-angle);
            this.flame.y = this.rocket.y + this.flameOffset * Math.cos(angle);

            // Slightly larger when boosting
            this.rocket.setScale(Phaser.Math.Linear(this.rocket.scaleX, 0.52, 0.01));
        } else {
            this.flame.setVisible(false);

            // Reset scale when not boosting
            this.rocket.setScale(Phaser.Math.Linear(this.rocket.scaleX, 0.5, 0.01));
        }

        // Update rocket physics with the boost flag
        this.gameEngine.updateRocket(this.rocket, this.cursors, this.boostActive);

        // Optional: Update fuel display
        // this.fuelText.setText(`Fuel: ${this.gameEngine.fuel}`);
    }

    /**
     * Handles the collision between the rocket and the ground.
     * @param {Phaser.Physics.Arcade.Sprite} rocket 
     * @param {Phaser.Physics.Arcade.Sprite} ground 
     */
    handleLanding(rocket, ground) {
        const outcome = this.gameEngine.determineLandingOutcome(rocket, ground);

        if (outcome === 'success') {
            this.showMessage("Perfect landing! The rocket has returned safely.");
            // Optionally, you can halt the game or proceed to another scene
        } else if (outcome === 'failure') {
            this.showMessage("Touchdown unsuccessful. The rocket has crash-landed.");
            // Restart the scene after a delay
            this.time.delayedCall(2000, () => {
                this.scene.restart();
            }, [], this);
        } else if (outcome === 'already_landed') {
            // Optional: Handle cases where landing has already been processed
            console.log('Landing already processed.');
        }
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

    /**
     * Displays a message on the screen for a specified duration.
     * @param {string} text - The message to display.
     */
    showMessage(text) {
        // Set the message text
        this.messageText.setText(text);

        // Make the message visible
        this.messageText.setVisible(true);

        // Clear any existing timed events for hiding the message
        if (this.hideMessageEvent) {
            this.hideMessageEvent.remove(false);
        }

        // Set a timed event to hide the message after MESSAGE_DURATION
        this.hideMessageEvent = this.time.delayedCall(
            LandingScene.MESSAGE_DURATION,
            () => {
                this.messageText.setVisible(false);
            },
            [],
            this
        );
    }
}
