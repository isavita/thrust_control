class GameEngine {
    constructor(scene) {
        this.scene = scene;
        this.gravity = 200;
        this.thrust = 300;
        this.rocketLanded = false;
    }

    updateRocket(rocket, cursors, input) {
        if (this.rocketLanded) return;

        rocket.setAccelerationY(this.gravity);

        if (cursors.up.isDown || input.activePointer.isDown) {
            rocket.setAccelerationY(this.gravity - this.thrust);
        }

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
