class GameEngine {
    constructor(scene) {
        this.scene = scene;
        this.gravity = 200;
        this.thrust = 300;
        this.boost = 500;
        this.rotationSpeed = 150; // Degrees per second for rotation
        this.rocketLanded = false;
        this.currentAngularVelocity = 0;
        // Optional: Fuel system
        // this.fuel = 1000; // Initial fuel amount
        // this.fuelConsumptionRate = 1; // Fuel consumed per frame when boosting
    }

    /**
     * Updates the rocket's physics based on input.
     * @param {Phaser.Physics.Arcade.Sprite} rocket - The rocket sprite.
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors - Cursor keys input.
     * @param {boolean} boostActive - Indicates if boost is active.
     */
    updateRocket(rocket, cursors, boostActive) {
        if (this.rocketLanded) return;

        let currentThrust = boostActive ? this.boost : this.thrust;

        // Optional: Fuel consumption
        /*
        if (boostActive && this.fuel > 0) {
            currentThrust = this.boost;
            this.fuel -= this.fuelConsumptionRate;
            if (this.fuel < 0) this.fuel = 0;
        } else {
            currentThrust = this.thrust;
        }
        */

        // Calculate thrust vector based on rocket's angle
        const angleRadians = Phaser.Math.DegToRad(rocket.angle);
        const thrustVector = {
            x: Math.sin(angleRadians) * currentThrust,
            y: Math.cos(angleRadians) * currentThrust
        };

        // Apply thrust opposing gravity
        rocket.setAccelerationY(this.gravity - thrustVector.y);
        rocket.setAccelerationX(thrustVector.x);

        // Handle smooth rotation ONLY if boost is active
        if (boostActive) {
            if (cursors.left.isDown) {
                this.currentAngularVelocity = -this.rotationSpeed;
            } else if (cursors.right.isDown) {
                this.currentAngularVelocity = this.rotationSpeed;
            } else {
                this.currentAngularVelocity = 0;
            }
        } else {
            // Reset angular velocity when boost is not active
            this.currentAngularVelocity = 0;
        }

        rocket.setAngularVelocity(this.currentAngularVelocity);

        // Optional: Limit maximum velocity for realism
        const maxVelocity = 300;
        if (rocket.body.velocity.x > maxVelocity) {
            rocket.body.velocity.x = maxVelocity;
        } else if (rocket.body.velocity.x < -maxVelocity) {
            rocket.body.velocity.x = -maxVelocity;
        }

        if (rocket.body.velocity.y > maxVelocity) {
            rocket.body.velocity.y = maxVelocity;
        } else if (rocket.body.velocity.y < -maxVelocity) {
            rocket.body.velocity.y = -maxVelocity;
        }

        // Optional: Update fuel display
        // this.scene.fuelText.setText(`Fuel: ${this.fuel}`);
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
