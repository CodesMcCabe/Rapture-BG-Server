// MONSTER WILL CHASE PLAYER, TAKE SHORTEST ROUTE IF POSSIBLE
let monsterSprites = require('./monster_sprites');
let Sprite = require('./sprite');

class Monster {
  constructor (ctx, canvasW, canvasH, sprite) {
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.coordinates = [700, 300];
    this.currentSprite = sprite;
    this.shift = 0;
    this.health = 2000;
    this.alive = true;
    this.lastUpdate = Date.now();
    this.gameOver = false;

    this.targetPos = [];
    this.interval = null;
    this.counter = 0;
    this.finalPlayerPos = [];
  }

  defeated () {
    this.alive = false;
  }

  reduceHealth (bullet) {
    this.health -= bullet.damage;
  }

  render(now) {
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite.url;
    this.ctx.drawImage(monsterSprite, this.shift, 0,
      this.currentSprite.frameWidth, this.currentSprite.frameHeight,
      this.coordinates[0], this.coordinates[1], this.currentSprite.frameWidth,
      this.currentSprite.frameHeight);

    let fps = this.currentSprite.fps * this.currentSprite.fpsX;
    if (now - this.lastUpdate > fps && !this.gameOver)  {
      this.currentSprite.fps = fps;
      this.lastUpdate = now;
      this.shift = this.currentSprite.currentFrame *
      this.currentSprite.frameWidth;

      if (this.currentSprite.currentFrame === this.currentSprite.totalFrames &&
        this.currentSprite.name === 'intro') {

        this.coordinates = [this.coordinates[0] - 15, this.coordinates[1] + 15];
        this.currentSprite = monsterSprites.idle;
        this.shift = 0;
        this.currentSprite.currentFrame = 0;

      } else if (this.currentSprite.currentFrame ===
        this.currentSprite.totalFrames) {

        this.shift = 0;
        this.currentSprite.currentFrame = 0;
      }
      this.currentSprite.currentFrame += 1;
    }
  }

  findDirectionVector (playerPos) {
    let x = playerPos[0] - this.coordinates[0];
    let y = playerPos[1] - this.coordinates[1];
    return [x, y];
  }

  findMagnitude (x, y) {
    let magnitude = Math.sqrt(x * x + y * y);
    return magnitude;
  }
  normalizeVector (playerDir, magnitude) {
    return [(playerDir[0]/magnitude), (playerDir[1]/magnitude)];
  }

  chasePlayer (playerPos, delta) {
      let playerDir = this.findDirectionVector(this.finalPlayerPos);
      let magnitude = this.findMagnitude(playerDir[0], playerDir[1]);
      let normalized = this.normalizeVector(playerDir, magnitude);
      let velocity = 2;

      this.coordinates[0] = this.coordinates[0] + (normalized[0] *
        velocity * delta);
      this.coordinates[1] = this.coordinates[1] + (normalized[1] *
        velocity * delta);
  }

  handleIdle () {
      if (this.counter === 200) {
        if (this.targetPos[0] >= this.coordinates[0]) {

          this.currentSprite = monsterSprites.bite_e;
          this.currentSprite.currentFrame = 0;
        } else {
          this.currentSprite = monsterSprites.bite_w;
          this.currentSprite.currentFrame = 0;
        }
        this.counter = 0;
      }
  }

  handleBiteWest (delta) {
    // BINDS FINAL POSITION BEFORE BITE
    if (this.finalPlayerPos.length === 0) {
      this.finalPlayerPos = Object.assign([], this.targetPos);
    }

    if (this.coordinates[0] <= this.finalPlayerPos[0] +50){
      this.currentSprite = monsterSprites.idle;
      this.currentSprite.currentFrame = 0;
      // this.coordinates = [this.finalPlayerPos[0] + 50, this.finalPlayerPos[1] - ];
      this.finalPlayerPos = [];
      this.targetPos = [];
    } else if (this.coordinates[0] >= this.finalPlayerPos[0]) {
      this.chasePlayer(this.finalPlayerPos, delta);
    }
  }

  handleBiteEast (delta) {
    if (this.finalPlayerPos.length === 0) {
      this.finalPlayerPos = Object.assign([], this.targetPos);
    }

    if (this.coordinates[0] >= this.finalPlayerPos[0] -50){
      this.currentSprite = monsterSprites.idle;
      this.currentSprite.currentFrame = 0;
      // this.coordinates = [this.finalPlayerPos[0] -10, this.finalPlayerPos[1]];
      this.finalPlayerPos = [];
      this.targetPos = [];
    } else if (this.coordinates[0] <= this.finalPlayerPos[0]) {
      this.chasePlayer(this.finalPlayerPos, delta);
    }
  }

  update(playerPos, dt, delta) {
    if (!this.alive) {
      this.currentSprite = monsterSprites.dead;
      return null;
    }
    // TRACKS POSITION OF PLAYER
    if (this.targetPos.length === 0) {
      this.interval = setInterval(() => {
          this.targetPos = Object.assign([], playerPos);
      }, 1000);
  }
    // OFFSET FOR IDLE ANIMATION
    this.counter = this.counter || 0;

    switch (this.currentSprite.name) {
      case 'idle':
          this.counter++;
          this.handleIdle();
        break;
      case 'bite_w':
        this.handleBiteWest(delta);
        break;
      case 'bite_e':
        this.handleBiteEast(delta);
        break;
    }


  }
}

module.exports = Monster;
