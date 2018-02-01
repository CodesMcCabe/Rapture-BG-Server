(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// sprite
// RENDER
// spritesheet for different in fps and size of blood

class BloodHit {
  constructor (playerAttr, ctx, sprite) {
    this.currentSprite = sprite;
    this.ctx = ctx;
    this.playerPos = Object.assign([], playerAttr.coordinates);
    this.coordinates = playerAttr.coordinates;
    this.lastUpdate = Date.now();
    this.shift = 0;
    this.collision = false;
  }

  render (now) {
    var bloodHitSprite = new Image();
    bloodHitSprite.src = this.currentSprite.url;
    this.ctx.drawImage(bloodHitSprite, this.shift, 0,
      this.currentSprite.frameWidth, this.currentSprite.frameHeight,
      this.coordinates[0], this.coordinates[1], this.currentSprite.frameWidth,
      this.currentSprite.frameHeight);

      let fps = this.currentSprite.fps * this.currentSprite.fpsX;
      if (now - this.lastUpdate > fps)  {
        this.currentSprite.fps = fps;
        this.lastUpdate = now;
        this.shift = this.currentSprite.currentFrame *
        this.currentSprite.frameWidth;

        // if (this.currentSprite.currentFrame ===
        //   this.currentSprite.totalFrames &&
        //   this.currentSprite.name === 'dead') {
        //     this.gameOver = true;

       if (this.currentSprite.currentFrame ===
            this.currentSprite.totalFrames) {
              this.collision = false;
              this.shift = 0;
              this.currentSprite.currentFrame = 0;
            }
            this.currentSprite.currentFrame += 1;
          }
  }
}

module.exports = BloodHit;

},{}],2:[function(require,module,exports){
class Bullet {
  constructor(playerAttr, canvasW, canvasH, ctx, sprite, bulletCount) {
    this.currentSprite = sprite;
    this.active = true;
    this.playerPos = Object.assign([], playerAttr.coordinates);
    this.playerFace = playerAttr.playerFace;
    this.coordinates = this.setCoordinates(this.playerPos);
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.bulletCounter = 0;
    this.bulletCount = bulletCount;

    // BAND AID FOR MONSTER BULLETS
    // SHOULD ALSO WORK FOR PLAYER BULLETS SHIFTING
    // ACTUALLY WORKS PRETTY NICELY, NOT SURE IF BETTER WAY TO
    // DO THIS ACTION SINCE ONLY USING 1 SPRITE
    this.currentURL = "";


    this.setCoordinates = this.setCoordinates.bind(this);
    this.setHitBox = this.setHitBox.bind(this);
  }
  // BULLETS WILL CHANGE SPRITES WHEN ANOTHER SHOT IS TAKEN
  // NEED TO KEEP THE IMAGE WHEN SHOT IS TAKEN
  render () {
    var bulletSprite = new Image();
    bulletSprite.src = this.currentUrl;
    this.ctx.drawImage(bulletSprite, this.coordinates[0], this.coordinates[1]);
  }

  setHitBox (playerFace) {
    let dimensionsCopy = Object.assign([],
      [this.currentSprite.frameWidth, this.currentSprite.frameHeight]);
    switch (playerFace) {
      case "left":
        this.currentSprite.frameHeight = dimensionsCopy[1];
        this.currentSprite.frameWidth = dimensionsCopy[0];
        break;
      case "up":
        this.currentSprite.frameHeight = dimensionsCopy[0];
        this.currentSprite.frameWidth = dimensionsCopy[1];
        break;
      case "right":
        this.currentSprite.frameHeight = dimensionsCopy[1];
        this.currentSprite.frameWidth = dimensionsCopy[0];
        break;
      case "down":
        this.currentSprite.frameHeight = dimensionsCopy[0];
        this.currentSprite.frameWidth = dimensionsCopy[1];
        break;
      default:
        return playerFace;
    }
  }

  setCoordinates (playerPos) {
    let x = playerPos[0];
    let y = playerPos[1];
    if (this.currentSprite.name === 'rifle') {
      this.setHitBox(this.playerFace);
      switch (this.playerFace) {
        case "left":
        x += 4;
        y += 11;
        return [x, y];
        case "up":
        x += 40;
        y += 5;
        return [x, y];
        case "right":
        x += 75;
        y += 40;
        return [x, y];
        case "down":
        x += 11;
        y += 80;
        return[x, y];
        default:
        return playerPos;
      }
    } else {
      return playerPos;
    }
  }

  update(dt, owner) {
    let bulletSpeed;
    if (owner === 'player') {
      bulletSpeed = 800;
      switch (this.playerFace) {
        case 'left':
          this.currentUrl = 'assets/images/bullet_horz.png';
          this.coordinates[0]-= (bulletSpeed * dt);
          this.active = this.active && this.coordinates[0] >= 0;
          break;
        case 'up':
          this.currentUrl = 'assets/images/bullet_vert.png';
          this.coordinates[1]-= (bulletSpeed * dt);
          this.active = this.active && this.coordinates[1] >= 0;
          break;
        case 'right':
          this.currentUrl = 'assets/images/bullet_horz.png';
          this.coordinates[0]+= (bulletSpeed * dt);
          this.active = this.active && this.coordinates[0] <= this.canvasW;
          break;
        case 'down':
          this.currentUrl = 'assets/images/bullet_vert.png';
          this.coordinates[1]+= (bulletSpeed * dt);
          this.active = this.active && this.coordinates[1] <= this.canvasH;
          break;
      }
    } else {
      bulletSpeed = 500;
      // debugger
      switch (this.bulletCount) {
        case 0:
          this.currentUrl = 'assets/images/mon_bullet_nw.png';
          this.coordinates[0] -=(bulletSpeed * dt);
          this.coordinates[1] -=(bulletSpeed * dt);
          this.active = this.active && this.coordinates[0] >= 0 &&
          this.coordinates[1] >= 0;
          break;
        case 1:
          this.currentUrl = 'assets/images/mon_bullet_left.png';
          this.coordinates[0]-= (bulletSpeed * dt);
          this.active = this.active && this.coordinates[0] >= 0;
          break;
        case 2:
          this.currentUrl = 'assets/images/mon_bullet_sw.png';
          this.coordinates[0] -=(bulletSpeed * dt);
          this.coordinates[1] +=(bulletSpeed * dt);
          this.active = this.active && this.coordinates[0] >= 0 &&
          this.coordinates[1] <= this.canvasH;
          break;
        case 3:
          this.currentUrl = 'assets/images/mon_bullet_south.png';
          this.coordinates[1]+= (bulletSpeed * dt);
          this.active = this.active && this.coordinates[1] <= this.canvasH;
          break;
        case 4:
          this.currentUrl = 'assets/images/mon_bullet_se.png';
          this.coordinates[0] += (bulletSpeed * dt);
          this.coordinates[1] += (bulletSpeed * dt);
          this.active = this.active && this.coordinates[1] <=
          this.canvasH && this.coordinates[0] <= this.canvasW;
          break;
        case 5:
          this.currentUrl = 'assets/images/mon_bullet_right.png';
          this.coordinates[0]+= (bulletSpeed * dt);
          this.active = this.active && this.coordinates[0] <= this.canvasW;
          break;
        case 6:
          this.currentUrl = 'assets/images/mon_bullet_ne.png';
          this.coordinates[0] += (bulletSpeed * dt);
          this.coordinates[1] -= (bulletSpeed * dt);
          this.active = this.active && this.coordinates[1] >= 0 &&
          this.coordinates[0] <= this.canvasW;
          break;
        case 7:
          this.currentUrl = 'assets/images/mon_bullet_vert.png';
          this.coordinates[1]-= (bulletSpeed * dt);
          this.active = this.active && this.coordinates[1] >= 0;
          break;
      }
    }
  }
}


module.exports = Bullet;

},{}],3:[function(require,module,exports){
let monsterSprites = require('../sprites/monster_sprites');
let bulletSprites = require('../sprites/bullet_sprites');
let Bullet = require('./bullet');
let Sprite = require('./sprite');

class Monster {
  constructor (ctx, canvasW, canvasH, sprite) {
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.coordinates = [700, 300];
    this.currentSprite = sprite;
    this.shift = 0;
    this.maxHP = 300;
    this.health = 300;
    this.alive = true;
    this.lastUpdate = Date.now();
    this.gameOver = false;

    this.targetPos = [];
    this.interval = null;
    this.counter = 0;
    this.finalPlayerPos = [];
    this.centerCoords = [0, 0];
    this.randCount = 200;
    this.pauseAnimation = false;
    this.bullets = [];
    this.bulletsLoaded = false;
    this.glowActive = true;
    this.currentPosition = this.currentPosition.bind(this);
  }

  currentPosition () {
    return {
      coordinates: this.setCenterCoords(),
    };
  }

  setCenterCoords () {
    let x = this.coordinates[0] +
      (this.currentSprite.frameWidth / 2);
    let y = this.coordinates[1] +
      (this.currentSprite.frameHeight / 2);

    return [x, y];
  }

  defeated () {
    this.alive = false;
  }

  playerDefeated() {
    this.gameOver = true;
  }

  reduceHealth (damage) {
    this.health -= damage;
  }

  render(now) {
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite.url;
    this.ctx.drawImage(monsterSprite, this.shift, 0,
      this.currentSprite.frameWidth, this.currentSprite.frameHeight,
      this.coordinates[0], this.coordinates[1], this.currentSprite.frameWidth,
      this.currentSprite.frameHeight);
    if (!this.pauseAnimation) {

      let fps = this.currentSprite.fps * this.currentSprite.fpsX;
      if (now - this.lastUpdate > fps)  {
        this.currentSprite.fps = fps;
        this.lastUpdate = now;
        this.shift = this.currentSprite.currentFrame *
        this.currentSprite.frameWidth;

        if (this.currentSprite.currentFrame ===
          this.currentSprite.totalFrames &&
          this.currentSprite.name === 'intro') {

            this.coordinates = [this.coordinates[0] - 15,
            this.coordinates[1] + 15];
            this.currentSprite = monsterSprites.idle;
            this.shift = 0;

          } else if (this.currentSprite.currentFrame ===
            this.currentSprite.totalFrames &&
            this.currentSprite.name === 'dead') {
              this.currentSprite.currentFrame = 2;
              this.shift = this.currentSprite.currentFrame *
              this.currentSprite.frameWidth;
              this.pauseAnimation = true;

            } else if (this.currentSprite.currentFrame ===
              this.currentSprite.totalFrames) {

                this.shift = 0;
                this.currentSprite.currentFrame = 0;
              }
              this.currentSprite.currentFrame += 1;
            }
    }
  }

  findDirectionVector () {
    let x = this.finalPlayerPos[0] - this.coordinates[0];
    let y = this.finalPlayerPos[1] - this.coordinates[1];
    return [x, y];
  }

  findMagnitude (x, y) {
    let magnitude = Math.sqrt(x * x + y * y);
    return magnitude;
  }
  normalizeVector (playerDir, magnitude) {
    return [(playerDir[0]/magnitude), (playerDir[1]/magnitude)];
  }

  chasePlayer (delta) {
      let playerDir = this.findDirectionVector();
      let magnitude = this.findMagnitude(playerDir[0], playerDir[1]);
      let normalized = this.normalizeVector(playerDir, magnitude);
      let velocity = 1.5;

      this.coordinates[0] = this.coordinates[0] + (normalized[0] *
        velocity * delta);
      this.coordinates[1] = this.coordinates[1] + (normalized[1] *
        velocity * delta);

      if (this.currentSprite.currentFrame === 0) {
        let charge = document.getElementById('charge');
        charge.volume = 1;
        charge.play();
      }
  }

  randomCount() {
    return (Math.random() * 200) + 180;
  }

  bulletAttack () {
    let i = 0;
    while (i < 8) {
      let bulletCount = i;
      this.bullets.push(new Bullet(this.currentPosition(), this.canvasW,
        this.canvasH, this.ctx, bulletSprites.monster, bulletCount));

      i++;
    }
    this.bulletsLoaded = true;
    this.bullets.filter(bullet => bullet.active);
  }

  handleIdle () {
    if (!this.bulletsLoaded) {
      let spit = document.getElementById('spit');
      spit.volume = 1;
      this.bulletAttack();
      spit.play();
    }
    let speed = 240;
    if (this.health <= this.maxHP * .75 && this.health > this.maxHP * .5) {
      speed = 180;
    } else if (this.health <= this.maxHP * .5 && this.health >
      this.maxHP * .25) {
      speed = 160;
    } else if (this.health <= this.maxHP * .25) {
      speed = 150;
    }

    if (!this.gameOver && this.counter >= speed * 0.5 && this.glowActive &&
      this.currentSprite.currentFrame === this.currentSprite.totalFrames) {
      this.shift = 0;
      this.currentSprite = monsterSprites.glow;
      this.currentSprite.currentFrame = 0;
      this.glowActive = false;
    }

    if (this.counter >= speed && !this.gameOver) {
      this.currentSprite.currentFrame = 0;
      this.bulletsLoaded = false;
      this.glowActive = true;

      if (this.targetPos[0] >= this.coordinates[0]) {
        this.shift = 0;
        this.currentSprite = monsterSprites.bite_e;
        this.currentSprite.currentFrame = 0;
      } else {
        this.shift = 0;
        this.currentSprite = monsterSprites.bite_w;
        this.currentSprite.currentFrame = 0;
        }
      this.counter = 0;
    }
  }

  handleBiteWest (delta) {
    // BINDS FINAL POSITION BEFORE BITE
    if (this.finalPlayerPos.length === 0) {
      if (this.targetPos[1] + this.currentSprite.frameHeight >= this.canvasH) {
        this.targetPos[1] = this.canvasH - this.currentSprite.frameHeight;
      }
      this.finalPlayerPos = [0 + this.targetPos[0], this.targetPos[1]];
      clearInterval(this.interval);
    }

    if (this.coordinates[0] <= this.finalPlayerPos[0]){
      this.shift = 0;
      this.currentSprite = monsterSprites.idle;
      if (this.coordinates[0] - this.currentSprite.frameWidth <=
        0){
          this.coordinates[0] = this.finalPlayerPos[0];
        }
      this.currentSprite.currentFrame = 0;
      this.finalPlayerPos = [];
      this.targetPos = [];
    } else if (this.coordinates[0] >= this.finalPlayerPos[0]) {
      this.chasePlayer(delta);
    }
  }
  // CHARGE DOESNT HIT IF IN CENTER OF BOTTOM OR top
  // SHOULD FIND A WAY TO STILL GO TOWARDS TARGET X BUT FULLY
  handleBiteEast (delta) {
    if (this.finalPlayerPos.length === 0) {
      if (this.targetPos[1] + this.currentSprite.frameHeight >= this.canvasH) {
        this.targetPos[1] = this.canvasH - this.currentSprite.frameHeight;
      }
      this.finalPlayerPos = [this.canvasW -
        (this.canvasW - this.targetPos[0]), this.targetPos[1]];
      clearInterval(this.interval);
    }

    if (this.coordinates[0] >= this.finalPlayerPos[0]) {
      this.currentSprite = monsterSprites.idle;
      if (this.coordinates[0] + this.currentSprite.frameWidth >=
        this.canvasW){
          this.coordinates[0] = this.finalPlayerPos[0] -
          (this.canvasW - this.finalPlayerPos[0]);
        }
      this.currentSprite.currentFrame = 0;
      this.finalPlayerPos = [];
      this.targetPos = [];
    } else if (this.coordinates[0] <= this.finalPlayerPos[0]) {
      this.chasePlayer(delta);
    }
  }

  update(playerPos, dt, delta) {
    if (!this.alive && !this.gameOver) {
      this.gameOver = true;
      this.currentSprite = monsterSprites.dead;
      this.shift = 0;
      // this.currentSprite.currentFrame = 0;
    }
    // TRACKS POSITION OF PLAYER
    if (this.targetPos.length === 0 ) {
      this.interval = setInterval(() => {
          this.targetPos = Object.assign([], playerPos);
      }, 100);
    }

    // OFFSET FOR IDLE ANIMATION
    this.counter = this.counter || 0;

    switch (this.currentSprite.name) {
      case 'idle':
        this.counter++;
        this.handleIdle();
        break;
      case 'glow':
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

},{"../sprites/bullet_sprites":8,"../sprites/monster_sprites":9,"./bullet":2,"./sprite":5}],4:[function(require,module,exports){
let playerSprites = require('../sprites/player_sprites');
let Sprite = require('./sprite');

class Player {
  constructor (ctx, canvasW, canvasH, sprite) {
    this.ctx = ctx;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.coordinates = [0, 0];
    this.currentSprite = sprite;
    this.facingPos = "right";
    this.hitBoxH = 55;
    this.hitBoxW = 69;
    this.keyPressed = {};
    this.alive = true;
    this.shift = 0;
    this.gameOver = false;
    this.lastUpdate = Date.now();
    this.centerCoords = [0, 0];
    this.health = 30;
  }

  dead () {
    this.alive = false;
  }

  reduceHealth (damage) {
    this.health -= damage;
    return damage;
  }

  setCenterCoords (x, y) {
    let centerX = x + (this.currentSprite.frameWidth / 2);
    let centerY = y + (this.currentSprite.frameHeight / 2);

    return [centerX, centerY];
  }

  render(now) {
    if (!this.gameOver) {

      var playerSprite = new Image();
      playerSprite.src = this.currentSprite.url;

      // playerSprite.addEventListener
      this.ctx.drawImage(playerSprite, this.shift, 0,
        this.currentSprite.frameWidth, this.currentSprite.frameHeight,
        this.coordinates[0], this.coordinates[1], this.currentSprite.frameWidth,
        this.currentSprite.frameHeight);
        // debugger

        let fps = this.currentSprite.fps * this.currentSprite.fpsX;
        if (now - this.lastUpdate > fps && !this.gameOver)  {
          this.currentSprite.fps = fps;
          this.lastUpdate = now;
          this.shift = this.currentSprite.currentFrame *
          this.currentSprite.frameWidth;

          if (this.currentSprite.currentFrame ===
            this.currentSprite.totalFrames &&
            this.currentSprite.name === 'dead') {
              this.gameOver = true;

            } else if (this.currentSprite.currentFrame ===
              this.currentSprite.totalFrames ) {

                this.shift = 0;
                this.currentSprite.currentFrame = 0;
              }
              this.currentSprite.currentFrame += 1;
            }
    }
  }


  setHitBox (facingPos) {
    switch (facingPos) {
      case "left":
        this.hitBoxH = 55;
        this.hitBoxW = 69;
        break;
      case "up":
        this.hitBoxH = 69;
        this.hitBoxW = 55;
        break;
      case "right":
        this.hitBoxH = 55;
        this.hitBoxW = 69;
        break;
      case "down":
        this.hitBoxH = 69;
        this.hitBoxW = 55;
        break;
      default:
        return facingPos;
    }
  }

  currentPosition () {
    return {
      coordinates: this.coordinates,
      playerFace: this.facingPos
    };
  }

  update(key) {
    const spriteHeight = 125;
    this.setHitBox(this.facingPos);
    let speed = 12;
    // key.preventDefault();

    if (this.alive) {
      if(this.keyPressed[37]) {
        this.currentSprite = playerSprites.aliveLeft;
        this.facingPos = "left";
        if (this.coordinates[0] >= 5) {this.coordinates[0]-=speed;}
      }
      if(this.keyPressed[38]) {
        this.currentSprite = playerSprites.aliveUp;
        this.facingPos = "up";
        if (this.coordinates[1] >= 15) {this.coordinates[1]-=speed;}
      }
      if(this.keyPressed[39]) {
        this.currentSprite = playerSprites.aliveRight;
        this.facingPos = "right";
        if (this.coordinates[0] <= (this.canvasW - this.hitBoxH - 30))
        {this.coordinates[0]+=speed;}
      }
      if(this.keyPressed[40]) {
        this.currentSprite = playerSprites.aliveDown;
        this.facingPos = "down";
        if (this.coordinates[1] <= (this.canvasH - this.hitBoxH))
        {this.coordinates[1]+=speed;}
      }
    } else {
      this.currentSprite = playerSprites.dead;
    }
    }

}

module.exports = Player;

},{"../sprites/player_sprites":10,"./sprite":5}],5:[function(require,module,exports){
class Sprite {
  constructor(options) {
    this.url = options.url;
    this.name = options.name;
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.currentFrame = options.currentFrame;
    this.totalFrames = options.totalFrames;
    this.once = options.once;
    this.fps = options.fps;
    this.fpsX = options.fpsX;
    this.damage = options.damage;
  }
}
// url, name, pos, size, speed, frames, dir, once

module.exports = Sprite;

},{}],6:[function(require,module,exports){
// HOW TO BUILD PHYSICS FOR A WEAPON?
// BULLET SPEED, SPREAD, DAMAGE?
// DO PHYSICS NEED TO BE A SEPARATE CLASS? CAN I IMPORT A LIBRARY TO HANDLE THAT LOGIC?

class Weapon {
  constructor (attributes) {
    this.rate = attributes.rate;
    this.model = attributes.model;
    this.power = attributes.power;
  }

}

module.exports = Weapon;

},{}],7:[function(require,module,exports){
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

},{"../classes/sprite":5}],8:[function(require,module,exports){
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
  monster: new Sprite(bulletSpriteSheet.monster)
};

module.exports = bulletSprites;

},{"../classes/sprite":5}],9:[function(require,module,exports){
let Sprite = require('../classes/sprite');
// IF BLANK RENDER BEFORE SPRITE, NEED TO RESET SHIFT TO 0!!
const monsterSpriteSheet = {
  dirt: {
    url: 'assets/images/worm_intro.png',
    name: 'intro',
    frameHeight: 166,
    frameWidth: 153,
    currentFrame: 0,
    totalFrames: 16,
    once: true,
    fps: 250,
    fpsX: 1,
  },

  intro: {
    url: 'assets/images/worm_intro.png',
    name: 'intro',
    frameHeight: 166,
    frameWidth: 153,
    currentFrame: 0,
    totalFrames: 16,
    once: true,
    fps: 100,
    fpsX: 1,
  },

  idle: {
    url: 'assets/images/worm_idle.png',
    name: 'idle',
    frameHeight: 173,
    frameWidth: 203,
    currentFrame: 0,
    totalFrames: 12,
    once: false,
    fps: 125,
    fpsX: 1,
  },

  glow: {
    url: 'assets/images/worm_idle_glow2.png',
    name: 'glow',
    frameHeight: 173,
    frameWidth: 223,
    currentFrame: 0,
    totalFrames: 12,
    once: false,
    fps: 50,
    fpsX: 1,
  },

  bite_w: {
    url: 'assets/images/bite_west.png',
    name: 'bite_w',
    frameHeight: 163,
    frameWidth: 192,
    currentFrame: 0,
    totalFrames: 5,
    once: false,
    fps: 200,
    fpsX: 1.5,
  },

  bite_e: {
    url: 'assets/images/bite_east.png',
    name: 'bite_e',
    frameHeight: 163,
    frameWidth: 192,
    currentFrame: 0,
    totalFrames: 5,
    once: false,
    fps: 200,
    fpsX: 1.5,
  },

  dead: {
    url: 'assets/images/worm_dead.png',
    name: 'dead',
    frameHeight: 163,
    frameWidth: 155,
    currentFrame: 0,
    totalFrames: 4,
    once: true,
    fps: 200,
    fpsX: 1,
  }
};

const monsterSprites = {
  intro: new Sprite(monsterSpriteSheet.intro),
  idle: new Sprite(monsterSpriteSheet.idle),
  glow: new Sprite(monsterSpriteSheet.glow),
  dead: new Sprite(monsterSpriteSheet.dead),
  bite_w: new Sprite(monsterSpriteSheet.bite_w),
  bite_e: new Sprite(monsterSpriteSheet.bite_e)
};

module.exports = monsterSprites;

},{"../classes/sprite":5}],10:[function(require,module,exports){
let Sprite = require('../classes/sprite');

const playerSpriteSheet = {
  dead: {
    url: 'assets/images/blood_small.png',
    name: 'dead',
    frameHeight: 124,
    frameWidth: (763 / 6),
    currentFrame: 0,
    totalFrames: 6,
    once: true,
    fps: 150,
    fpsX: 1,
  },

  empty: {
    url: '',
    name: '',
    frameHeight: 0,
    frameWidth: 0,
    currentFrame: 0,
    totalFrames: 0,
    once: 0,
    fps: 0,
    fpsX: 0,
  },

  aliveLeft: {
    url: 'assets/images/player_rifle_left.png',
    name: 'left',
    frameHeight: 55,
    frameWidth: 93,
    currentFrame: 0,
    totalFrames: 1,
    // hitBoxHeightOffset:
    // hitBoxWidthOffset:
    once: true,
    fps: 250,
    fpsX: 1,
  },
  aliveUp: {
    url: 'assets/images/player_rifle_up.png',
    name: 'up',
    frameHeight: 93,
    frameWidth: 55,
    currentFrame: 0,
    totalFrames: 1,
    once: true,
    fps: 250,
    fpsX: 1,
  },
  aliveRight: {
    url: 'assets/images/player_rifle.png',
    name: 'right',
    frameHeight: 55,
    frameWidth: 93,
    currentFrame: 0,
    totalFrames: 1,
    once: true,
    fps: 250,
    fpsX: 1,
  },
  aliveDown: {
    url: 'assets/images/player_rifle_down.png',
    name: 'down',
    frameHeight: 93,
    frameWidth: 55,
    currentFrame: 0,
    totalFrames: 1,
    once: true,
    fps: 250,
    fpsX: 1,
  },
};

const playerSprites = {
  dead: new Sprite(playerSpriteSheet.dead),
  aliveLeft: new Sprite(playerSpriteSheet.aliveLeft),
  aliveUp: new Sprite(playerSpriteSheet.aliveUp),
  aliveRight: new Sprite(playerSpriteSheet.aliveRight),
  aliveDown: new Sprite(playerSpriteSheet.aliveDown),

};

module.exports = playerSprites;

},{"../classes/sprite":5}],11:[function(require,module,exports){
let monsterSprites = require('./lib/sprites/monster_sprites.js');
let playerSprites = require('./lib/sprites/player_sprites.js');
let bulletSprites = require('./lib/sprites/bullet_sprites.js');
let bloodHitSprites = require('./lib/sprites/blood_hit_sprites.js');
let Sprite = require('./lib/classes/sprite.js');
let Monster = require('./lib/classes/monster.js');
let BloodHit = require('./lib/classes/blood_hit.js');
let Player = require('./lib/classes/player.js');
let Weapons = require('./lib/classes/weapons.js');
let Bullet = require('./lib/classes/bullet.js');
let preloadImages = require('./resources.js');

window.onload = function() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let myReq;
  preloadAssets();

  function startGame () {
    let start = document.getElementById('start');
    let music = document.getElementById('music');
    let introMusic = document.getElementById('cave_theme');
    introMusic.volume = 1;
    // set up date now
    // convert to seconds
    // end when gameOver
    // have timer div set up and append to the id of the div tag

    start.addEventListener('click', function(e) {
        start.className = 'start_button_hide';
        gameStart = true;
        gameWin = false;
        gameTimerStart = Date.now();
        introMusic.pause();
        music.volume = .7;
        music.play();
    });

    document.onkeypress = function (evt) {
      if (evt.keyCode === 13) {
        start.className = 'start_button_hide';
        gameStart = true;
        gameWin = false;
        gameTimerStart = Date.now();
        introMusic.pause();
        music.volume = .7;
        music.play();
      }
    };



    let audio = document.getElementById('audio_hover');
    audio.volume = 0.4;
    start.addEventListener('mouseover', function(evt) {
      audio.play();
    });
  }

  function preloadAssets () {
    preloadImages.forEach(image => {
      let loadedImage = new Image();
      loadedImage.src = image;
    });
  }

  function gameOverPrompt () {
    gameTimerStop = true;
    let gameOver = document.getElementById('game_over');
    let audio = document.getElementById('audio_hover');
    let scoreScreen = document.getElementById('score_screen');
    if (gameWin) {
      scoreScreen.innerHTML = `Worm Boss defeated in ${elapsed} seconds!`;
    } else {
      scoreScreen.innerHTML = `You survived for ${elapsed} seconds.`;
    }

    let timeout = setTimeout(() => {
      gameOver.style.display = 'block';
      scoreScreen.style.display = 'block';
    }, 2000);

    audio.volume = 0.4;
    gameOver.addEventListener('mouseover', function(evt) {
      audio.play();
    });

    gameOver.addEventListener('click', function(e) {
      clearTimeout(timeout);
      gameOver.style.display = 'none';
      scoreScreen.style.display = 'none';
      monsterSprites.dead.currentFrame = 0;
      monsterSprites.idle.currentFrame = 0;
      player.currentSprite.currentFrame = 0;
      monsterSprites.intro.currentFrame = 0;
      restartGame();
    });

    // document.onkeypress = function (evt) {
    //   // evt.preventDefault();
    //   if (evt.keyCode === 13) {
    //     clearTimeout(timeout);
    //     gameOver.style.display = 'none';
    //     monsterSprites.dead.currentFrame = 0;
    //     monsterSprites.idle.currentFrame = 0;
    //     player.currentSprite.currentFrame = 0;
    //     monsterSprites.intro.currentFrame = 0;
    //     restartGame();
    //   }
    // };
  }

  function restartGame () {
    gameTimerStop = false;
    gameTimerStart = Date.now();
    let gameOver = document.getElementById('game_over');
    gameOver.style.display = "none";
    monster = new Monster(ctx, canvas.width, canvas.height,
      monsterSprites.intro);
    player = new Player(ctx, canvas.width, canvas.height,
      playerSprites.aliveRight);
    monsterBullets = monster.bullets;
  }

  let monster = new Monster(ctx, canvas.width, canvas.height,
    monsterSprites.intro);
  let gameStart = false;
  let bullets = [];
  let monsterBullets = monster.bullets;
  let player = new Player(ctx, canvas.width, canvas.height,
    playerSprites.aliveRight);
  let lastTime = Date.now();
  let key;
  let allowFire = true;
  let playerHit = new BloodHit(player.currentPosition(), ctx,
    bloodHitSprites.playerHit);

  let gameWin = false;
  function collisionDetected () {
    let collideBullets = Object.assign([], bullets);
    let bulletX;
    let bulletY;
    let playerX = player.coordinates[0];
    let playerY = player.coordinates[1];
    let monsterX = monster.coordinates[0];
    let monsterY = monster.coordinates[1];
    let mHBoffset = 40;

    if (gameStart) {
      bullets.forEach(bullet => {
        bulletX = bullet.coordinates[0];
        bulletY = bullet.coordinates[1];
        if (bulletX < monsterX + monster.currentSprite.frameWidth - mHBoffset &&
          bulletX + bullet.currentSprite.frameWidth > monsterX + mHBoffset &&
          bulletY < monsterY + monster.currentSprite.frameHeight - mHBoffset &&
          bulletY + bullet.currentSprite.frameHeight > monsterY + mHBoffset) {
            monster.reduceHealth(bullet.currentSprite.damage);
            bullets.splice(0, 1);

            if (monster.health <= 0) {
              gameWin = true;
              monster.defeated();
              gameOverPrompt();
            }

          }
        }
      );
    }
    monsterBullets.forEach(bullet => {
      bulletX = bullet.coordinates[0];
      bulletY = bullet.coordinates[1];
      if (bulletX < playerX + player.currentSprite.frameWidth &&
        bulletX + bullet.currentSprite.frameWidth > playerX &&
        bulletY < playerY + player.currentSprite.frameHeight &&
        bulletY + bullet.currentSprite.frameHeight > playerY) {
          player.reduceHealth(bullet.currentSprite.damage);
          let index = monsterBullets.indexOf(bullet);
          monsterBullets.splice(index, 1);
          playerHit = new BloodHit(player.currentPosition(), ctx,
          bloodHitSprites.playerHit);
          playerHit.collision = true;

          if (player.health <= 0) {
            playerHit.collision = false;
            player.dead();
            monster.playerDefeated();
            gameOverPrompt();
          }
      }
    });

    if (playerX < monsterX + monster.currentSprite.frameWidth - mHBoffset&&
      playerX + player.hitBoxW > monsterX + mHBoffset&&
      playerY < monsterY + monster.currentSprite.frameHeight - mHBoffset&&
      playerY + player.hitBoxH > monsterY + mHBoffset &&
      gameStart && monster.alive) {
        player.dead();
        monster.playerDefeated();
        gameOverPrompt();
      }
  }

  let lastBullet;
  function Fire () {
    allowFire = false;
    setTimeout(() => {
      allowFire = true;
    }, 200);
  }

  function shoot (playerPos) {
      bullets.push(new Bullet(playerPos, canvas.width,
        canvas.height, ctx, bulletSprites.rifle));

      bullets = bullets.filter(bullet => bullet.active);

    Fire();
    let bulletSound = document.getElementById('bullet');
    bulletSound.volume = 0.7;
    bulletSound.load();
    bulletSound.play();
  }

  function update (key, dt, delta) {
    player.update(key);
    if (gameStart) {
      monster.update(player.coordinates, dt, delta);
    }
    bullets.forEach(bullet => bullet.update(dt, 'player'));
    monsterBullets.forEach(bullet => bullet.update(dt, 'monster'));
  }

  const clear = () =>  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  function render (now) {
    if (playerHit.collision) {
      playerHit.render(now);
    }

    if (gameStart) {
      monster.render(now);
    }

    player.render(now);

    bullets.forEach(bullet => bullet.render());

    monsterBullets.forEach(bullet => bullet.render());
    if (monster.currentSprite.name === 'intro' &&
    gameStart && monster.currentSprite.currentFrame === 1) {
      let intro = document.getElementById('intro_monster');
      intro.volume = 1;
      intro.play();
    } else if (monster.currentSprite.name !== 'intro' && gameStart &&
    monster.alive) {
      let monBG = document.getElementById('monster_bg');
      monBG.volume = 1;
      monBG.playbackRate = 3.5;
      monBG.play();
    }
  }

  document.onkeydown = function (evt) {
    let keys = [32, 37, 38, 39, 40];
    key = evt.which;
    if(keys.includes(key)) {
      evt.preventDefault();
    }
    player.keyPressed[key] = true;
    if (key === 32 && player.alive && allowFire) {
      shoot(player.currentPosition());
    }
  };

  document.onkeyup = function(evt) {
    evt.preventDefault();
    player.keyPressed[evt.which] = false;
    key = null;
  };
  let gameTimerStop = false;
  let gameTimerStart;
  let elapsed;
  function timer() {
    let time = document.getElementById('timer');
    if (gameStart && !gameTimerStop) {
      elapsed = ((Date.now() - gameTimerStart) / 1000).toFixed(1);

      time.innerHTML = elapsed;
    }
  }

  // let delta;
  function main() {
    let now = Date.now();
    let delta = now - lastTime;
    let dt = (delta) / 500.0;
    myReq = requestAnimationFrame( main );
    collisionDetected();
    timer();
    update(key, dt, delta);
    clear();
    render(now);
    lastTime = now;
  }
  myReq = requestAnimationFrame( main );
  startGame();
};

},{"./lib/classes/blood_hit.js":1,"./lib/classes/bullet.js":2,"./lib/classes/monster.js":3,"./lib/classes/player.js":4,"./lib/classes/sprite.js":5,"./lib/classes/weapons.js":6,"./lib/sprites/blood_hit_sprites.js":7,"./lib/sprites/bullet_sprites.js":8,"./lib/sprites/monster_sprites.js":9,"./lib/sprites/player_sprites.js":10,"./resources.js":12}],12:[function(require,module,exports){
const images = [
  'assets/images/arrow_keys.png',
  'assets/images/arrows_pop.png',
  'assets/images/bg_final.png',
  'assets/images/bite_east.png',
  'assets/images/bite_north.png',
  'assets/images/bite_south.png',
  'assets/images/bite_west.png',
  'assets/images/blood_small.png',
  'assets/images/bullet_horz.png',
  'assets/images/bullet_vert.png',
  'assets/images/dirt_pop.png',
  'assets/images/dirt_pop.png',
  'assets/images/github-original.png',
  'assets/images/globe.png',
  'assets/images/linkedin_logo.png',
  'assets/images/mon_bullet_left.png',
  'assets/images/mon_bullet_ne.png',
  'assets/images/mon_bullet_nw.png',
  'assets/images/mon_bullet_right.png',
  'assets/images/mon_bullet_se.png',
  'assets/images/mon_bullet_south.png',
  'assets/images/mon_bullet_sw.png',
  'assets/images/mon_bullet_vert.png',
  'assets/images/player_rifle_down.png',
  'assets/images/player_rifle_left.png',
  'assets/images/player_rifle_up.png',
  'assets/images/player_rifle.png',
  'assets/images/spacebar.png',
  'assets/images/worm_dead.png',
  'assets/images/worm_idle.png',
  'assets/images/worm_idle_glow2.png',
  'assets/images/worm_intro.png',
];

module.exports = images;

},{}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImxpYi9jbGFzc2VzL2Jsb29kX2hpdC5qcyIsImxpYi9jbGFzc2VzL2J1bGxldC5qcyIsImxpYi9jbGFzc2VzL21vbnN0ZXIuanMiLCJsaWIvY2xhc3Nlcy9wbGF5ZXIuanMiLCJsaWIvY2xhc3Nlcy9zcHJpdGUuanMiLCJsaWIvY2xhc3Nlcy93ZWFwb25zLmpzIiwibGliL3Nwcml0ZXMvYmxvb2RfaGl0X3Nwcml0ZXMuanMiLCJsaWIvc3ByaXRlcy9idWxsZXRfc3ByaXRlcy5qcyIsImxpYi9zcHJpdGVzL21vbnN0ZXJfc3ByaXRlcy5qcyIsImxpYi9zcHJpdGVzL3BsYXllcl9zcHJpdGVzLmpzIiwibWFpbi5qcyIsInJlc291cmNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNwcml0ZVxuLy8gUkVOREVSXG4vLyBzcHJpdGVzaGVldCBmb3IgZGlmZmVyZW50IGluIGZwcyBhbmQgc2l6ZSBvZiBibG9vZFxuXG5jbGFzcyBCbG9vZEhpdCB7XG4gIGNvbnN0cnVjdG9yIChwbGF5ZXJBdHRyLCBjdHgsIHNwcml0ZSkge1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHNwcml0ZTtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnBsYXllclBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllckF0dHIuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBwbGF5ZXJBdHRyLmNvb3JkaW5hdGVzO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5jb2xsaXNpb24gPSBmYWxzZTtcbiAgfVxuXG4gIHJlbmRlciAobm93KSB7XG4gICAgdmFyIGJsb29kSGl0U3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgYmxvb2RIaXRTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYmxvb2RIaXRTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgdGhpcy5jb29yZGluYXRlc1swXSwgdGhpcy5jb29yZGluYXRlc1sxXSwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuXG4gICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgaWYgKG5vdyAtIHRoaXMubGFzdFVwZGF0ZSA+IGZwcykgIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgIC8vIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAvLyAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyAmJlxuICAgICAgICAvLyAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnZGVhZCcpIHtcbiAgICAgICAgLy8gICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG4gICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMpIHtcbiAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSArPSAxO1xuICAgICAgICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb29kSGl0O1xuIiwiY2xhc3MgQnVsbGV0IHtcbiAgY29uc3RydWN0b3IocGxheWVyQXR0ciwgY2FudmFzVywgY2FudmFzSCwgY3R4LCBzcHJpdGUsIGJ1bGxldENvdW50KSB7XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnBsYXllclBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllckF0dHIuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMucGxheWVyRmFjZSA9IHBsYXllckF0dHIucGxheWVyRmFjZTtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gdGhpcy5zZXRDb29yZGluYXRlcyh0aGlzLnBsYXllclBvcyk7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuYnVsbGV0Q291bnRlciA9IDA7XG4gICAgdGhpcy5idWxsZXRDb3VudCA9IGJ1bGxldENvdW50O1xuXG4gICAgLy8gQkFORCBBSUQgRk9SIE1PTlNURVIgQlVMTEVUU1xuICAgIC8vIFNIT1VMRCBBTFNPIFdPUksgRk9SIFBMQVlFUiBCVUxMRVRTIFNISUZUSU5HXG4gICAgLy8gQUNUVUFMTFkgV09SS1MgUFJFVFRZIE5JQ0VMWSwgTk9UIFNVUkUgSUYgQkVUVEVSIFdBWSBUT1xuICAgIC8vIERPIFRISVMgQUNUSU9OIFNJTkNFIE9OTFkgVVNJTkcgMSBTUFJJVEVcbiAgICB0aGlzLmN1cnJlbnRVUkwgPSBcIlwiO1xuXG5cbiAgICB0aGlzLnNldENvb3JkaW5hdGVzID0gdGhpcy5zZXRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2V0SGl0Qm94ID0gdGhpcy5zZXRIaXRCb3guYmluZCh0aGlzKTtcbiAgfVxuICAvLyBCVUxMRVRTIFdJTEwgQ0hBTkdFIFNQUklURVMgV0hFTiBBTk9USEVSIFNIT1QgSVMgVEFLRU5cbiAgLy8gTkVFRCBUTyBLRUVQIFRIRSBJTUFHRSBXSEVOIFNIT1QgSVMgVEFLRU5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgYnVsbGV0U3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgYnVsbGV0U3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYnVsbGV0U3ByaXRlLCB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdKTtcbiAgfVxuXG4gIHNldEhpdEJveCAocGxheWVyRmFjZSkge1xuICAgIGxldCBkaW1lbnNpb25zQ29weSA9IE9iamVjdC5hc3NpZ24oW10sXG4gICAgICBbdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodF0pO1xuICAgIHN3aXRjaCAocGxheWVyRmFjZSkge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyRmFjZTtcbiAgICB9XG4gIH1cblxuICBzZXRDb29yZGluYXRlcyAocGxheWVyUG9zKSB7XG4gICAgbGV0IHggPSBwbGF5ZXJQb3NbMF07XG4gICAgbGV0IHkgPSBwbGF5ZXJQb3NbMV07XG4gICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAncmlmbGUnKSB7XG4gICAgICB0aGlzLnNldEhpdEJveCh0aGlzLnBsYXllckZhY2UpO1xuICAgICAgc3dpdGNoICh0aGlzLnBsYXllckZhY2UpIHtcbiAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgeCArPSA0O1xuICAgICAgICB5ICs9IDExO1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgeCArPSA0MDtcbiAgICAgICAgeSArPSA1O1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgeCArPSA3NTtcbiAgICAgICAgeSArPSA0MDtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgeCArPSAxMTtcbiAgICAgICAgeSArPSA4MDtcbiAgICAgICAgcmV0dXJuW3gsIHldO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyUG9zO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGxheWVyUG9zO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkdCwgb3duZXIpIHtcbiAgICBsZXQgYnVsbGV0U3BlZWQ7XG4gICAgaWYgKG93bmVyID09PSAncGxheWVyJykge1xuICAgICAgYnVsbGV0U3BlZWQgPSA4MDA7XG4gICAgICBzd2l0Y2ggKHRoaXMucGxheWVyRmFjZSkge1xuICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1bGxldFNwZWVkID0gNTAwO1xuICAgICAgLy8gZGVidWdnZXJcbiAgICAgIHN3aXRjaCAodGhpcy5idWxsZXRDb3VudCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9udy5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gLT0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMCAmJlxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbGVmdC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3N3LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdICs9KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwICYmXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NvdXRoLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gdGhpcy5jYW52YXNIO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zZS5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PVxuICAgICAgICAgIHRoaXMuY2FudmFzSCAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfcmlnaHQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X25lLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSArPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSAtPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDAgJiZcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCdWxsZXQ7XG4iLCJsZXQgbW9uc3RlclNwcml0ZXMgPSByZXF1aXJlKCcuLi9zcHJpdGVzL21vbnN0ZXJfc3ByaXRlcycpO1xubGV0IGJ1bGxldFNwcml0ZXMgPSByZXF1aXJlKCcuLi9zcHJpdGVzL2J1bGxldF9zcHJpdGVzJyk7XG5sZXQgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jbGFzcyBNb25zdGVyIHtcbiAgY29uc3RydWN0b3IgKGN0eCwgY2FudmFzVywgY2FudmFzSCwgc3ByaXRlKSB7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbNzAwLCAzMDBdO1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHNwcml0ZTtcbiAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICB0aGlzLm1heEhQID0gMzAwO1xuICAgIHRoaXMuaGVhbHRoID0gMzAwO1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuXG4gICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB0aGlzLmludGVydmFsID0gbnVsbDtcbiAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICB0aGlzLmNlbnRlckNvb3JkcyA9IFswLCAwXTtcbiAgICB0aGlzLnJhbmRDb3VudCA9IDIwMDtcbiAgICB0aGlzLnBhdXNlQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5idWxsZXRzID0gW107XG4gICAgdGhpcy5idWxsZXRzTG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5nbG93QWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbiA9IHRoaXMuY3VycmVudFBvc2l0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICBjdXJyZW50UG9zaXRpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb29yZGluYXRlczogdGhpcy5zZXRDZW50ZXJDb29yZHMoKSxcbiAgICB9O1xuICB9XG5cbiAgc2V0Q2VudGVyQ29vcmRzICgpIHtcbiAgICBsZXQgeCA9IHRoaXMuY29vcmRpbmF0ZXNbMF0gK1xuICAgICAgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC8gMik7XG4gICAgbGV0IHkgPSB0aGlzLmNvb3JkaW5hdGVzWzFdICtcbiAgICAgICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLyAyKTtcblxuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBkZWZlYXRlZCAoKSB7XG4gICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xuICB9XG5cbiAgcGxheWVyRGVmZWF0ZWQoKSB7XG4gICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gIH1cblxuICByZWR1Y2VIZWFsdGggKGRhbWFnZSkge1xuICAgIHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcbiAgfVxuXG4gIHJlbmRlcihub3cpIHtcbiAgICB2YXIgbW9uc3RlclNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgIG1vbnN0ZXJTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UobW9uc3RlclNwcml0ZSwgdGhpcy5zaGlmdCwgMCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCk7XG4gICAgaWYgKCF0aGlzLnBhdXNlQW5pbWF0aW9uKSB7XG5cbiAgICAgIGxldCBmcHMgPSB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzICogdGhpcy5jdXJyZW50U3ByaXRlLmZwc1g7XG4gICAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzKSAge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzID0gZnBzO1xuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGg7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdpbnRybycpIHtcblxuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IFt0aGlzLmNvb3JkaW5hdGVzWzBdIC0gMTUsXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdICsgMTVdO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2RlYWQnKSB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAyO1xuICAgICAgICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuICAgICAgICAgICAgICB0aGlzLnBhdXNlQW5pbWF0aW9uID0gdHJ1ZTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kRGlyZWN0aW9uVmVjdG9yICgpIHtcbiAgICBsZXQgeCA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0gLSB0aGlzLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCB5ID0gdGhpcy5maW5hbFBsYXllclBvc1sxXSAtIHRoaXMuY29vcmRpbmF0ZXNbMV07XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfVxuXG4gIGZpbmRNYWduaXR1ZGUgKHgsIHkpIHtcbiAgICBsZXQgbWFnbml0dWRlID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIHJldHVybiBtYWduaXR1ZGU7XG4gIH1cbiAgbm9ybWFsaXplVmVjdG9yIChwbGF5ZXJEaXIsIG1hZ25pdHVkZSkge1xuICAgIHJldHVybiBbKHBsYXllckRpclswXS9tYWduaXR1ZGUpLCAocGxheWVyRGlyWzFdL21hZ25pdHVkZSldO1xuICB9XG5cbiAgY2hhc2VQbGF5ZXIgKGRlbHRhKSB7XG4gICAgICBsZXQgcGxheWVyRGlyID0gdGhpcy5maW5kRGlyZWN0aW9uVmVjdG9yKCk7XG4gICAgICBsZXQgbWFnbml0dWRlID0gdGhpcy5maW5kTWFnbml0dWRlKHBsYXllckRpclswXSwgcGxheWVyRGlyWzFdKTtcbiAgICAgIGxldCBub3JtYWxpemVkID0gdGhpcy5ub3JtYWxpemVWZWN0b3IocGxheWVyRGlyLCBtYWduaXR1ZGUpO1xuICAgICAgbGV0IHZlbG9jaXR5ID0gMS41O1xuXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5jb29yZGluYXRlc1swXSArIChub3JtYWxpemVkWzBdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdID0gdGhpcy5jb29yZGluYXRlc1sxXSArIChub3JtYWxpemVkWzFdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PSAwKSB7XG4gICAgICAgIGxldCBjaGFyZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcmdlJyk7XG4gICAgICAgIGNoYXJnZS52b2x1bWUgPSAxO1xuICAgICAgICBjaGFyZ2UucGxheSgpO1xuICAgICAgfVxuICB9XG5cbiAgcmFuZG9tQ291bnQoKSB7XG4gICAgcmV0dXJuIChNYXRoLnJhbmRvbSgpICogMjAwKSArIDE4MDtcbiAgfVxuXG4gIGJ1bGxldEF0dGFjayAoKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIHdoaWxlIChpIDwgOCkge1xuICAgICAgbGV0IGJ1bGxldENvdW50ID0gaTtcbiAgICAgIHRoaXMuYnVsbGV0cy5wdXNoKG5ldyBCdWxsZXQodGhpcy5jdXJyZW50UG9zaXRpb24oKSwgdGhpcy5jYW52YXNXLFxuICAgICAgICB0aGlzLmNhbnZhc0gsIHRoaXMuY3R4LCBidWxsZXRTcHJpdGVzLm1vbnN0ZXIsIGJ1bGxldENvdW50KSk7XG5cbiAgICAgIGkrKztcbiAgICB9XG4gICAgdGhpcy5idWxsZXRzTG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmJ1bGxldHMuZmlsdGVyKGJ1bGxldCA9PiBidWxsZXQuYWN0aXZlKTtcbiAgfVxuXG4gIGhhbmRsZUlkbGUgKCkge1xuICAgIGlmICghdGhpcy5idWxsZXRzTG9hZGVkKSB7XG4gICAgICBsZXQgc3BpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGl0Jyk7XG4gICAgICBzcGl0LnZvbHVtZSA9IDE7XG4gICAgICB0aGlzLmJ1bGxldEF0dGFjaygpO1xuICAgICAgc3BpdC5wbGF5KCk7XG4gICAgfVxuICAgIGxldCBzcGVlZCA9IDI0MDtcbiAgICBpZiAodGhpcy5oZWFsdGggPD0gdGhpcy5tYXhIUCAqIC43NSAmJiB0aGlzLmhlYWx0aCA+IHRoaXMubWF4SFAgKiAuNSkge1xuICAgICAgc3BlZWQgPSAxODA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogLjUgJiYgdGhpcy5oZWFsdGggPlxuICAgICAgdGhpcy5tYXhIUCAqIC4yNSkge1xuICAgICAgc3BlZWQgPSAxNjA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogLjI1KSB7XG4gICAgICBzcGVlZCA9IDE1MDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZ2FtZU92ZXIgJiYgdGhpcy5jb3VudGVyID49IHNwZWVkICogMC41ICYmIHRoaXMuZ2xvd0FjdGl2ZSAmJlxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT0gdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzKSB7XG4gICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmdsb3c7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHRoaXMuZ2xvd0FjdGl2ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvdW50ZXIgPj0gc3BlZWQgJiYgIXRoaXMuZ2FtZU92ZXIpIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5idWxsZXRzTG9hZGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmdsb3dBY3RpdmUgPSB0cnVlO1xuXG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMF0gPj0gdGhpcy5jb29yZGluYXRlc1swXSkge1xuICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuYml0ZV9lO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5iaXRlX3c7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICB9XG4gICAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUJpdGVXZXN0IChkZWx0YSkge1xuICAgIC8vIEJJTkRTIEZJTkFMIFBPU0lUSU9OIEJFRk9SRSBCSVRFXG4gICAgaWYgKHRoaXMuZmluYWxQbGF5ZXJQb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMV0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPj0gdGhpcy5jYW52YXNIKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0UG9zWzFdID0gdGhpcy5jYW52YXNIIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0O1xuICAgICAgfVxuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFswICsgdGhpcy50YXJnZXRQb3NbMF0sIHRoaXMudGFyZ2V0UG9zWzFdXTtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5maW5hbFBsYXllclBvc1swXSl7XG4gICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSAtIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIDw9XG4gICAgICAgIDApe1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdO1xuICAgICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICAgIHRoaXMudGFyZ2V0UG9zID0gW107XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdID49IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pIHtcbiAgICAgIHRoaXMuY2hhc2VQbGF5ZXIoZGVsdGEpO1xuICAgIH1cbiAgfVxuICAvLyBDSEFSR0UgRE9FU05UIEhJVCBJRiBJTiBDRU5URVIgT0YgQk9UVE9NIE9SIHRvcFxuICAvLyBTSE9VTEQgRklORCBBIFdBWSBUTyBTVElMTCBHTyBUT1dBUkRTIFRBUkdFVCBYIEJVVCBGVUxMWVxuICBoYW5kbGVCaXRlRWFzdCAoZGVsdGEpIHtcbiAgICBpZiAodGhpcy5maW5hbFBsYXllclBvcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmICh0aGlzLnRhcmdldFBvc1sxXSArIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+PSB0aGlzLmNhbnZhc0gpIHtcbiAgICAgICAgdGhpcy50YXJnZXRQb3NbMV0gPSB0aGlzLmNhbnZhc0ggLSB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQ7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW3RoaXMuY2FudmFzVyAtXG4gICAgICAgICh0aGlzLmNhbnZhc1cgLSB0aGlzLnRhcmdldFBvc1swXSksIHRoaXMudGFyZ2V0UG9zWzFdXTtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdICsgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPj1cbiAgICAgICAgdGhpcy5jYW52YXNXKXtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5maW5hbFBsYXllclBvc1swXSAtXG4gICAgICAgICAgKHRoaXMuY2FudmFzVyAtIHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pO1xuICAgICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICAgIHRoaXMudGFyZ2V0UG9zID0gW107XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pIHtcbiAgICAgIHRoaXMuY2hhc2VQbGF5ZXIoZGVsdGEpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShwbGF5ZXJQb3MsIGR0LCBkZWx0YSkge1xuICAgIGlmICghdGhpcy5hbGl2ZSAmJiAhdGhpcy5nYW1lT3Zlcikge1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5kZWFkO1xuICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAvLyB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICB9XG4gICAgLy8gVFJBQ0tTIFBPU0lUSU9OIE9GIFBMQVlFUlxuICAgIGlmICh0aGlzLnRhcmdldFBvcy5sZW5ndGggPT09IDAgKSB7XG4gICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudGFyZ2V0UG9zID0gT2JqZWN0LmFzc2lnbihbXSwgcGxheWVyUG9zKTtcbiAgICAgIH0sIDEwMCk7XG4gICAgfVxuXG4gICAgLy8gT0ZGU0VUIEZPUiBJRExFIEFOSU1BVElPTlxuICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciB8fCAwO1xuXG4gICAgc3dpdGNoICh0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSkge1xuICAgICAgY2FzZSAnaWRsZSc6XG4gICAgICAgIHRoaXMuY291bnRlcisrO1xuICAgICAgICB0aGlzLmhhbmRsZUlkbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnbG93JzpcbiAgICAgICAgdGhpcy5jb3VudGVyKys7XG4gICAgICAgIHRoaXMuaGFuZGxlSWRsZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JpdGVfdyc6XG4gICAgICAgIHRoaXMuaGFuZGxlQml0ZVdlc3QoZGVsdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JpdGVfZSc6XG4gICAgICAgIHRoaXMuaGFuZGxlQml0ZUVhc3QoZGVsdGEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb25zdGVyO1xuIiwibGV0IHBsYXllclNwcml0ZXMgPSByZXF1aXJlKCcuLi9zcHJpdGVzL3BsYXllcl9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IgKGN0eCwgY2FudmFzVywgY2FudmFzSCwgc3ByaXRlKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbMCwgMF07XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuZmFjaW5nUG9zID0gXCJyaWdodFwiO1xuICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgIHRoaXMuaGl0Qm94VyA9IDY5O1xuICAgIHRoaXMua2V5UHJlc3NlZCA9IHt9O1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuY2VudGVyQ29vcmRzID0gWzAsIDBdO1xuICAgIHRoaXMuaGVhbHRoID0gMzA7XG4gIH1cblxuICBkZWFkICgpIHtcbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG4gIH1cblxuICByZWR1Y2VIZWFsdGggKGRhbWFnZSkge1xuICAgIHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcbiAgICByZXR1cm4gZGFtYWdlO1xuICB9XG5cbiAgc2V0Q2VudGVyQ29vcmRzICh4LCB5KSB7XG4gICAgbGV0IGNlbnRlclggPSB4ICsgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC8gMik7XG4gICAgbGV0IGNlbnRlclkgPSB5ICsgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAvIDIpO1xuXG4gICAgcmV0dXJuIFtjZW50ZXJYLCBjZW50ZXJZXTtcbiAgfVxuXG4gIHJlbmRlcihub3cpIHtcbiAgICBpZiAoIXRoaXMuZ2FtZU92ZXIpIHtcblxuICAgICAgdmFyIHBsYXllclNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgcGxheWVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZS51cmw7XG5cbiAgICAgIC8vIHBsYXllclNwcml0ZS5hZGRFdmVudExpc3RlbmVyXG4gICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UocGxheWVyU3ByaXRlLCB0aGlzLnNoaWZ0LCAwLFxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgLy8gZGVidWdnZXJcblxuICAgICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzICYmICF0aGlzLmdhbWVPdmVyKSAge1xuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcHMgPSBmcHM7XG4gICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aDtcblxuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2RlYWQnKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHNldEhpdEJveCAoZmFjaW5nUG9zKSB7XG4gICAgc3dpdGNoIChmYWNpbmdQb3MpIHtcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA2OTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNjk7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDU1O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA1NTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNjk7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDU1O1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWNpbmdQb3M7XG4gICAgfVxuICB9XG5cbiAgY3VycmVudFBvc2l0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBwbGF5ZXJGYWNlOiB0aGlzLmZhY2luZ1Bvc1xuICAgIH07XG4gIH1cblxuICB1cGRhdGUoa2V5KSB7XG4gICAgY29uc3Qgc3ByaXRlSGVpZ2h0ID0gMTI1O1xuICAgIHRoaXMuc2V0SGl0Qm94KHRoaXMuZmFjaW5nUG9zKTtcbiAgICBsZXQgc3BlZWQgPSAxMjtcbiAgICAvLyBrZXkucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzddKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVMZWZ0O1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwibGVmdFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSA1KSB7dGhpcy5jb29yZGluYXRlc1swXS09c3BlZWQ7fVxuICAgICAgfVxuICAgICAgaWYodGhpcy5rZXlQcmVzc2VkWzM4XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlVXA7XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJ1cFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA+PSAxNSkge3RoaXMuY29vcmRpbmF0ZXNbMV0tPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszOV0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0O1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwicmlnaHRcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gKHRoaXMuY2FudmFzVyAtIHRoaXMuaGl0Qm94SCAtIDMwKSlcbiAgICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMF0rPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFs0MF0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZURvd247XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJkb3duXCI7XG4gICAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzFdIDw9ICh0aGlzLmNhbnZhc0ggLSB0aGlzLmhpdEJveEgpKVxuICAgICAgICB7dGhpcy5jb29yZGluYXRlc1sxXSs9c3BlZWQ7fVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmRlYWQ7XG4gICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsImNsYXNzIFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsO1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLmZyYW1lV2lkdGggPSBvcHRpb25zLmZyYW1lV2lkdGg7XG4gICAgdGhpcy5mcmFtZUhlaWdodCA9IG9wdGlvbnMuZnJhbWVIZWlnaHQ7XG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSBvcHRpb25zLmN1cnJlbnRGcmFtZTtcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gb3B0aW9ucy50b3RhbEZyYW1lcztcbiAgICB0aGlzLm9uY2UgPSBvcHRpb25zLm9uY2U7XG4gICAgdGhpcy5mcHMgPSBvcHRpb25zLmZwcztcbiAgICB0aGlzLmZwc1ggPSBvcHRpb25zLmZwc1g7XG4gICAgdGhpcy5kYW1hZ2UgPSBvcHRpb25zLmRhbWFnZTtcbiAgfVxufVxuLy8gdXJsLCBuYW1lLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcbiIsIi8vIEhPVyBUTyBCVUlMRCBQSFlTSUNTIEZPUiBBIFdFQVBPTj9cbi8vIEJVTExFVCBTUEVFRCwgU1BSRUFELCBEQU1BR0U/XG4vLyBETyBQSFlTSUNTIE5FRUQgVE8gQkUgQSBTRVBBUkFURSBDTEFTUz8gQ0FOIEkgSU1QT1JUIEEgTElCUkFSWSBUTyBIQU5ETEUgVEhBVCBMT0dJQz9cblxuY2xhc3MgV2VhcG9uIHtcbiAgY29uc3RydWN0b3IgKGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLnJhdGUgPSBhdHRyaWJ1dGVzLnJhdGU7XG4gICAgdGhpcy5tb2RlbCA9IGF0dHJpYnV0ZXMubW9kZWw7XG4gICAgdGhpcy5wb3dlciA9IGF0dHJpYnV0ZXMucG93ZXI7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYXBvbjtcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuLi9jbGFzc2VzL3Nwcml0ZScpO1xuLy8gTUFLRSBTTUFMTEVSXG5jb25zdCBibG9vZEhpdFNwcml0ZVNoZWV0ID0ge1xuICBwbGF5ZXJIaXQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2Jsb29kX3NtYWxsLnBuZycsXG4gICAgbmFtZTogJ3BsYXllckhpdCcsXG4gICAgZnJhbWVIZWlnaHQ6IDEyNCxcbiAgICBmcmFtZVdpZHRoOiAoNzYzIC8gNiksXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAxMCxcbiAgICBmcHNYOiAxLFxuICB9LFxuICAvLyBNQUtFIEJMT09EIERJRkZFUkVOVCBDT0xPUlxuICAvLyBVU0UgRlVMTCBTSVpFIE1PREVMXG4gIG1vbnN0ZXJIaXQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2Jsb29kX3NtYWxsLnBuZycsXG4gICAgbmFtZTogJ3BsYXllckhpdCcsXG4gICAgZnJhbWVIZWlnaHQ6IDEyNCxcbiAgICBmcmFtZVdpZHRoOiAoNzYzIC8gNiksXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAxMCxcbiAgICBmcHNYOiAxLFxuICB9LFxufTtcblxuY29uc3QgYmxvb2RIaXRTcHJpdGVzID0ge1xuICBwbGF5ZXJIaXQ6IG5ldyBTcHJpdGUoYmxvb2RIaXRTcHJpdGVTaGVldC5wbGF5ZXJIaXQpLFxuICBtb25zdGVySGl0OiBuZXcgU3ByaXRlKGJsb29kSGl0U3ByaXRlU2hlZXQubW9uc3RlckhpdCksXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJsb29kSGl0U3ByaXRlcztcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuLi9jbGFzc2VzL3Nwcml0ZScpO1xuLy8gSUYgQkxBTksgUkVOREVSIEJFRk9SRSBTUFJJVEUsIE5FRUQgVE8gUkVTRVQgU0hJRlQgVE8gMCEhXG5jb25zdCBidWxsZXRTcHJpdGVTaGVldCA9IHtcbiAgcmlmbGU6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZycsXG4gICAgbmFtZTogJ3JpZmxlJyxcbiAgICBmcmFtZUhlaWdodDogNixcbiAgICBmcmFtZVdpZHRoOiAxNCxcbiAgICBkYW1hZ2U6IDEwLFxuICB9LFxuXG4gIG1vbnN0ZXI6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfdmVydC5wbmcnLFxuICAgIG5hbWU6ICdtb25zdGVyJyxcbiAgICBmcmFtZUhlaWdodDogMzIsXG4gICAgZnJhbWVXaWR0aDogOSxcbiAgICBkYW1hZ2U6IDEwLFxuICB9LFxufTtcblxuY29uc3QgYnVsbGV0U3ByaXRlcyA9IHtcbiAgcmlmbGU6IG5ldyBTcHJpdGUoYnVsbGV0U3ByaXRlU2hlZXQucmlmbGUpLFxuICBtb25zdGVyOiBuZXcgU3ByaXRlKGJ1bGxldFNwcml0ZVNoZWV0Lm1vbnN0ZXIpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1bGxldFNwcml0ZXM7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi4vY2xhc3Nlcy9zcHJpdGUnKTtcbi8vIElGIEJMQU5LIFJFTkRFUiBCRUZPUkUgU1BSSVRFLCBORUVEIFRPIFJFU0VUIFNISUZUIFRPIDAhIVxuY29uc3QgbW9uc3RlclNwcml0ZVNoZWV0ID0ge1xuICBkaXJ0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG4gICAgbmFtZTogJ2ludHJvJyxcbiAgICBmcmFtZUhlaWdodDogMTY2LFxuICAgIGZyYW1lV2lkdGg6IDE1MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDE2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBpbnRybzoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuICAgIG5hbWU6ICdpbnRybycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2NixcbiAgICBmcmFtZVdpZHRoOiAxNTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMTAwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgaWRsZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pZGxlLnBuZycsXG4gICAgbmFtZTogJ2lkbGUnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNzMsXG4gICAgZnJhbWVXaWR0aDogMjAzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTIsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAxMjUsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBnbG93OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2lkbGVfZ2xvdzIucG5nJyxcbiAgICBuYW1lOiAnZ2xvdycsXG4gICAgZnJhbWVIZWlnaHQ6IDE3MyxcbiAgICBmcmFtZVdpZHRoOiAyMjMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxMixcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgYml0ZV93OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9iaXRlX3dlc3QucG5nJyxcbiAgICBuYW1lOiAnYml0ZV93JyxcbiAgICBmcmFtZUhlaWdodDogMTYzLFxuICAgIGZyYW1lV2lkdGg6IDE5MixcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDUsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMS41LFxuICB9LFxuXG4gIGJpdGVfZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV9lYXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfZScsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEuNSxcbiAgfSxcblxuICBkZWFkOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2RlYWQucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA0LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMSxcbiAgfVxufTtcblxuY29uc3QgbW9uc3RlclNwcml0ZXMgPSB7XG4gIGludHJvOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5pbnRybyksXG4gIGlkbGU6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmlkbGUpLFxuICBnbG93OiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5nbG93KSxcbiAgZGVhZDogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuZGVhZCksXG4gIGJpdGVfdzogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuYml0ZV93KSxcbiAgYml0ZV9lOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5iaXRlX2UpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vbnN0ZXJTcHJpdGVzO1xuIiwibGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4uL2NsYXNzZXMvc3ByaXRlJyk7XG5cbmNvbnN0IHBsYXllclNwcml0ZVNoZWV0ID0ge1xuICBkZWFkOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9ibG9vZF9zbWFsbC5wbmcnLFxuICAgIG5hbWU6ICdkZWFkJyxcbiAgICBmcmFtZUhlaWdodDogMTI0LFxuICAgIGZyYW1lV2lkdGg6ICg3NjMgLyA2KSxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDE1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGVtcHR5OiB7XG4gICAgdXJsOiAnJyxcbiAgICBuYW1lOiAnJyxcbiAgICBmcmFtZUhlaWdodDogMCxcbiAgICBmcmFtZVdpZHRoOiAwLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMCxcbiAgICBvbmNlOiAwLFxuICAgIGZwczogMCxcbiAgICBmcHNYOiAwLFxuICB9LFxuXG4gIGFsaXZlTGVmdDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2xlZnQucG5nJyxcbiAgICBuYW1lOiAnbGVmdCcsXG4gICAgZnJhbWVIZWlnaHQ6IDU1LFxuICAgIGZyYW1lV2lkdGg6IDkzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICAvLyBoaXRCb3hIZWlnaHRPZmZzZXQ6XG4gICAgLy8gaGl0Qm94V2lkdGhPZmZzZXQ6XG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuICBhbGl2ZVVwOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfdXAucG5nJyxcbiAgICBuYW1lOiAndXAnLFxuICAgIGZyYW1lSGVpZ2h0OiA5MyxcbiAgICBmcmFtZVdpZHRoOiA1NSxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuICBhbGl2ZVJpZ2h0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGUucG5nJyxcbiAgICBuYW1lOiAncmlnaHQnLFxuICAgIGZyYW1lSGVpZ2h0OiA1NSxcbiAgICBmcmFtZVdpZHRoOiA5MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuICBhbGl2ZURvd246IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9kb3duLnBuZycsXG4gICAgbmFtZTogJ2Rvd24nLFxuICAgIGZyYW1lSGVpZ2h0OiA5MyxcbiAgICBmcmFtZVdpZHRoOiA1NSxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxufTtcblxuY29uc3QgcGxheWVyU3ByaXRlcyA9IHtcbiAgZGVhZDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5kZWFkKSxcbiAgYWxpdmVMZWZ0OiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlTGVmdCksXG4gIGFsaXZlVXA6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVVcCksXG4gIGFsaXZlUmlnaHQ6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVSaWdodCksXG4gIGFsaXZlRG93bjogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZURvd24pLFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBsYXllclNwcml0ZXM7XG4iLCJsZXQgbW9uc3RlclNwcml0ZXMgPSByZXF1aXJlKCcuL2xpYi9zcHJpdGVzL21vbnN0ZXJfc3ByaXRlcy5qcycpO1xubGV0IHBsYXllclNwcml0ZXMgPSByZXF1aXJlKCcuL2xpYi9zcHJpdGVzL3BsYXllcl9zcHJpdGVzLmpzJyk7XG5sZXQgYnVsbGV0U3ByaXRlcyA9IHJlcXVpcmUoJy4vbGliL3Nwcml0ZXMvYnVsbGV0X3Nwcml0ZXMuanMnKTtcbmxldCBibG9vZEhpdFNwcml0ZXMgPSByZXF1aXJlKCcuL2xpYi9zcHJpdGVzL2Jsb29kX2hpdF9zcHJpdGVzLmpzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9saWIvY2xhc3Nlcy9zcHJpdGUuanMnKTtcbmxldCBNb25zdGVyID0gcmVxdWlyZSgnLi9saWIvY2xhc3Nlcy9tb25zdGVyLmpzJyk7XG5sZXQgQmxvb2RIaXQgPSByZXF1aXJlKCcuL2xpYi9jbGFzc2VzL2Jsb29kX2hpdC5qcycpO1xubGV0IFBsYXllciA9IHJlcXVpcmUoJy4vbGliL2NsYXNzZXMvcGxheWVyLmpzJyk7XG5sZXQgV2VhcG9ucyA9IHJlcXVpcmUoJy4vbGliL2NsYXNzZXMvd2VhcG9ucy5qcycpO1xubGV0IEJ1bGxldCA9IHJlcXVpcmUoJy4vbGliL2NsYXNzZXMvYnVsbGV0LmpzJyk7XG5sZXQgcHJlbG9hZEltYWdlcyA9IHJlcXVpcmUoJy4vcmVzb3VyY2VzLmpzJyk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBsZXQgbXlSZXE7XG4gIHByZWxvYWRBc3NldHMoKTtcblxuICBmdW5jdGlvbiBzdGFydEdhbWUgKCkge1xuICAgIGxldCBzdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xuICAgIGxldCBtdXNpYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtdXNpYycpO1xuICAgIGxldCBpbnRyb011c2ljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhdmVfdGhlbWUnKTtcbiAgICBpbnRyb011c2ljLnZvbHVtZSA9IDE7XG4gICAgLy8gc2V0IHVwIGRhdGUgbm93XG4gICAgLy8gY29udmVydCB0byBzZWNvbmRzXG4gICAgLy8gZW5kIHdoZW4gZ2FtZU92ZXJcbiAgICAvLyBoYXZlIHRpbWVyIGRpdiBzZXQgdXAgYW5kIGFwcGVuZCB0byB0aGUgaWQgb2YgdGhlIGRpdiB0YWdcblxuICAgIHN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBzdGFydC5jbGFzc05hbWUgPSAnc3RhcnRfYnV0dG9uX2hpZGUnO1xuICAgICAgICBnYW1lU3RhcnQgPSB0cnVlO1xuICAgICAgICBnYW1lV2luID0gZmFsc2U7XG4gICAgICAgIGdhbWVUaW1lclN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgaW50cm9NdXNpYy5wYXVzZSgpO1xuICAgICAgICBtdXNpYy52b2x1bWUgPSAuNztcbiAgICAgICAgbXVzaWMucGxheSgpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQub25rZXlwcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgc3RhcnQuY2xhc3NOYW1lID0gJ3N0YXJ0X2J1dHRvbl9oaWRlJztcbiAgICAgICAgZ2FtZVN0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgZ2FtZVdpbiA9IGZhbHNlO1xuICAgICAgICBnYW1lVGltZXJTdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgIGludHJvTXVzaWMucGF1c2UoKTtcbiAgICAgICAgbXVzaWMudm9sdW1lID0gLjc7XG4gICAgICAgIG11c2ljLnBsYXkoKTtcbiAgICAgIH1cbiAgICB9O1xuXG5cblxuICAgIGxldCBhdWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdWRpb19ob3ZlcicpO1xuICAgIGF1ZGlvLnZvbHVtZSA9IDAuNDtcbiAgICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbihldnQpIHtcbiAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWxvYWRBc3NldHMgKCkge1xuICAgIHByZWxvYWRJbWFnZXMuZm9yRWFjaChpbWFnZSA9PiB7XG4gICAgICBsZXQgbG9hZGVkSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGxvYWRlZEltYWdlLnNyYyA9IGltYWdlO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXJQcm9tcHQgKCkge1xuICAgIGdhbWVUaW1lclN0b3AgPSB0cnVlO1xuICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICBsZXQgYXVkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW9faG92ZXInKTtcbiAgICBsZXQgc2NvcmVTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmVfc2NyZWVuJyk7XG4gICAgaWYgKGdhbWVXaW4pIHtcbiAgICAgIHNjb3JlU2NyZWVuLmlubmVySFRNTCA9IGBXb3JtIEJvc3MgZGVmZWF0ZWQgaW4gJHtlbGFwc2VkfSBzZWNvbmRzIWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjb3JlU2NyZWVuLmlubmVySFRNTCA9IGBZb3Ugc3Vydml2ZWQgZm9yICR7ZWxhcHNlZH0gc2Vjb25kcy5gO1xuICAgIH1cblxuICAgIGxldCB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHNjb3JlU2NyZWVuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH0sIDIwMDApO1xuXG4gICAgYXVkaW8udm9sdW1lID0gMC40O1xuICAgIGdhbWVPdmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgYXVkaW8ucGxheSgpO1xuICAgIH0pO1xuXG4gICAgZ2FtZU92ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgc2NvcmVTY3JlZW4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmRlYWQuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmlkbGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHBsYXllci5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICBtb25zdGVyU3ByaXRlcy5pbnRyby5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgcmVzdGFydEdhbWUoKTtcbiAgICB9KTtcblxuICAgIC8vIGRvY3VtZW50Lm9ua2V5cHJlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgLy8gICAvLyBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAvLyAgIGlmIChldnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAvLyAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIC8vICAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIC8vICAgICBtb25zdGVyU3ByaXRlcy5kZWFkLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgLy8gICAgIG1vbnN0ZXJTcHJpdGVzLmlkbGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAvLyAgICAgcGxheWVyLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAvLyAgICAgbW9uc3RlclNwcml0ZXMuaW50cm8uY3VycmVudEZyYW1lID0gMDtcbiAgICAvLyAgICAgcmVzdGFydEdhbWUoKTtcbiAgICAvLyAgIH1cbiAgICAvLyB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzdGFydEdhbWUgKCkge1xuICAgIGdhbWVUaW1lclN0b3AgPSBmYWxzZTtcbiAgICBnYW1lVGltZXJTdGFydCA9IERhdGUubm93KCk7XG4gICAgbGV0IGdhbWVPdmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWVfb3ZlcicpO1xuICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBtb25zdGVyID0gbmV3IE1vbnN0ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgICBtb25zdGVyU3ByaXRlcy5pbnRybyk7XG4gICAgcGxheWVyID0gbmV3IFBsYXllcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICAgIHBsYXllclNwcml0ZXMuYWxpdmVSaWdodCk7XG4gICAgbW9uc3RlckJ1bGxldHMgPSBtb25zdGVyLmJ1bGxldHM7XG4gIH1cblxuICBsZXQgbW9uc3RlciA9IG5ldyBNb25zdGVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvKTtcbiAgbGV0IGdhbWVTdGFydCA9IGZhbHNlO1xuICBsZXQgYnVsbGV0cyA9IFtdO1xuICBsZXQgbW9uc3RlckJ1bGxldHMgPSBtb25zdGVyLmJ1bGxldHM7XG4gIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgIHBsYXllclNwcml0ZXMuYWxpdmVSaWdodCk7XG4gIGxldCBsYXN0VGltZSA9IERhdGUubm93KCk7XG4gIGxldCBrZXk7XG4gIGxldCBhbGxvd0ZpcmUgPSB0cnVlO1xuICBsZXQgcGxheWVySGl0ID0gbmV3IEJsb29kSGl0KHBsYXllci5jdXJyZW50UG9zaXRpb24oKSwgY3R4LFxuICAgIGJsb29kSGl0U3ByaXRlcy5wbGF5ZXJIaXQpO1xuXG4gIGxldCBnYW1lV2luID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGNvbGxpc2lvbkRldGVjdGVkICgpIHtcbiAgICBsZXQgY29sbGlkZUJ1bGxldHMgPSBPYmplY3QuYXNzaWduKFtdLCBidWxsZXRzKTtcbiAgICBsZXQgYnVsbGV0WDtcbiAgICBsZXQgYnVsbGV0WTtcbiAgICBsZXQgcGxheWVyWCA9IHBsYXllci5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgcGxheWVyWSA9IHBsYXllci5jb29yZGluYXRlc1sxXTtcbiAgICBsZXQgbW9uc3RlclggPSBtb25zdGVyLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCBtb25zdGVyWSA9IG1vbnN0ZXIuY29vcmRpbmF0ZXNbMV07XG4gICAgbGV0IG1IQm9mZnNldCA9IDQwO1xuXG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICAgIGJ1bGxldFggPSBidWxsZXQuY29vcmRpbmF0ZXNbMF07XG4gICAgICAgIGJ1bGxldFkgPSBidWxsZXQuY29vcmRpbmF0ZXNbMV07XG4gICAgICAgIGlmIChidWxsZXRYIDwgbW9uc3RlclggKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAtIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFggKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID4gbW9uc3RlclggKyBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLSBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPiBtb25zdGVyWSArIG1IQm9mZnNldCkge1xuICAgICAgICAgICAgbW9uc3Rlci5yZWR1Y2VIZWFsdGgoYnVsbGV0LmN1cnJlbnRTcHJpdGUuZGFtYWdlKTtcbiAgICAgICAgICAgIGJ1bGxldHMuc3BsaWNlKDAsIDEpO1xuXG4gICAgICAgICAgICBpZiAobW9uc3Rlci5oZWFsdGggPD0gMCkge1xuICAgICAgICAgICAgICBnYW1lV2luID0gdHJ1ZTtcbiAgICAgICAgICAgICAgbW9uc3Rlci5kZWZlYXRlZCgpO1xuICAgICAgICAgICAgICBnYW1lT3ZlclByb21wdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICBidWxsZXRYID0gYnVsbGV0LmNvb3JkaW5hdGVzWzBdO1xuICAgICAgYnVsbGV0WSA9IGJ1bGxldC5jb29yZGluYXRlc1sxXTtcbiAgICAgIGlmIChidWxsZXRYIDwgcGxheWVyWCArIHBsYXllci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggJiZcbiAgICAgICAgYnVsbGV0WCArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPiBwbGF5ZXJYICYmXG4gICAgICAgIGJ1bGxldFkgPCBwbGF5ZXJZICsgcGxheWVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgJiZcbiAgICAgICAgYnVsbGV0WSArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID4gcGxheWVyWSkge1xuICAgICAgICAgIHBsYXllci5yZWR1Y2VIZWFsdGgoYnVsbGV0LmN1cnJlbnRTcHJpdGUuZGFtYWdlKTtcbiAgICAgICAgICBsZXQgaW5kZXggPSBtb25zdGVyQnVsbGV0cy5pbmRleE9mKGJ1bGxldCk7XG4gICAgICAgICAgbW9uc3RlckJ1bGxldHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICBwbGF5ZXJIaXQgPSBuZXcgQmxvb2RIaXQocGxheWVyLmN1cnJlbnRQb3NpdGlvbigpLCBjdHgsXG4gICAgICAgICAgYmxvb2RIaXRTcHJpdGVzLnBsYXllckhpdCk7XG4gICAgICAgICAgcGxheWVySGl0LmNvbGxpc2lvbiA9IHRydWU7XG5cbiAgICAgICAgICBpZiAocGxheWVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICBwbGF5ZXJIaXQuY29sbGlzaW9uID0gZmFsc2U7XG4gICAgICAgICAgICBwbGF5ZXIuZGVhZCgpO1xuICAgICAgICAgICAgbW9uc3Rlci5wbGF5ZXJEZWZlYXRlZCgpO1xuICAgICAgICAgICAgZ2FtZU92ZXJQcm9tcHQoKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGxheWVyWCA8IG1vbnN0ZXJYICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLSBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWCArIHBsYXllci5oaXRCb3hXID4gbW9uc3RlclggKyBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWSA8IG1vbnN0ZXJZICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC0gbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclkgKyBwbGF5ZXIuaGl0Qm94SCA+IG1vbnN0ZXJZICsgbUhCb2Zmc2V0ICYmXG4gICAgICBnYW1lU3RhcnQgJiYgbW9uc3Rlci5hbGl2ZSkge1xuICAgICAgICBwbGF5ZXIuZGVhZCgpO1xuICAgICAgICBtb25zdGVyLnBsYXllckRlZmVhdGVkKCk7XG4gICAgICAgIGdhbWVPdmVyUHJvbXB0KCk7XG4gICAgICB9XG4gIH1cblxuICBsZXQgbGFzdEJ1bGxldDtcbiAgZnVuY3Rpb24gRmlyZSAoKSB7XG4gICAgYWxsb3dGaXJlID0gZmFsc2U7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBhbGxvd0ZpcmUgPSB0cnVlO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG9vdCAocGxheWVyUG9zKSB7XG4gICAgICBidWxsZXRzLnB1c2gobmV3IEJ1bGxldChwbGF5ZXJQb3MsIGNhbnZhcy53aWR0aCxcbiAgICAgICAgY2FudmFzLmhlaWdodCwgY3R4LCBidWxsZXRTcHJpdGVzLnJpZmxlKSk7XG5cbiAgICAgIGJ1bGxldHMgPSBidWxsZXRzLmZpbHRlcihidWxsZXQgPT4gYnVsbGV0LmFjdGl2ZSk7XG5cbiAgICBGaXJlKCk7XG4gICAgbGV0IGJ1bGxldFNvdW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1bGxldCcpO1xuICAgIGJ1bGxldFNvdW5kLnZvbHVtZSA9IDAuNztcbiAgICBidWxsZXRTb3VuZC5sb2FkKCk7XG4gICAgYnVsbGV0U291bmQucGxheSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlIChrZXksIGR0LCBkZWx0YSkge1xuICAgIHBsYXllci51cGRhdGUoa2V5KTtcbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBtb25zdGVyLnVwZGF0ZShwbGF5ZXIuY29vcmRpbmF0ZXMsIGR0LCBkZWx0YSk7XG4gICAgfVxuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnVwZGF0ZShkdCwgJ3BsYXllcicpKTtcbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQudXBkYXRlKGR0LCAnbW9uc3RlcicpKTtcbiAgfVxuXG4gIGNvbnN0IGNsZWFyID0gKCkgPT4gIHtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVuZGVyIChub3cpIHtcbiAgICBpZiAocGxheWVySGl0LmNvbGxpc2lvbikge1xuICAgICAgcGxheWVySGl0LnJlbmRlcihub3cpO1xuICAgIH1cblxuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIG1vbnN0ZXIucmVuZGVyKG5vdyk7XG4gICAgfVxuXG4gICAgcGxheWVyLnJlbmRlcihub3cpO1xuXG4gICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQucmVuZGVyKCkpO1xuXG4gICAgbW9uc3RlckJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnJlbmRlcigpKTtcbiAgICBpZiAobW9uc3Rlci5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdpbnRybycgJiZcbiAgICBnYW1lU3RhcnQgJiYgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT0gMSkge1xuICAgICAgbGV0IGludHJvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ludHJvX21vbnN0ZXInKTtcbiAgICAgIGludHJvLnZvbHVtZSA9IDE7XG4gICAgICBpbnRyby5wbGF5KCk7XG4gICAgfSBlbHNlIGlmIChtb25zdGVyLmN1cnJlbnRTcHJpdGUubmFtZSAhPT0gJ2ludHJvJyAmJiBnYW1lU3RhcnQgJiZcbiAgICBtb25zdGVyLmFsaXZlKSB7XG4gICAgICBsZXQgbW9uQkcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9uc3Rlcl9iZycpO1xuICAgICAgbW9uQkcudm9sdW1lID0gMTtcbiAgICAgIG1vbkJHLnBsYXliYWNrUmF0ZSA9IDMuNTtcbiAgICAgIG1vbkJHLnBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgbGV0IGtleXMgPSBbMzIsIDM3LCAzOCwgMzksIDQwXTtcbiAgICBrZXkgPSBldnQud2hpY2g7XG4gICAgaWYoa2V5cy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgcGxheWVyLmtleVByZXNzZWRba2V5XSA9IHRydWU7XG4gICAgaWYgKGtleSA9PT0gMzIgJiYgcGxheWVyLmFsaXZlICYmIGFsbG93RmlyZSkge1xuICAgICAgc2hvb3QocGxheWVyLmN1cnJlbnRQb3NpdGlvbigpKTtcbiAgICB9XG4gIH07XG5cbiAgZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBsYXllci5rZXlQcmVzc2VkW2V2dC53aGljaF0gPSBmYWxzZTtcbiAgICBrZXkgPSBudWxsO1xuICB9O1xuICBsZXQgZ2FtZVRpbWVyU3RvcCA9IGZhbHNlO1xuICBsZXQgZ2FtZVRpbWVyU3RhcnQ7XG4gIGxldCBlbGFwc2VkO1xuICBmdW5jdGlvbiB0aW1lcigpIHtcbiAgICBsZXQgdGltZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lcicpO1xuICAgIGlmIChnYW1lU3RhcnQgJiYgIWdhbWVUaW1lclN0b3ApIHtcbiAgICAgIGVsYXBzZWQgPSAoKERhdGUubm93KCkgLSBnYW1lVGltZXJTdGFydCkgLyAxMDAwKS50b0ZpeGVkKDEpO1xuXG4gICAgICB0aW1lLmlubmVySFRNTCA9IGVsYXBzZWQ7XG4gICAgfVxuICB9XG5cbiAgLy8gbGV0IGRlbHRhO1xuICBmdW5jdGlvbiBtYWluKCkge1xuICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGxldCBkZWx0YSA9IG5vdyAtIGxhc3RUaW1lO1xuICAgIGxldCBkdCA9IChkZWx0YSkgLyA1MDAuMDtcbiAgICBteVJlcSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSggbWFpbiApO1xuICAgIGNvbGxpc2lvbkRldGVjdGVkKCk7XG4gICAgdGltZXIoKTtcbiAgICB1cGRhdGUoa2V5LCBkdCwgZGVsdGEpO1xuICAgIGNsZWFyKCk7XG4gICAgcmVuZGVyKG5vdyk7XG4gICAgbGFzdFRpbWUgPSBub3c7XG4gIH1cbiAgbXlSZXEgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG1haW4gKTtcbiAgc3RhcnRHYW1lKCk7XG59O1xuIiwiY29uc3QgaW1hZ2VzID0gW1xuICAnYXNzZXRzL2ltYWdlcy9hcnJvd19rZXlzLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2Fycm93c19wb3AucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYmdfZmluYWwucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV9lYXN0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfbm9ydGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV9zb3V0aC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9iaXRlX3dlc3QucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYmxvb2Rfc21hbGwucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvZGlydF9wb3AucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvZGlydF9wb3AucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvZ2l0aHViLW9yaWdpbmFsLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2dsb2JlLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2xpbmtlZGluX2xvZ28ucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9sZWZ0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbmUucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9udy5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3JpZ2h0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc2UucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zb3V0aC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3N3LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfdmVydC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfZG93bi5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfbGVmdC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfdXAucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3NwYWNlYmFyLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dvcm1fZGVhZC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy93b3JtX2lkbGUucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvd29ybV9pZGxlX2dsb3cyLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dvcm1faW50cm8ucG5nJyxcbl07XG5cbm1vZHVsZS5leHBvcnRzID0gaW1hZ2VzO1xuIl19
