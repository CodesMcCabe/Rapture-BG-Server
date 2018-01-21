// MONSTER WILL CHASE PLAYER, TAKE SHORTEST ROUTE IF POSSIBLE
let monsterSprites = require('./monster_sprites');
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
    this.gameOver = false;

    this.targetPos = [];
    this.interval = null;
    this.counter = 0;
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
    // this.currentSprite.currentFrame = 0;
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite.url;
    // this.coordinates[0] = Math.floor(this.coordinates[0]);
    // this.coordinates[1] = Math.floor(this.coordinates[1]);
    this.ctx.drawImage(monsterSprite, this.shift, 0,
      this.currentSprite.frameWidth, this.currentSprite.frameHeight,
      this.coordinates[0], this.coordinates[1], this.currentSprite.frameWidth,
      this.currentSprite.frameHeight);
        // debugger
    let fps = this.currentSprite.fps * this.currentSprite.fpsX;
    if (now - this.lastUpdate > fps && !this.gameOver)  {
      this.currentSprite.fps = fps;
      this.lastUpdate = now;
      this.shift += this.currentSprite.frameWidth + 1;
      // debugger
      if (this.currentSprite.currentFrame === this.currentSprite.totalFrames &&
        this.currentSprite.name === 'intro') {
      // if (this.currentSprite.currentFrame === this.currentSprite.totalFrames - 2) {
          // th
        // debugger
        this.coordinates = [this.coordinates[0] - 15, this.coordinates[1] + 15];
        this.currentSprite = monsterSprites.idle;
        this.shift = 0;
        this.currentSprite.currentFrame = 0;
      // } else if (this.currentSprite.currentFrame ===
      //   this.currentSprite.totalFrames && this.currentSprite.name === 'bite') {
      //
      //   this.shift = 0;
      //   this.currentSprite.currentFrame = 0;
      } else if (this.currentSprite.currentFrame ===
        this.currentSprite.totalFrames) {

        this.shift = 0;
        this.currentSprite.currentFrame = 0;
      }

      this.currentSprite.currentFrame += 1;
    }
  }
  // should prob extract this out to a vector js file
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
    // debugger
      let playerDir = this.findDirectionVector(playerPos);
      let magnitude = this.findMagnitude(playerDir[0], playerDir[1]);
      let normalized = this.normalizeVector(playerDir, magnitude);
      let velocity = 1;
      // debugger
      this.coordinates[0] = this.coordinates[0] + (normalized[0] * velocity * delta);
      this.coordinates[1] = this.coordinates[1] + (normalized[1] * velocity * delta);
  }

  handleIdle () {
      if (this.counter === 200) {
        if (this.targetPos[0] >= this.coordinates[0]) {
          // debugger
          this.currentSprite = monsterSprites.bite_e;
          this.currentSprite.currentFrame = 0;
        } else {
          this.currentSprite = monsterSprites.bite_w;
          this.currentSprite.currentFrame = 0;
        }
        this.counter = 0;
      }
      // debugger
  }

  handleBiteWest (delta) {
    // use chase logic and reset sprite to idle when position reached
    // debugger
    if (
      this.coordinates[0] <= this.targetPos[0] +50){
        // debugger
      this.currentSprite = monsterSprites.idle;
      this.currentSprite.currentFrame = 0;
      this.coordinates = [this.targetPos[0] + 10, this.targetPos[1]];

      this.targetPos = [];
      // this.reachedTarget = false;
    } else if (this.coordinates[0] >= this.targetPos[0]) {

      this.chasePlayer(this.targetPos, delta);
      // this.reachedTarget = false;
    }
  }

  handleBiteEast (delta) {

    if (this.coordinates[0] >= this.targetPos[0] -50){
        // debugger
      this.currentSprite = monsterSprites.idle;
      this.currentSprite.currentFrame = 0;
      this.coordinates = [this.targetPos[0] -10, this.targetPos[1]];
      // debugger
      this.targetPos = [];
    } else if (this.coordinates[0] <= this.targetPos[0]) {
      // debugger
      this.chasePlayer(this.targetPos, delta);
    }
  }

  update(playerPos, dt, delta) {
    if (!this.alive) {
      // debugger
      this.currentSprite = monsterSprites.dead;
      return null;
    }
    if (this.targetPos.length === 0) {
      setTimeout(() => {
          this.targetPos = Object.assign([], playerPos);
      }, 3000);
  }

    this.counter = this.counter || 0;

    switch (this.currentSprite.name) {
      case 'idle':
          this.counter++;
          // if (this.counter >= 150) {
            this.handleIdle();
            // this.counter = 0;
          // }
        break;
      case 'bite_w':
        this.handleBiteWest(delta);
        break;
      case 'bite_e':
        // debugger
        this.handleBiteEast(delta);
        break;
    }

  }
    //
    // this.interval = setInterval(() => {
    //   this.currentSprite.name = 'chase';
    //   // this.coordinates = [750, 300];
    // }, 5000);


//  WORKING CODE BELOW
    // if (this.coordinates >= [this.targetPos[0], this.targetPos[1]] &&
    //   this.coordinates <= [this.targetPos[0] + 50, this.targetPos[1] +50]){
    //
    //   this.coordinates = this.targetPos;
    //   this.targetPos = [];
    //   // this.reachedTarget = false;
    // } else if (this.currentSprite.name === 'idle' &&
    // this.coordinates[0] >= this.targetPos[0] && this.coordinates[1] >= this.targetPos[1]) {
    //
    //   this.chasePlayer(this.targetPos, delta);
      // this.reachedTarget = false;
    // }

// WORKING CODE ABOVE


    // if (this.currentSprite.name === 'idle' &&
    // this.coordinates[0] >= this.targetPos[0] && this.coordinates[1] >= this.targetPos[1]) {
    //   // debugger
    //
    // } else if (this.coordinates >= [this.targetPos[0], this.targetPos[1]] &&
    //   this.coordinates <= [this.targetPos[0] + 50, this.targetPos[1] +50]){
    //   debugger
    //   this.coordinates = this.targetPos;
    //   this.targetPos = [];
    // }
    //
    // if (this.currentSprite.name === 'idle') {
    //   setInterval(() => {
    //     this.chasePlayer(playerPos, delta);
    //   }, 5000);
    //
    //   // this.currentSprite.name = 'chase';
    // } else if (this.currentSprite.name === 'chase') {
    //   this.currentSprite.name = 'idle';


    // setInterval(())
    // const keys = [37, 38, 39, 40];
    // const random = Math.floor(Math.random() * (keys.length - 1));
    // const key = keys[random];
    // const spriteHeight = 125;


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
    // if(key === 40) {Math.trunc(this.coordinates[1] + (normalized[1] * velocity * delta))
    //   this.currentSprite = 'assets/images/bossworm_front.png';
    //   if (this.coordinates[1] <= (this.canvasH - spriteHeight))
    //   {this.coordinates[1]+=10;}
    // }

  // set new image and then call src on that image path
  //

}

module.exports = Monster;
