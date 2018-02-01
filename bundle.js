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
    this.maxHP = 500;
    this.health = 1;
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

    // timeout = setTimeout(() => {
    gameOver.style.display = 'block';
    scoreScreen.style.display = 'block';
    //   restartReady = true;
    // }, 1000);

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

    // let restart = document.onkeydown = function (event2) {
    //   if (event2.keyCode === 13) {
    //     clearTimeout(timeout);
    //     gameOver.style.display = 'none';
    //     monsterSprites.dead.currentFrame = 0;
    //     monsterSprites.idle.currentFrame = 0;
    //     player.currentSprite.currentFrame = 0;
    //     monsterSprites.intro.currentFrame = 0;
    //     restartGame();
    //   }


  }

  function restartGame () {
    let music = document.getElementById('music');
    let gameOver = document.getElementById('game_over');
    let scoreScreen = document.getElementById('score_screen');
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
        // clearTimeout(timeout);
        // timeout = 0;
        // restartReady = false;
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
  'assets/images/wasd.png',
];

module.exports = images;

},{}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImxpYi9jbGFzc2VzL2Jsb29kX2hpdC5qcyIsImxpYi9jbGFzc2VzL2J1bGxldC5qcyIsImxpYi9jbGFzc2VzL21vbnN0ZXIuanMiLCJsaWIvY2xhc3Nlcy9wbGF5ZXIuanMiLCJsaWIvY2xhc3Nlcy9zcHJpdGUuanMiLCJsaWIvY2xhc3Nlcy93ZWFwb25zLmpzIiwibGliL3Nwcml0ZXMvYmxvb2RfaGl0X3Nwcml0ZXMuanMiLCJsaWIvc3ByaXRlcy9idWxsZXRfc3ByaXRlcy5qcyIsImxpYi9zcHJpdGVzL21vbnN0ZXJfc3ByaXRlcy5qcyIsImxpYi9zcHJpdGVzL3BsYXllcl9zcHJpdGVzLmpzIiwibWFpbi5qcyIsInJlc291cmNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc3ByaXRlXG4vLyBSRU5ERVJcbi8vIHNwcml0ZXNoZWV0IGZvciBkaWZmZXJlbnQgaW4gZnBzIGFuZCBzaXplIG9mIGJsb29kXG5cbmNsYXNzIEJsb29kSGl0IHtcbiAgY29uc3RydWN0b3IgKHBsYXllckF0dHIsIGN0eCwgc3ByaXRlKSB7XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMucGxheWVyUG9zID0gT2JqZWN0LmFzc2lnbihbXSwgcGxheWVyQXR0ci5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IHBsYXllckF0dHIuY29vcmRpbmF0ZXM7XG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICB0aGlzLmNvbGxpc2lvbiA9IGZhbHNlO1xuICB9XG5cbiAgcmVuZGVyIChub3cpIHtcbiAgICB2YXIgYmxvb2RIaXRTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBibG9vZEhpdFNwcml0ZS5zcmMgPSB0aGlzLmN1cnJlbnRTcHJpdGUudXJsO1xuICAgIHRoaXMuY3R4LmRyYXdJbWFnZShibG9vZEhpdFNwcml0ZSwgdGhpcy5zaGlmdCwgMCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdIC0gKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC8gMiksXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdIC0gKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAvIDIpLFxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCk7XG5cbiAgICAgIGxldCBmcHMgPSB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzICogdGhpcy5jdXJyZW50U3ByaXRlLmZwc1g7XG4gICAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzKSAge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzID0gZnBzO1xuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGg7XG5cbiAgICAgICAgLy8gaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgIC8vICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgIC8vICAgdGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdkZWFkJykge1xuICAgICAgICAvLyAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG5cbiAgICAgICBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcykge1xuICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICs9IDE7XG4gICAgICAgICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmxvb2RIaXQ7XG4iLCJjbGFzcyBCdWxsZXQge1xuICBjb25zdHJ1Y3RvcihwbGF5ZXJBdHRyLCBjYW52YXNXLCBjYW52YXNILCBjdHgsIHNwcml0ZSwgYnVsbGV0Q291bnQpIHtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMucGxheWVyUG9zID0gT2JqZWN0LmFzc2lnbihbXSwgcGxheWVyQXR0ci5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5wbGF5ZXJGYWNlID0gcGxheWVyQXR0ci5wbGF5ZXJGYWNlO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSB0aGlzLnNldENvb3JkaW5hdGVzKHRoaXMucGxheWVyUG9zKTtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5idWxsZXRDb3VudGVyID0gMDtcbiAgICB0aGlzLmJ1bGxldENvdW50ID0gYnVsbGV0Q291bnQ7XG5cbiAgICAvLyBCQU5EIEFJRCBGT1IgTU9OU1RFUiBCVUxMRVRTXG4gICAgLy8gU0hPVUxEIEFMU08gV09SSyBGT1IgUExBWUVSIEJVTExFVFMgU0hJRlRJTkdcbiAgICAvLyBBQ1RVQUxMWSBXT1JLUyBQUkVUVFkgTklDRUxZLCBOT1QgU1VSRSBJRiBCRVRURVIgV0FZIFRPXG4gICAgLy8gRE8gVEhJUyBBQ1RJT04gU0lOQ0UgT05MWSBVU0lORyAxIFNQUklURVxuICAgIHRoaXMuY3VycmVudFVSTCA9IFwiXCI7XG5cblxuICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMgPSB0aGlzLnNldENvb3JkaW5hdGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZXRIaXRCb3ggPSB0aGlzLnNldEhpdEJveC5iaW5kKHRoaXMpO1xuICB9XG4gIC8vIEJVTExFVFMgV0lMTCBDSEFOR0UgU1BSSVRFUyBXSEVOIEFOT1RIRVIgU0hPVCBJUyBUQUtFTlxuICAvLyBORUVEIFRPIEtFRVAgVEhFIElNQUdFIFdIRU4gU0hPVCBJUyBUQUtFTlxuICByZW5kZXIgKCkge1xuICAgIHZhciBidWxsZXRTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBidWxsZXRTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50VXJsO1xuICAgIHRoaXMuY3R4LmRyYXdJbWFnZShidWxsZXRTcHJpdGUsIHRoaXMuY29vcmRpbmF0ZXNbMF0sIHRoaXMuY29vcmRpbmF0ZXNbMV0pO1xuICB9XG5cbiAgc2V0SGl0Qm94IChwbGF5ZXJGYWNlKSB7XG4gICAgbGV0IGRpbWVuc2lvbnNDb3B5ID0gT2JqZWN0LmFzc2lnbihbXSxcbiAgICAgIFt0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0XSk7XG4gICAgc3dpdGNoIChwbGF5ZXJGYWNlKSB7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwbGF5ZXJGYWNlO1xuICAgIH1cbiAgfVxuXG4gIHNldENvb3JkaW5hdGVzIChwbGF5ZXJQb3MpIHtcbiAgICBsZXQgeCA9IHBsYXllclBvc1swXTtcbiAgICBsZXQgeSA9IHBsYXllclBvc1sxXTtcbiAgICBpZiAodGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdyaWZsZScpIHtcbiAgICAgIHRoaXMuc2V0SGl0Qm94KHRoaXMucGxheWVyRmFjZSk7XG4gICAgICBzd2l0Y2ggKHRoaXMucGxheWVyRmFjZSkge1xuICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICB4ICs9IDQ7XG4gICAgICAgIHkgKz0gMTE7XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICB4ICs9IDQwO1xuICAgICAgICB5ICs9IDU7XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB4ICs9IDc1O1xuICAgICAgICB5ICs9IDQwO1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB4ICs9IDExO1xuICAgICAgICB5ICs9IDgwO1xuICAgICAgICByZXR1cm5beCwgeV07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwbGF5ZXJQb3M7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwbGF5ZXJQb3M7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKGR0LCBvd25lcikge1xuICAgIGxldCBidWxsZXRTcGVlZDtcbiAgICBpZiAob3duZXIgPT09ICdwbGF5ZXInKSB7XG4gICAgICBidWxsZXRTcGVlZCA9IDgwMDtcbiAgICAgIHN3aXRjaCAodGhpcy5wbGF5ZXJGYWNlKSB7XG4gICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXS09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXAnOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXS09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5jYW52YXNXO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9IHRoaXMuY2FudmFzSDtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYnVsbGV0U3BlZWQgPSA1MDA7XG4gICAgICAvLyBkZWJ1Z2dlclxuICAgICAgc3dpdGNoICh0aGlzLmJ1bGxldENvdW50KSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X253LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdIC09KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwICYmXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9sZWZ0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXS09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc3cucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdIC09KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gKz0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDAgJiZcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9IHRoaXMuY2FudmFzSDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc291dGgucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NlLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSArPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSArPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9XG4gICAgICAgICAgdGhpcy5jYW52YXNIICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5jYW52YXNXO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9yaWdodC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbmUucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdICs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdIC09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMCAmJlxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5jYW52YXNXO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXS09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGxldDtcbiIsImxldCBtb25zdGVyU3ByaXRlcyA9IHJlcXVpcmUoJy4uL3Nwcml0ZXMvbW9uc3Rlcl9zcHJpdGVzJyk7XG5sZXQgYnVsbGV0U3ByaXRlcyA9IHJlcXVpcmUoJy4uL3Nwcml0ZXMvYnVsbGV0X3Nwcml0ZXMnKTtcbmxldCBCdWxsZXQgPSByZXF1aXJlKCcuL2J1bGxldCcpO1xubGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG5cbmNsYXNzIE1vbnN0ZXIge1xuICBjb25zdHJ1Y3RvciAoY3R4LCBjYW52YXNXLCBjYW52YXNILCBzcHJpdGUpIHtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFs3MDAsIDMwMF07XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgIHRoaXMubWF4SFAgPSA1MDA7XG4gICAgdGhpcy5oZWFsdGggPSAxO1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuXG4gICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB0aGlzLmludGVydmFsID0gbnVsbDtcbiAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICB0aGlzLmNlbnRlckNvb3JkcyA9IFswLCAwXTtcbiAgICB0aGlzLnJhbmRDb3VudCA9IDIwMDtcbiAgICB0aGlzLnBhdXNlQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5idWxsZXRzID0gW107XG4gICAgdGhpcy5idWxsZXRzTG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5nbG93QWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbiA9IHRoaXMuY3VycmVudFBvc2l0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICBjdXJyZW50UG9zaXRpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb29yZGluYXRlczogdGhpcy5zZXRDZW50ZXJDb29yZHMoKSxcbiAgICB9O1xuICB9XG5cbiAgc2V0Q2VudGVyQ29vcmRzICgpIHtcbiAgICBsZXQgeCA9IHRoaXMuY29vcmRpbmF0ZXNbMF0gK1xuICAgICAgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC8gMik7XG4gICAgbGV0IHkgPSB0aGlzLmNvb3JkaW5hdGVzWzFdICtcbiAgICAgICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLyAyKTtcblxuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBkZWZlYXRlZCAoKSB7XG4gICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xuICB9XG5cbiAgcGxheWVyRGVmZWF0ZWQoKSB7XG4gICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gIH1cblxuICByZWR1Y2VIZWFsdGggKGRhbWFnZSkge1xuICAgIHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcbiAgfVxuXG4gIHJlbmRlcihub3cpIHtcbiAgICB2YXIgbW9uc3RlclNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgIG1vbnN0ZXJTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UobW9uc3RlclNwcml0ZSwgdGhpcy5zaGlmdCwgMCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCk7XG4gICAgaWYgKCF0aGlzLnBhdXNlQW5pbWF0aW9uKSB7XG5cbiAgICAgIGxldCBmcHMgPSB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzICogdGhpcy5jdXJyZW50U3ByaXRlLmZwc1g7XG4gICAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzKSAge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzID0gZnBzO1xuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGg7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdpbnRybycpIHtcblxuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IFt0aGlzLmNvb3JkaW5hdGVzWzBdIC0gMTUsXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdICsgMTVdO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2RlYWQnKSB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAyO1xuICAgICAgICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuICAgICAgICAgICAgICB0aGlzLnBhdXNlQW5pbWF0aW9uID0gdHJ1ZTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kRGlyZWN0aW9uVmVjdG9yICgpIHtcbiAgICBsZXQgeCA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0gLSB0aGlzLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCB5ID0gdGhpcy5maW5hbFBsYXllclBvc1sxXSAtIHRoaXMuY29vcmRpbmF0ZXNbMV07XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfVxuXG4gIGZpbmRNYWduaXR1ZGUgKHgsIHkpIHtcbiAgICBsZXQgbWFnbml0dWRlID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIHJldHVybiBtYWduaXR1ZGU7XG4gIH1cbiAgbm9ybWFsaXplVmVjdG9yIChwbGF5ZXJEaXIsIG1hZ25pdHVkZSkge1xuICAgIHJldHVybiBbKHBsYXllckRpclswXS9tYWduaXR1ZGUpLCAocGxheWVyRGlyWzFdL21hZ25pdHVkZSldO1xuICB9XG5cbiAgY2hhc2VQbGF5ZXIgKGRlbHRhKSB7XG4gICAgICBsZXQgcGxheWVyRGlyID0gdGhpcy5maW5kRGlyZWN0aW9uVmVjdG9yKCk7XG4gICAgICBsZXQgbWFnbml0dWRlID0gdGhpcy5maW5kTWFnbml0dWRlKHBsYXllckRpclswXSwgcGxheWVyRGlyWzFdKTtcbiAgICAgIGxldCBub3JtYWxpemVkID0gdGhpcy5ub3JtYWxpemVWZWN0b3IocGxheWVyRGlyLCBtYWduaXR1ZGUpO1xuICAgICAgbGV0IHZlbG9jaXR5ID0gMS41O1xuXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5jb29yZGluYXRlc1swXSArIChub3JtYWxpemVkWzBdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdID0gdGhpcy5jb29yZGluYXRlc1sxXSArIChub3JtYWxpemVkWzFdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PSAwKSB7XG4gICAgICAgIGxldCBjaGFyZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcmdlJyk7XG4gICAgICAgIGNoYXJnZS52b2x1bWUgPSAxO1xuICAgICAgICBjaGFyZ2UucGxheSgpO1xuICAgICAgfVxuICB9XG5cbiAgcmFuZG9tQ291bnQoKSB7XG4gICAgcmV0dXJuIChNYXRoLnJhbmRvbSgpICogMjAwKSArIDE4MDtcbiAgfVxuXG4gIGJ1bGxldEF0dGFjayAoKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIHdoaWxlIChpIDwgOCkge1xuICAgICAgbGV0IGJ1bGxldENvdW50ID0gaTtcbiAgICAgIHRoaXMuYnVsbGV0cy5wdXNoKG5ldyBCdWxsZXQodGhpcy5jdXJyZW50UG9zaXRpb24oKSwgdGhpcy5jYW52YXNXLFxuICAgICAgICB0aGlzLmNhbnZhc0gsIHRoaXMuY3R4LCBidWxsZXRTcHJpdGVzLm1vbnN0ZXIsIGJ1bGxldENvdW50KSk7XG5cbiAgICAgIGkrKztcbiAgICB9XG4gICAgdGhpcy5idWxsZXRzTG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmJ1bGxldHMuZmlsdGVyKGJ1bGxldCA9PiBidWxsZXQuYWN0aXZlKTtcbiAgfVxuXG4gIGhhbmRsZUlkbGUgKCkge1xuICAgIGlmICghdGhpcy5idWxsZXRzTG9hZGVkKSB7XG4gICAgICBsZXQgc3BpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGl0Jyk7XG4gICAgICBzcGl0LnZvbHVtZSA9IDE7XG4gICAgICB0aGlzLmJ1bGxldEF0dGFjaygpO1xuICAgICAgc3BpdC5wbGF5KCk7XG4gICAgfVxuICAgIGxldCBzcGVlZCA9IDI0MDtcbiAgICBpZiAodGhpcy5oZWFsdGggPD0gdGhpcy5tYXhIUCAqIC43NSAmJiB0aGlzLmhlYWx0aCA+IHRoaXMubWF4SFAgKiAuNSkge1xuICAgICAgc3BlZWQgPSAxODA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogLjUgJiYgdGhpcy5oZWFsdGggPlxuICAgICAgdGhpcy5tYXhIUCAqIC4yNSkge1xuICAgICAgc3BlZWQgPSAxNjA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogLjI1KSB7XG4gICAgICBzcGVlZCA9IDE1MDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZ2FtZU92ZXIgJiYgdGhpcy5jb3VudGVyID49IHNwZWVkICogMC41ICYmIHRoaXMuZ2xvd0FjdGl2ZSAmJlxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT0gdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzKSB7XG4gICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmdsb3c7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHRoaXMuZ2xvd0FjdGl2ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvdW50ZXIgPj0gc3BlZWQgJiYgIXRoaXMuZ2FtZU92ZXIpIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5idWxsZXRzTG9hZGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmdsb3dBY3RpdmUgPSB0cnVlO1xuXG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMF0gPj0gdGhpcy5jb29yZGluYXRlc1swXSkge1xuICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuYml0ZV9lO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5iaXRlX3c7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICB9XG4gICAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUJpdGVXZXN0IChkZWx0YSkge1xuICAgIC8vIEJJTkRTIEZJTkFMIFBPU0lUSU9OIEJFRk9SRSBCSVRFXG4gICAgaWYgKHRoaXMuZmluYWxQbGF5ZXJQb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMV0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPj0gdGhpcy5jYW52YXNIKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0UG9zWzFdID0gdGhpcy5jYW52YXNIIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0O1xuICAgICAgfVxuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFswICsgdGhpcy50YXJnZXRQb3NbMF0sIHRoaXMudGFyZ2V0UG9zWzFdXTtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5maW5hbFBsYXllclBvc1swXSl7XG4gICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSAtIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIDw9XG4gICAgICAgIDApe1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdO1xuICAgICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICAgIHRoaXMudGFyZ2V0UG9zID0gW107XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdID49IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pIHtcbiAgICAgIHRoaXMuY2hhc2VQbGF5ZXIoZGVsdGEpO1xuICAgIH1cbiAgfVxuICAvLyBDSEFSR0UgRE9FU05UIEhJVCBJRiBJTiBDRU5URVIgT0YgQk9UVE9NIE9SIHRvcFxuICAvLyBTSE9VTEQgRklORCBBIFdBWSBUTyBTVElMTCBHTyBUT1dBUkRTIFRBUkdFVCBYIEJVVCBGVUxMWVxuICBoYW5kbGVCaXRlRWFzdCAoZGVsdGEpIHtcbiAgICBpZiAodGhpcy5maW5hbFBsYXllclBvcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmICh0aGlzLnRhcmdldFBvc1sxXSArIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+PSB0aGlzLmNhbnZhc0gpIHtcbiAgICAgICAgdGhpcy50YXJnZXRQb3NbMV0gPSB0aGlzLmNhbnZhc0ggLSB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQ7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW3RoaXMuY2FudmFzVyAtXG4gICAgICAgICh0aGlzLmNhbnZhc1cgLSB0aGlzLnRhcmdldFBvc1swXSksIHRoaXMudGFyZ2V0UG9zWzFdXTtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdICsgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPj1cbiAgICAgICAgdGhpcy5jYW52YXNXKXtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5maW5hbFBsYXllclBvc1swXSAtXG4gICAgICAgICAgKHRoaXMuY2FudmFzVyAtIHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pO1xuICAgICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICAgIHRoaXMudGFyZ2V0UG9zID0gW107XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pIHtcbiAgICAgIHRoaXMuY2hhc2VQbGF5ZXIoZGVsdGEpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShwbGF5ZXJQb3MsIGR0LCBkZWx0YSkge1xuICAgIGlmICghdGhpcy5hbGl2ZSAmJiAhdGhpcy5nYW1lT3Zlcikge1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5kZWFkO1xuICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAvLyB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICB9XG4gICAgLy8gVFJBQ0tTIFBPU0lUSU9OIE9GIFBMQVlFUlxuICAgIGlmICh0aGlzLnRhcmdldFBvcy5sZW5ndGggPT09IDAgKSB7XG4gICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudGFyZ2V0UG9zID0gT2JqZWN0LmFzc2lnbihbXSwgcGxheWVyUG9zKTtcbiAgICAgIH0sIDEwMCk7XG4gICAgfVxuXG4gICAgLy8gT0ZGU0VUIEZPUiBJRExFIEFOSU1BVElPTlxuICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciB8fCAwO1xuXG4gICAgc3dpdGNoICh0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSkge1xuICAgICAgY2FzZSAnaWRsZSc6XG4gICAgICAgIHRoaXMuY291bnRlcisrO1xuICAgICAgICB0aGlzLmhhbmRsZUlkbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnbG93JzpcbiAgICAgICAgdGhpcy5jb3VudGVyKys7XG4gICAgICAgIHRoaXMuaGFuZGxlSWRsZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JpdGVfdyc6XG4gICAgICAgIHRoaXMuaGFuZGxlQml0ZVdlc3QoZGVsdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JpdGVfZSc6XG4gICAgICAgIHRoaXMuaGFuZGxlQml0ZUVhc3QoZGVsdGEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb25zdGVyO1xuIiwibGV0IHBsYXllclNwcml0ZXMgPSByZXF1aXJlKCcuLi9zcHJpdGVzL3BsYXllcl9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IgKGN0eCwgY2FudmFzVywgY2FudmFzSCwgc3ByaXRlKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbMCwgMF07XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuZmFjaW5nUG9zID0gXCJyaWdodFwiO1xuICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgIHRoaXMuaGl0Qm94VyA9IDY5O1xuICAgIHRoaXMua2V5UHJlc3NlZCA9IHt9O1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuY2VudGVyQ29vcmRzID0gWzAsIDBdO1xuICAgIHRoaXMuaGVhbHRoID0gMzA7XG4gIH1cblxuICBkZWFkICgpIHtcbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG4gIH1cblxuICByZWR1Y2VIZWFsdGggKGRhbWFnZSkge1xuICAgIHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcbiAgICByZXR1cm4gZGFtYWdlO1xuICB9XG5cbiAgc2V0Q2VudGVyQ29vcmRzICh4LCB5KSB7XG4gICAgbGV0IGNlbnRlclggPSB4ICsgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC8gMik7XG4gICAgbGV0IGNlbnRlclkgPSB5ICsgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAvIDIpO1xuXG4gICAgcmV0dXJuIFtjZW50ZXJYLCBjZW50ZXJZXTtcbiAgfVxuXG4gIHJlbmRlcihub3cpIHtcbiAgICBpZiAoIXRoaXMuZ2FtZU92ZXIpIHtcblxuICAgICAgdmFyIHBsYXllclNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgcGxheWVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZS51cmw7XG5cbiAgICAgIC8vIHBsYXllclNwcml0ZS5hZGRFdmVudExpc3RlbmVyXG4gICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UocGxheWVyU3ByaXRlLCB0aGlzLnNoaWZ0LCAwLFxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgLy8gZGVidWdnZXJcblxuICAgICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzICYmICF0aGlzLmdhbWVPdmVyKSAge1xuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcHMgPSBmcHM7XG4gICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aDtcblxuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2RlYWQnKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHNldEhpdEJveCAoZmFjaW5nUG9zKSB7XG4gICAgc3dpdGNoIChmYWNpbmdQb3MpIHtcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA2OTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNjk7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDU1O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA1NTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNjk7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDU1O1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWNpbmdQb3M7XG4gICAgfVxuICB9XG5cbiAgY3VycmVudFBvc2l0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBwbGF5ZXJGYWNlOiB0aGlzLmZhY2luZ1Bvc1xuICAgIH07XG4gIH1cblxuICB1cGRhdGUoa2V5KSB7XG4gICAgY29uc3Qgc3ByaXRlSGVpZ2h0ID0gMTI1O1xuICAgIHRoaXMuc2V0SGl0Qm94KHRoaXMuZmFjaW5nUG9zKTtcbiAgICBsZXQgc3BlZWQgPSAxMjtcbiAgICAvLyBrZXkucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzddIHx8IHRoaXMua2V5UHJlc3NlZFs2NV0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZUxlZnQ7XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJsZWZ0XCI7XG4gICAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdID49IDUpIHt0aGlzLmNvb3JkaW5hdGVzWzBdLT1zcGVlZDt9XG4gICAgICB9XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzhdIHx8IHRoaXMua2V5UHJlc3NlZFs4N10pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZVVwO1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwidXBcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMTUpIHt0aGlzLmNvb3JkaW5hdGVzWzFdLT1zcGVlZDt9XG4gICAgICB9XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzldIHx8IHRoaXMua2V5UHJlc3NlZFs2OF0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0O1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwicmlnaHRcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gKHRoaXMuY2FudmFzVyAtIHRoaXMuaGl0Qm94SCAtIDMwKSlcbiAgICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMF0rPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFs0MF0gfHwgdGhpcy5rZXlQcmVzc2VkWzgzXSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlRG93bjtcbiAgICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcImRvd25cIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gKHRoaXMuY2FudmFzSCAtIHRoaXMuaGl0Qm94SCkpXG4gICAgICAgIHt0aGlzLmNvb3JkaW5hdGVzWzFdKz1zcGVlZDt9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuZGVhZDtcbiAgICB9XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuIiwiY2xhc3MgU3ByaXRlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmw7XG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgIHRoaXMuZnJhbWVXaWR0aCA9IG9wdGlvbnMuZnJhbWVXaWR0aDtcbiAgICB0aGlzLmZyYW1lSGVpZ2h0ID0gb3B0aW9ucy5mcmFtZUhlaWdodDtcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IG9wdGlvbnMuY3VycmVudEZyYW1lO1xuICAgIHRoaXMudG90YWxGcmFtZXMgPSBvcHRpb25zLnRvdGFsRnJhbWVzO1xuICAgIHRoaXMub25jZSA9IG9wdGlvbnMub25jZTtcbiAgICB0aGlzLmZwcyA9IG9wdGlvbnMuZnBzO1xuICAgIHRoaXMuZnBzWCA9IG9wdGlvbnMuZnBzWDtcbiAgICB0aGlzLmRhbWFnZSA9IG9wdGlvbnMuZGFtYWdlO1xuICB9XG59XG4vLyB1cmwsIG5hbWUsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlXG5cbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlO1xuIiwiLy8gSE9XIFRPIEJVSUxEIFBIWVNJQ1MgRk9SIEEgV0VBUE9OP1xuLy8gQlVMTEVUIFNQRUVELCBTUFJFQUQsIERBTUFHRT9cbi8vIERPIFBIWVNJQ1MgTkVFRCBUTyBCRSBBIFNFUEFSQVRFIENMQVNTPyBDQU4gSSBJTVBPUlQgQSBMSUJSQVJZIFRPIEhBTkRMRSBUSEFUIExPR0lDP1xuXG5jbGFzcyBXZWFwb24ge1xuICBjb25zdHJ1Y3RvciAoYXR0cmlidXRlcykge1xuICAgIHRoaXMucmF0ZSA9IGF0dHJpYnV0ZXMucmF0ZTtcbiAgICB0aGlzLm1vZGVsID0gYXR0cmlidXRlcy5tb2RlbDtcbiAgICB0aGlzLnBvd2VyID0gYXR0cmlidXRlcy5wb3dlcjtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2VhcG9uO1xuIiwibGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4uL2NsYXNzZXMvc3ByaXRlJyk7XG4vLyBNQUtFIFNNQUxMRVJcbmNvbnN0IGJsb29kSGl0U3ByaXRlU2hlZXQgPSB7XG4gIHBsYXllckhpdDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYmxvb2Rfc21hbGwucG5nJyxcbiAgICBuYW1lOiAncGxheWVySGl0JyxcbiAgICBmcmFtZUhlaWdodDogMTI0LFxuICAgIGZyYW1lV2lkdGg6ICg3NjMgLyA2KSxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDEwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIC8vIE1BS0UgQkxPT0QgRElGRkVSRU5UIENPTE9SXG4gIC8vIFVTRSBGVUxMIFNJWkUgTU9ERUxcbiAgbW9uc3RlckhpdDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvbW9uc3Rlcl9ibG9vZC5wbmcnLFxuICAgIG5hbWU6ICdwbGF5ZXJIaXQnLFxuICAgIGZyYW1lSGVpZ2h0OiAzMjQsXG4gICAgZnJhbWVXaWR0aDogKDE5NTcgLyA2KSxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDUsXG4gICAgZnBzWDogMSxcbiAgfSxcbn07XG5cbmNvbnN0IGJsb29kSGl0U3ByaXRlcyA9IHtcbiAgcGxheWVySGl0OiBuZXcgU3ByaXRlKGJsb29kSGl0U3ByaXRlU2hlZXQucGxheWVySGl0KSxcbiAgbW9uc3RlckhpdDogbmV3IFNwcml0ZShibG9vZEhpdFNwcml0ZVNoZWV0Lm1vbnN0ZXJIaXQpLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBibG9vZEhpdFNwcml0ZXM7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi4vY2xhc3Nlcy9zcHJpdGUnKTtcbi8vIElGIEJMQU5LIFJFTkRFUiBCRUZPUkUgU1BSSVRFLCBORUVEIFRPIFJFU0VUIFNISUZUIFRPIDAhIVxuY29uc3QgYnVsbGV0U3ByaXRlU2hlZXQgPSB7XG4gIHJpZmxlOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnLFxuICAgIG5hbWU6ICdyaWZsZScsXG4gICAgZnJhbWVIZWlnaHQ6IDYsXG4gICAgZnJhbWVXaWR0aDogMTQsXG4gICAgZGFtYWdlOiAxMCxcbiAgfSxcblxuICBtb25zdGVyOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3ZlcnQucG5nJyxcbiAgICBuYW1lOiAnbW9uc3RlcicsXG4gICAgZnJhbWVIZWlnaHQ6IDMyLFxuICAgIGZyYW1lV2lkdGg6IDksXG4gICAgZGFtYWdlOiAxMCxcbiAgfSxcbn07XG5cbmNvbnN0IGJ1bGxldFNwcml0ZXMgPSB7XG4gIHJpZmxlOiBuZXcgU3ByaXRlKGJ1bGxldFNwcml0ZVNoZWV0LnJpZmxlKSxcbiAgbW9uc3RlcjogbmV3IFNwcml0ZShidWxsZXRTcHJpdGVTaGVldC5tb25zdGVyKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBidWxsZXRTcHJpdGVzO1xuIiwibGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4uL2NsYXNzZXMvc3ByaXRlJyk7XG4vLyBJRiBCTEFOSyBSRU5ERVIgQkVGT1JFIFNQUklURSwgTkVFRCBUTyBSRVNFVCBTSElGVCBUTyAwISFcbmNvbnN0IG1vbnN0ZXJTcHJpdGVTaGVldCA9IHtcbiAgZGlydDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuICAgIG5hbWU6ICdpbnRybycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2NixcbiAgICBmcmFtZVdpZHRoOiAxNTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgaW50cm86IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faW50cm8ucG5nJyxcbiAgICBuYW1lOiAnaW50cm8nLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjYsXG4gICAgZnJhbWVXaWR0aDogMTUzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDEwMCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGlkbGU6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faWRsZS5wbmcnLFxuICAgIG5hbWU6ICdpZGxlJyxcbiAgICBmcmFtZUhlaWdodDogMTczLFxuICAgIGZyYW1lV2lkdGg6IDIwMyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEyLFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMTI1LFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgZ2xvdzoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pZGxlX2dsb3cyLnBuZycsXG4gICAgbmFtZTogJ2dsb3cnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNzMsXG4gICAgZnJhbWVXaWR0aDogMjIzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTIsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiA1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGJpdGVfdzoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV93ZXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfdycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEuNSxcbiAgfSxcblxuICBiaXRlX2U6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2JpdGVfZWFzdC5wbmcnLFxuICAgIG5hbWU6ICdiaXRlX2UnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjMsXG4gICAgZnJhbWVXaWR0aDogMTkyLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNSxcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDIwMCxcbiAgICBmcHNYOiAxLjUsXG4gIH0sXG5cbiAgZGVhZDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9kZWFkLnBuZycsXG4gICAgbmFtZTogJ2RlYWQnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjMsXG4gICAgZnJhbWVXaWR0aDogMTU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNCxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogNDAwLFxuICAgIGZwc1g6IDEsXG4gIH1cbn07XG5cbmNvbnN0IG1vbnN0ZXJTcHJpdGVzID0ge1xuICBpbnRybzogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuaW50cm8pLFxuICBpZGxlOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5pZGxlKSxcbiAgZ2xvdzogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuZ2xvdyksXG4gIGRlYWQ6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmRlYWQpLFxuICBiaXRlX3c6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmJpdGVfdyksXG4gIGJpdGVfZTogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuYml0ZV9lKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtb25zdGVyU3ByaXRlcztcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuLi9jbGFzc2VzL3Nwcml0ZScpO1xuXG5jb25zdCBwbGF5ZXJTcHJpdGVTaGVldCA9IHtcbiAgZGVhZDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYmxvb2Rfc21hbGwucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDEyNCxcbiAgICBmcmFtZVdpZHRoOiAoNzYzIC8gNiksXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAxNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBlbXB0eToge1xuICAgIHVybDogJycsXG4gICAgbmFtZTogJycsXG4gICAgZnJhbWVIZWlnaHQ6IDAsXG4gICAgZnJhbWVXaWR0aDogMCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDAsXG4gICAgb25jZTogMCxcbiAgICBmcHM6IDAsXG4gICAgZnBzWDogMCxcbiAgfSxcblxuICBhbGl2ZUxlZnQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9sZWZ0LnBuZycsXG4gICAgbmFtZTogJ2xlZnQnLFxuICAgIGZyYW1lSGVpZ2h0OiA1NSxcbiAgICBmcmFtZVdpZHRoOiA5MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgLy8gaGl0Qm94SGVpZ2h0T2Zmc2V0OlxuICAgIC8vIGhpdEJveFdpZHRoT2Zmc2V0OlxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVVcDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX3VwLnBuZycsXG4gICAgbmFtZTogJ3VwJyxcbiAgICBmcmFtZUhlaWdodDogOTMsXG4gICAgZnJhbWVXaWR0aDogNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVSaWdodDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlLnBuZycsXG4gICAgbmFtZTogJ3JpZ2h0JyxcbiAgICBmcmFtZUhlaWdodDogNTUsXG4gICAgZnJhbWVXaWR0aDogOTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVEb3duOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfZG93bi5wbmcnLFxuICAgIG5hbWU6ICdkb3duJyxcbiAgICBmcmFtZUhlaWdodDogOTMsXG4gICAgZnJhbWVXaWR0aDogNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbn07XG5cbmNvbnN0IHBsYXllclNwcml0ZXMgPSB7XG4gIGRlYWQ6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuZGVhZCksXG4gIGFsaXZlTGVmdDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZUxlZnQpLFxuICBhbGl2ZVVwOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlVXApLFxuICBhbGl2ZVJpZ2h0OiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlUmlnaHQpLFxuICBhbGl2ZURvd246IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVEb3duKSxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwbGF5ZXJTcHJpdGVzO1xuIiwibGV0IG1vbnN0ZXJTcHJpdGVzID0gcmVxdWlyZSgnLi9saWIvc3ByaXRlcy9tb25zdGVyX3Nwcml0ZXMuanMnKTtcbmxldCBwbGF5ZXJTcHJpdGVzID0gcmVxdWlyZSgnLi9saWIvc3ByaXRlcy9wbGF5ZXJfc3ByaXRlcy5qcycpO1xubGV0IGJ1bGxldFNwcml0ZXMgPSByZXF1aXJlKCcuL2xpYi9zcHJpdGVzL2J1bGxldF9zcHJpdGVzLmpzJyk7XG5sZXQgYmxvb2RIaXRTcHJpdGVzID0gcmVxdWlyZSgnLi9saWIvc3ByaXRlcy9ibG9vZF9oaXRfc3ByaXRlcy5qcycpO1xubGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vbGliL2NsYXNzZXMvc3ByaXRlLmpzJyk7XG5sZXQgTW9uc3RlciA9IHJlcXVpcmUoJy4vbGliL2NsYXNzZXMvbW9uc3Rlci5qcycpO1xubGV0IEJsb29kSGl0ID0gcmVxdWlyZSgnLi9saWIvY2xhc3Nlcy9ibG9vZF9oaXQuanMnKTtcbmxldCBQbGF5ZXIgPSByZXF1aXJlKCcuL2xpYi9jbGFzc2VzL3BsYXllci5qcycpO1xubGV0IFdlYXBvbnMgPSByZXF1aXJlKCcuL2xpYi9jbGFzc2VzL3dlYXBvbnMuanMnKTtcbmxldCBCdWxsZXQgPSByZXF1aXJlKCcuL2xpYi9jbGFzc2VzL2J1bGxldC5qcycpO1xubGV0IHByZWxvYWRJbWFnZXMgPSByZXF1aXJlKCcuL3Jlc291cmNlcy5qcycpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gIGxldCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG4gIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgbGV0IG15UmVxO1xuICBwcmVsb2FkQXNzZXRzKCk7XG5cbiAgZnVuY3Rpb24gc3RhcnRHYW1lICgpIHtcbiAgICBsZXQgc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKTtcbiAgICBsZXQgbXVzaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVzaWMnKTtcbiAgICBsZXQgaW50cm9NdXNpYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXZlX3RoZW1lJyk7XG4gICAgaW50cm9NdXNpYy52b2x1bWUgPSAxO1xuICAgIC8vIHNldCB1cCBkYXRlIG5vd1xuICAgIC8vIGNvbnZlcnQgdG8gc2Vjb25kc1xuICAgIC8vIGVuZCB3aGVuIGdhbWVPdmVyXG4gICAgLy8gaGF2ZSB0aW1lciBkaXYgc2V0IHVwIGFuZCBhcHBlbmQgdG8gdGhlIGlkIG9mIHRoZSBkaXYgdGFnXG5cbiAgICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgc3RhcnQuY2xhc3NOYW1lID0gJ3N0YXJ0X2J1dHRvbl9oaWRlJztcbiAgICAgICAgZ2FtZVN0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgZ2FtZVdpbiA9IGZhbHNlO1xuICAgICAgICBnYW1lVGltZXJTdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgIGludHJvTXVzaWMucGF1c2UoKTtcbiAgICAgICAgbXVzaWMudm9sdW1lID0gLjc7XG4gICAgICAgIG11c2ljLnBsYXkoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50Lm9ua2V5cHJlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIHN0YXJ0LmNsYXNzTmFtZSA9ICdzdGFydF9idXR0b25faGlkZSc7XG4gICAgICAgIGdhbWVTdGFydCA9IHRydWU7XG4gICAgICAgIGdhbWVXaW4gPSBmYWxzZTtcbiAgICAgICAgZ2FtZVRpbWVyU3RhcnQgPSBEYXRlLm5vdygpO1xuICAgICAgICBpbnRyb011c2ljLnBhdXNlKCk7XG4gICAgICAgIG11c2ljLnZvbHVtZSA9IC43O1xuICAgICAgICBtdXNpYy5wbGF5KCk7XG4gICAgICB9XG4gICAgfTtcblxuXG5cbiAgICBsZXQgYXVkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW9faG92ZXInKTtcbiAgICBhdWRpby52b2x1bWUgPSAwLjQ7XG4gICAgc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBhdWRpby5wbGF5KCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVsb2FkQXNzZXRzICgpIHtcbiAgICBwcmVsb2FkSW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4ge1xuICAgICAgbGV0IGxvYWRlZEltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICBsb2FkZWRJbWFnZS5zcmMgPSBpbWFnZTtcbiAgICB9KTtcbiAgfVxuICBsZXQgdGltZW91dDtcbiAgbGV0IHJlc3RhcnRSZWFkeSA9IGZhbHNlO1xuICBmdW5jdGlvbiBnYW1lT3ZlclByb21wdCAoKSB7XG4gICAgbGV0IGludHJvTXVzaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2F2ZV90aGVtZScpO1xuICAgIGludHJvTXVzaWMudm9sdW1lID0gMTtcbiAgICBpbnRyb011c2ljLnBsYXkoKTtcbiAgICBsZXQgbXVzaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVzaWMnKTtcbiAgICBtdXNpYy5wYXVzZSgpO1xuICAgIGdhbWVUaW1lclN0b3AgPSB0cnVlO1xuICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICBsZXQgYXVkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW9faG92ZXInKTtcbiAgICBsZXQgc2NvcmVTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmVfc2NyZWVuJyk7XG4gICAgaWYgKGdhbWVXaW4pIHtcbiAgICAgIHNjb3JlU2NyZWVuLmlubmVySFRNTCA9IGBXb3JtIEJvc3MgZGVmZWF0ZWQgaW4gJHtlbGFwc2VkfSBzZWNvbmRzIWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjb3JlU2NyZWVuLmlubmVySFRNTCA9IGBZb3Ugc3Vydml2ZWQgZm9yICR7ZWxhcHNlZH0gc2Vjb25kcy5gO1xuICAgIH1cblxuICAgIC8vIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBzY29yZVNjcmVlbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAvLyAgIHJlc3RhcnRSZWFkeSA9IHRydWU7XG4gICAgLy8gfSwgMTAwMCk7XG5cbiAgICBhdWRpby52b2x1bWUgPSAwLjQ7XG4gICAgZ2FtZU92ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBhdWRpby5wbGF5KCk7XG4gICAgfSk7XG5cbiAgICBnYW1lT3Zlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBzY29yZVNjcmVlbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgbW9uc3RlclNwcml0ZXMuZGVhZC5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgbW9uc3RlclNwcml0ZXMuaWRsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgcGxheWVyLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICByZXN0YXJ0R2FtZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gbGV0IHJlc3RhcnQgPSBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZXZlbnQyKSB7XG4gICAgLy8gICBpZiAoZXZlbnQyLmtleUNvZGUgPT09IDEzKSB7XG4gICAgLy8gICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAvLyAgICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyAgICAgbW9uc3RlclNwcml0ZXMuZGVhZC5jdXJyZW50RnJhbWUgPSAwO1xuICAgIC8vICAgICBtb25zdGVyU3ByaXRlcy5pZGxlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgLy8gICAgIHBsYXllci5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgLy8gICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgLy8gICAgIHJlc3RhcnRHYW1lKCk7XG4gICAgLy8gICB9XG5cblxuICB9XG5cbiAgZnVuY3Rpb24gcmVzdGFydEdhbWUgKCkge1xuICAgIGxldCBtdXNpYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtdXNpYycpO1xuICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICBsZXQgc2NvcmVTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmVfc2NyZWVuJyk7XG4gICAgbXVzaWMudm9sdW1lID0gLjc7XG4gICAgbXVzaWMucGxheSgpO1xuICAgIGdhbWVUaW1lclN0b3AgPSBmYWxzZTtcbiAgICBnYW1lVGltZXJTdGFydCA9IERhdGUubm93KCk7XG4gICAgZ2FtZVdpbiA9IGZhbHNlO1xuICAgIHNjb3JlU2NyZWVuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIG1vbnN0ZXIgPSBuZXcgTW9uc3RlcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvKTtcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgICAgcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0KTtcbiAgICBtb25zdGVyQnVsbGV0cyA9IG1vbnN0ZXIuYnVsbGV0cztcblxuICB9XG5cbiAgbGV0IG1vbnN0ZXIgPSBuZXcgTW9uc3RlcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICBtb25zdGVyU3ByaXRlcy5pbnRybyk7XG4gIGxldCBnYW1lU3RhcnQgPSBmYWxzZTtcbiAgbGV0IGJ1bGxldHMgPSBbXTtcbiAgbGV0IG1vbnN0ZXJCdWxsZXRzID0gbW9uc3Rlci5idWxsZXRzO1xuICBsZXQgcGxheWVyID0gbmV3IFBsYXllcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICBwbGF5ZXJTcHJpdGVzLmFsaXZlUmlnaHQpO1xuICBsZXQgbGFzdFRpbWUgPSBEYXRlLm5vdygpO1xuICBsZXQga2V5O1xuICBsZXQgYWxsb3dGaXJlID0gdHJ1ZTtcbiAgbGV0IHBsYXllckhpdCA9IG5ldyBCbG9vZEhpdChwbGF5ZXIuY3VycmVudFBvc2l0aW9uKCksIGN0eCxcbiAgICBibG9vZEhpdFNwcml0ZXMucGxheWVySGl0KTtcbiAgbGV0IG1vbnN0ZXJIaXQgPSBuZXcgQmxvb2RIaXQobW9uc3Rlci5jdXJyZW50UG9zaXRpb24oKSwgY3R4LFxuICAgIGJsb29kSGl0U3ByaXRlcy5tb25zdGVySGl0KTtcblxuICBsZXQgZ2FtZVdpbiA9IGZhbHNlO1xuICBmdW5jdGlvbiBjb2xsaXNpb25EZXRlY3RlZCAoKSB7XG4gICAgbGV0IGNvbGxpZGVCdWxsZXRzID0gT2JqZWN0LmFzc2lnbihbXSwgYnVsbGV0cyk7XG4gICAgbGV0IGJ1bGxldFg7XG4gICAgbGV0IGJ1bGxldFk7XG4gICAgbGV0IHBsYXllclggPSBwbGF5ZXIuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IHBsYXllclkgPSBwbGF5ZXIuY29vcmRpbmF0ZXNbMV07XG4gICAgbGV0IG1vbnN0ZXJYID0gbW9uc3Rlci5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgbW9uc3RlclkgPSBtb25zdGVyLmNvb3JkaW5hdGVzWzFdO1xuICAgIGxldCBtSEJvZmZzZXQgPSA0MDtcblxuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIGxldCBibG9vZFNxdWlydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb25zdGVyX2hpdCcpO1xuICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICAgIGJ1bGxldFggPSBidWxsZXQuY29vcmRpbmF0ZXNbMF07XG4gICAgICAgIGJ1bGxldFkgPSBidWxsZXQuY29vcmRpbmF0ZXNbMV07XG4gICAgICAgIGlmIChidWxsZXRYIDwgbW9uc3RlclggKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAtIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFggKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID4gbW9uc3RlclggKyBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLSBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPiBtb25zdGVyWSArIG1IQm9mZnNldCkge1xuICAgICAgICAgICAgYmxvb2RTcXVpcnQudm9sdW1lID0gMTtcbiAgICAgICAgICAgIGJsb29kU3F1aXJ0LnBsYXliYWNrUmF0ZSA9IDQ7XG4gICAgICAgICAgICBibG9vZFNxdWlydC5wbGF5KCk7XG4gICAgICAgICAgICBtb25zdGVyLnJlZHVjZUhlYWx0aChidWxsZXQuY3VycmVudFNwcml0ZS5kYW1hZ2UpO1xuICAgICAgICAgICAgYnVsbGV0cy5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICBtb25zdGVySGl0ID0gbmV3IEJsb29kSGl0KG1vbnN0ZXIuY3VycmVudFBvc2l0aW9uKCksIGN0eCxcbiAgICAgICAgICAgIGJsb29kSGl0U3ByaXRlcy5tb25zdGVySGl0KTtcbiAgICAgICAgICAgIG1vbnN0ZXJIaXQuY29sbGlzaW9uID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKG1vbnN0ZXIuaGVhbHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgbGV0IGRlYXRoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vbnN0ZXJfZGVhdGgnKTtcbiAgICAgICAgICAgICAgZGVhdGgudm9sdW1lID0gMTtcbiAgICAgICAgICAgICAgZGVhdGgucGxheSgpO1xuICAgICAgICAgICAgICBtb25zdGVySGl0LmNvbGxpc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICBnYW1lV2luID0gdHJ1ZTtcbiAgICAgICAgICAgICAgbW9uc3Rlci5kZWZlYXRlZCgpO1xuICAgICAgICAgICAgICBnYW1lT3ZlclByb21wdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgICBsZXQgZ3J1bnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3J1bnQnKTtcbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICBidWxsZXRYID0gYnVsbGV0LmNvb3JkaW5hdGVzWzBdO1xuICAgICAgYnVsbGV0WSA9IGJ1bGxldC5jb29yZGluYXRlc1sxXTtcbiAgICAgIGlmIChidWxsZXRYIDwgcGxheWVyWCArIHBsYXllci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggJiZcbiAgICAgICAgYnVsbGV0WCArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPiBwbGF5ZXJYICYmXG4gICAgICAgIGJ1bGxldFkgPCBwbGF5ZXJZICsgcGxheWVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgJiZcbiAgICAgICAgYnVsbGV0WSArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID4gcGxheWVyWSkge1xuICAgICAgICAgIHBsYXllci5yZWR1Y2VIZWFsdGgoYnVsbGV0LmN1cnJlbnRTcHJpdGUuZGFtYWdlKTtcbiAgICAgICAgICBncnVudC52b2x1bWUgPSAxO1xuICAgICAgICAgIGdydW50LnBsYXliYWNrUmF0ZSA9IDI7XG4gICAgICAgICAgZ3J1bnQucGxheSgpO1xuICAgICAgICAgIGxldCBpbmRleCA9IG1vbnN0ZXJCdWxsZXRzLmluZGV4T2YoYnVsbGV0KTtcbiAgICAgICAgICBtb25zdGVyQnVsbGV0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIGlmIChwbGF5ZXIuaGVhbHRoID4gMCkge1xuICAgICAgICAgICAgcGxheWVySGl0ID0gbmV3IEJsb29kSGl0KHBsYXllci5jdXJyZW50UG9zaXRpb24oKSwgY3R4LFxuICAgICAgICAgICAgYmxvb2RIaXRTcHJpdGVzLnBsYXllckhpdCk7XG4gICAgICAgICAgICBwbGF5ZXJIaXQuY29sbGlzaW9uID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGxheWVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICBwbGF5ZXJIaXQuY29sbGlzaW9uID0gZmFsc2U7XG4gICAgICAgICAgICBwbGF5ZXIuZGVhZCgpO1xuICAgICAgICAgICAgbW9uc3Rlci5wbGF5ZXJEZWZlYXRlZCgpO1xuICAgICAgICAgICAgZ2FtZU92ZXJQcm9tcHQoKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGxheWVyWCA8IG1vbnN0ZXJYICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLSBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWCArIHBsYXllci5oaXRCb3hXID4gbW9uc3RlclggKyBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWSA8IG1vbnN0ZXJZICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC0gbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclkgKyBwbGF5ZXIuaGl0Qm94SCA+IG1vbnN0ZXJZICsgbUhCb2Zmc2V0ICYmXG4gICAgICBnYW1lU3RhcnQgJiYgbW9uc3Rlci5hbGl2ZSkge1xuICAgICAgICBwbGF5ZXIuZGVhZCgpO1xuICAgICAgICBtb25zdGVyLnBsYXllckRlZmVhdGVkKCk7XG4gICAgICAgIGdhbWVPdmVyUHJvbXB0KCk7XG4gICAgICB9XG4gIH1cblxuICBsZXQgbGFzdEJ1bGxldDtcbiAgZnVuY3Rpb24gRmlyZSAoKSB7XG4gICAgYWxsb3dGaXJlID0gZmFsc2U7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBhbGxvd0ZpcmUgPSB0cnVlO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG9vdCAocGxheWVyUG9zKSB7XG4gICAgICBidWxsZXRzLnB1c2gobmV3IEJ1bGxldChwbGF5ZXJQb3MsIGNhbnZhcy53aWR0aCxcbiAgICAgICAgY2FudmFzLmhlaWdodCwgY3R4LCBidWxsZXRTcHJpdGVzLnJpZmxlKSk7XG5cbiAgICAgIGJ1bGxldHMgPSBidWxsZXRzLmZpbHRlcihidWxsZXQgPT4gYnVsbGV0LmFjdGl2ZSk7XG5cbiAgICBGaXJlKCk7XG4gICAgbGV0IGJ1bGxldFNvdW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1bGxldCcpO1xuICAgIGJ1bGxldFNvdW5kLnZvbHVtZSA9IDAuNztcbiAgICBidWxsZXRTb3VuZC5sb2FkKCk7XG4gICAgYnVsbGV0U291bmQucGxheSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlIChrZXksIGR0LCBkZWx0YSkge1xuICAgIHBsYXllci51cGRhdGUoa2V5KTtcbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBtb25zdGVyLnVwZGF0ZShwbGF5ZXIuY29vcmRpbmF0ZXMsIGR0LCBkZWx0YSk7XG4gICAgfVxuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnVwZGF0ZShkdCwgJ3BsYXllcicpKTtcbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQudXBkYXRlKGR0LCAnbW9uc3RlcicpKTtcbiAgfVxuXG4gIGNvbnN0IGNsZWFyID0gKCkgPT4gIHtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVuZGVyIChub3cpIHtcbiAgICBpZiAocGxheWVySGl0LmNvbGxpc2lvbikge1xuICAgICAgcGxheWVySGl0LnJlbmRlcihub3cpO1xuICAgIH1cblxuICAgIGlmIChtb25zdGVySGl0LmNvbGxpc2lvbikge1xuICAgICAgbW9uc3RlckhpdC5yZW5kZXIobm93KTtcbiAgICB9XG5cbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBtb25zdGVyLnJlbmRlcihub3cpO1xuICAgIH1cblxuICAgIHBsYXllci5yZW5kZXIobm93KTtcblxuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnJlbmRlcigpKTtcblxuICAgIG1vbnN0ZXJCdWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC5yZW5kZXIoKSk7XG4gICAgaWYgKG1vbnN0ZXIuY3VycmVudFNwcml0ZS5uYW1lID09PSAnaW50cm8nICYmXG4gICAgZ2FtZVN0YXJ0ICYmIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09IDEpIHtcbiAgICAgIGxldCBpbnRybyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnRyb19tb25zdGVyJyk7XG4gICAgICBpbnRyby52b2x1bWUgPSAxO1xuICAgICAgaW50cm8ucGxheSgpO1xuICAgIH0gZWxzZSBpZiAobW9uc3Rlci5jdXJyZW50U3ByaXRlLm5hbWUgIT09ICdpbnRybycgJiYgZ2FtZVN0YXJ0ICYmXG4gICAgbW9uc3Rlci5hbGl2ZSkge1xuICAgICAgbGV0IG1vbkJHID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vbnN0ZXJfYmcnKTtcbiAgICAgIG1vbkJHLnZvbHVtZSA9IDE7XG4gICAgICBtb25CRy5wbGF5YmFja1JhdGUgPSAzLjU7XG4gICAgICBtb25CRy5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGxldCBrZXlzID0gWzMyLCAzNywgMzgsIDM5LCA0MF07XG4gICAga2V5ID0gZXZ0LndoaWNoO1xuICAgIGlmKGtleXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIHBsYXllci5rZXlQcmVzc2VkW2tleV0gPSB0cnVlO1xuICAgIGlmIChrZXkgPT09IDMyICYmIHBsYXllci5hbGl2ZSAmJiBhbGxvd0ZpcmUpIHtcbiAgICAgIHNob290KHBsYXllci5jdXJyZW50UG9zaXRpb24oKSk7XG4gICAgfVxuXG4gICAgaWYgKCFtb25zdGVyLmFsaXZlIHx8ICFwbGF5ZXIuYWxpdmUpIHtcbiAgICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICAgIGlmIChrZXkgPT09IDEzKSB7XG4gICAgICAgIC8vIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgLy8gdGltZW91dCA9IDA7XG4gICAgICAgIC8vIHJlc3RhcnRSZWFkeSA9IGZhbHNlO1xuICAgICAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBtb25zdGVyU3ByaXRlcy5kZWFkLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgIG1vbnN0ZXJTcHJpdGVzLmlkbGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgcGxheWVyLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgbW9uc3RlclNwcml0ZXMuaW50cm8uY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgcmVzdGFydEdhbWUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBsYXllci5rZXlQcmVzc2VkW2V2dC53aGljaF0gPSBmYWxzZTtcbiAgICBrZXkgPSBudWxsO1xuICB9O1xuICBsZXQgZ2FtZVRpbWVyU3RvcCA9IGZhbHNlO1xuICBsZXQgZ2FtZVRpbWVyU3RhcnQgPSAoMCkudG9GaXhlZCgxKTtcbiAgbGV0IGVsYXBzZWQ7XG4gIGZ1bmN0aW9uIHRpbWVyKCkge1xuICAgIGxldCB0aW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbWVyJyk7XG5cbiAgICBpZiAoZ2FtZVN0YXJ0ICYmICFnYW1lVGltZXJTdG9wKSB7XG4gICAgICBlbGFwc2VkID0gKChEYXRlLm5vdygpIC0gZ2FtZVRpbWVyU3RhcnQpIC8gMTAwMCkudG9GaXhlZCgxKTtcbiAgICAgIHRpbWUuaW5uZXJIVE1MID0gYCR7ZWxhcHNlZH1gO1xuICAgIH0gZWxzZSBpZiAoZ2FtZVRpbWVyU3RvcCkge1xuICAgICAgdGltZS5pbm5lckhUTUwgPSBlbGFwc2VkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lLmlubmVySFRNTCA9IGdhbWVUaW1lclN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIC8vIGxldCBkZWx0YTtcbiAgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBsZXQgZGVsdGEgPSBub3cgLSBsYXN0VGltZTtcbiAgICBsZXQgZHQgPSAoZGVsdGEpIC8gNTAwLjA7XG4gICAgbXlSZXEgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG1haW4gKTtcbiAgICBjb2xsaXNpb25EZXRlY3RlZCgpO1xuICAgIHRpbWVyKCk7XG4gICAgdXBkYXRlKGtleSwgZHQsIGRlbHRhKTtcbiAgICBjbGVhcigpO1xuICAgIHJlbmRlcihub3cpO1xuICAgIGxhc3RUaW1lID0gbm93O1xuICB9XG4gIG15UmVxID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluICk7XG4gIHN0YXJ0R2FtZSgpO1xufTtcbiIsImNvbnN0IGltYWdlcyA9IFtcbiAgJ2Fzc2V0cy9pbWFnZXMvYXJyb3dfa2V5cy5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9hcnJvd3NfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JnX2ZpbmFsLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfZWFzdC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9iaXRlX25vcnRoLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfc291dGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV93ZXN0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2Jsb29kX3NtYWxsLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2RpcnRfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2RpcnRfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2dpdGh1Yi1vcmlnaW5hbC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9nbG9iZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9saW5rZWRpbl9sb2dvLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbGVmdC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X25lLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbncucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9yaWdodC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NlLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc291dGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zdy5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3ZlcnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2Rvd24ucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2xlZnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX3VwLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9zcGFjZWJhci5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy93b3JtX2RlYWQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvd29ybV9pZGxlLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dvcm1faWRsZV9nbG93Mi5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dhc2QucG5nJyxcbl07XG5cbm1vZHVsZS5leHBvcnRzID0gaW1hZ2VzO1xuIl19
