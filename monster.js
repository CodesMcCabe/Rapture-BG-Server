// MONSTER WILL CHASE PLAYER, TAKE SHORTEST ROUTE IF POSSIBLE
let spriteSheet = require('./monster_sprites');
let Sprite = require('./sprite');

class Monster {
  constructor (ctx, canvasW, canvasH, options) {
    // this.name = options.name;
    // this.power = options.power;
    // this.sprite = options.sprite;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.coordinates = [750, 350];
    // this.currentSprite = 'assets/images/bossworm_front.png';
    // debugger
    this.currentSprite = 'assets/images/worm_intro.png';
    this.sprite = 'intro';
    this.frameWidth = 153;
    this.frameHeight = 166;
    this.currentFrame = 0;
    this.shift = 0;
    this.totalFrames = 16;
    // HITBOX
    this.height = 106;
    this.width = 115;
    this.health = 100;
    this.alive = true;
    this.once = true;
    this.delay = 100;
    this.lastTime = 0;
    this.fps = 50;
    this.acDelta = 0;

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
    // compare the last time it updated to the frames
    // if the lastTime is 0 then set it to Date now
    // then we have something to care to and run the code

    // if it does not meet our criteria we just skip render
    // console.log(this.lastUpdate - now);
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite;
    this.ctx.drawImage(monsterSprite, this.shift, 0, this.frameWidth,
      this.frameHeight, 750, 350, this.frameWidth, this.frameHeight);


    if (now - this.lastUpdate > 80) {
      this.lastUpdate = now;
      this.shift += this.frameWidth + 1;

      if (this.currentFrame === this.totalFrames) {
        this.shift = 0;
        this.currentFrame = 0;
      }
      
      this.currentFrame++;
    }
  }

  update(delta) {
    if (!this.alive) {
      this.currentSprite = 'assets/images/boss_die.png';
      return null;
    }

    // if(this.shift !== 0) {
    //   this.currentFrame++;
    // }

    // if (this.currentFrame !== 0) {
    //   if (Date.now() - lastTime > 100) {
    //     this.currentFrame++;
    //   }
    // } else {
    //   this.currentFrame ++;
    // }

    const keys = [37, 38, 39, 40];
    const random = Math.floor(Math.random() * (keys.length - 1));
    const key = keys[random];
    const spriteHeight = 125;

    if(key === 37) {
      this.currentSprite = 'assets/images/bossworm_front.png';
      if (this.coordinates[0] >= 0) {this.coordinates[0]+=10;}
    }
    if(key === 38) {
      this.currentSprite = 'assets/images/bossworm_front.png';
      if (this.coordinates[1] >= 0) {this.coordinates[1]-=10;}
    }
    if(key === 39) {
      this.currentSprite = 'assets/images/bossworm_front.png';
      if (this.coordinates[0] <= (this.canvasW - spriteHeight))
      {this.coordinates[0]-=10;}
    }
    if(key === 40) {
      this.currentSprite = 'assets/images/bossworm_front.png';
      if (this.coordinates[1] <= (this.canvasH - spriteHeight))
      {this.coordinates[1]+=10;}
    }
  }

  // set new image and then call src on that image path
  //

}

module.exports = Monster;
