(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// drop event listener here
// SHOULD SET IT UP FOR FURTHER MAPS
// BOARD INSTANCE CAN BE INVOKED UPON GAME START AND PASSED IN A SPECIFIC Board
// HOW DO I CREATE THE BOARD AND PASS IT IN?

// const board = {
//   bgImage: new Image()
//
// }
class Board {
  constructor (ctx) {
    // this.background = new;
    // this.background = backgroundimage;
    // this.board = platforms;
  }
}

// can also set this as a single function

module.exports = Board;

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
let Sprite = require('./sprite');
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

},{"./sprite":10}],4:[function(require,module,exports){
let Board = require('./board');
let monsterSprites = require('./monster_sprites');
let playerSprites = require('./player_sprites');
let bulletSprites = require('./bullet_sprites');
let Sprite = require('./sprite');
let Monster = require('./monster');
let Player = require('./player');
let Weapons = require('./weapons');
let Bullet = require('./bullet');
let preloadImages = require('./resources');

window.onload = function() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let startButton = 'assets/images/start_button.png';
  let gameOverSprite = 'assets/images/game_over.png';
  let myReq;
  preloadAssets();

  function startGame () {

    let start = document.getElementById('start');
    start.addEventListener('click', function(e) {
        start.className = 'start_button_hide';
        gameStart = true;
    });
  }

  function preloadAssets () {
    preloadImages.forEach(image => {
      let loadedImage = new Image();
      loadedImage.src = image;
    });
  }

  function gameOverPrompt () {

    let gameOver = document.getElementById('game_over');
    let timeout = setTimeout(() => {
      gameOver.style.display = 'block';
    }, 2000);

    gameOver.addEventListener('click', function(e) {
      clearTimeout(timeout);
      gameOver.style.display = 'none';
      monsterSprites.dead.currentFrame = 0;
      monsterSprites.idle.currentFrame = 0;
      player.currentSprite.currentFrame = 0;
      monsterSprites.intro.currentFrame = 0;
      restartGame();
    });
  }

  function restartGame () {
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
              monster.defeated();
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
          player.dead();
          monster.playerDefeated();
          gameOverPrompt();
      }
    });

    if (playerX < monsterX + monster.currentSprite.frameWidth - mHBoffset&&
      playerX + player.hitBoxW > monsterX + mHBoffset&&
      playerY < monsterY + monster.currentSprite.frameHeight - mHBoffset&&
      playerY + player.hitBoxH > monsterY + mHBoffset&&
      monster.alive) {
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
    if (gameStart) {
      monster.render(now);
    }
    player.render(now);
    bullets.forEach(bullet => bullet.render());
    monsterBullets.forEach(bullet => bullet.render());
  }

  document.onkeydown = function (evt) {
    evt.preventDefault();
    key = evt.which;
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
  // let delta;
  function main() {
    let now = Date.now();
    let delta = now - lastTime;
    let dt = (delta) / 500.0;
    myReq = requestAnimationFrame( main );
    collisionDetected();
    update(key, dt, delta);
    clear();
    render(now);
    lastTime = now;
  }
  myReq = requestAnimationFrame( main );
  startGame();
};

},{"./board":1,"./bullet":2,"./bullet_sprites":3,"./monster":5,"./monster_sprites":6,"./player":7,"./player_sprites":8,"./resources":9,"./sprite":10,"./weapons":11}],5:[function(require,module,exports){
let monsterSprites = require('./monster_sprites');
let bulletSprites = require('./bullet_sprites');
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
      let velocity = 2;

      this.coordinates[0] = this.coordinates[0] + (normalized[0] *
        velocity * delta);
      this.coordinates[1] = this.coordinates[1] + (normalized[1] *
        velocity * delta);
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
    console.log(this.bullets.length);
  }

  handleIdle () {
    if (!this.bulletsLoaded) {
      this.bulletAttack();
    }
    let speed = 200;
    if (this.health <= this.maxHP * .75 && this.health > this.maxHP * .5) {
      speed = 180;
    } else if (this.health <= this.maxHP * .5 && this.health > this.maxHP * .25) {
      speed = 160;
    } else if (this.health <= this.maxHP * .25) {
      speed = 150;
    }
    if (this.counter >= speed && !this.gameOver) {
      this.bulletsLoaded = false;

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

},{"./bullet":2,"./bullet_sprites":3,"./monster_sprites":6,"./sprite":10}],6:[function(require,module,exports){
let Sprite = require('./sprite');
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
  dead: new Sprite(monsterSpriteSheet.dead),
  bite_w: new Sprite(monsterSpriteSheet.bite_w),
  bite_e: new Sprite(monsterSpriteSheet.bite_e)
};

module.exports = monsterSprites;

},{"./sprite":10}],7:[function(require,module,exports){
let playerSprites = require('./player_sprites');
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

  dead () {
    this.alive = false;
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

},{"./player_sprites":8,"./sprite":10}],8:[function(require,module,exports){
let Sprite = require('./sprite');

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

},{"./sprite":10}],9:[function(require,module,exports){
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
  'assets/images/game_over_again.jpg',
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
  'assets/images/start_button.png',
  'assets/images/worm_dead.png',
  'assets/images/worm_idle.png',
  'assets/images/worm_intro.png',
];

module.exports = images;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJvYXJkLmpzIiwiYnVsbGV0LmpzIiwiYnVsbGV0X3Nwcml0ZXMuanMiLCJtYWluLmpzIiwibW9uc3Rlci5qcyIsIm1vbnN0ZXJfc3ByaXRlcy5qcyIsInBsYXllci5qcyIsInBsYXllcl9zcHJpdGVzLmpzIiwicmVzb3VyY2VzLmpzIiwic3ByaXRlLmpzIiwid2VhcG9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gZHJvcCBldmVudCBsaXN0ZW5lciBoZXJlXG4vLyBTSE9VTEQgU0VUIElUIFVQIEZPUiBGVVJUSEVSIE1BUFNcbi8vIEJPQVJEIElOU1RBTkNFIENBTiBCRSBJTlZPS0VEIFVQT04gR0FNRSBTVEFSVCBBTkQgUEFTU0VEIElOIEEgU1BFQ0lGSUMgQm9hcmRcbi8vIEhPVyBETyBJIENSRUFURSBUSEUgQk9BUkQgQU5EIFBBU1MgSVQgSU4/XG5cbi8vIGNvbnN0IGJvYXJkID0ge1xuLy8gICBiZ0ltYWdlOiBuZXcgSW1hZ2UoKVxuLy9cbi8vIH1cbmNsYXNzIEJvYXJkIHtcbiAgY29uc3RydWN0b3IgKGN0eCkge1xuICAgIC8vIHRoaXMuYmFja2dyb3VuZCA9IG5ldztcbiAgICAvLyB0aGlzLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kaW1hZ2U7XG4gICAgLy8gdGhpcy5ib2FyZCA9IHBsYXRmb3JtcztcbiAgfVxufVxuXG4vLyBjYW4gYWxzbyBzZXQgdGhpcyBhcyBhIHNpbmdsZSBmdW5jdGlvblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvYXJkO1xuIiwiY2xhc3MgQnVsbGV0IHtcbiAgY29uc3RydWN0b3IocGxheWVyQXR0ciwgY2FudmFzVywgY2FudmFzSCwgY3R4LCBzcHJpdGUsIGJ1bGxldENvdW50KSB7XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnBsYXllclBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllckF0dHIuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMucGxheWVyRmFjZSA9IHBsYXllckF0dHIucGxheWVyRmFjZTtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gdGhpcy5zZXRDb29yZGluYXRlcyh0aGlzLnBsYXllclBvcyk7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuYnVsbGV0Q291bnRlciA9IDA7XG4gICAgdGhpcy5idWxsZXRDb3VudCA9IGJ1bGxldENvdW50O1xuXG4gICAgLy8gQkFORCBBSUQgRk9SIE1PTlNURVIgQlVMTEVUU1xuICAgIC8vIFNIT1VMRCBBTFNPIFdPUksgRk9SIFBMQVlFUiBCVUxMRVRTIFNISUZUSU5HXG4gICAgLy8gQUNUVUFMTFkgV09SS1MgUFJFVFRZIE5JQ0VMWSwgTk9UIFNVUkUgSUYgQkVUVEVSIFdBWSBUT1xuICAgIC8vIERPIFRISVMgQUNUSU9OIFNJTkNFIE9OTFkgVVNJTkcgMSBTUFJJVEVcbiAgICB0aGlzLmN1cnJlbnRVUkwgPSBcIlwiO1xuXG5cbiAgICB0aGlzLnNldENvb3JkaW5hdGVzID0gdGhpcy5zZXRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2V0SGl0Qm94ID0gdGhpcy5zZXRIaXRCb3guYmluZCh0aGlzKTtcbiAgfVxuICAvLyBCVUxMRVRTIFdJTEwgQ0hBTkdFIFNQUklURVMgV0hFTiBBTk9USEVSIFNIT1QgSVMgVEFLRU5cbiAgLy8gTkVFRCBUTyBLRUVQIFRIRSBJTUFHRSBXSEVOIFNIT1QgSVMgVEFLRU5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgYnVsbGV0U3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgYnVsbGV0U3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYnVsbGV0U3ByaXRlLCB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdKTtcbiAgfVxuXG4gIHNldEhpdEJveCAocGxheWVyRmFjZSkge1xuICAgIGxldCBkaW1lbnNpb25zQ29weSA9IE9iamVjdC5hc3NpZ24oW10sXG4gICAgICBbdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodF0pO1xuICAgIHN3aXRjaCAocGxheWVyRmFjZSkge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyRmFjZTtcbiAgICB9XG4gIH1cblxuICBzZXRDb29yZGluYXRlcyAocGxheWVyUG9zKSB7XG4gICAgbGV0IHggPSBwbGF5ZXJQb3NbMF07XG4gICAgbGV0IHkgPSBwbGF5ZXJQb3NbMV07XG4gICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAncmlmbGUnKSB7XG4gICAgICB0aGlzLnNldEhpdEJveCh0aGlzLnBsYXllckZhY2UpO1xuICAgICAgc3dpdGNoICh0aGlzLnBsYXllckZhY2UpIHtcbiAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgeCArPSA0O1xuICAgICAgICB5ICs9IDExO1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgeCArPSA0MDtcbiAgICAgICAgeSArPSA1O1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgeCArPSA3NTtcbiAgICAgICAgeSArPSA0MDtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgeCArPSAxMTtcbiAgICAgICAgeSArPSA4MDtcbiAgICAgICAgcmV0dXJuW3gsIHldO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyUG9zO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGxheWVyUG9zO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkdCwgb3duZXIpIHtcbiAgICBsZXQgYnVsbGV0U3BlZWQ7XG4gICAgaWYgKG93bmVyID09PSAncGxheWVyJykge1xuICAgICAgYnVsbGV0U3BlZWQgPSA4MDA7XG4gICAgICBzd2l0Y2ggKHRoaXMucGxheWVyRmFjZSkge1xuICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1bGxldFNwZWVkID0gNTAwO1xuICAgICAgLy8gZGVidWdnZXJcbiAgICAgIHN3aXRjaCAodGhpcy5idWxsZXRDb3VudCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9udy5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gLT0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMCAmJlxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbGVmdC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3N3LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdICs9KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwICYmXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NvdXRoLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gdGhpcy5jYW52YXNIO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zZS5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PVxuICAgICAgICAgIHRoaXMuY2FudmFzSCAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfcmlnaHQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X25lLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSArPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSAtPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDAgJiZcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCdWxsZXQ7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcbi8vIElGIEJMQU5LIFJFTkRFUiBCRUZPUkUgU1BSSVRFLCBORUVEIFRPIFJFU0VUIFNISUZUIFRPIDAhIVxuY29uc3QgYnVsbGV0U3ByaXRlU2hlZXQgPSB7XG4gIHJpZmxlOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnLFxuICAgIG5hbWU6ICdyaWZsZScsXG4gICAgZnJhbWVIZWlnaHQ6IDYsXG4gICAgZnJhbWVXaWR0aDogMTQsXG4gICAgZGFtYWdlOiAxMCxcbiAgfSxcblxuICBtb25zdGVyOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3ZlcnQucG5nJyxcbiAgICBuYW1lOiAnbW9uc3RlcicsXG4gICAgZnJhbWVIZWlnaHQ6IDMyLFxuICAgIGZyYW1lV2lkdGg6IDksXG4gICAgZGFtYWdlOiAxMCxcbiAgfSxcbn07XG5cbmNvbnN0IGJ1bGxldFNwcml0ZXMgPSB7XG4gIHJpZmxlOiBuZXcgU3ByaXRlKGJ1bGxldFNwcml0ZVNoZWV0LnJpZmxlKSxcbiAgbW9uc3RlcjogbmV3IFNwcml0ZShidWxsZXRTcHJpdGVTaGVldC5tb25zdGVyKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBidWxsZXRTcHJpdGVzO1xuIiwibGV0IEJvYXJkID0gcmVxdWlyZSgnLi9ib2FyZCcpO1xubGV0IG1vbnN0ZXJTcHJpdGVzID0gcmVxdWlyZSgnLi9tb25zdGVyX3Nwcml0ZXMnKTtcbmxldCBwbGF5ZXJTcHJpdGVzID0gcmVxdWlyZSgnLi9wbGF5ZXJfc3ByaXRlcycpO1xubGV0IGJ1bGxldFNwcml0ZXMgPSByZXF1aXJlKCcuL2J1bGxldF9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcbmxldCBNb25zdGVyID0gcmVxdWlyZSgnLi9tb25zdGVyJyk7XG5sZXQgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcbmxldCBXZWFwb25zID0gcmVxdWlyZSgnLi93ZWFwb25zJyk7XG5sZXQgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcbmxldCBwcmVsb2FkSW1hZ2VzID0gcmVxdWlyZSgnLi9yZXNvdXJjZXMnKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGxldCBzdGFydEJ1dHRvbiA9ICdhc3NldHMvaW1hZ2VzL3N0YXJ0X2J1dHRvbi5wbmcnO1xuICBsZXQgZ2FtZU92ZXJTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9nYW1lX292ZXIucG5nJztcbiAgbGV0IG15UmVxO1xuICBwcmVsb2FkQXNzZXRzKCk7XG5cbiAgZnVuY3Rpb24gc3RhcnRHYW1lICgpIHtcblxuICAgIGxldCBzdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xuICAgIHN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBzdGFydC5jbGFzc05hbWUgPSAnc3RhcnRfYnV0dG9uX2hpZGUnO1xuICAgICAgICBnYW1lU3RhcnQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlbG9hZEFzc2V0cyAoKSB7XG4gICAgcHJlbG9hZEltYWdlcy5mb3JFYWNoKGltYWdlID0+IHtcbiAgICAgIGxldCBsb2FkZWRJbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgbG9hZGVkSW1hZ2Uuc3JjID0gaW1hZ2U7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlclByb21wdCAoKSB7XG5cbiAgICBsZXQgZ2FtZU92ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZV9vdmVyJyk7XG4gICAgbGV0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH0sIDIwMDApO1xuXG4gICAgZ2FtZU92ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgbW9uc3RlclNwcml0ZXMuZGVhZC5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgbW9uc3RlclNwcml0ZXMuaWRsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgcGxheWVyLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICByZXN0YXJ0R2FtZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzdGFydEdhbWUgKCkge1xuICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgbW9uc3RlciA9IG5ldyBNb25zdGVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgICAgbW9uc3RlclNwcml0ZXMuaW50cm8pO1xuICAgIHBsYXllciA9IG5ldyBQbGF5ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgICBwbGF5ZXJTcHJpdGVzLmFsaXZlUmlnaHQpO1xuICAgIG1vbnN0ZXJCdWxsZXRzID0gbW9uc3Rlci5idWxsZXRzO1xuICB9XG5cbiAgbGV0IG1vbnN0ZXIgPSBuZXcgTW9uc3RlcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICBtb25zdGVyU3ByaXRlcy5pbnRybyk7XG4gIGxldCBnYW1lU3RhcnQgPSBmYWxzZTtcbiAgbGV0IGJ1bGxldHMgPSBbXTtcbiAgbGV0IG1vbnN0ZXJCdWxsZXRzID0gbW9uc3Rlci5idWxsZXRzO1xuICBsZXQgcGxheWVyID0gbmV3IFBsYXllcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICBwbGF5ZXJTcHJpdGVzLmFsaXZlUmlnaHQpO1xuICBsZXQgbGFzdFRpbWUgPSBEYXRlLm5vdygpO1xuICBsZXQga2V5O1xuICBsZXQgYWxsb3dGaXJlID0gdHJ1ZTtcblxuICBmdW5jdGlvbiBjb2xsaXNpb25EZXRlY3RlZCAoKSB7XG4gICAgbGV0IGNvbGxpZGVCdWxsZXRzID0gT2JqZWN0LmFzc2lnbihbXSwgYnVsbGV0cyk7XG4gICAgbGV0IGJ1bGxldFg7XG4gICAgbGV0IGJ1bGxldFk7XG4gICAgbGV0IHBsYXllclggPSBwbGF5ZXIuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IHBsYXllclkgPSBwbGF5ZXIuY29vcmRpbmF0ZXNbMV07XG4gICAgbGV0IG1vbnN0ZXJYID0gbW9uc3Rlci5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgbW9uc3RlclkgPSBtb25zdGVyLmNvb3JkaW5hdGVzWzFdO1xuICAgIGxldCBtSEJvZmZzZXQgPSA0MDtcblxuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xuICAgICAgICBidWxsZXRYID0gYnVsbGV0LmNvb3JkaW5hdGVzWzBdO1xuICAgICAgICBidWxsZXRZID0gYnVsbGV0LmNvb3JkaW5hdGVzWzFdO1xuICAgICAgICBpZiAoYnVsbGV0WCA8IG1vbnN0ZXJYICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLSBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRYICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA+IG1vbnN0ZXJYICsgbUhCb2Zmc2V0ICYmXG4gICAgICAgICAgYnVsbGV0WSA8IG1vbnN0ZXJZICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC0gbUhCb2Zmc2V0ICYmXG4gICAgICAgICAgYnVsbGV0WSArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID4gbW9uc3RlclkgKyBtSEJvZmZzZXQpIHtcbiAgICAgICAgICAgIG1vbnN0ZXIucmVkdWNlSGVhbHRoKGJ1bGxldC5jdXJyZW50U3ByaXRlLmRhbWFnZSk7XG4gICAgICAgICAgICBidWxsZXRzLnNwbGljZSgwLCAxKTtcblxuICAgICAgICAgICAgaWYgKG1vbnN0ZXIuaGVhbHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgbW9uc3Rlci5kZWZlYXRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgbW9uc3RlckJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xuICAgICAgYnVsbGV0WCA9IGJ1bGxldC5jb29yZGluYXRlc1swXTtcbiAgICAgIGJ1bGxldFkgPSBidWxsZXQuY29vcmRpbmF0ZXNbMV07XG4gICAgICBpZiAoYnVsbGV0WCA8IHBsYXllclggKyBwbGF5ZXIuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoICYmXG4gICAgICAgIGJ1bGxldFggKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID4gcGxheWVyWCAmJlxuICAgICAgICBidWxsZXRZIDwgcGxheWVyWSArIHBsYXllci5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ICYmXG4gICAgICAgIGJ1bGxldFkgKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+IHBsYXllclkpIHtcbiAgICAgICAgICBwbGF5ZXIuZGVhZCgpO1xuICAgICAgICAgIG1vbnN0ZXIucGxheWVyRGVmZWF0ZWQoKTtcbiAgICAgICAgICBnYW1lT3ZlclByb21wdCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBsYXllclggPCBtb25zdGVyWCArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC0gbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclggKyBwbGF5ZXIuaGl0Qm94VyA+IG1vbnN0ZXJYICsgbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclkgPCBtb25zdGVyWSArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAtIG1IQm9mZnNldCYmXG4gICAgICBwbGF5ZXJZICsgcGxheWVyLmhpdEJveEggPiBtb25zdGVyWSArIG1IQm9mZnNldCYmXG4gICAgICBtb25zdGVyLmFsaXZlKSB7XG4gICAgICAgIHBsYXllci5kZWFkKCk7XG4gICAgICAgIG1vbnN0ZXIucGxheWVyRGVmZWF0ZWQoKTtcbiAgICAgICAgZ2FtZU92ZXJQcm9tcHQoKTtcbiAgICAgIH1cbiAgfVxuXG4gIGxldCBsYXN0QnVsbGV0O1xuICBmdW5jdGlvbiBGaXJlICgpIHtcbiAgICBhbGxvd0ZpcmUgPSBmYWxzZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGFsbG93RmlyZSA9IHRydWU7XG4gICAgfSwgMjAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob290IChwbGF5ZXJQb3MpIHtcbiAgICAgIGJ1bGxldHMucHVzaChuZXcgQnVsbGV0KHBsYXllclBvcywgY2FudmFzLndpZHRoLFxuICAgICAgICBjYW52YXMuaGVpZ2h0LCBjdHgsIGJ1bGxldFNwcml0ZXMucmlmbGUpKTtcblxuICAgICAgYnVsbGV0cyA9IGJ1bGxldHMuZmlsdGVyKGJ1bGxldCA9PiBidWxsZXQuYWN0aXZlKTtcblxuICAgIEZpcmUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSAoa2V5LCBkdCwgZGVsdGEpIHtcbiAgICBwbGF5ZXIudXBkYXRlKGtleSk7XG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgbW9uc3Rlci51cGRhdGUocGxheWVyLmNvb3JkaW5hdGVzLCBkdCwgZGVsdGEpO1xuICAgIH1cbiAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC51cGRhdGUoZHQsICdwbGF5ZXInKSk7XG4gICAgbW9uc3RlckJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnVwZGF0ZShkdCwgJ21vbnN0ZXInKSk7XG4gIH1cblxuICBjb25zdCBjbGVhciA9ICgpID0+ICB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlbmRlciAobm93KSB7XG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgbW9uc3Rlci5yZW5kZXIobm93KTtcbiAgICB9XG4gICAgcGxheWVyLnJlbmRlcihub3cpO1xuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnJlbmRlcigpKTtcbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQucmVuZGVyKCkpO1xuICB9XG5cbiAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGtleSA9IGV2dC53aGljaDtcbiAgICBwbGF5ZXIua2V5UHJlc3NlZFtrZXldID0gdHJ1ZTtcbiAgICBpZiAoa2V5ID09PSAzMiAmJiBwbGF5ZXIuYWxpdmUgJiYgYWxsb3dGaXJlKSB7XG4gICAgICBzaG9vdChwbGF5ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xuICAgIH1cbiAgfTtcblxuICBkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGxheWVyLmtleVByZXNzZWRbZXZ0LndoaWNoXSA9IGZhbHNlO1xuICAgIGtleSA9IG51bGw7XG4gIH07XG4gIC8vIGxldCBkZWx0YTtcbiAgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBsZXQgZGVsdGEgPSBub3cgLSBsYXN0VGltZTtcbiAgICBsZXQgZHQgPSAoZGVsdGEpIC8gNTAwLjA7XG4gICAgbXlSZXEgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG1haW4gKTtcbiAgICBjb2xsaXNpb25EZXRlY3RlZCgpO1xuICAgIHVwZGF0ZShrZXksIGR0LCBkZWx0YSk7XG4gICAgY2xlYXIoKTtcbiAgICByZW5kZXIobm93KTtcbiAgICBsYXN0VGltZSA9IG5vdztcbiAgfVxuICBteVJlcSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSggbWFpbiApO1xuICBzdGFydEdhbWUoKTtcbn07XG4iLCJsZXQgbW9uc3RlclNwcml0ZXMgPSByZXF1aXJlKCcuL21vbnN0ZXJfc3ByaXRlcycpO1xubGV0IGJ1bGxldFNwcml0ZXMgPSByZXF1aXJlKCcuL2J1bGxldF9zcHJpdGVzJyk7XG5sZXQgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jbGFzcyBNb25zdGVyIHtcbiAgY29uc3RydWN0b3IgKGN0eCwgY2FudmFzVywgY2FudmFzSCwgc3ByaXRlKSB7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbNzAwLCAzMDBdO1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHNwcml0ZTtcbiAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICB0aGlzLm1heEhQID0gMzAwO1xuICAgIHRoaXMuaGVhbHRoID0gMzAwO1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuXG4gICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB0aGlzLmludGVydmFsID0gbnVsbDtcbiAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICB0aGlzLmNlbnRlckNvb3JkcyA9IFswLCAwXTtcbiAgICB0aGlzLnJhbmRDb3VudCA9IDIwMDtcbiAgICB0aGlzLnBhdXNlQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5idWxsZXRzID0gW107XG4gICAgdGhpcy5idWxsZXRzTG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50UG9zaXRpb24gPSB0aGlzLmN1cnJlbnRQb3NpdGlvbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY3VycmVudFBvc2l0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuc2V0Q2VudGVyQ29vcmRzKCksXG4gICAgfTtcbiAgfVxuXG4gIHNldENlbnRlckNvb3JkcyAoKSB7XG4gICAgbGV0IHggPSB0aGlzLmNvb3JkaW5hdGVzWzBdICtcbiAgICAgICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAvIDIpO1xuICAgIGxldCB5ID0gdGhpcy5jb29yZGluYXRlc1sxXSArXG4gICAgICAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC8gMik7XG5cbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZGVmZWF0ZWQgKCkge1xuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHBsYXllckRlZmVhdGVkKCkge1xuICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICB9XG5cbiAgcmVkdWNlSGVhbHRoIChkYW1hZ2UpIHtcbiAgICB0aGlzLmhlYWx0aCAtPSBkYW1hZ2U7XG4gIH1cblxuICByZW5kZXIobm93KSB7XG4gICAgdmFyIG1vbnN0ZXJTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBtb25zdGVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZS51cmw7XG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKG1vbnN0ZXJTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgdGhpcy5jb29yZGluYXRlc1swXSwgdGhpcy5jb29yZGluYXRlc1sxXSwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuICAgIGlmICghdGhpcy5wYXVzZUFuaW1hdGlvbikge1xuXG4gICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgaWYgKG5vdyAtIHRoaXMubGFzdFVwZGF0ZSA+IGZwcykgIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyAmJlxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnaW50cm8nKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbdGhpcy5jb29yZGluYXRlc1swXSAtIDE1LFxuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSArIDE1XTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcblxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyAmJlxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdkZWFkJykge1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMjtcbiAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKlxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aDtcbiAgICAgICAgICAgICAgdGhpcy5wYXVzZUFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmluZERpcmVjdGlvblZlY3RvciAoKSB7XG4gICAgbGV0IHggPSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdIC0gdGhpcy5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgeSA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMV0gLSB0aGlzLmNvb3JkaW5hdGVzWzFdO1xuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBmaW5kTWFnbml0dWRlICh4LCB5KSB7XG4gICAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICByZXR1cm4gbWFnbml0dWRlO1xuICB9XG4gIG5vcm1hbGl6ZVZlY3RvciAocGxheWVyRGlyLCBtYWduaXR1ZGUpIHtcbiAgICByZXR1cm4gWyhwbGF5ZXJEaXJbMF0vbWFnbml0dWRlKSwgKHBsYXllckRpclsxXS9tYWduaXR1ZGUpXTtcbiAgfVxuXG4gIGNoYXNlUGxheWVyIChkZWx0YSkge1xuICAgICAgbGV0IHBsYXllckRpciA9IHRoaXMuZmluZERpcmVjdGlvblZlY3RvcigpO1xuICAgICAgbGV0IG1hZ25pdHVkZSA9IHRoaXMuZmluZE1hZ25pdHVkZShwbGF5ZXJEaXJbMF0sIHBsYXllckRpclsxXSk7XG4gICAgICBsZXQgbm9ybWFsaXplZCA9IHRoaXMubm9ybWFsaXplVmVjdG9yKHBsYXllckRpciwgbWFnbml0dWRlKTtcbiAgICAgIGxldCB2ZWxvY2l0eSA9IDI7XG5cbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmNvb3JkaW5hdGVzWzBdICsgKG5vcm1hbGl6ZWRbMF0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPSB0aGlzLmNvb3JkaW5hdGVzWzFdICsgKG5vcm1hbGl6ZWRbMV0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcbiAgfVxuXG4gIHJhbmRvbUNvdW50KCkge1xuICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSAqIDIwMCkgKyAxODA7XG4gIH1cblxuICBidWxsZXRBdHRhY2sgKCkge1xuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IDgpIHtcbiAgICAgIGxldCBidWxsZXRDb3VudCA9IGk7XG4gICAgICB0aGlzLmJ1bGxldHMucHVzaChuZXcgQnVsbGV0KHRoaXMuY3VycmVudFBvc2l0aW9uKCksIHRoaXMuY2FudmFzVyxcbiAgICAgICAgdGhpcy5jYW52YXNILCB0aGlzLmN0eCwgYnVsbGV0U3ByaXRlcy5tb25zdGVyLCBidWxsZXRDb3VudCkpO1xuICAgICAgaSsrO1xuICAgIH1cbiAgICB0aGlzLmJ1bGxldHNMb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuYnVsbGV0cy5maWx0ZXIoYnVsbGV0ID0+IGJ1bGxldC5hY3RpdmUpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuYnVsbGV0cy5sZW5ndGgpO1xuICB9XG5cbiAgaGFuZGxlSWRsZSAoKSB7XG4gICAgaWYgKCF0aGlzLmJ1bGxldHNMb2FkZWQpIHtcbiAgICAgIHRoaXMuYnVsbGV0QXR0YWNrKCk7XG4gICAgfVxuICAgIGxldCBzcGVlZCA9IDIwMDtcbiAgICBpZiAodGhpcy5oZWFsdGggPD0gdGhpcy5tYXhIUCAqIC43NSAmJiB0aGlzLmhlYWx0aCA+IHRoaXMubWF4SFAgKiAuNSkge1xuICAgICAgc3BlZWQgPSAxODA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogLjUgJiYgdGhpcy5oZWFsdGggPiB0aGlzLm1heEhQICogLjI1KSB7XG4gICAgICBzcGVlZCA9IDE2MDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGVhbHRoIDw9IHRoaXMubWF4SFAgKiAuMjUpIHtcbiAgICAgIHNwZWVkID0gMTUwO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb3VudGVyID49IHNwZWVkICYmICF0aGlzLmdhbWVPdmVyKSB7XG4gICAgICB0aGlzLmJ1bGxldHNMb2FkZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMudGFyZ2V0UG9zWzBdID49IHRoaXMuY29vcmRpbmF0ZXNbMF0pIHtcbiAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmJpdGVfZTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuYml0ZV93O1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVCaXRlV2VzdCAoZGVsdGEpIHtcbiAgICAvLyBCSU5EUyBGSU5BTCBQT1NJVElPTiBCRUZPUkUgQklURVxuICAgIGlmICh0aGlzLmZpbmFsUGxheWVyUG9zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0UG9zWzFdICsgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID49IHRoaXMuY2FudmFzSCkge1xuICAgICAgICB0aGlzLnRhcmdldFBvc1sxXSA9IHRoaXMuY2FudmFzSCAtIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodDtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbMCArIHRoaXMudGFyZ2V0UG9zWzBdLCB0aGlzLnRhcmdldFBvc1sxXV07XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pe1xuICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5pZGxlO1xuICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA8PVxuICAgICAgICAwKXtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5maW5hbFBsYXllclBvc1swXTtcbiAgICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW107XG4gICAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmNoYXNlUGxheWVyKGRlbHRhKTtcbiAgICB9XG4gIH1cbiAgLy8gQ0hBUkdFIERPRVNOVCBISVQgSUYgSU4gQ0VOVEVSIE9GIEJPVFRPTSBPUiB0b3BcbiAgLy8gU0hPVUxEIEZJTkQgQSBXQVkgVE8gU1RJTEwgR08gVE9XQVJEUyBUQVJHRVQgWCBCVVQgRlVMTFlcbiAgaGFuZGxlQml0ZUVhc3QgKGRlbHRhKSB7XG4gICAgaWYgKHRoaXMuZmluYWxQbGF5ZXJQb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMV0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPj0gdGhpcy5jYW52YXNIKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0UG9zWzFdID0gdGhpcy5jYW52YXNIIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0O1xuICAgICAgfVxuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFt0aGlzLmNhbnZhc1cgLVxuICAgICAgICAodGhpcy5jYW52YXNXIC0gdGhpcy50YXJnZXRQb3NbMF0pLCB0aGlzLnRhcmdldFBvc1sxXV07XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdID49IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSArIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID49XG4gICAgICAgIHRoaXMuY2FudmFzVyl7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0gLVxuICAgICAgICAgICh0aGlzLmNhbnZhc1cgLSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKTtcbiAgICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW107XG4gICAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmNoYXNlUGxheWVyKGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUocGxheWVyUG9zLCBkdCwgZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuYWxpdmUgJiYgIXRoaXMuZ2FtZU92ZXIpIHtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuZGVhZDtcbiAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgLy8gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgfVxuICAgIC8vIFRSQUNLUyBQT1NJVElPTiBPRiBQTEFZRVJcbiAgICBpZiAodGhpcy50YXJnZXRQb3MubGVuZ3RoID09PSAwICkge1xuICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRhcmdldFBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllclBvcyk7XG4gICAgICB9LCAxMDApO1xuICAgIH1cblxuICAgIC8vIE9GRlNFVCBGT1IgSURMRSBBTklNQVRJT05cbiAgICB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgfHwgMDtcblxuICAgIHN3aXRjaCAodGhpcy5jdXJyZW50U3ByaXRlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ2lkbGUnOlxuICAgICAgICAgIHRoaXMuY291bnRlcisrO1xuICAgICAgICAgIHRoaXMuaGFuZGxlSWRsZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JpdGVfdyc6XG4gICAgICAgIHRoaXMuaGFuZGxlQml0ZVdlc3QoZGVsdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JpdGVfZSc6XG4gICAgICAgIHRoaXMuaGFuZGxlQml0ZUVhc3QoZGVsdGEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb25zdGVyO1xuIiwibGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG4vLyBJRiBCTEFOSyBSRU5ERVIgQkVGT1JFIFNQUklURSwgTkVFRCBUTyBSRVNFVCBTSElGVCBUTyAwISFcbmNvbnN0IG1vbnN0ZXJTcHJpdGVTaGVldCA9IHtcbiAgZGlydDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuICAgIG5hbWU6ICdpbnRybycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2NixcbiAgICBmcmFtZVdpZHRoOiAxNTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgaW50cm86IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faW50cm8ucG5nJyxcbiAgICBuYW1lOiAnaW50cm8nLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjYsXG4gICAgZnJhbWVXaWR0aDogMTUzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDEwMCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGlkbGU6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faWRsZS5wbmcnLFxuICAgIG5hbWU6ICdpZGxlJyxcbiAgICBmcmFtZUhlaWdodDogMTczLFxuICAgIGZyYW1lV2lkdGg6IDIwMyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEyLFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMTI1LFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgYml0ZV93OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9iaXRlX3dlc3QucG5nJyxcbiAgICBuYW1lOiAnYml0ZV93JyxcbiAgICBmcmFtZUhlaWdodDogMTYzLFxuICAgIGZyYW1lV2lkdGg6IDE5MixcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDUsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMS41LFxuICB9LFxuXG4gIGJpdGVfZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV9lYXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfZScsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEuNSxcbiAgfSxcblxuICBkZWFkOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2RlYWQucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA0LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMSxcbiAgfVxufTtcblxuY29uc3QgbW9uc3RlclNwcml0ZXMgPSB7XG4gIGludHJvOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5pbnRybyksXG4gIGlkbGU6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmlkbGUpLFxuICBkZWFkOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5kZWFkKSxcbiAgYml0ZV93OiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5iaXRlX3cpLFxuICBiaXRlX2U6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmJpdGVfZSlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbW9uc3RlclNwcml0ZXM7XG4iLCJsZXQgcGxheWVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vcGxheWVyX3Nwcml0ZXMnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvciAoY3R4LCBjYW52YXNXLCBjYW52YXNILCBzcHJpdGUpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFswLCAwXTtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5mYWNpbmdQb3MgPSBcInJpZ2h0XCI7XG4gICAgdGhpcy5oaXRCb3hIID0gNTU7XG4gICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgdGhpcy5rZXlQcmVzc2VkID0ge307XG4gICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5jZW50ZXJDb29yZHMgPSBbMCwgMF07XG4gIH1cblxuICBzZXRDZW50ZXJDb29yZHMgKHgsIHkpIHtcbiAgICBsZXQgY2VudGVyWCA9IHggKyAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLyAyKTtcbiAgICBsZXQgY2VudGVyWSA9IHkgKyAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC8gMik7XG5cbiAgICByZXR1cm4gW2NlbnRlclgsIGNlbnRlclldO1xuICB9XG5cbiAgcmVuZGVyKG5vdykge1xuICAgIGlmICghdGhpcy5nYW1lT3Zlcikge1xuXG4gICAgICB2YXIgcGxheWVyU3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgICBwbGF5ZXJTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcblxuICAgICAgLy8gcGxheWVyU3ByaXRlLmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShwbGF5ZXJTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0sIHRoaXMuY29vcmRpbmF0ZXNbMV0sIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLFxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICAvLyBkZWJ1Z2dlclxuXG4gICAgICAgIGxldCBmcHMgPSB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzICogdGhpcy5jdXJyZW50U3ByaXRlLmZwc1g7XG4gICAgICAgIGlmIChub3cgLSB0aGlzLmxhc3RVcGRhdGUgPiBmcHMgJiYgIXRoaXMuZ2FtZU92ZXIpICB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgICAgICAgdGhpcy5zaGlmdCA9IHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKlxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnZGVhZCcpIHtcbiAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSArPSAxO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlYWQgKCkge1xuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHNldEhpdEJveCAoZmFjaW5nUG9zKSB7XG4gICAgc3dpdGNoIChmYWNpbmdQb3MpIHtcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA2OTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNjk7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDU1O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA1NTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNjk7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDU1O1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWNpbmdQb3M7XG4gICAgfVxuICB9XG5cbiAgY3VycmVudFBvc2l0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBwbGF5ZXJGYWNlOiB0aGlzLmZhY2luZ1Bvc1xuICAgIH07XG4gIH1cblxuICB1cGRhdGUoa2V5KSB7XG4gICAgY29uc3Qgc3ByaXRlSGVpZ2h0ID0gMTI1O1xuICAgIHRoaXMuc2V0SGl0Qm94KHRoaXMuZmFjaW5nUG9zKTtcbiAgICBsZXQgc3BlZWQgPSAxMjtcblxuICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzddKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVMZWZ0O1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwibGVmdFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSA1KSB7dGhpcy5jb29yZGluYXRlc1swXS09c3BlZWQ7fVxuICAgICAgfVxuICAgICAgaWYodGhpcy5rZXlQcmVzc2VkWzM4XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlVXA7XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJ1cFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA+PSAxNSkge3RoaXMuY29vcmRpbmF0ZXNbMV0tPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszOV0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0O1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwicmlnaHRcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gKHRoaXMuY2FudmFzVyAtIHRoaXMuaGl0Qm94SCAtIDMwKSlcbiAgICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMF0rPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFs0MF0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZURvd247XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJkb3duXCI7XG4gICAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzFdIDw9ICh0aGlzLmNhbnZhc0ggLSB0aGlzLmhpdEJveEgpKVxuICAgICAgICB7dGhpcy5jb29yZGluYXRlc1sxXSs9c3BlZWQ7fVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmRlYWQ7XG4gICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jb25zdCBwbGF5ZXJTcHJpdGVTaGVldCA9IHtcbiAgZGVhZDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYmxvb2Rfc21hbGwucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDEyNCxcbiAgICBmcmFtZVdpZHRoOiAoNzYzIC8gNiksXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAxNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBlbXB0eToge1xuICAgIHVybDogJycsXG4gICAgbmFtZTogJycsXG4gICAgZnJhbWVIZWlnaHQ6IDAsXG4gICAgZnJhbWVXaWR0aDogMCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDAsXG4gICAgb25jZTogMCxcbiAgICBmcHM6IDAsXG4gICAgZnBzWDogMCxcbiAgfSxcblxuICBhbGl2ZUxlZnQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9sZWZ0LnBuZycsXG4gICAgbmFtZTogJ2xlZnQnLFxuICAgIGZyYW1lSGVpZ2h0OiA1NSxcbiAgICBmcmFtZVdpZHRoOiA5MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgLy8gaGl0Qm94SGVpZ2h0T2Zmc2V0OlxuICAgIC8vIGhpdEJveFdpZHRoT2Zmc2V0OlxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVVcDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX3VwLnBuZycsXG4gICAgbmFtZTogJ3VwJyxcbiAgICBmcmFtZUhlaWdodDogOTMsXG4gICAgZnJhbWVXaWR0aDogNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVSaWdodDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlLnBuZycsXG4gICAgbmFtZTogJ3JpZ2h0JyxcbiAgICBmcmFtZUhlaWdodDogNTUsXG4gICAgZnJhbWVXaWR0aDogOTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVEb3duOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfZG93bi5wbmcnLFxuICAgIG5hbWU6ICdkb3duJyxcbiAgICBmcmFtZUhlaWdodDogOTMsXG4gICAgZnJhbWVXaWR0aDogNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbn07XG5cbmNvbnN0IHBsYXllclNwcml0ZXMgPSB7XG4gIGRlYWQ6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuZGVhZCksXG4gIGFsaXZlTGVmdDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZUxlZnQpLFxuICBhbGl2ZVVwOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlVXApLFxuICBhbGl2ZVJpZ2h0OiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlUmlnaHQpLFxuICBhbGl2ZURvd246IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVEb3duKSxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwbGF5ZXJTcHJpdGVzO1xuIiwiY29uc3QgaW1hZ2VzID0gW1xuICAnYXNzZXRzL2ltYWdlcy9hcnJvd19rZXlzLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2Fycm93c19wb3AucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYmdfZmluYWwucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV9lYXN0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfbm9ydGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV9zb3V0aC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9iaXRlX3dlc3QucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYmxvb2Rfc21hbGwucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvZGlydF9wb3AucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvZ2FtZV9vdmVyX2FnYWluLmpwZycsXG4gICdhc3NldHMvaW1hZ2VzL2RpcnRfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2dpdGh1Yi1vcmlnaW5hbC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9nbG9iZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9saW5rZWRpbl9sb2dvLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbGVmdC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X25lLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbncucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9yaWdodC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NlLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc291dGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zdy5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3ZlcnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2Rvd24ucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2xlZnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX3VwLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9zcGFjZWJhci5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9zdGFydF9idXR0b24ucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvd29ybV9kZWFkLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dvcm1faWRsZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGltYWdlcztcbiIsImNsYXNzIFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsO1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLmZyYW1lV2lkdGggPSBvcHRpb25zLmZyYW1lV2lkdGg7XG4gICAgdGhpcy5mcmFtZUhlaWdodCA9IG9wdGlvbnMuZnJhbWVIZWlnaHQ7XG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSBvcHRpb25zLmN1cnJlbnRGcmFtZTtcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gb3B0aW9ucy50b3RhbEZyYW1lcztcbiAgICB0aGlzLm9uY2UgPSBvcHRpb25zLm9uY2U7XG4gICAgdGhpcy5mcHMgPSBvcHRpb25zLmZwcztcbiAgICB0aGlzLmZwc1ggPSBvcHRpb25zLmZwc1g7XG4gICAgdGhpcy5kYW1hZ2UgPSBvcHRpb25zLmRhbWFnZTtcbiAgfVxufVxuLy8gdXJsLCBuYW1lLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcbiIsIi8vIEhPVyBUTyBCVUlMRCBQSFlTSUNTIEZPUiBBIFdFQVBPTj9cbi8vIEJVTExFVCBTUEVFRCwgU1BSRUFELCBEQU1BR0U/XG4vLyBETyBQSFlTSUNTIE5FRUQgVE8gQkUgQSBTRVBBUkFURSBDTEFTUz8gQ0FOIEkgSU1QT1JUIEEgTElCUkFSWSBUTyBIQU5ETEUgVEhBVCBMT0dJQz9cblxuY2xhc3MgV2VhcG9uIHtcbiAgY29uc3RydWN0b3IgKGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLnJhdGUgPSBhdHRyaWJ1dGVzLnJhdGU7XG4gICAgdGhpcy5tb2RlbCA9IGF0dHJpYnV0ZXMubW9kZWw7XG4gICAgdGhpcy5wb3dlciA9IGF0dHJpYnV0ZXMucG93ZXI7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYXBvbjtcbiJdfQ==
