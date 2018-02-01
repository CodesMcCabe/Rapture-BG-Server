let Sprite = require('../classes/sprite');
// MAKE SMALLER
const bloodHitSpriteSheet = {
  playerHit: {
    url: 'assets/images/blood_small.png',
    name: 'playerHit',
    frameHeight: 124,
    frameWidth: (763 / 6),
    currentFrame: 0,
    totalFrames: 6,
    once: true,
    fps: 10,
    fpsX: 1,
  },
  // MAKE BLOOD DIFFERENT COLOR
  // USE FULL SIZE MODEL
  monsterHit: {
    url: 'assets/images/blood_small.png',
    name: 'playerHit',
    frameHeight: 124,
    frameWidth: (763 / 6),
    currentFrame: 0,
    totalFrames: 6,
    once: true,
    fps: 10,
    fpsX: 1,
  },
};

const bloodHitSprites = {
  playerHit: new Sprite(bloodHitSpriteSheet.playerHit),
  monsterHit: new Sprite(bloodHitSpriteSheet.monsterHit),
};

module.exports = bloodHitSprites;
