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
      this.coordinates[0] - (this.currentSprite.frameWidth / 2),
      this.coordinates[1] - (this.currentSprite.frameHeight / 2),
      this.currentSprite.frameWidth, this.currentSprite.frameHeight);

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
    this.maxHP = 1000;
    this.health = 1000;
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
    this.chargeVelocity = 1.5;
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
      let velocity = this.chargeVelocity;

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
    let speed = 150;
    if (this.health <= this.maxHP * 0.75 && this.health > this.maxHP * 0.5) {
      this.chargeVelocity = 2;
      speed = 130;
    } else if (this.health <= this.maxHP * 0.5 && this.health >
      this.maxHP * 0.25) {
      speed = 110;
    } else if (this.health <= this.maxHP * 0.25) {
      this.chargeVelocity = 2.25;
      speed = 90;
    }

    if (!this.gameOver && this.counter >= speed && this.glowActive &&
      this.currentSprite.currentFrame === this.currentSprite.totalFrames) {
      this.shift = 0;
      this.currentSprite = monsterSprites.glow;
      this.currentSprite.currentFrame = 0;
      this.glowActive = false;
    }

    if (this.counter >= speed && !this.gameOver && !this.glowActive &&
      this.currentSprite.currentFrame === this.currentSprite.totalFrames) {
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
      if(this.keyPressed[37] || this.keyPressed[65]) {
        this.currentSprite = playerSprites.aliveLeft;
        this.facingPos = "left";
        if (this.coordinates[0] >= 5) {this.coordinates[0]-=speed;}
      }
      if(this.keyPressed[38] || this.keyPressed[87]) {
        this.currentSprite = playerSprites.aliveUp;
        this.facingPos = "up";
        if (this.coordinates[1] >= 15) {this.coordinates[1]-=speed;}
      }
      if(this.keyPressed[39] || this.keyPressed[68]) {
        this.currentSprite = playerSprites.aliveRight;
        this.facingPos = "right";
        if (this.coordinates[0] <= (this.canvasW - this.hitBoxH - 30))
        {this.coordinates[0]+=speed;}
      }
      if(this.keyPressed[40] || this.keyPressed[83]) {
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
    url: 'assets/images/monster_blood.png',
    name: 'playerHit',
    frameHeight: 324,
    frameWidth: (1957 / 6),
    currentFrame: 0,
    totalFrames: 6,
    once: true,
    fps: 5,
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
    fps: 400,
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

  let sounds = document.getElementsByTagName('audio');
  let audioMute = document.getElementById('audio');
  audioMute.addEventListener('click', function(e) {
    let i;
    if (sounds[0].muted === true) {
      audioMute.src = "assets/images/audio_play.png";
      // audioMute = document.getElementById('audio');
    } else {
      audioMute.src = "assets/images/audio_mute.png";
      // audioMute = document.getElementById('audio');
    }

    for (i = 0; i < sounds.length; i++) {
      if(sounds[i].muted === true) {
        sounds[i].muted = false;
      } else {
        sounds[i].muted = true;
      }
    }
  });

  function startGame () {
    let start = document.getElementById('start');
    let music = document.getElementById('music');
    let introMusic = document.getElementById('cave_theme');
    let healthBar = document.getElementById('healthbar');
    introMusic.volume = 1;

    start.addEventListener('click', function(e) {
        healthBar.style.display = "block";
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
        healthBar.style.display = "block";
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
  let timeout;
  let restartReady = false;
  function gameOverPrompt () {
    let introMusic = document.getElementById('cave_theme');
    introMusic.volume = 1;
    introMusic.play();
    let music = document.getElementById('music');
    music.pause();
    gameTimerStop = true;
    let gameOver = document.getElementById('game_over');
    let audio = document.getElementById('audio_hover');
    let scoreScreen = document.getElementById('score_screen');
    if (gameWin) {
      scoreScreen.innerHTML = `Worm Boss defeated in ${elapsed} seconds!`;
    } else {
      scoreScreen.innerHTML = `You survived for ${elapsed} seconds.`;
    }

    gameOver.style.display = 'block';
    scoreScreen.style.display = 'block';
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
  }

  function restartGame () {
    let music = document.getElementById('music');
    let gameOver = document.getElementById('game_over');
    let scoreScreen = document.getElementById('score_screen');
    let healthbar = document.getElementById('healthbar');
    healthbar.value = monster.maxHP;
    music.volume = .7;
    music.play();
    gameTimerStop = false;
    gameTimerStart = Date.now();
    gameWin = false;
    scoreScreen.style.display = 'none';
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
  let monsterHit = new BloodHit(monster.currentPosition(), ctx,
    bloodHitSprites.monsterHit);

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
      let bloodSquirt = document.getElementById('monster_hit');
      bullets.forEach(bullet => {
        bulletX = bullet.coordinates[0];
        bulletY = bullet.coordinates[1];
        if (bulletX < monsterX + monster.currentSprite.frameWidth - mHBoffset &&
          bulletX + bullet.currentSprite.frameWidth > monsterX + mHBoffset &&
          bulletY < monsterY + monster.currentSprite.frameHeight - mHBoffset &&
          bulletY + bullet.currentSprite.frameHeight > monsterY + mHBoffset) {
            bloodSquirt.volume = 1;
            bloodSquirt.playbackRate = 4;
            bloodSquirt.play();
            monster.reduceHealth(bullet.currentSprite.damage);
            bullets.splice(0, 1);
            monsterHit = new BloodHit(monster.currentPosition(), ctx,
            bloodHitSprites.monsterHit);
            monsterHit.collision = true;
            let health = document.getElementById('healthbar');
            health.value -= bullet.currentSprite.damage;

            if (monster.health <= 0) {
              let death = document.getElementById('monster_death');
              death.volume = 1;
              death.play();
              monsterHit.collision = false;
              gameWin = true;
              monster.defeated();
              gameOverPrompt();
            }

          }
        }
      );
    }

    let grunt = document.getElementById('grunt');
    monsterBullets.forEach(bullet => {
      bulletX = bullet.coordinates[0];
      bulletY = bullet.coordinates[1];
      if (bulletX < playerX + player.currentSprite.frameWidth &&
        bulletX + bullet.currentSprite.frameWidth > playerX &&
        bulletY < playerY + player.currentSprite.frameHeight &&
        bulletY + bullet.currentSprite.frameHeight > playerY) {
          player.reduceHealth(bullet.currentSprite.damage);
          grunt.volume = 1;
          grunt.playbackRate = 2;
          grunt.play();
          let index = monsterBullets.indexOf(bullet);
          monsterBullets.splice(index, 1);
          if (player.health > 0) {
            playerHit = new BloodHit(player.currentPosition(), ctx,
            bloodHitSprites.playerHit);
            playerHit.collision = true;
          }

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

    if (monsterHit.collision) {
      monsterHit.render(now);
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

    if (!monster.alive || !player.alive) {
      let gameOver = document.getElementById('game_over');
      if (key === 13) {
        gameOver.style.display = 'none';
        monsterSprites.dead.currentFrame = 0;
        monsterSprites.idle.currentFrame = 0;
        player.currentSprite.currentFrame = 0;
        monsterSprites.intro.currentFrame = 0;
        restartGame();
      }
    }
  };

  document.onkeyup = function(evt) {
    evt.preventDefault();
    player.keyPressed[evt.which] = false;
    key = null;
  };
  let gameTimerStop = false;
  let gameTimerStart = (0).toFixed(1);
  let elapsed;
  function timer() {
    let time = document.getElementById('timer');

    if (gameStart && !gameTimerStop) {
      elapsed = ((Date.now() - gameTimerStart) / 1000).toFixed(1);
      time.innerHTML = `${elapsed}`;
    } else if (gameTimerStop) {
      time.innerHTML = elapsed;
    } else {
      time.innerHTML = gameTimerStart;
    }
  }

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
  'assets/images/wasd.png',
];

module.exports = images;

},{}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImxpYi9jbGFzc2VzL2Jsb29kX2hpdC5qcyIsImxpYi9jbGFzc2VzL2J1bGxldC5qcyIsImxpYi9jbGFzc2VzL21vbnN0ZXIuanMiLCJsaWIvY2xhc3Nlcy9wbGF5ZXIuanMiLCJsaWIvY2xhc3Nlcy9zcHJpdGUuanMiLCJsaWIvY2xhc3Nlcy93ZWFwb25zLmpzIiwibGliL3Nwcml0ZXMvYmxvb2RfaGl0X3Nwcml0ZXMuanMiLCJsaWIvc3ByaXRlcy9idWxsZXRfc3ByaXRlcy5qcyIsImxpYi9zcHJpdGVzL21vbnN0ZXJfc3ByaXRlcy5qcyIsImxpYi9zcHJpdGVzL3BsYXllcl9zcHJpdGVzLmpzIiwibWFpbi5qcyIsInJlc291cmNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9SQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9XQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNwcml0ZVxuLy8gUkVOREVSXG4vLyBzcHJpdGVzaGVldCBmb3IgZGlmZmVyZW50IGluIGZwcyBhbmQgc2l6ZSBvZiBibG9vZFxuXG5jbGFzcyBCbG9vZEhpdCB7XG4gIGNvbnN0cnVjdG9yIChwbGF5ZXJBdHRyLCBjdHgsIHNwcml0ZSkge1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHNwcml0ZTtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnBsYXllclBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllckF0dHIuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBwbGF5ZXJBdHRyLmNvb3JkaW5hdGVzO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5jb2xsaXNpb24gPSBmYWxzZTtcbiAgfVxuXG4gIHJlbmRlciAobm93KSB7XG4gICAgdmFyIGJsb29kSGl0U3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgYmxvb2RIaXRTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYmxvb2RIaXRTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgdGhpcy5jb29yZGluYXRlc1swXSAtICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAvIDIpLFxuICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSAtICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLyAyKSxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuXG4gICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgaWYgKG5vdyAtIHRoaXMubGFzdFVwZGF0ZSA+IGZwcykgIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgIC8vIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAvLyAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyAmJlxuICAgICAgICAvLyAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnZGVhZCcpIHtcbiAgICAgICAgLy8gICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG4gICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMpIHtcbiAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSArPSAxO1xuICAgICAgICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb29kSGl0O1xuIiwiY2xhc3MgQnVsbGV0IHtcbiAgY29uc3RydWN0b3IocGxheWVyQXR0ciwgY2FudmFzVywgY2FudmFzSCwgY3R4LCBzcHJpdGUsIGJ1bGxldENvdW50KSB7XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnBsYXllclBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllckF0dHIuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMucGxheWVyRmFjZSA9IHBsYXllckF0dHIucGxheWVyRmFjZTtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gdGhpcy5zZXRDb29yZGluYXRlcyh0aGlzLnBsYXllclBvcyk7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuYnVsbGV0Q291bnRlciA9IDA7XG4gICAgdGhpcy5idWxsZXRDb3VudCA9IGJ1bGxldENvdW50O1xuXG4gICAgLy8gQkFORCBBSUQgRk9SIE1PTlNURVIgQlVMTEVUU1xuICAgIC8vIFNIT1VMRCBBTFNPIFdPUksgRk9SIFBMQVlFUiBCVUxMRVRTIFNISUZUSU5HXG4gICAgLy8gQUNUVUFMTFkgV09SS1MgUFJFVFRZIE5JQ0VMWSwgTk9UIFNVUkUgSUYgQkVUVEVSIFdBWSBUT1xuICAgIC8vIERPIFRISVMgQUNUSU9OIFNJTkNFIE9OTFkgVVNJTkcgMSBTUFJJVEVcbiAgICB0aGlzLmN1cnJlbnRVUkwgPSBcIlwiO1xuXG5cbiAgICB0aGlzLnNldENvb3JkaW5hdGVzID0gdGhpcy5zZXRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2V0SGl0Qm94ID0gdGhpcy5zZXRIaXRCb3guYmluZCh0aGlzKTtcbiAgfVxuICAvLyBCVUxMRVRTIFdJTEwgQ0hBTkdFIFNQUklURVMgV0hFTiBBTk9USEVSIFNIT1QgSVMgVEFLRU5cbiAgLy8gTkVFRCBUTyBLRUVQIFRIRSBJTUFHRSBXSEVOIFNIT1QgSVMgVEFLRU5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgYnVsbGV0U3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgYnVsbGV0U3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYnVsbGV0U3ByaXRlLCB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdKTtcbiAgfVxuXG4gIHNldEhpdEJveCAocGxheWVyRmFjZSkge1xuICAgIGxldCBkaW1lbnNpb25zQ29weSA9IE9iamVjdC5hc3NpZ24oW10sXG4gICAgICBbdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodF0pO1xuICAgIHN3aXRjaCAocGxheWVyRmFjZSkge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyRmFjZTtcbiAgICB9XG4gIH1cblxuICBzZXRDb29yZGluYXRlcyAocGxheWVyUG9zKSB7XG4gICAgbGV0IHggPSBwbGF5ZXJQb3NbMF07XG4gICAgbGV0IHkgPSBwbGF5ZXJQb3NbMV07XG4gICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAncmlmbGUnKSB7XG4gICAgICB0aGlzLnNldEhpdEJveCh0aGlzLnBsYXllckZhY2UpO1xuICAgICAgc3dpdGNoICh0aGlzLnBsYXllckZhY2UpIHtcbiAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgeCArPSA0O1xuICAgICAgICB5ICs9IDExO1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgeCArPSA0MDtcbiAgICAgICAgeSArPSA1O1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgeCArPSA3NTtcbiAgICAgICAgeSArPSA0MDtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgeCArPSAxMTtcbiAgICAgICAgeSArPSA4MDtcbiAgICAgICAgcmV0dXJuW3gsIHldO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyUG9zO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGxheWVyUG9zO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkdCwgb3duZXIpIHtcbiAgICBsZXQgYnVsbGV0U3BlZWQ7XG4gICAgaWYgKG93bmVyID09PSAncGxheWVyJykge1xuICAgICAgYnVsbGV0U3BlZWQgPSA4MDA7XG4gICAgICBzd2l0Y2ggKHRoaXMucGxheWVyRmFjZSkge1xuICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1bGxldFNwZWVkID0gNTAwO1xuICAgICAgLy8gZGVidWdnZXJcbiAgICAgIHN3aXRjaCAodGhpcy5idWxsZXRDb3VudCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9udy5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gLT0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMCAmJlxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbGVmdC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3N3LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdICs9KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwICYmXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NvdXRoLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gdGhpcy5jYW52YXNIO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zZS5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PVxuICAgICAgICAgIHRoaXMuY2FudmFzSCAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfcmlnaHQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X25lLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSArPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSAtPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDAgJiZcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCdWxsZXQ7XG4iLCJsZXQgbW9uc3RlclNwcml0ZXMgPSByZXF1aXJlKCcuLi9zcHJpdGVzL21vbnN0ZXJfc3ByaXRlcycpO1xubGV0IGJ1bGxldFNwcml0ZXMgPSByZXF1aXJlKCcuLi9zcHJpdGVzL2J1bGxldF9zcHJpdGVzJyk7XG5sZXQgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jbGFzcyBNb25zdGVyIHtcbiAgY29uc3RydWN0b3IgKGN0eCwgY2FudmFzVywgY2FudmFzSCwgc3ByaXRlKSB7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbNzAwLCAzMDBdO1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHNwcml0ZTtcbiAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICB0aGlzLm1heEhQID0gMTAwMDtcbiAgICB0aGlzLmhlYWx0aCA9IDEwMDA7XG4gICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG5cbiAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgIHRoaXMuY2VudGVyQ29vcmRzID0gWzAsIDBdO1xuICAgIHRoaXMucmFuZENvdW50ID0gMjAwO1xuICAgIHRoaXMucGF1c2VBbmltYXRpb24gPSBmYWxzZTtcbiAgICB0aGlzLmJ1bGxldHMgPSBbXTtcbiAgICB0aGlzLmJ1bGxldHNMb2FkZWQgPSBmYWxzZTtcbiAgICB0aGlzLmdsb3dBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuY2hhcmdlVmVsb2NpdHkgPSAxLjU7XG4gICAgdGhpcy5jdXJyZW50UG9zaXRpb24gPSB0aGlzLmN1cnJlbnRQb3NpdGlvbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY3VycmVudFBvc2l0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuc2V0Q2VudGVyQ29vcmRzKCksXG4gICAgfTtcbiAgfVxuXG4gIHNldENlbnRlckNvb3JkcyAoKSB7XG4gICAgbGV0IHggPSB0aGlzLmNvb3JkaW5hdGVzWzBdICtcbiAgICAgICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAvIDIpO1xuICAgIGxldCB5ID0gdGhpcy5jb29yZGluYXRlc1sxXSArXG4gICAgICAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC8gMik7XG5cbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZGVmZWF0ZWQgKCkge1xuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHBsYXllckRlZmVhdGVkKCkge1xuICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICB9XG5cbiAgcmVkdWNlSGVhbHRoIChkYW1hZ2UpIHtcbiAgICB0aGlzLmhlYWx0aCAtPSBkYW1hZ2U7XG4gIH1cblxuICByZW5kZXIobm93KSB7XG4gICAgdmFyIG1vbnN0ZXJTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBtb25zdGVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZS51cmw7XG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKG1vbnN0ZXJTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgdGhpcy5jb29yZGluYXRlc1swXSwgdGhpcy5jb29yZGluYXRlc1sxXSwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuICAgIGlmICghdGhpcy5wYXVzZUFuaW1hdGlvbikge1xuXG4gICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgaWYgKG5vdyAtIHRoaXMubGFzdFVwZGF0ZSA+IGZwcykgIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyAmJlxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnaW50cm8nKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbdGhpcy5jb29yZGluYXRlc1swXSAtIDE1LFxuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSArIDE1XTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcblxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyAmJlxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdkZWFkJykge1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMjtcbiAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKlxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aDtcbiAgICAgICAgICAgICAgdGhpcy5wYXVzZUFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmluZERpcmVjdGlvblZlY3RvciAoKSB7XG4gICAgbGV0IHggPSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdIC0gdGhpcy5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgeSA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMV0gLSB0aGlzLmNvb3JkaW5hdGVzWzFdO1xuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBmaW5kTWFnbml0dWRlICh4LCB5KSB7XG4gICAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICByZXR1cm4gbWFnbml0dWRlO1xuICB9XG4gIG5vcm1hbGl6ZVZlY3RvciAocGxheWVyRGlyLCBtYWduaXR1ZGUpIHtcbiAgICByZXR1cm4gWyhwbGF5ZXJEaXJbMF0vbWFnbml0dWRlKSwgKHBsYXllckRpclsxXS9tYWduaXR1ZGUpXTtcbiAgfVxuXG4gIGNoYXNlUGxheWVyIChkZWx0YSkge1xuICAgICAgbGV0IHBsYXllckRpciA9IHRoaXMuZmluZERpcmVjdGlvblZlY3RvcigpO1xuICAgICAgbGV0IG1hZ25pdHVkZSA9IHRoaXMuZmluZE1hZ25pdHVkZShwbGF5ZXJEaXJbMF0sIHBsYXllckRpclsxXSk7XG4gICAgICBsZXQgbm9ybWFsaXplZCA9IHRoaXMubm9ybWFsaXplVmVjdG9yKHBsYXllckRpciwgbWFnbml0dWRlKTtcbiAgICAgIGxldCB2ZWxvY2l0eSA9IHRoaXMuY2hhcmdlVmVsb2NpdHk7XG5cbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmNvb3JkaW5hdGVzWzBdICsgKG5vcm1hbGl6ZWRbMF0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPSB0aGlzLmNvb3JkaW5hdGVzWzFdICsgKG5vcm1hbGl6ZWRbMV0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09IDApIHtcbiAgICAgICAgbGV0IGNoYXJnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFyZ2UnKTtcbiAgICAgICAgY2hhcmdlLnZvbHVtZSA9IDE7XG4gICAgICAgIGNoYXJnZS5wbGF5KCk7XG4gICAgICB9XG4gIH1cblxuICByYW5kb21Db3VudCgpIHtcbiAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAyMDApICsgMTgwO1xuICB9XG5cbiAgYnVsbGV0QXR0YWNrICgpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCA4KSB7XG4gICAgICBsZXQgYnVsbGV0Q291bnQgPSBpO1xuICAgICAgdGhpcy5idWxsZXRzLnB1c2gobmV3IEJ1bGxldCh0aGlzLmN1cnJlbnRQb3NpdGlvbigpLCB0aGlzLmNhbnZhc1csXG4gICAgICAgIHRoaXMuY2FudmFzSCwgdGhpcy5jdHgsIGJ1bGxldFNwcml0ZXMubW9uc3RlciwgYnVsbGV0Q291bnQpKTtcblxuICAgICAgaSsrO1xuICAgIH1cbiAgICB0aGlzLmJ1bGxldHNMb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuYnVsbGV0cy5maWx0ZXIoYnVsbGV0ID0+IGJ1bGxldC5hY3RpdmUpO1xuICB9XG5cbiAgaGFuZGxlSWRsZSAoKSB7XG4gICAgaWYgKCF0aGlzLmJ1bGxldHNMb2FkZWQpIHtcbiAgICAgIGxldCBzcGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaXQnKTtcbiAgICAgIHNwaXQudm9sdW1lID0gMTtcbiAgICAgIHRoaXMuYnVsbGV0QXR0YWNrKCk7XG4gICAgICBzcGl0LnBsYXkoKTtcbiAgICB9XG4gICAgbGV0IHNwZWVkID0gMTUwO1xuICAgIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogMC43NSAmJiB0aGlzLmhlYWx0aCA+IHRoaXMubWF4SFAgKiAwLjUpIHtcbiAgICAgIHRoaXMuY2hhcmdlVmVsb2NpdHkgPSAyO1xuICAgICAgc3BlZWQgPSAxMzA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogMC41ICYmIHRoaXMuaGVhbHRoID5cbiAgICAgIHRoaXMubWF4SFAgKiAwLjI1KSB7XG4gICAgICBzcGVlZCA9IDExMDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGVhbHRoIDw9IHRoaXMubWF4SFAgKiAwLjI1KSB7XG4gICAgICB0aGlzLmNoYXJnZVZlbG9jaXR5ID0gMi4yNTtcbiAgICAgIHNwZWVkID0gOTA7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdhbWVPdmVyICYmIHRoaXMuY291bnRlciA+PSBzcGVlZCAmJiB0aGlzLmdsb3dBY3RpdmUgJiZcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09IHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcykge1xuICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5nbG93O1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB0aGlzLmdsb3dBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb3VudGVyID49IHNwZWVkICYmICF0aGlzLmdhbWVPdmVyICYmICF0aGlzLmdsb3dBY3RpdmUgJiZcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09IHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcykge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB0aGlzLmJ1bGxldHNMb2FkZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZ2xvd0FjdGl2ZSA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLnRhcmdldFBvc1swXSA+PSB0aGlzLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5iaXRlX2U7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmJpdGVfdztcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQml0ZVdlc3QgKGRlbHRhKSB7XG4gICAgLy8gQklORFMgRklOQUwgUE9TSVRJT04gQkVGT1JFIEJJVEVcbiAgICBpZiAodGhpcy5maW5hbFBsYXllclBvcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmICh0aGlzLnRhcmdldFBvc1sxXSArIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+PSB0aGlzLmNhbnZhc0gpIHtcbiAgICAgICAgdGhpcy50YXJnZXRQb3NbMV0gPSB0aGlzLmNhbnZhc0ggLSB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQ7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gWzAgKyB0aGlzLnRhcmdldFBvc1swXSwgdGhpcy50YXJnZXRQb3NbMV1dO1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKXtcbiAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPD1cbiAgICAgICAgMCl7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF07XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jaGFzZVBsYXllcihkZWx0YSk7XG4gICAgfVxuICB9XG4gIC8vIENIQVJHRSBET0VTTlQgSElUIElGIElOIENFTlRFUiBPRiBCT1RUT00gT1IgdG9wXG4gIC8vIFNIT1VMRCBGSU5EIEEgV0FZIFRPIFNUSUxMIEdPIFRPV0FSRFMgVEFSR0VUIFggQlVUIEZVTExZXG4gIGhhbmRsZUJpdGVFYXN0IChkZWx0YSkge1xuICAgIGlmICh0aGlzLmZpbmFsUGxheWVyUG9zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0UG9zWzFdICsgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID49IHRoaXMuY2FudmFzSCkge1xuICAgICAgICB0aGlzLnRhcmdldFBvc1sxXSA9IHRoaXMuY2FudmFzSCAtIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodDtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbdGhpcy5jYW52YXNXIC1cbiAgICAgICAgKHRoaXMuY2FudmFzVyAtIHRoaXMudGFyZ2V0UG9zWzBdKSwgdGhpcy50YXJnZXRQb3NbMV1dO1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5pZGxlO1xuICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA+PVxuICAgICAgICB0aGlzLmNhbnZhc1cpe1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdIC1cbiAgICAgICAgICAodGhpcy5jYW52YXNXIC0gdGhpcy5maW5hbFBsYXllclBvc1swXSk7XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jaGFzZVBsYXllcihkZWx0YSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKHBsYXllclBvcywgZHQsIGRlbHRhKSB7XG4gICAgaWYgKCF0aGlzLmFsaXZlICYmICF0aGlzLmdhbWVPdmVyKSB7XG4gICAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmRlYWQ7XG4gICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgIC8vIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgIH1cbiAgICAvLyBUUkFDS1MgUE9TSVRJT04gT0YgUExBWUVSXG4gICAgaWYgKHRoaXMudGFyZ2V0UG9zLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50YXJnZXRQb3MgPSBPYmplY3QuYXNzaWduKFtdLCBwbGF5ZXJQb3MpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICAvLyBPRkZTRVQgRk9SIElETEUgQU5JTUFUSU9OXG4gICAgdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyIHx8IDA7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY3VycmVudFNwcml0ZS5uYW1lKSB7XG4gICAgICBjYXNlICdpZGxlJzpcbiAgICAgICAgdGhpcy5jb3VudGVyKys7XG4gICAgICAgIHRoaXMuaGFuZGxlSWRsZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dsb3cnOlxuICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgdGhpcy5oYW5kbGVJZGxlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYml0ZV93JzpcbiAgICAgICAgdGhpcy5oYW5kbGVCaXRlV2VzdChkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYml0ZV9lJzpcbiAgICAgICAgdGhpcy5oYW5kbGVCaXRlRWFzdChkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vbnN0ZXI7XG4iLCJsZXQgcGxheWVyU3ByaXRlcyA9IHJlcXVpcmUoJy4uL3Nwcml0ZXMvcGxheWVyX3Nwcml0ZXMnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvciAoY3R4LCBjYW52YXNXLCBjYW52YXNILCBzcHJpdGUpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFswLCAwXTtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5mYWNpbmdQb3MgPSBcInJpZ2h0XCI7XG4gICAgdGhpcy5oaXRCb3hIID0gNTU7XG4gICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgdGhpcy5rZXlQcmVzc2VkID0ge307XG4gICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5jZW50ZXJDb29yZHMgPSBbMCwgMF07XG4gICAgdGhpcy5oZWFsdGggPSAzMDtcbiAgfVxuXG4gIGRlYWQgKCkge1xuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHJlZHVjZUhlYWx0aCAoZGFtYWdlKSB7XG4gICAgdGhpcy5oZWFsdGggLT0gZGFtYWdlO1xuICAgIHJldHVybiBkYW1hZ2U7XG4gIH1cblxuICBzZXRDZW50ZXJDb29yZHMgKHgsIHkpIHtcbiAgICBsZXQgY2VudGVyWCA9IHggKyAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLyAyKTtcbiAgICBsZXQgY2VudGVyWSA9IHkgKyAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC8gMik7XG5cbiAgICByZXR1cm4gW2NlbnRlclgsIGNlbnRlclldO1xuICB9XG5cbiAgcmVuZGVyKG5vdykge1xuICAgIGlmICghdGhpcy5nYW1lT3Zlcikge1xuXG4gICAgICB2YXIgcGxheWVyU3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgICBwbGF5ZXJTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcblxuICAgICAgLy8gcGxheWVyU3ByaXRlLmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShwbGF5ZXJTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0sIHRoaXMuY29vcmRpbmF0ZXNbMV0sIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLFxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICAvLyBkZWJ1Z2dlclxuXG4gICAgICAgIGxldCBmcHMgPSB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzICogdGhpcy5jdXJyZW50U3ByaXRlLmZwc1g7XG4gICAgICAgIGlmIChub3cgLSB0aGlzLmxhc3RVcGRhdGUgPiBmcHMgJiYgIXRoaXMuZ2FtZU92ZXIpICB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgICAgICAgdGhpcy5zaGlmdCA9IHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKlxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnZGVhZCcpIHtcbiAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSArPSAxO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgc2V0SGl0Qm94IChmYWNpbmdQb3MpIHtcbiAgICBzd2l0Y2ggKGZhY2luZ1Bvcykge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNTU7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDY5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA2OTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNTU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA2OTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA2OTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNTU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhY2luZ1BvcztcbiAgICB9XG4gIH1cblxuICBjdXJyZW50UG9zaXRpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb29yZGluYXRlczogdGhpcy5jb29yZGluYXRlcyxcbiAgICAgIHBsYXllckZhY2U6IHRoaXMuZmFjaW5nUG9zXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZShrZXkpIHtcbiAgICBjb25zdCBzcHJpdGVIZWlnaHQgPSAxMjU7XG4gICAgdGhpcy5zZXRIaXRCb3godGhpcy5mYWNpbmdQb3MpO1xuICAgIGxldCBzcGVlZCA9IDEyO1xuICAgIC8vIGtleS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKHRoaXMuYWxpdmUpIHtcbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszN10gfHwgdGhpcy5rZXlQcmVzc2VkWzY1XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlTGVmdDtcbiAgICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcImxlZnRcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gNSkge3RoaXMuY29vcmRpbmF0ZXNbMF0tPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszOF0gfHwgdGhpcy5rZXlQcmVzc2VkWzg3XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlVXA7XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJ1cFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA+PSAxNSkge3RoaXMuY29vcmRpbmF0ZXNbMV0tPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszOV0gfHwgdGhpcy5rZXlQcmVzc2VkWzY4XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlUmlnaHQ7XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJyaWdodFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA8PSAodGhpcy5jYW52YXNXIC0gdGhpcy5oaXRCb3hIIC0gMzApKVxuICAgICAgICB7dGhpcy5jb29yZGluYXRlc1swXSs9c3BlZWQ7fVxuICAgICAgfVxuICAgICAgaWYodGhpcy5rZXlQcmVzc2VkWzQwXSB8fCB0aGlzLmtleVByZXNzZWRbODNdKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVEb3duO1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwiZG93blwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA8PSAodGhpcy5jYW52YXNIIC0gdGhpcy5oaXRCb3hIKSlcbiAgICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMV0rPXNwZWVkO31cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5kZWFkO1xuICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCJjbGFzcyBTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybDtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5mcmFtZVdpZHRoID0gb3B0aW9ucy5mcmFtZVdpZHRoO1xuICAgIHRoaXMuZnJhbWVIZWlnaHQgPSBvcHRpb25zLmZyYW1lSGVpZ2h0O1xuICAgIHRoaXMuY3VycmVudEZyYW1lID0gb3B0aW9ucy5jdXJyZW50RnJhbWU7XG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IG9wdGlvbnMudG90YWxGcmFtZXM7XG4gICAgdGhpcy5vbmNlID0gb3B0aW9ucy5vbmNlO1xuICAgIHRoaXMuZnBzID0gb3B0aW9ucy5mcHM7XG4gICAgdGhpcy5mcHNYID0gb3B0aW9ucy5mcHNYO1xuICAgIHRoaXMuZGFtYWdlID0gb3B0aW9ucy5kYW1hZ2U7XG4gIH1cbn1cbi8vIHVybCwgbmFtZSwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2VcblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7XG4iLCIvLyBIT1cgVE8gQlVJTEQgUEhZU0lDUyBGT1IgQSBXRUFQT04/XG4vLyBCVUxMRVQgU1BFRUQsIFNQUkVBRCwgREFNQUdFP1xuLy8gRE8gUEhZU0lDUyBORUVEIFRPIEJFIEEgU0VQQVJBVEUgQ0xBU1M/IENBTiBJIElNUE9SVCBBIExJQlJBUlkgVE8gSEFORExFIFRIQVQgTE9HSUM/XG5cbmNsYXNzIFdlYXBvbiB7XG4gIGNvbnN0cnVjdG9yIChhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5yYXRlID0gYXR0cmlidXRlcy5yYXRlO1xuICAgIHRoaXMubW9kZWwgPSBhdHRyaWJ1dGVzLm1vZGVsO1xuICAgIHRoaXMucG93ZXIgPSBhdHRyaWJ1dGVzLnBvd2VyO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXZWFwb247XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi4vY2xhc3Nlcy9zcHJpdGUnKTtcbi8vIE1BS0UgU01BTExFUlxuY29uc3QgYmxvb2RIaXRTcHJpdGVTaGVldCA9IHtcbiAgcGxheWVySGl0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9ibG9vZF9zbWFsbC5wbmcnLFxuICAgIG5hbWU6ICdwbGF5ZXJIaXQnLFxuICAgIGZyYW1lSGVpZ2h0OiAxMjQsXG4gICAgZnJhbWVXaWR0aDogKDc2MyAvIDYpLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgLy8gTUFLRSBCTE9PRCBESUZGRVJFTlQgQ09MT1JcbiAgLy8gVVNFIEZVTEwgU0laRSBNT0RFTFxuICBtb25zdGVySGl0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9tb25zdGVyX2Jsb29kLnBuZycsXG4gICAgbmFtZTogJ3BsYXllckhpdCcsXG4gICAgZnJhbWVIZWlnaHQ6IDMyNCxcbiAgICBmcmFtZVdpZHRoOiAoMTk1NyAvIDYpLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogNSxcbiAgICBmcHNYOiAxLFxuICB9LFxufTtcblxuY29uc3QgYmxvb2RIaXRTcHJpdGVzID0ge1xuICBwbGF5ZXJIaXQ6IG5ldyBTcHJpdGUoYmxvb2RIaXRTcHJpdGVTaGVldC5wbGF5ZXJIaXQpLFxuICBtb25zdGVySGl0OiBuZXcgU3ByaXRlKGJsb29kSGl0U3ByaXRlU2hlZXQubW9uc3RlckhpdCksXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJsb29kSGl0U3ByaXRlcztcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuLi9jbGFzc2VzL3Nwcml0ZScpO1xuLy8gSUYgQkxBTksgUkVOREVSIEJFRk9SRSBTUFJJVEUsIE5FRUQgVE8gUkVTRVQgU0hJRlQgVE8gMCEhXG5jb25zdCBidWxsZXRTcHJpdGVTaGVldCA9IHtcbiAgcmlmbGU6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZycsXG4gICAgbmFtZTogJ3JpZmxlJyxcbiAgICBmcmFtZUhlaWdodDogNixcbiAgICBmcmFtZVdpZHRoOiAxNCxcbiAgICBkYW1hZ2U6IDEwLFxuICB9LFxuXG4gIG1vbnN0ZXI6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfdmVydC5wbmcnLFxuICAgIG5hbWU6ICdtb25zdGVyJyxcbiAgICBmcmFtZUhlaWdodDogMzIsXG4gICAgZnJhbWVXaWR0aDogOSxcbiAgICBkYW1hZ2U6IDEwLFxuICB9LFxufTtcblxuY29uc3QgYnVsbGV0U3ByaXRlcyA9IHtcbiAgcmlmbGU6IG5ldyBTcHJpdGUoYnVsbGV0U3ByaXRlU2hlZXQucmlmbGUpLFxuICBtb25zdGVyOiBuZXcgU3ByaXRlKGJ1bGxldFNwcml0ZVNoZWV0Lm1vbnN0ZXIpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1bGxldFNwcml0ZXM7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi4vY2xhc3Nlcy9zcHJpdGUnKTtcbi8vIElGIEJMQU5LIFJFTkRFUiBCRUZPUkUgU1BSSVRFLCBORUVEIFRPIFJFU0VUIFNISUZUIFRPIDAhIVxuY29uc3QgbW9uc3RlclNwcml0ZVNoZWV0ID0ge1xuICBkaXJ0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG4gICAgbmFtZTogJ2ludHJvJyxcbiAgICBmcmFtZUhlaWdodDogMTY2LFxuICAgIGZyYW1lV2lkdGg6IDE1MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDE2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBpbnRybzoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuICAgIG5hbWU6ICdpbnRybycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2NixcbiAgICBmcmFtZVdpZHRoOiAxNTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMTAwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgaWRsZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pZGxlLnBuZycsXG4gICAgbmFtZTogJ2lkbGUnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNzMsXG4gICAgZnJhbWVXaWR0aDogMjAzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTIsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAxMjUsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBnbG93OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2lkbGVfZ2xvdzIucG5nJyxcbiAgICBuYW1lOiAnZ2xvdycsXG4gICAgZnJhbWVIZWlnaHQ6IDE3MyxcbiAgICBmcmFtZVdpZHRoOiAyMjMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxMixcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgYml0ZV93OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9iaXRlX3dlc3QucG5nJyxcbiAgICBuYW1lOiAnYml0ZV93JyxcbiAgICBmcmFtZUhlaWdodDogMTYzLFxuICAgIGZyYW1lV2lkdGg6IDE5MixcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDUsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMS41LFxuICB9LFxuXG4gIGJpdGVfZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV9lYXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfZScsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEuNSxcbiAgfSxcblxuICBkZWFkOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2RlYWQucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA0LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiA0MDAsXG4gICAgZnBzWDogMSxcbiAgfVxufTtcblxuY29uc3QgbW9uc3RlclNwcml0ZXMgPSB7XG4gIGludHJvOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5pbnRybyksXG4gIGlkbGU6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmlkbGUpLFxuICBnbG93OiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5nbG93KSxcbiAgZGVhZDogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuZGVhZCksXG4gIGJpdGVfdzogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuYml0ZV93KSxcbiAgYml0ZV9lOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5iaXRlX2UpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vbnN0ZXJTcHJpdGVzO1xuIiwibGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4uL2NsYXNzZXMvc3ByaXRlJyk7XG5cbmNvbnN0IHBsYXllclNwcml0ZVNoZWV0ID0ge1xuICBkZWFkOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9ibG9vZF9zbWFsbC5wbmcnLFxuICAgIG5hbWU6ICdkZWFkJyxcbiAgICBmcmFtZUhlaWdodDogMTI0LFxuICAgIGZyYW1lV2lkdGg6ICg3NjMgLyA2KSxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDE1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGVtcHR5OiB7XG4gICAgdXJsOiAnJyxcbiAgICBuYW1lOiAnJyxcbiAgICBmcmFtZUhlaWdodDogMCxcbiAgICBmcmFtZVdpZHRoOiAwLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMCxcbiAgICBvbmNlOiAwLFxuICAgIGZwczogMCxcbiAgICBmcHNYOiAwLFxuICB9LFxuXG4gIGFsaXZlTGVmdDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2xlZnQucG5nJyxcbiAgICBuYW1lOiAnbGVmdCcsXG4gICAgZnJhbWVIZWlnaHQ6IDU1LFxuICAgIGZyYW1lV2lkdGg6IDkzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICAvLyBoaXRCb3hIZWlnaHRPZmZzZXQ6XG4gICAgLy8gaGl0Qm94V2lkdGhPZmZzZXQ6XG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuICBhbGl2ZVVwOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfdXAucG5nJyxcbiAgICBuYW1lOiAndXAnLFxuICAgIGZyYW1lSGVpZ2h0OiA5MyxcbiAgICBmcmFtZVdpZHRoOiA1NSxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuICBhbGl2ZVJpZ2h0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGUucG5nJyxcbiAgICBuYW1lOiAncmlnaHQnLFxuICAgIGZyYW1lSGVpZ2h0OiA1NSxcbiAgICBmcmFtZVdpZHRoOiA5MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuICBhbGl2ZURvd246IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9kb3duLnBuZycsXG4gICAgbmFtZTogJ2Rvd24nLFxuICAgIGZyYW1lSGVpZ2h0OiA5MyxcbiAgICBmcmFtZVdpZHRoOiA1NSxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxufTtcblxuY29uc3QgcGxheWVyU3ByaXRlcyA9IHtcbiAgZGVhZDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5kZWFkKSxcbiAgYWxpdmVMZWZ0OiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlTGVmdCksXG4gIGFsaXZlVXA6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVVcCksXG4gIGFsaXZlUmlnaHQ6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVSaWdodCksXG4gIGFsaXZlRG93bjogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZURvd24pLFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBsYXllclNwcml0ZXM7XG4iLCJsZXQgbW9uc3RlclNwcml0ZXMgPSByZXF1aXJlKCcuL2xpYi9zcHJpdGVzL21vbnN0ZXJfc3ByaXRlcy5qcycpO1xubGV0IHBsYXllclNwcml0ZXMgPSByZXF1aXJlKCcuL2xpYi9zcHJpdGVzL3BsYXllcl9zcHJpdGVzLmpzJyk7XG5sZXQgYnVsbGV0U3ByaXRlcyA9IHJlcXVpcmUoJy4vbGliL3Nwcml0ZXMvYnVsbGV0X3Nwcml0ZXMuanMnKTtcbmxldCBibG9vZEhpdFNwcml0ZXMgPSByZXF1aXJlKCcuL2xpYi9zcHJpdGVzL2Jsb29kX2hpdF9zcHJpdGVzLmpzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9saWIvY2xhc3Nlcy9zcHJpdGUuanMnKTtcbmxldCBNb25zdGVyID0gcmVxdWlyZSgnLi9saWIvY2xhc3Nlcy9tb25zdGVyLmpzJyk7XG5sZXQgQmxvb2RIaXQgPSByZXF1aXJlKCcuL2xpYi9jbGFzc2VzL2Jsb29kX2hpdC5qcycpO1xubGV0IFBsYXllciA9IHJlcXVpcmUoJy4vbGliL2NsYXNzZXMvcGxheWVyLmpzJyk7XG5sZXQgV2VhcG9ucyA9IHJlcXVpcmUoJy4vbGliL2NsYXNzZXMvd2VhcG9ucy5qcycpO1xubGV0IEJ1bGxldCA9IHJlcXVpcmUoJy4vbGliL2NsYXNzZXMvYnVsbGV0LmpzJyk7XG5sZXQgcHJlbG9hZEltYWdlcyA9IHJlcXVpcmUoJy4vcmVzb3VyY2VzLmpzJyk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBsZXQgbXlSZXE7XG4gIHByZWxvYWRBc3NldHMoKTtcblxuICBsZXQgc291bmRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2F1ZGlvJyk7XG4gIGxldCBhdWRpb011dGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW8nKTtcbiAgYXVkaW9NdXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGxldCBpO1xuICAgIGlmIChzb3VuZHNbMF0ubXV0ZWQgPT09IHRydWUpIHtcbiAgICAgIGF1ZGlvTXV0ZS5zcmMgPSBcImFzc2V0cy9pbWFnZXMvYXVkaW9fcGxheS5wbmdcIjtcbiAgICAgIC8vIGF1ZGlvTXV0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdWRpbycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdWRpb011dGUuc3JjID0gXCJhc3NldHMvaW1hZ2VzL2F1ZGlvX211dGUucG5nXCI7XG4gICAgICAvLyBhdWRpb011dGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW8nKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc291bmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZihzb3VuZHNbaV0ubXV0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgc291bmRzW2ldLm11dGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb3VuZHNbaV0ubXV0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gc3RhcnRHYW1lICgpIHtcbiAgICBsZXQgc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKTtcbiAgICBsZXQgbXVzaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVzaWMnKTtcbiAgICBsZXQgaW50cm9NdXNpYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXZlX3RoZW1lJyk7XG4gICAgbGV0IGhlYWx0aEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFsdGhiYXInKTtcbiAgICBpbnRyb011c2ljLnZvbHVtZSA9IDE7XG5cbiAgICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaGVhbHRoQmFyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHN0YXJ0LmNsYXNzTmFtZSA9ICdzdGFydF9idXR0b25faGlkZSc7XG4gICAgICAgIGdhbWVTdGFydCA9IHRydWU7XG4gICAgICAgIGdhbWVXaW4gPSBmYWxzZTtcbiAgICAgICAgZ2FtZVRpbWVyU3RhcnQgPSBEYXRlLm5vdygpO1xuICAgICAgICBpbnRyb011c2ljLnBhdXNlKCk7XG4gICAgICAgIG11c2ljLnZvbHVtZSA9IC43O1xuICAgICAgICBtdXNpYy5wbGF5KCk7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5vbmtleXByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICBoZWFsdGhCYXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgc3RhcnQuY2xhc3NOYW1lID0gJ3N0YXJ0X2J1dHRvbl9oaWRlJztcbiAgICAgICAgZ2FtZVN0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgZ2FtZVdpbiA9IGZhbHNlO1xuICAgICAgICBnYW1lVGltZXJTdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgIGludHJvTXVzaWMucGF1c2UoKTtcbiAgICAgICAgbXVzaWMudm9sdW1lID0gLjc7XG4gICAgICAgIG11c2ljLnBsYXkoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IGF1ZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1ZGlvX2hvdmVyJyk7XG4gICAgYXVkaW8udm9sdW1lID0gMC40O1xuICAgIHN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgYXVkaW8ucGxheSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlbG9hZEFzc2V0cyAoKSB7XG4gICAgcHJlbG9hZEltYWdlcy5mb3JFYWNoKGltYWdlID0+IHtcbiAgICAgIGxldCBsb2FkZWRJbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgbG9hZGVkSW1hZ2Uuc3JjID0gaW1hZ2U7XG4gICAgfSk7XG4gIH1cbiAgbGV0IHRpbWVvdXQ7XG4gIGxldCByZXN0YXJ0UmVhZHkgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZ2FtZU92ZXJQcm9tcHQgKCkge1xuICAgIGxldCBpbnRyb011c2ljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhdmVfdGhlbWUnKTtcbiAgICBpbnRyb011c2ljLnZvbHVtZSA9IDE7XG4gICAgaW50cm9NdXNpYy5wbGF5KCk7XG4gICAgbGV0IG11c2ljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ211c2ljJyk7XG4gICAgbXVzaWMucGF1c2UoKTtcbiAgICBnYW1lVGltZXJTdG9wID0gdHJ1ZTtcbiAgICBsZXQgZ2FtZU92ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZV9vdmVyJyk7XG4gICAgbGV0IGF1ZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1ZGlvX2hvdmVyJyk7XG4gICAgbGV0IHNjb3JlU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlX3NjcmVlbicpO1xuICAgIGlmIChnYW1lV2luKSB7XG4gICAgICBzY29yZVNjcmVlbi5pbm5lckhUTUwgPSBgV29ybSBCb3NzIGRlZmVhdGVkIGluICR7ZWxhcHNlZH0gc2Vjb25kcyFgO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY29yZVNjcmVlbi5pbm5lckhUTUwgPSBgWW91IHN1cnZpdmVkIGZvciAke2VsYXBzZWR9IHNlY29uZHMuYDtcbiAgICB9XG5cbiAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBzY29yZVNjcmVlbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBhdWRpby52b2x1bWUgPSAwLjQ7XG4gICAgZ2FtZU92ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBhdWRpby5wbGF5KCk7XG4gICAgfSk7XG5cbiAgICBnYW1lT3Zlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBzY29yZVNjcmVlbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgbW9uc3RlclNwcml0ZXMuZGVhZC5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgbW9uc3RlclNwcml0ZXMuaWRsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgcGxheWVyLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICByZXN0YXJ0R2FtZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzdGFydEdhbWUgKCkge1xuICAgIGxldCBtdXNpYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtdXNpYycpO1xuICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICBsZXQgc2NvcmVTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmVfc2NyZWVuJyk7XG4gICAgbGV0IGhlYWx0aGJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFsdGhiYXInKTtcbiAgICBoZWFsdGhiYXIudmFsdWUgPSBtb25zdGVyLm1heEhQO1xuICAgIG11c2ljLnZvbHVtZSA9IC43O1xuICAgIG11c2ljLnBsYXkoKTtcbiAgICBnYW1lVGltZXJTdG9wID0gZmFsc2U7XG4gICAgZ2FtZVRpbWVyU3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIGdhbWVXaW4gPSBmYWxzZTtcbiAgICBzY29yZVNjcmVlbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBtb25zdGVyID0gbmV3IE1vbnN0ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgICBtb25zdGVyU3ByaXRlcy5pbnRybyk7XG4gICAgcGxheWVyID0gbmV3IFBsYXllcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICAgIHBsYXllclNwcml0ZXMuYWxpdmVSaWdodCk7XG4gICAgbW9uc3RlckJ1bGxldHMgPSBtb25zdGVyLmJ1bGxldHM7XG4gIH1cblxuICBsZXQgbW9uc3RlciA9IG5ldyBNb25zdGVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvKTtcbiAgbGV0IGdhbWVTdGFydCA9IGZhbHNlO1xuICBsZXQgYnVsbGV0cyA9IFtdO1xuICBsZXQgbW9uc3RlckJ1bGxldHMgPSBtb25zdGVyLmJ1bGxldHM7XG4gIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgIHBsYXllclNwcml0ZXMuYWxpdmVSaWdodCk7XG4gIGxldCBsYXN0VGltZSA9IERhdGUubm93KCk7XG4gIGxldCBrZXk7XG4gIGxldCBhbGxvd0ZpcmUgPSB0cnVlO1xuICBsZXQgcGxheWVySGl0ID0gbmV3IEJsb29kSGl0KHBsYXllci5jdXJyZW50UG9zaXRpb24oKSwgY3R4LFxuICAgIGJsb29kSGl0U3ByaXRlcy5wbGF5ZXJIaXQpO1xuICBsZXQgbW9uc3RlckhpdCA9IG5ldyBCbG9vZEhpdChtb25zdGVyLmN1cnJlbnRQb3NpdGlvbigpLCBjdHgsXG4gICAgYmxvb2RIaXRTcHJpdGVzLm1vbnN0ZXJIaXQpO1xuXG4gIGxldCBnYW1lV2luID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGNvbGxpc2lvbkRldGVjdGVkICgpIHtcbiAgICBsZXQgY29sbGlkZUJ1bGxldHMgPSBPYmplY3QuYXNzaWduKFtdLCBidWxsZXRzKTtcbiAgICBsZXQgYnVsbGV0WDtcbiAgICBsZXQgYnVsbGV0WTtcbiAgICBsZXQgcGxheWVyWCA9IHBsYXllci5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgcGxheWVyWSA9IHBsYXllci5jb29yZGluYXRlc1sxXTtcbiAgICBsZXQgbW9uc3RlclggPSBtb25zdGVyLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCBtb25zdGVyWSA9IG1vbnN0ZXIuY29vcmRpbmF0ZXNbMV07XG4gICAgbGV0IG1IQm9mZnNldCA9IDQwO1xuXG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgbGV0IGJsb29kU3F1aXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vbnN0ZXJfaGl0Jyk7XG4gICAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IHtcbiAgICAgICAgYnVsbGV0WCA9IGJ1bGxldC5jb29yZGluYXRlc1swXTtcbiAgICAgICAgYnVsbGV0WSA9IGJ1bGxldC5jb29yZGluYXRlc1sxXTtcbiAgICAgICAgaWYgKGJ1bGxldFggPCBtb25zdGVyWCArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC0gbUhCb2Zmc2V0ICYmXG4gICAgICAgICAgYnVsbGV0WCArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPiBtb25zdGVyWCArIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFkgPCBtb25zdGVyWSArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAtIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFkgKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+IG1vbnN0ZXJZICsgbUhCb2Zmc2V0KSB7XG4gICAgICAgICAgICBibG9vZFNxdWlydC52b2x1bWUgPSAxO1xuICAgICAgICAgICAgYmxvb2RTcXVpcnQucGxheWJhY2tSYXRlID0gNDtcbiAgICAgICAgICAgIGJsb29kU3F1aXJ0LnBsYXkoKTtcbiAgICAgICAgICAgIG1vbnN0ZXIucmVkdWNlSGVhbHRoKGJ1bGxldC5jdXJyZW50U3ByaXRlLmRhbWFnZSk7XG4gICAgICAgICAgICBidWxsZXRzLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgIG1vbnN0ZXJIaXQgPSBuZXcgQmxvb2RIaXQobW9uc3Rlci5jdXJyZW50UG9zaXRpb24oKSwgY3R4LFxuICAgICAgICAgICAgYmxvb2RIaXRTcHJpdGVzLm1vbnN0ZXJIaXQpO1xuICAgICAgICAgICAgbW9uc3RlckhpdC5jb2xsaXNpb24gPSB0cnVlO1xuICAgICAgICAgICAgbGV0IGhlYWx0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFsdGhiYXInKTtcbiAgICAgICAgICAgIGhlYWx0aC52YWx1ZSAtPSBidWxsZXQuY3VycmVudFNwcml0ZS5kYW1hZ2U7XG5cbiAgICAgICAgICAgIGlmIChtb25zdGVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICAgIGxldCBkZWF0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb25zdGVyX2RlYXRoJyk7XG4gICAgICAgICAgICAgIGRlYXRoLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICAgIGRlYXRoLnBsYXkoKTtcbiAgICAgICAgICAgICAgbW9uc3RlckhpdC5jb2xsaXNpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgZ2FtZVdpbiA9IHRydWU7XG4gICAgICAgICAgICAgIG1vbnN0ZXIuZGVmZWF0ZWQoKTtcbiAgICAgICAgICAgICAgZ2FtZU92ZXJQcm9tcHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgZ3J1bnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3J1bnQnKTtcbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICBidWxsZXRYID0gYnVsbGV0LmNvb3JkaW5hdGVzWzBdO1xuICAgICAgYnVsbGV0WSA9IGJ1bGxldC5jb29yZGluYXRlc1sxXTtcbiAgICAgIGlmIChidWxsZXRYIDwgcGxheWVyWCArIHBsYXllci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggJiZcbiAgICAgICAgYnVsbGV0WCArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPiBwbGF5ZXJYICYmXG4gICAgICAgIGJ1bGxldFkgPCBwbGF5ZXJZICsgcGxheWVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgJiZcbiAgICAgICAgYnVsbGV0WSArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID4gcGxheWVyWSkge1xuICAgICAgICAgIHBsYXllci5yZWR1Y2VIZWFsdGgoYnVsbGV0LmN1cnJlbnRTcHJpdGUuZGFtYWdlKTtcbiAgICAgICAgICBncnVudC52b2x1bWUgPSAxO1xuICAgICAgICAgIGdydW50LnBsYXliYWNrUmF0ZSA9IDI7XG4gICAgICAgICAgZ3J1bnQucGxheSgpO1xuICAgICAgICAgIGxldCBpbmRleCA9IG1vbnN0ZXJCdWxsZXRzLmluZGV4T2YoYnVsbGV0KTtcbiAgICAgICAgICBtb25zdGVyQnVsbGV0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIGlmIChwbGF5ZXIuaGVhbHRoID4gMCkge1xuICAgICAgICAgICAgcGxheWVySGl0ID0gbmV3IEJsb29kSGl0KHBsYXllci5jdXJyZW50UG9zaXRpb24oKSwgY3R4LFxuICAgICAgICAgICAgYmxvb2RIaXRTcHJpdGVzLnBsYXllckhpdCk7XG4gICAgICAgICAgICBwbGF5ZXJIaXQuY29sbGlzaW9uID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGxheWVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICBwbGF5ZXJIaXQuY29sbGlzaW9uID0gZmFsc2U7XG4gICAgICAgICAgICBwbGF5ZXIuZGVhZCgpO1xuICAgICAgICAgICAgbW9uc3Rlci5wbGF5ZXJEZWZlYXRlZCgpO1xuICAgICAgICAgICAgZ2FtZU92ZXJQcm9tcHQoKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGxheWVyWCA8IG1vbnN0ZXJYICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLSBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWCArIHBsYXllci5oaXRCb3hXID4gbW9uc3RlclggKyBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWSA8IG1vbnN0ZXJZICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC0gbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclkgKyBwbGF5ZXIuaGl0Qm94SCA+IG1vbnN0ZXJZICsgbUhCb2Zmc2V0ICYmXG4gICAgICBnYW1lU3RhcnQgJiYgbW9uc3Rlci5hbGl2ZSkge1xuICAgICAgICBwbGF5ZXIuZGVhZCgpO1xuICAgICAgICBtb25zdGVyLnBsYXllckRlZmVhdGVkKCk7XG4gICAgICAgIGdhbWVPdmVyUHJvbXB0KCk7XG4gICAgICB9XG4gIH1cblxuICBsZXQgbGFzdEJ1bGxldDtcbiAgZnVuY3Rpb24gRmlyZSAoKSB7XG4gICAgYWxsb3dGaXJlID0gZmFsc2U7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBhbGxvd0ZpcmUgPSB0cnVlO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG9vdCAocGxheWVyUG9zKSB7XG4gICAgICBidWxsZXRzLnB1c2gobmV3IEJ1bGxldChwbGF5ZXJQb3MsIGNhbnZhcy53aWR0aCxcbiAgICAgICAgY2FudmFzLmhlaWdodCwgY3R4LCBidWxsZXRTcHJpdGVzLnJpZmxlKSk7XG5cbiAgICAgIGJ1bGxldHMgPSBidWxsZXRzLmZpbHRlcihidWxsZXQgPT4gYnVsbGV0LmFjdGl2ZSk7XG5cbiAgICBGaXJlKCk7XG4gICAgbGV0IGJ1bGxldFNvdW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1bGxldCcpO1xuICAgIGJ1bGxldFNvdW5kLnZvbHVtZSA9IDAuNztcbiAgICBidWxsZXRTb3VuZC5sb2FkKCk7XG4gICAgYnVsbGV0U291bmQucGxheSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlIChrZXksIGR0LCBkZWx0YSkge1xuICAgIHBsYXllci51cGRhdGUoa2V5KTtcbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBtb25zdGVyLnVwZGF0ZShwbGF5ZXIuY29vcmRpbmF0ZXMsIGR0LCBkZWx0YSk7XG4gICAgfVxuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnVwZGF0ZShkdCwgJ3BsYXllcicpKTtcbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQudXBkYXRlKGR0LCAnbW9uc3RlcicpKTtcbiAgfVxuXG4gIGNvbnN0IGNsZWFyID0gKCkgPT4gIHtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVuZGVyIChub3cpIHtcbiAgICBpZiAocGxheWVySGl0LmNvbGxpc2lvbikge1xuICAgICAgcGxheWVySGl0LnJlbmRlcihub3cpO1xuICAgIH1cblxuICAgIGlmIChtb25zdGVySGl0LmNvbGxpc2lvbikge1xuICAgICAgbW9uc3RlckhpdC5yZW5kZXIobm93KTtcbiAgICB9XG5cbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBtb25zdGVyLnJlbmRlcihub3cpO1xuICAgIH1cblxuICAgIHBsYXllci5yZW5kZXIobm93KTtcblxuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnJlbmRlcigpKTtcblxuICAgIG1vbnN0ZXJCdWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC5yZW5kZXIoKSk7XG4gICAgaWYgKG1vbnN0ZXIuY3VycmVudFNwcml0ZS5uYW1lID09PSAnaW50cm8nICYmXG4gICAgZ2FtZVN0YXJ0ICYmIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09IDEpIHtcbiAgICAgIGxldCBpbnRybyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnRyb19tb25zdGVyJyk7XG4gICAgICBpbnRyby52b2x1bWUgPSAxO1xuICAgICAgaW50cm8ucGxheSgpO1xuICAgIH0gZWxzZSBpZiAobW9uc3Rlci5jdXJyZW50U3ByaXRlLm5hbWUgIT09ICdpbnRybycgJiYgZ2FtZVN0YXJ0ICYmXG4gICAgbW9uc3Rlci5hbGl2ZSkge1xuICAgICAgbGV0IG1vbkJHID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vbnN0ZXJfYmcnKTtcbiAgICAgIG1vbkJHLnZvbHVtZSA9IDE7XG4gICAgICBtb25CRy5wbGF5YmFja1JhdGUgPSAzLjU7XG4gICAgICBtb25CRy5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGxldCBrZXlzID0gWzMyLCAzNywgMzgsIDM5LCA0MF07XG4gICAga2V5ID0gZXZ0LndoaWNoO1xuICAgIGlmKGtleXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIHBsYXllci5rZXlQcmVzc2VkW2tleV0gPSB0cnVlO1xuICAgIGlmIChrZXkgPT09IDMyICYmIHBsYXllci5hbGl2ZSAmJiBhbGxvd0ZpcmUpIHtcbiAgICAgIHNob290KHBsYXllci5jdXJyZW50UG9zaXRpb24oKSk7XG4gICAgfVxuXG4gICAgaWYgKCFtb25zdGVyLmFsaXZlIHx8ICFwbGF5ZXIuYWxpdmUpIHtcbiAgICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICAgIGlmIChrZXkgPT09IDEzKSB7XG4gICAgICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIG1vbnN0ZXJTcHJpdGVzLmRlYWQuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgbW9uc3RlclNwcml0ZXMuaWRsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICBwbGF5ZXIuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICBtb25zdGVyU3ByaXRlcy5pbnRyby5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICByZXN0YXJ0R2FtZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGxheWVyLmtleVByZXNzZWRbZXZ0LndoaWNoXSA9IGZhbHNlO1xuICAgIGtleSA9IG51bGw7XG4gIH07XG4gIGxldCBnYW1lVGltZXJTdG9wID0gZmFsc2U7XG4gIGxldCBnYW1lVGltZXJTdGFydCA9ICgwKS50b0ZpeGVkKDEpO1xuICBsZXQgZWxhcHNlZDtcbiAgZnVuY3Rpb24gdGltZXIoKSB7XG4gICAgbGV0IHRpbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZXInKTtcblxuICAgIGlmIChnYW1lU3RhcnQgJiYgIWdhbWVUaW1lclN0b3ApIHtcbiAgICAgIGVsYXBzZWQgPSAoKERhdGUubm93KCkgLSBnYW1lVGltZXJTdGFydCkgLyAxMDAwKS50b0ZpeGVkKDEpO1xuICAgICAgdGltZS5pbm5lckhUTUwgPSBgJHtlbGFwc2VkfWA7XG4gICAgfSBlbHNlIGlmIChnYW1lVGltZXJTdG9wKSB7XG4gICAgICB0aW1lLmlubmVySFRNTCA9IGVsYXBzZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWUuaW5uZXJIVE1MID0gZ2FtZVRpbWVyU3RhcnQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBsZXQgZGVsdGEgPSBub3cgLSBsYXN0VGltZTtcbiAgICBsZXQgZHQgPSAoZGVsdGEpIC8gNTAwLjA7XG4gICAgbXlSZXEgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG1haW4gKTtcbiAgICBjb2xsaXNpb25EZXRlY3RlZCgpO1xuICAgIHRpbWVyKCk7XG4gICAgdXBkYXRlKGtleSwgZHQsIGRlbHRhKTtcbiAgICBjbGVhcigpO1xuICAgIHJlbmRlcihub3cpO1xuICAgIGxhc3RUaW1lID0gbm93O1xuICB9XG4gIG15UmVxID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluICk7XG4gIHN0YXJ0R2FtZSgpO1xufTtcbiIsImNvbnN0IGltYWdlcyA9IFtcbiAgJ2Fzc2V0cy9pbWFnZXMvYXJyb3dfa2V5cy5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9hcnJvd3NfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JnX2ZpbmFsLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfZWFzdC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9iaXRlX25vcnRoLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfc291dGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV93ZXN0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2Jsb29kX3NtYWxsLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2RpcnRfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2RpcnRfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2dpdGh1Yi1vcmlnaW5hbC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9nbG9iZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9saW5rZWRpbl9sb2dvLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbGVmdC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X25lLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbncucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9yaWdodC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NlLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc291dGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zdy5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3ZlcnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2Rvd24ucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2xlZnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX3VwLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9zcGFjZWJhci5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy93b3JtX2RlYWQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvd29ybV9pZGxlLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dvcm1faWRsZV9nbG93Mi5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dhc2QucG5nJyxcbl07XG5cbm1vZHVsZS5leHBvcnRzID0gaW1hZ2VzO1xuIl19
