class GameEngine {
    constructor(scene) {
        this.scene = scene;
        this.gravity = 200;
        this.thrust = 300;
        this.boost = 500;
        this.rocketLanded = false;
    }

    /**
     * Updates the rocket's physics based on input.
     * @param {Phaser.Physics.Arcade.Sprite} rocket - The rocket sprite.
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors - Cursor keys input.
     * @param {boolean} boostActive - Indicates if boost is active.
     */
    updateRocket(rocket, cursors, boostActive) {
        if (this.rocketLanded) return;

        let currentThrust = this.thrust;

        // Determine thrust based on boost status
        if (boostActive) {
            currentThrust = this.boost;
        }

        // Apply upward acceleration (opposite to gravity)
        rocket.setAccelerationY(this.gravity - currentThrust);

        // Rotate rocket based on horizontal movement
        if (cursors.left.isDown) {
            rocket.setAngularVelocity(-150);
        } else if (cursors.right.isDown) {
            rocket.setAngularVelocity(150);
        } else {
            rocket.setAngularVelocity(0);
        }
    }

    landRocket(rocket, ground) {
        if (rocket.body.velocity.y < 50 && Math.abs(rocket.angle) < 10) {
            this.rocketLanded = true;
            rocket.setVelocity(0);
            rocket.setAcceleration(0);
            rocket.setAngularVelocity(0);
            rocket.setAngle(0);
            console.log('Rocket landed successfully!');
        } else {
            console.log('Crash landing!');
            this.scene.scene.restart();
        }
    }
}

export default GameEngine;
