let Sprite = require('../classes/sprite');
// IF BLANK RENDER BEFORE SPRITE, NEED TO RESET SHIFT TO 0!!
const bulletSpriteSheet = {
  rifle: {
    url: 'assets/images/bullet_horz.png',
    name: 'rifle',
    frameHeight: 6,
    frameWidth: 14,
    damage: 10,
  },

  nomad: {
    url: 'assets/images/bullet_horz_nomad.png',
    name: 'nomad',
    frameHeight: 6,
    frameWidth: 14,
    damage: 500,
  },

  monster: {
    url: 'assets/images/mon_bullet_vert.png',
    name: 'monster',
    frameHeight: 32,
    frameWidth: 9,
    damage: 10,
  },
};

const bulletSprites = {
  rifle: new Sprite(bulletSpriteSheet.rifle),
  monster: new Sprite(bulletSpriteSheet.monster),
  nomad: new Sprite(bulletSpriteSheet.nomad)
};

module.exports = bulletSprites;
