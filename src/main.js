import Phaser from './lib/phaser.js';
import LandingScene from './scenes/LandingScene.js';

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true
    }
  },
  scene: [LandingScene]
});
