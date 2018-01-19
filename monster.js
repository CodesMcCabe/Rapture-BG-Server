// MONSTER WILL CHASE PLAYER, TAKE SHORTEST ROUTE IF POSSIBLE
let spriteSheet = require('./monster_sprites');
let Sprite = require('./sprite');

class Monster {
  constructor (ctx, canvasW, canvasH, sprite) {
    // this.name = options.name;
    // this.power = options.power;
    // this.sprite = options.sprite;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.coordinates = [700, 300];
    this.currentSprite = sprite;
    this.shift = 0;
    this.health = 100;
    this.alive = true;
    this.lastUpdate = Date.now();
  }

  defeated () {
    this.alive = false;
  }

  reduceHealth (bullet) {
    this.health -= bullet.damage;
  }

  // createSprite(sprite) {
  //   if (sprite !== this.currentSprite) {
  //     this.currentSprite = new Sprite(sprite);
  //   }
  // }

  render(now) {
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite.url;
    this.ctx.drawImage(monsterSprite, this.shift, 0,
      this.currentSprite.frameWidth, this.currentSprite.frameHeight,
      this.coordinates[0], this.coordinates[1], this.currentSprite.frameWidth,
      this.currentSprite.frameHeight);

    if (now - this.lastUpdate > this.currentSprite.fps) {
      this.lastUpdate = now;
      this.shift += this.currentSprite.frameWidth + 1;

      if (this.currentSprite.currentFrame === this.currentSprite.totalFrames &&
        this.currentSprite.name === 'intro') {
        // this.currentSprite = 'assets/images/worm_idle.png';
        // this.s = 'idle';
        this.shift = 0;
        this.currentSprite.currentFrame = 0;
      } else if (this.currentSprite.currentFrame ===
        this.currentSprite.totalFrames) {

        this.shift = 0;
        this.currentSprite.currentFrame = 0;
      }

      this.currentSprite.currentFrame++;
    }
  }

  update(delta) {
    if (!this.alive) {
      this.currentSprite = 'assets/images/boss_die.png';
      return null;
    }

    const keys = [37, 38, 39, 40];
    const random = Math.floor(Math.random() * (keys.length - 1));
    const key = keys[random];
    const spriteHeight = 125;

    // if(key === 37) {
    //   this.currentSprite = 'assets/images/bossworm_front.png';
    //   if (this.coordinates[0] >= 0) {this.coordinates[0]+=10;}
    // }
    // if(key === 38) {
    //   this.currentSprite = 'assets/images/bossworm_front.png';
    //   if (this.coordinates[1] >= 0) {this.coordinates[1]-=10;}
    // }
    // if(key === 39) {
    //   this.currentSprite = 'assets/images/bossworm_front.png';
    //   if (this.coordinates[0] <= (this.canvasW - spriteHeight))
    //   {this.coordinates[0]-=10;}
    // }
    // if(key === 40) {
    //   this.currentSprite = 'assets/images/bossworm_front.png';
    //   if (this.coordinates[1] <= (this.canvasH - spriteHeight))
    //   {this.coordinates[1]+=10;}
    // }
  }

  // set new image and then call src on that image path
  //

}

module.exports = Monster;
