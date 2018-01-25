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

},{"./sprite":9}],4:[function(require,module,exports){
let Board = require('./board');
let monsterSprites = require('./monster_sprites');
let playerSprites = require('./player_sprites');
let bulletSprites = require('./bullet_sprites');
let Sprite = require('./sprite');
let Monster = require('./monster');
let Player = require('./player');
let Weapons = require('./weapons');
let Bullet = require('./bullet');

window.onload = function() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let startButton = 'assets/images/start_button.png';
  let gameOverSprite = 'assets/images/game_over.png';
  let myReq;

  function startGame () {

    let start = document.getElementById('start');
    start.addEventListener('click', function(e) {
        start.className = 'start_button_hide';
        gameStart = true;
    });
  }

  function gameOverPrompt () {
    player.dead();
    monster.playerDefeated();
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
          gameOverPrompt();
      }
    });

    if (playerX < monsterX + monster.currentSprite.frameWidth - mHBoffset&&
      playerX + player.hitBoxW > monsterX + mHBoffset&&
      playerY < monsterY + monster.currentSprite.frameHeight - mHBoffset&&
      playerY + player.hitBoxH > monsterY + mHBoffset&&
      monster.alive) {
        gameOverPrompt();
      }
  }

  let lastBullet;
  function Fire () {
    allowFire = false;
    setTimeout(() => {
      allowFire = true;
    }, 250);
  }

  function shoot (playerPos) {
    if (allowFire) {
      bullets.push(new Bullet(playerPos, canvas.width,
        canvas.height, ctx, bulletSprites.rifle));

      bullets = bullets.filter(bullet => bullet.active);
    }

    Fire();
  }

  function update (key, dt, delta) {
    player.update(key);
    // let playerCenterPos =
      // player.setCenterCoords(player.coordinates[0], player.coordinates[1]);
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
    key = evt.which;
    player.keyPressed[key] = true;
    if (key === 32 && player.alive) {
      shoot(player.currentPosition());
    }
  };

  document.onkeyup = function(evt) {
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

},{"./board":1,"./bullet":2,"./bullet_sprites":3,"./monster":5,"./monster_sprites":6,"./player":7,"./player_sprites":8,"./sprite":9,"./weapons":10}],5:[function(require,module,exports){
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

},{"./bullet":2,"./bullet_sprites":3,"./monster_sprites":6,"./sprite":9}],6:[function(require,module,exports){
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

},{"./sprite":9}],7:[function(require,module,exports){
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
          this.currentSprite.totalFrames && !this.alive) {
            // this.currentSprite.currentFrame = 0;
            this.alive = true;

        } else if (this.currentSprite.currentFrame ===
        this.currentSprite.totalFrames ) {

        this.shift = 0;
        this.currentSprite.currentFrame = 0;
      }
      this.currentSprite.currentFrame += 1;
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

},{"./player_sprites":8,"./sprite":9}],8:[function(require,module,exports){
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

},{"./sprite":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJvYXJkLmpzIiwiYnVsbGV0LmpzIiwiYnVsbGV0X3Nwcml0ZXMuanMiLCJtYWluLmpzIiwibW9uc3Rlci5qcyIsIm1vbnN0ZXJfc3ByaXRlcy5qcyIsInBsYXllci5qcyIsInBsYXllcl9zcHJpdGVzLmpzIiwic3ByaXRlLmpzIiwid2VhcG9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGRyb3AgZXZlbnQgbGlzdGVuZXIgaGVyZVxuLy8gU0hPVUxEIFNFVCBJVCBVUCBGT1IgRlVSVEhFUiBNQVBTXG4vLyBCT0FSRCBJTlNUQU5DRSBDQU4gQkUgSU5WT0tFRCBVUE9OIEdBTUUgU1RBUlQgQU5EIFBBU1NFRCBJTiBBIFNQRUNJRklDIEJvYXJkXG4vLyBIT1cgRE8gSSBDUkVBVEUgVEhFIEJPQVJEIEFORCBQQVNTIElUIElOP1xuXG4vLyBjb25zdCBib2FyZCA9IHtcbi8vICAgYmdJbWFnZTogbmV3IEltYWdlKClcbi8vXG4vLyB9XG5jbGFzcyBCb2FyZCB7XG4gIGNvbnN0cnVjdG9yIChjdHgpIHtcbiAgICAvLyB0aGlzLmJhY2tncm91bmQgPSBuZXc7XG4gICAgLy8gdGhpcy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZGltYWdlO1xuICAgIC8vIHRoaXMuYm9hcmQgPSBwbGF0Zm9ybXM7XG4gIH1cbn1cblxuLy8gY2FuIGFsc28gc2V0IHRoaXMgYXMgYSBzaW5nbGUgZnVuY3Rpb25cblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDtcbiIsImNsYXNzIEJ1bGxldCB7XG4gIGNvbnN0cnVjdG9yKHBsYXllckF0dHIsIGNhbnZhc1csIGNhbnZhc0gsIGN0eCwgc3ByaXRlLCBidWxsZXRDb3VudCkge1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHNwcml0ZTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5wbGF5ZXJQb3MgPSBPYmplY3QuYXNzaWduKFtdLCBwbGF5ZXJBdHRyLmNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLnBsYXllckZhY2UgPSBwbGF5ZXJBdHRyLnBsYXllckZhY2U7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IHRoaXMuc2V0Q29vcmRpbmF0ZXModGhpcy5wbGF5ZXJQb3MpO1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmJ1bGxldENvdW50ZXIgPSAwO1xuICAgIHRoaXMuYnVsbGV0Q291bnQgPSBidWxsZXRDb3VudDtcblxuICAgIC8vIEJBTkQgQUlEIEZPUiBNT05TVEVSIEJVTExFVFNcbiAgICAvLyBTSE9VTEQgQUxTTyBXT1JLIEZPUiBQTEFZRVIgQlVMTEVUUyBTSElGVElOR1xuICAgIC8vIEFDVFVBTExZIFdPUktTIFBSRVRUWSBOSUNFTFksIE5PVCBTVVJFIElGIEJFVFRFUiBXQVkgVE9cbiAgICAvLyBETyBUSElTIEFDVElPTiBTSU5DRSBPTkxZIFVTSU5HIDEgU1BSSVRFXG4gICAgdGhpcy5jdXJyZW50VVJMID0gXCJcIjtcblxuXG4gICAgdGhpcy5zZXRDb29yZGluYXRlcyA9IHRoaXMuc2V0Q29vcmRpbmF0ZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNldEhpdEJveCA9IHRoaXMuc2V0SGl0Qm94LmJpbmQodGhpcyk7XG4gIH1cbiAgLy8gQlVMTEVUUyBXSUxMIENIQU5HRSBTUFJJVEVTIFdIRU4gQU5PVEhFUiBTSE9UIElTIFRBS0VOXG4gIC8vIE5FRUQgVE8gS0VFUCBUSEUgSU1BR0UgV0hFTiBTSE9UIElTIFRBS0VOXG4gIHJlbmRlciAoKSB7XG4gICAgdmFyIGJ1bGxldFNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgIGJ1bGxldFNwcml0ZS5zcmMgPSB0aGlzLmN1cnJlbnRVcmw7XG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKGJ1bGxldFNwcml0ZSwgdGhpcy5jb29yZGluYXRlc1swXSwgdGhpcy5jb29yZGluYXRlc1sxXSk7XG4gIH1cblxuICBzZXRIaXRCb3ggKHBsYXllckZhY2UpIHtcbiAgICBsZXQgZGltZW5zaW9uc0NvcHkgPSBPYmplY3QuYXNzaWduKFtdLFxuICAgICAgW3RoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHRdKTtcbiAgICBzd2l0Y2ggKHBsYXllckZhY2UpIHtcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHBsYXllckZhY2U7XG4gICAgfVxuICB9XG5cbiAgc2V0Q29vcmRpbmF0ZXMgKHBsYXllclBvcykge1xuICAgIGxldCB4ID0gcGxheWVyUG9zWzBdO1xuICAgIGxldCB5ID0gcGxheWVyUG9zWzFdO1xuICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ3JpZmxlJykge1xuICAgICAgdGhpcy5zZXRIaXRCb3godGhpcy5wbGF5ZXJGYWNlKTtcbiAgICAgIHN3aXRjaCAodGhpcy5wbGF5ZXJGYWNlKSB7XG4gICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHggKz0gNDtcbiAgICAgICAgeSArPSAxMTtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHggKz0gNDA7XG4gICAgICAgIHkgKz0gNTtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHggKz0gNzU7XG4gICAgICAgIHkgKz0gNDA7XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHggKz0gMTE7XG4gICAgICAgIHkgKz0gODA7XG4gICAgICAgIHJldHVyblt4LCB5XTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHBsYXllclBvcztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBsYXllclBvcztcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoZHQsIG93bmVyKSB7XG4gICAgbGV0IGJ1bGxldFNwZWVkO1xuICAgIGlmIChvd25lciA9PT0gJ3BsYXllcicpIHtcbiAgICAgIGJ1bGxldFNwZWVkID0gODAwO1xuICAgICAgc3dpdGNoICh0aGlzLnBsYXllckZhY2UpIHtcbiAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gdGhpcy5jYW52YXNIO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBidWxsZXRTcGVlZCA9IDUwMDtcbiAgICAgIC8vIGRlYnVnZ2VyXG4gICAgICBzd2l0Y2ggKHRoaXMuYnVsbGV0Q291bnQpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbncucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdIC09KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gLT0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDAgJiZcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X2xlZnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zdy5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gLT0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSArPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMCAmJlxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gdGhpcy5jYW52YXNIO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zb3V0aC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9IHRoaXMuY2FudmFzSDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc2UucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdICs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdICs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD1cbiAgICAgICAgICB0aGlzLmNhbnZhc0ggJiYgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3JpZ2h0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5jYW52YXNXO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9uZS5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwICYmXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQnVsbGV0O1xuIiwibGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG4vLyBJRiBCTEFOSyBSRU5ERVIgQkVGT1JFIFNQUklURSwgTkVFRCBUTyBSRVNFVCBTSElGVCBUTyAwISFcbmNvbnN0IGJ1bGxldFNwcml0ZVNoZWV0ID0ge1xuICByaWZsZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJyxcbiAgICBuYW1lOiAncmlmbGUnLFxuICAgIGZyYW1lSGVpZ2h0OiA2LFxuICAgIGZyYW1lV2lkdGg6IDE0LFxuICAgIGRhbWFnZTogMTAsXG4gIH0sXG5cbiAgbW9uc3Rlcjoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF92ZXJ0LnBuZycsXG4gICAgbmFtZTogJ21vbnN0ZXInLFxuICAgIGZyYW1lSGVpZ2h0OiAzMixcbiAgICBmcmFtZVdpZHRoOiA5LFxuICAgIGRhbWFnZTogMTAsXG4gIH0sXG59O1xuXG5jb25zdCBidWxsZXRTcHJpdGVzID0ge1xuICByaWZsZTogbmV3IFNwcml0ZShidWxsZXRTcHJpdGVTaGVldC5yaWZsZSksXG4gIG1vbnN0ZXI6IG5ldyBTcHJpdGUoYnVsbGV0U3ByaXRlU2hlZXQubW9uc3Rlcilcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYnVsbGV0U3ByaXRlcztcbiIsImxldCBCb2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcbmxldCBtb25zdGVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vbW9uc3Rlcl9zcHJpdGVzJyk7XG5sZXQgcGxheWVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vcGxheWVyX3Nwcml0ZXMnKTtcbmxldCBidWxsZXRTcHJpdGVzID0gcmVxdWlyZSgnLi9idWxsZXRfc3ByaXRlcycpO1xubGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG5sZXQgTW9uc3RlciA9IHJlcXVpcmUoJy4vbW9uc3RlcicpO1xubGV0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJyk7XG5sZXQgV2VhcG9ucyA9IHJlcXVpcmUoJy4vd2VhcG9ucycpO1xubGV0IEJ1bGxldCA9IHJlcXVpcmUoJy4vYnVsbGV0Jyk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBsZXQgc3RhcnRCdXR0b24gPSAnYXNzZXRzL2ltYWdlcy9zdGFydF9idXR0b24ucG5nJztcbiAgbGV0IGdhbWVPdmVyU3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvZ2FtZV9vdmVyLnBuZyc7XG4gIGxldCBteVJlcTtcblxuICBmdW5jdGlvbiBzdGFydEdhbWUgKCkge1xuXG4gICAgbGV0IHN0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0Jyk7XG4gICAgc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHN0YXJ0LmNsYXNzTmFtZSA9ICdzdGFydF9idXR0b25faGlkZSc7XG4gICAgICAgIGdhbWVTdGFydCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlclByb21wdCAoKSB7XG4gICAgcGxheWVyLmRlYWQoKTtcbiAgICBtb25zdGVyLnBsYXllckRlZmVhdGVkKCk7XG4gICAgbGV0IGdhbWVPdmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWVfb3ZlcicpO1xuICAgIGxldCB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9LCAyMDAwKTtcblxuICAgIGdhbWVPdmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmRlYWQuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmlkbGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHBsYXllci5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICBtb25zdGVyU3ByaXRlcy5pbnRyby5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgcmVzdGFydEdhbWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3RhcnRHYW1lICgpIHtcbiAgICBsZXQgZ2FtZU92ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZV9vdmVyJyk7XG4gICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIG1vbnN0ZXIgPSBuZXcgTW9uc3RlcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvKTtcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgICAgcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0KTtcbiAgICBtb25zdGVyQnVsbGV0cyA9IG1vbnN0ZXIuYnVsbGV0cztcbiAgfVxuXG4gIGxldCBtb25zdGVyID0gbmV3IE1vbnN0ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgbW9uc3RlclNwcml0ZXMuaW50cm8pO1xuICBsZXQgZ2FtZVN0YXJ0ID0gZmFsc2U7XG4gIGxldCBidWxsZXRzID0gW107XG4gIGxldCBtb25zdGVyQnVsbGV0cyA9IG1vbnN0ZXIuYnVsbGV0cztcbiAgbGV0IHBsYXllciA9IG5ldyBQbGF5ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0KTtcbiAgbGV0IGxhc3RUaW1lID0gRGF0ZS5ub3coKTtcbiAgbGV0IGtleTtcbiAgbGV0IGFsbG93RmlyZSA9IHRydWU7XG5cbiAgZnVuY3Rpb24gY29sbGlzaW9uRGV0ZWN0ZWQgKCkge1xuICAgIGxldCBjb2xsaWRlQnVsbGV0cyA9IE9iamVjdC5hc3NpZ24oW10sIGJ1bGxldHMpO1xuICAgIGxldCBidWxsZXRYO1xuICAgIGxldCBidWxsZXRZO1xuICAgIGxldCBwbGF5ZXJYID0gcGxheWVyLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCBwbGF5ZXJZID0gcGxheWVyLmNvb3JkaW5hdGVzWzFdO1xuICAgIGxldCBtb25zdGVyWCA9IG1vbnN0ZXIuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IG1vbnN0ZXJZID0gbW9uc3Rlci5jb29yZGluYXRlc1sxXTtcbiAgICBsZXQgbUhCb2Zmc2V0ID0gNDA7XG5cbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IHtcbiAgICAgICAgYnVsbGV0WCA9IGJ1bGxldC5jb29yZGluYXRlc1swXTtcbiAgICAgICAgYnVsbGV0WSA9IGJ1bGxldC5jb29yZGluYXRlc1sxXTtcbiAgICAgICAgaWYgKGJ1bGxldFggPCBtb25zdGVyWCArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC0gbUhCb2Zmc2V0ICYmXG4gICAgICAgICAgYnVsbGV0WCArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPiBtb25zdGVyWCArIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFkgPCBtb25zdGVyWSArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAtIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFkgKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+IG1vbnN0ZXJZICsgbUhCb2Zmc2V0KSB7XG4gICAgICAgICAgICBtb25zdGVyLnJlZHVjZUhlYWx0aChidWxsZXQuY3VycmVudFNwcml0ZS5kYW1hZ2UpO1xuICAgICAgICAgICAgYnVsbGV0cy5zcGxpY2UoMCwgMSk7XG5cbiAgICAgICAgICAgIGlmIChtb25zdGVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICAgIG1vbnN0ZXIuZGVmZWF0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICAgIG1vbnN0ZXJCdWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IHtcbiAgICAgIGJ1bGxldFggPSBidWxsZXQuY29vcmRpbmF0ZXNbMF07XG4gICAgICBidWxsZXRZID0gYnVsbGV0LmNvb3JkaW5hdGVzWzFdO1xuICAgICAgaWYgKGJ1bGxldFggPCBwbGF5ZXJYICsgcGxheWVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAmJlxuICAgICAgICBidWxsZXRYICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA+IHBsYXllclggJiZcbiAgICAgICAgYnVsbGV0WSA8IHBsYXllclkgKyBwbGF5ZXIuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAmJlxuICAgICAgICBidWxsZXRZICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPiBwbGF5ZXJZKSB7XG4gICAgICAgICAgZ2FtZU92ZXJQcm9tcHQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwbGF5ZXJYIDwgbW9uc3RlclggKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAtIG1IQm9mZnNldCYmXG4gICAgICBwbGF5ZXJYICsgcGxheWVyLmhpdEJveFcgPiBtb25zdGVyWCArIG1IQm9mZnNldCYmXG4gICAgICBwbGF5ZXJZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLSBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWSArIHBsYXllci5oaXRCb3hIID4gbW9uc3RlclkgKyBtSEJvZmZzZXQmJlxuICAgICAgbW9uc3Rlci5hbGl2ZSkge1xuICAgICAgICBnYW1lT3ZlclByb21wdCgpO1xuICAgICAgfVxuICB9XG5cbiAgbGV0IGxhc3RCdWxsZXQ7XG4gIGZ1bmN0aW9uIEZpcmUgKCkge1xuICAgIGFsbG93RmlyZSA9IGZhbHNlO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgYWxsb3dGaXJlID0gdHJ1ZTtcbiAgICB9LCAyNTApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvb3QgKHBsYXllclBvcykge1xuICAgIGlmIChhbGxvd0ZpcmUpIHtcbiAgICAgIGJ1bGxldHMucHVzaChuZXcgQnVsbGV0KHBsYXllclBvcywgY2FudmFzLndpZHRoLFxuICAgICAgICBjYW52YXMuaGVpZ2h0LCBjdHgsIGJ1bGxldFNwcml0ZXMucmlmbGUpKTtcblxuICAgICAgYnVsbGV0cyA9IGJ1bGxldHMuZmlsdGVyKGJ1bGxldCA9PiBidWxsZXQuYWN0aXZlKTtcbiAgICB9XG5cbiAgICBGaXJlKCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUgKGtleSwgZHQsIGRlbHRhKSB7XG4gICAgcGxheWVyLnVwZGF0ZShrZXkpO1xuICAgIC8vIGxldCBwbGF5ZXJDZW50ZXJQb3MgPVxuICAgICAgLy8gcGxheWVyLnNldENlbnRlckNvb3JkcyhwbGF5ZXIuY29vcmRpbmF0ZXNbMF0sIHBsYXllci5jb29yZGluYXRlc1sxXSk7XG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgbW9uc3Rlci51cGRhdGUocGxheWVyLmNvb3JkaW5hdGVzLCBkdCwgZGVsdGEpO1xuICAgIH1cbiAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC51cGRhdGUoZHQsICdwbGF5ZXInKSk7XG4gICAgbW9uc3RlckJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnVwZGF0ZShkdCwgJ21vbnN0ZXInKSk7XG4gIH1cblxuICBjb25zdCBjbGVhciA9ICgpID0+ICB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlbmRlciAobm93KSB7XG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgbW9uc3Rlci5yZW5kZXIobm93KTtcbiAgICB9XG4gICAgcGxheWVyLnJlbmRlcihub3cpO1xuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnJlbmRlcigpKTtcbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQucmVuZGVyKCkpO1xuICB9XG5cbiAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGtleSA9IGV2dC53aGljaDtcbiAgICBwbGF5ZXIua2V5UHJlc3NlZFtrZXldID0gdHJ1ZTtcbiAgICBpZiAoa2V5ID09PSAzMiAmJiBwbGF5ZXIuYWxpdmUpIHtcbiAgICAgIHNob290KHBsYXllci5jdXJyZW50UG9zaXRpb24oKSk7XG4gICAgfVxuICB9O1xuXG4gIGRvY3VtZW50Lm9ua2V5dXAgPSBmdW5jdGlvbihldnQpIHtcbiAgICBwbGF5ZXIua2V5UHJlc3NlZFtldnQud2hpY2hdID0gZmFsc2U7XG4gICAga2V5ID0gbnVsbDtcbiAgfTtcbiAgLy8gbGV0IGRlbHRhO1xuICBmdW5jdGlvbiBtYWluKCkge1xuICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGxldCBkZWx0YSA9IG5vdyAtIGxhc3RUaW1lO1xuICAgIGxldCBkdCA9IChkZWx0YSkgLyA1MDAuMDtcbiAgICBteVJlcSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSggbWFpbiApO1xuICAgIGNvbGxpc2lvbkRldGVjdGVkKCk7XG4gICAgdXBkYXRlKGtleSwgZHQsIGRlbHRhKTtcbiAgICBjbGVhcigpO1xuICAgIHJlbmRlcihub3cpO1xuICAgIGxhc3RUaW1lID0gbm93O1xuICB9XG4gIG15UmVxID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluICk7XG4gIHN0YXJ0R2FtZSgpO1xufTtcbiIsImxldCBtb25zdGVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vbW9uc3Rlcl9zcHJpdGVzJyk7XG5sZXQgYnVsbGV0U3ByaXRlcyA9IHJlcXVpcmUoJy4vYnVsbGV0X3Nwcml0ZXMnKTtcbmxldCBCdWxsZXQgPSByZXF1aXJlKCcuL2J1bGxldCcpO1xubGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG5cbmNsYXNzIE1vbnN0ZXIge1xuICBjb25zdHJ1Y3RvciAoY3R4LCBjYW52YXNXLCBjYW52YXNILCBzcHJpdGUpIHtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFs3MDAsIDMwMF07XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgIHRoaXMubWF4SFAgPSAzMDA7XG4gICAgdGhpcy5oZWFsdGggPSAzMDA7XG4gICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG5cbiAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgIHRoaXMuY2VudGVyQ29vcmRzID0gWzAsIDBdO1xuICAgIHRoaXMucmFuZENvdW50ID0gMjAwO1xuICAgIHRoaXMucGF1c2VBbmltYXRpb24gPSBmYWxzZTtcbiAgICB0aGlzLmJ1bGxldHMgPSBbXTtcbiAgICB0aGlzLmJ1bGxldHNMb2FkZWQgPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbiA9IHRoaXMuY3VycmVudFBvc2l0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICBjdXJyZW50UG9zaXRpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb29yZGluYXRlczogdGhpcy5zZXRDZW50ZXJDb29yZHMoKSxcbiAgICB9O1xuICB9XG5cbiAgc2V0Q2VudGVyQ29vcmRzICgpIHtcbiAgICBsZXQgeCA9IHRoaXMuY29vcmRpbmF0ZXNbMF0gK1xuICAgICAgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC8gMik7XG4gICAgbGV0IHkgPSB0aGlzLmNvb3JkaW5hdGVzWzFdICtcbiAgICAgICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLyAyKTtcblxuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBkZWZlYXRlZCAoKSB7XG4gICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xuICB9XG5cbiAgcGxheWVyRGVmZWF0ZWQoKSB7XG4gICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gIH1cblxuICByZWR1Y2VIZWFsdGggKGRhbWFnZSkge1xuICAgIHRoaXMuaGVhbHRoIC09IGRhbWFnZTtcbiAgfVxuXG4gIHJlbmRlcihub3cpIHtcbiAgICB2YXIgbW9uc3RlclNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgIG1vbnN0ZXJTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UobW9uc3RlclNwcml0ZSwgdGhpcy5zaGlmdCwgMCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCk7XG4gICAgaWYgKCF0aGlzLnBhdXNlQW5pbWF0aW9uKSB7XG5cbiAgICAgIGxldCBmcHMgPSB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzICogdGhpcy5jdXJyZW50U3ByaXRlLmZwc1g7XG4gICAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzKSAge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzID0gZnBzO1xuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGg7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdpbnRybycpIHtcblxuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IFt0aGlzLmNvb3JkaW5hdGVzWzBdIC0gMTUsXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdICsgMTVdO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2RlYWQnKSB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAyO1xuICAgICAgICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuICAgICAgICAgICAgICB0aGlzLnBhdXNlQW5pbWF0aW9uID0gdHJ1ZTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kRGlyZWN0aW9uVmVjdG9yICgpIHtcbiAgICBsZXQgeCA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0gLSB0aGlzLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCB5ID0gdGhpcy5maW5hbFBsYXllclBvc1sxXSAtIHRoaXMuY29vcmRpbmF0ZXNbMV07XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfVxuXG4gIGZpbmRNYWduaXR1ZGUgKHgsIHkpIHtcbiAgICBsZXQgbWFnbml0dWRlID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIHJldHVybiBtYWduaXR1ZGU7XG4gIH1cbiAgbm9ybWFsaXplVmVjdG9yIChwbGF5ZXJEaXIsIG1hZ25pdHVkZSkge1xuICAgIHJldHVybiBbKHBsYXllckRpclswXS9tYWduaXR1ZGUpLCAocGxheWVyRGlyWzFdL21hZ25pdHVkZSldO1xuICB9XG5cbiAgY2hhc2VQbGF5ZXIgKGRlbHRhKSB7XG4gICAgICBsZXQgcGxheWVyRGlyID0gdGhpcy5maW5kRGlyZWN0aW9uVmVjdG9yKCk7XG4gICAgICBsZXQgbWFnbml0dWRlID0gdGhpcy5maW5kTWFnbml0dWRlKHBsYXllckRpclswXSwgcGxheWVyRGlyWzFdKTtcbiAgICAgIGxldCBub3JtYWxpemVkID0gdGhpcy5ub3JtYWxpemVWZWN0b3IocGxheWVyRGlyLCBtYWduaXR1ZGUpO1xuICAgICAgbGV0IHZlbG9jaXR5ID0gMjtcblxuICAgICAgdGhpcy5jb29yZGluYXRlc1swXSA9IHRoaXMuY29vcmRpbmF0ZXNbMF0gKyAobm9ybWFsaXplZFswXSAqXG4gICAgICAgIHZlbG9jaXR5ICogZGVsdGEpO1xuICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSA9IHRoaXMuY29vcmRpbmF0ZXNbMV0gKyAobm9ybWFsaXplZFsxXSAqXG4gICAgICAgIHZlbG9jaXR5ICogZGVsdGEpO1xuICB9XG5cbiAgcmFuZG9tQ291bnQoKSB7XG4gICAgcmV0dXJuIChNYXRoLnJhbmRvbSgpICogMjAwKSArIDE4MDtcbiAgfVxuXG4gIGJ1bGxldEF0dGFjayAoKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIHdoaWxlIChpIDwgOCkge1xuICAgICAgbGV0IGJ1bGxldENvdW50ID0gaTtcbiAgICAgIHRoaXMuYnVsbGV0cy5wdXNoKG5ldyBCdWxsZXQodGhpcy5jdXJyZW50UG9zaXRpb24oKSwgdGhpcy5jYW52YXNXLFxuICAgICAgICB0aGlzLmNhbnZhc0gsIHRoaXMuY3R4LCBidWxsZXRTcHJpdGVzLm1vbnN0ZXIsIGJ1bGxldENvdW50KSk7XG4gICAgICBpKys7XG4gICAgfVxuICAgIHRoaXMuYnVsbGV0c0xvYWRlZCA9IHRydWU7XG4gICAgdGhpcy5idWxsZXRzLmZpbHRlcihidWxsZXQgPT4gYnVsbGV0LmFjdGl2ZSk7XG4gICAgY29uc29sZS5sb2codGhpcy5idWxsZXRzLmxlbmd0aCk7XG4gIH1cblxuICBoYW5kbGVJZGxlICgpIHtcbiAgICBpZiAoIXRoaXMuYnVsbGV0c0xvYWRlZCkge1xuICAgICAgdGhpcy5idWxsZXRBdHRhY2soKTtcbiAgICB9XG4gICAgbGV0IHNwZWVkID0gMjAwO1xuICAgIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogLjc1ICYmIHRoaXMuaGVhbHRoID4gdGhpcy5tYXhIUCAqIC41KSB7XG4gICAgICBzcGVlZCA9IDE4MDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGVhbHRoIDw9IHRoaXMubWF4SFAgKiAuNSAmJiB0aGlzLmhlYWx0aCA+IHRoaXMubWF4SFAgKiAuMjUpIHtcbiAgICAgIHNwZWVkID0gMTYwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oZWFsdGggPD0gdGhpcy5tYXhIUCAqIC4yNSkge1xuICAgICAgc3BlZWQgPSAxNTA7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvdW50ZXIgPj0gc3BlZWQgJiYgIXRoaXMuZ2FtZU92ZXIpIHtcbiAgICAgIHRoaXMuYnVsbGV0c0xvYWRlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMF0gPj0gdGhpcy5jb29yZGluYXRlc1swXSkge1xuICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuYml0ZV9lO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5iaXRlX3c7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICB9XG4gICAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUJpdGVXZXN0IChkZWx0YSkge1xuICAgIC8vIEJJTkRTIEZJTkFMIFBPU0lUSU9OIEJFRk9SRSBCSVRFXG4gICAgaWYgKHRoaXMuZmluYWxQbGF5ZXJQb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMV0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPj0gdGhpcy5jYW52YXNIKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0UG9zWzFdID0gdGhpcy5jYW52YXNIIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0O1xuICAgICAgfVxuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFswICsgdGhpcy50YXJnZXRQb3NbMF0sIHRoaXMudGFyZ2V0UG9zWzFdXTtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5maW5hbFBsYXllclBvc1swXSl7XG4gICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSAtIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIDw9XG4gICAgICAgIDApe1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdO1xuICAgICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICAgIHRoaXMudGFyZ2V0UG9zID0gW107XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdID49IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pIHtcbiAgICAgIHRoaXMuY2hhc2VQbGF5ZXIoZGVsdGEpO1xuICAgIH1cbiAgfVxuICAvLyBDSEFSR0UgRE9FU05UIEhJVCBJRiBJTiBDRU5URVIgT0YgQk9UVE9NIE9SIHRvcFxuICAvLyBTSE9VTEQgRklORCBBIFdBWSBUTyBTVElMTCBHTyBUT1dBUkRTIFRBUkdFVCBYIEJVVCBGVUxMWVxuICBoYW5kbGVCaXRlRWFzdCAoZGVsdGEpIHtcbiAgICBpZiAodGhpcy5maW5hbFBsYXllclBvcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmICh0aGlzLnRhcmdldFBvc1sxXSArIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+PSB0aGlzLmNhbnZhc0gpIHtcbiAgICAgICAgdGhpcy50YXJnZXRQb3NbMV0gPSB0aGlzLmNhbnZhc0ggLSB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQ7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW3RoaXMuY2FudmFzVyAtXG4gICAgICAgICh0aGlzLmNhbnZhc1cgLSB0aGlzLnRhcmdldFBvc1swXSksIHRoaXMudGFyZ2V0UG9zWzFdXTtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdICsgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPj1cbiAgICAgICAgdGhpcy5jYW52YXNXKXtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5maW5hbFBsYXllclBvc1swXSAtXG4gICAgICAgICAgKHRoaXMuY2FudmFzVyAtIHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pO1xuICAgICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICAgIHRoaXMudGFyZ2V0UG9zID0gW107XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pIHtcbiAgICAgIHRoaXMuY2hhc2VQbGF5ZXIoZGVsdGEpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShwbGF5ZXJQb3MsIGR0LCBkZWx0YSkge1xuICAgIGlmICghdGhpcy5hbGl2ZSAmJiAhdGhpcy5nYW1lT3Zlcikge1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5kZWFkO1xuICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAvLyB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICB9XG4gICAgLy8gVFJBQ0tTIFBPU0lUSU9OIE9GIFBMQVlFUlxuICAgIGlmICh0aGlzLnRhcmdldFBvcy5sZW5ndGggPT09IDAgKSB7XG4gICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudGFyZ2V0UG9zID0gT2JqZWN0LmFzc2lnbihbXSwgcGxheWVyUG9zKTtcbiAgICAgIH0sIDEwMCk7XG4gICAgfVxuXG4gICAgLy8gT0ZGU0VUIEZPUiBJRExFIEFOSU1BVElPTlxuICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciB8fCAwO1xuXG4gICAgc3dpdGNoICh0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSkge1xuICAgICAgY2FzZSAnaWRsZSc6XG4gICAgICAgICAgdGhpcy5jb3VudGVyKys7XG4gICAgICAgICAgdGhpcy5oYW5kbGVJZGxlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYml0ZV93JzpcbiAgICAgICAgdGhpcy5oYW5kbGVCaXRlV2VzdChkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYml0ZV9lJzpcbiAgICAgICAgdGhpcy5oYW5kbGVCaXRlRWFzdChkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vbnN0ZXI7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcbi8vIElGIEJMQU5LIFJFTkRFUiBCRUZPUkUgU1BSSVRFLCBORUVEIFRPIFJFU0VUIFNISUZUIFRPIDAhIVxuY29uc3QgbW9uc3RlclNwcml0ZVNoZWV0ID0ge1xuICBkaXJ0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG4gICAgbmFtZTogJ2ludHJvJyxcbiAgICBmcmFtZUhlaWdodDogMTY2LFxuICAgIGZyYW1lV2lkdGg6IDE1MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDE2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBpbnRybzoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuICAgIG5hbWU6ICdpbnRybycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2NixcbiAgICBmcmFtZVdpZHRoOiAxNTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMTAwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgaWRsZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pZGxlLnBuZycsXG4gICAgbmFtZTogJ2lkbGUnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNzMsXG4gICAgZnJhbWVXaWR0aDogMjAzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTIsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAxMjUsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBiaXRlX3c6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2JpdGVfd2VzdC5wbmcnLFxuICAgIG5hbWU6ICdiaXRlX3cnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjMsXG4gICAgZnJhbWVXaWR0aDogMTkyLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNSxcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDIwMCxcbiAgICBmcHNYOiAxLjUsXG4gIH0sXG5cbiAgYml0ZV9lOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9iaXRlX2Vhc3QucG5nJyxcbiAgICBuYW1lOiAnYml0ZV9lJyxcbiAgICBmcmFtZUhlaWdodDogMTYzLFxuICAgIGZyYW1lV2lkdGg6IDE5MixcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDUsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMS41LFxuICB9LFxuXG4gIGRlYWQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1fZGVhZC5wbmcnLFxuICAgIG5hbWU6ICdkZWFkJyxcbiAgICBmcmFtZUhlaWdodDogMTYzLFxuICAgIGZyYW1lV2lkdGg6IDE1NSxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDQsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDIwMCxcbiAgICBmcHNYOiAxLFxuICB9XG59O1xuXG5jb25zdCBtb25zdGVyU3ByaXRlcyA9IHtcbiAgaW50cm86IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmludHJvKSxcbiAgaWRsZTogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuaWRsZSksXG4gIGRlYWQ6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmRlYWQpLFxuICBiaXRlX3c6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmJpdGVfdyksXG4gIGJpdGVfZTogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuYml0ZV9lKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtb25zdGVyU3ByaXRlcztcbiIsImxldCBwbGF5ZXJTcHJpdGVzID0gcmVxdWlyZSgnLi9wbGF5ZXJfc3ByaXRlcycpO1xubGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG5cbmNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yIChjdHgsIGNhbnZhc1csIGNhbnZhc0gsIHNwcml0ZSkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gWzAsIDBdO1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHNwcml0ZTtcbiAgICB0aGlzLmZhY2luZ1BvcyA9IFwicmlnaHRcIjtcbiAgICB0aGlzLmhpdEJveEggPSA1NTtcbiAgICB0aGlzLmhpdEJveFcgPSA2OTtcbiAgICB0aGlzLmtleVByZXNzZWQgPSB7fTtcbiAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcbiAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLmNlbnRlckNvb3JkcyA9IFswLCAwXTtcbiAgfVxuXG4gIHNldENlbnRlckNvb3JkcyAoeCwgeSkge1xuICAgIGxldCBjZW50ZXJYID0geCArICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAvIDIpO1xuICAgIGxldCBjZW50ZXJZID0geSArICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLyAyKTtcblxuICAgIHJldHVybiBbY2VudGVyWCwgY2VudGVyWV07XG4gIH1cblxuICByZW5kZXIobm93KSB7XG4gICAgdmFyIHBsYXllclNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgIHBsYXllclNwcml0ZS5zcmMgPSB0aGlzLmN1cnJlbnRTcHJpdGUudXJsO1xuXG4gICAgLy8gcGxheWVyU3ByaXRlLmFkZEV2ZW50TGlzdGVuZXJcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UocGxheWVyU3ByaXRlLCB0aGlzLnNoaWZ0LCAwLFxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCxcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0sIHRoaXMuY29vcmRpbmF0ZXNbMV0sIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLFxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0KTtcbiAgICAgIC8vIGRlYnVnZ2VyXG5cbiAgICAgIGxldCBmcHMgPSB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzICogdGhpcy5jdXJyZW50U3ByaXRlLmZwc1g7XG4gICAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzICYmICF0aGlzLmdhbWVPdmVyKSAge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzID0gZnBzO1xuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGg7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmICF0aGlzLmFsaXZlKSB7XG4gICAgICAgICAgICAvLyB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICkge1xuXG4gICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKz0gMTtcbiAgICB9XG4gIH1cblxuICBkZWFkICgpIHtcbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG4gIH1cblxuICBzZXRIaXRCb3ggKGZhY2luZ1Bvcykge1xuICAgIHN3aXRjaCAoZmFjaW5nUG9zKSB7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA1NTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDY5O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA1NTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNTU7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDY5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDY5O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA1NTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFjaW5nUG9zO1xuICAgIH1cbiAgfVxuXG4gIGN1cnJlbnRQb3NpdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvb3JkaW5hdGVzOiB0aGlzLmNvb3JkaW5hdGVzLFxuICAgICAgcGxheWVyRmFjZTogdGhpcy5mYWNpbmdQb3NcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlKGtleSkge1xuICAgIGNvbnN0IHNwcml0ZUhlaWdodCA9IDEyNTtcbiAgICB0aGlzLnNldEhpdEJveCh0aGlzLmZhY2luZ1Bvcyk7XG4gICAgbGV0IHNwZWVkID0gMTI7XG5cbiAgICBpZiAodGhpcy5hbGl2ZSkge1xuICAgICAgaWYodGhpcy5rZXlQcmVzc2VkWzM3XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlTGVmdDtcbiAgICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcImxlZnRcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gNSkge3RoaXMuY29vcmRpbmF0ZXNbMF0tPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszOF0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZVVwO1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwidXBcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMTUpIHt0aGlzLmNvb3JkaW5hdGVzWzFdLT1zcGVlZDt9XG4gICAgICB9XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzldKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVSaWdodDtcbiAgICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcInJpZ2h0XCI7XG4gICAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIDw9ICh0aGlzLmNhbnZhc1cgLSB0aGlzLmhpdEJveEggLSAzMCkpXG4gICAgICAgIHt0aGlzLmNvb3JkaW5hdGVzWzBdKz1zcGVlZDt9XG4gICAgICB9XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbNDBdKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVEb3duO1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwiZG93blwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA8PSAodGhpcy5jYW52YXNIIC0gdGhpcy5oaXRCb3hIKSlcbiAgICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMV0rPXNwZWVkO31cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5kZWFkO1xuICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY29uc3QgcGxheWVyU3ByaXRlU2hlZXQgPSB7XG4gIGRlYWQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2Jsb29kX3NtYWxsLnBuZycsXG4gICAgbmFtZTogJ2RlYWQnLFxuICAgIGZyYW1lSGVpZ2h0OiAxMjQsXG4gICAgZnJhbWVXaWR0aDogKDc2MyAvIDYpLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMTUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgZW1wdHk6IHtcbiAgICB1cmw6ICcnLFxuICAgIG5hbWU6ICcnLFxuICAgIGZyYW1lSGVpZ2h0OiAwLFxuICAgIGZyYW1lV2lkdGg6IDAsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAwLFxuICAgIG9uY2U6IDAsXG4gICAgZnBzOiAwLFxuICAgIGZwc1g6IDAsXG4gIH0sXG5cbiAgYWxpdmVMZWZ0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfbGVmdC5wbmcnLFxuICAgIG5hbWU6ICdsZWZ0JyxcbiAgICBmcmFtZUhlaWdodDogNTUsXG4gICAgZnJhbWVXaWR0aDogOTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIC8vIGhpdEJveEhlaWdodE9mZnNldDpcbiAgICAvLyBoaXRCb3hXaWR0aE9mZnNldDpcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIGFsaXZlVXA6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV91cC5wbmcnLFxuICAgIG5hbWU6ICd1cCcsXG4gICAgZnJhbWVIZWlnaHQ6IDkzLFxuICAgIGZyYW1lV2lkdGg6IDU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIGFsaXZlUmlnaHQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZS5wbmcnLFxuICAgIG5hbWU6ICdyaWdodCcsXG4gICAgZnJhbWVIZWlnaHQ6IDU1LFxuICAgIGZyYW1lV2lkdGg6IDkzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIGFsaXZlRG93bjoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2Rvd24ucG5nJyxcbiAgICBuYW1lOiAnZG93bicsXG4gICAgZnJhbWVIZWlnaHQ6IDkzLFxuICAgIGZyYW1lV2lkdGg6IDU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG59O1xuXG5jb25zdCBwbGF5ZXJTcHJpdGVzID0ge1xuICBkZWFkOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmRlYWQpLFxuICBhbGl2ZUxlZnQ6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVMZWZ0KSxcbiAgYWxpdmVVcDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZVVwKSxcbiAgYWxpdmVSaWdodDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZVJpZ2h0KSxcbiAgYWxpdmVEb3duOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlRG93biksXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGxheWVyU3ByaXRlcztcbiIsImNsYXNzIFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsO1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLmZyYW1lV2lkdGggPSBvcHRpb25zLmZyYW1lV2lkdGg7XG4gICAgdGhpcy5mcmFtZUhlaWdodCA9IG9wdGlvbnMuZnJhbWVIZWlnaHQ7XG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSBvcHRpb25zLmN1cnJlbnRGcmFtZTtcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gb3B0aW9ucy50b3RhbEZyYW1lcztcbiAgICB0aGlzLm9uY2UgPSBvcHRpb25zLm9uY2U7XG4gICAgdGhpcy5mcHMgPSBvcHRpb25zLmZwcztcbiAgICB0aGlzLmZwc1ggPSBvcHRpb25zLmZwc1g7XG4gICAgdGhpcy5kYW1hZ2UgPSBvcHRpb25zLmRhbWFnZTtcbiAgfVxufVxuLy8gdXJsLCBuYW1lLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcbiIsIi8vIEhPVyBUTyBCVUlMRCBQSFlTSUNTIEZPUiBBIFdFQVBPTj9cbi8vIEJVTExFVCBTUEVFRCwgU1BSRUFELCBEQU1BR0U/XG4vLyBETyBQSFlTSUNTIE5FRUQgVE8gQkUgQSBTRVBBUkFURSBDTEFTUz8gQ0FOIEkgSU1QT1JUIEEgTElCUkFSWSBUTyBIQU5ETEUgVEhBVCBMT0dJQz9cblxuY2xhc3MgV2VhcG9uIHtcbiAgY29uc3RydWN0b3IgKGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLnJhdGUgPSBhdHRyaWJ1dGVzLnJhdGU7XG4gICAgdGhpcy5tb2RlbCA9IGF0dHJpYnV0ZXMubW9kZWw7XG4gICAgdGhpcy5wb3dlciA9IGF0dHJpYnV0ZXMucG93ZXI7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYXBvbjtcbiJdfQ==
