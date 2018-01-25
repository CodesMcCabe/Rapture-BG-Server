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

  function hoverSound () {

  }

  function startGame () {
    let start = document.getElementById('start');

    start.addEventListener('click', function(e) {
        start.className = 'start_button_hide';
        gameStart = true;
    });

    let audio = document.getElementById('audio_hover');
    audio.volume = 0.4;
    start.addEventListener('mouseover', function(evt) {
      audio.load();
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

    let gameOver = document.getElementById('game_over');
    let timeout = setTimeout(() => {
      gameOver.style.display = 'block';
    }, 2000);

    let audio = document.getElementById('audio_hover');
    audio.volume = 0.4;
    gameOver.addEventListener('mouseover', function(evt) {
      audio.load();
      audio.play();
    });

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
      playerY + player.hitBoxH > monsterY + mHBoffset &&
      gameStart) {
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
    let keys = [32, 37, 38, 39, 40];
    key = evt.which;
    if(keys.includes(key)) {
      evt.preventDefault();
    }
    // key.preventDefault();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJvYXJkLmpzIiwiYnVsbGV0LmpzIiwiYnVsbGV0X3Nwcml0ZXMuanMiLCJtYWluLmpzIiwibW9uc3Rlci5qcyIsIm1vbnN0ZXJfc3ByaXRlcy5qcyIsInBsYXllci5qcyIsInBsYXllcl9zcHJpdGVzLmpzIiwicmVzb3VyY2VzLmpzIiwic3ByaXRlLmpzIiwid2VhcG9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGRyb3AgZXZlbnQgbGlzdGVuZXIgaGVyZVxuLy8gU0hPVUxEIFNFVCBJVCBVUCBGT1IgRlVSVEhFUiBNQVBTXG4vLyBCT0FSRCBJTlNUQU5DRSBDQU4gQkUgSU5WT0tFRCBVUE9OIEdBTUUgU1RBUlQgQU5EIFBBU1NFRCBJTiBBIFNQRUNJRklDIEJvYXJkXG4vLyBIT1cgRE8gSSBDUkVBVEUgVEhFIEJPQVJEIEFORCBQQVNTIElUIElOP1xuXG4vLyBjb25zdCBib2FyZCA9IHtcbi8vICAgYmdJbWFnZTogbmV3IEltYWdlKClcbi8vXG4vLyB9XG5jbGFzcyBCb2FyZCB7XG4gIGNvbnN0cnVjdG9yIChjdHgpIHtcbiAgICAvLyB0aGlzLmJhY2tncm91bmQgPSBuZXc7XG4gICAgLy8gdGhpcy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZGltYWdlO1xuICAgIC8vIHRoaXMuYm9hcmQgPSBwbGF0Zm9ybXM7XG4gIH1cbn1cblxuLy8gY2FuIGFsc28gc2V0IHRoaXMgYXMgYSBzaW5nbGUgZnVuY3Rpb25cblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDtcbiIsImNsYXNzIEJ1bGxldCB7XG4gIGNvbnN0cnVjdG9yKHBsYXllckF0dHIsIGNhbnZhc1csIGNhbnZhc0gsIGN0eCwgc3ByaXRlLCBidWxsZXRDb3VudCkge1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHNwcml0ZTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5wbGF5ZXJQb3MgPSBPYmplY3QuYXNzaWduKFtdLCBwbGF5ZXJBdHRyLmNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLnBsYXllckZhY2UgPSBwbGF5ZXJBdHRyLnBsYXllckZhY2U7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IHRoaXMuc2V0Q29vcmRpbmF0ZXModGhpcy5wbGF5ZXJQb3MpO1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmJ1bGxldENvdW50ZXIgPSAwO1xuICAgIHRoaXMuYnVsbGV0Q291bnQgPSBidWxsZXRDb3VudDtcblxuICAgIC8vIEJBTkQgQUlEIEZPUiBNT05TVEVSIEJVTExFVFNcbiAgICAvLyBTSE9VTEQgQUxTTyBXT1JLIEZPUiBQTEFZRVIgQlVMTEVUUyBTSElGVElOR1xuICAgIC8vIEFDVFVBTExZIFdPUktTIFBSRVRUWSBOSUNFTFksIE5PVCBTVVJFIElGIEJFVFRFUiBXQVkgVE9cbiAgICAvLyBETyBUSElTIEFDVElPTiBTSU5DRSBPTkxZIFVTSU5HIDEgU1BSSVRFXG4gICAgdGhpcy5jdXJyZW50VVJMID0gXCJcIjtcblxuXG4gICAgdGhpcy5zZXRDb29yZGluYXRlcyA9IHRoaXMuc2V0Q29vcmRpbmF0ZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNldEhpdEJveCA9IHRoaXMuc2V0SGl0Qm94LmJpbmQodGhpcyk7XG4gIH1cbiAgLy8gQlVMTEVUUyBXSUxMIENIQU5HRSBTUFJJVEVTIFdIRU4gQU5PVEhFUiBTSE9UIElTIFRBS0VOXG4gIC8vIE5FRUQgVE8gS0VFUCBUSEUgSU1BR0UgV0hFTiBTSE9UIElTIFRBS0VOXG4gIHJlbmRlciAoKSB7XG4gICAgdmFyIGJ1bGxldFNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgIGJ1bGxldFNwcml0ZS5zcmMgPSB0aGlzLmN1cnJlbnRVcmw7XG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKGJ1bGxldFNwcml0ZSwgdGhpcy5jb29yZGluYXRlc1swXSwgdGhpcy5jb29yZGluYXRlc1sxXSk7XG4gIH1cblxuICBzZXRIaXRCb3ggKHBsYXllckZhY2UpIHtcbiAgICBsZXQgZGltZW5zaW9uc0NvcHkgPSBPYmplY3QuYXNzaWduKFtdLFxuICAgICAgW3RoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHRdKTtcbiAgICBzd2l0Y2ggKHBsYXllckZhY2UpIHtcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHBsYXllckZhY2U7XG4gICAgfVxuICB9XG5cbiAgc2V0Q29vcmRpbmF0ZXMgKHBsYXllclBvcykge1xuICAgIGxldCB4ID0gcGxheWVyUG9zWzBdO1xuICAgIGxldCB5ID0gcGxheWVyUG9zWzFdO1xuICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ3JpZmxlJykge1xuICAgICAgdGhpcy5zZXRIaXRCb3godGhpcy5wbGF5ZXJGYWNlKTtcbiAgICAgIHN3aXRjaCAodGhpcy5wbGF5ZXJGYWNlKSB7XG4gICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHggKz0gNDtcbiAgICAgICAgeSArPSAxMTtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHggKz0gNDA7XG4gICAgICAgIHkgKz0gNTtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHggKz0gNzU7XG4gICAgICAgIHkgKz0gNDA7XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHggKz0gMTE7XG4gICAgICAgIHkgKz0gODA7XG4gICAgICAgIHJldHVyblt4LCB5XTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHBsYXllclBvcztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBsYXllclBvcztcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoZHQsIG93bmVyKSB7XG4gICAgbGV0IGJ1bGxldFNwZWVkO1xuICAgIGlmIChvd25lciA9PT0gJ3BsYXllcicpIHtcbiAgICAgIGJ1bGxldFNwZWVkID0gODAwO1xuICAgICAgc3dpdGNoICh0aGlzLnBsYXllckZhY2UpIHtcbiAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gdGhpcy5jYW52YXNIO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBidWxsZXRTcGVlZCA9IDUwMDtcbiAgICAgIC8vIGRlYnVnZ2VyXG4gICAgICBzd2l0Y2ggKHRoaXMuYnVsbGV0Q291bnQpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbncucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdIC09KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gLT0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDAgJiZcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X2xlZnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zdy5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gLT0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSArPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMCAmJlxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gdGhpcy5jYW52YXNIO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zb3V0aC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9IHRoaXMuY2FudmFzSDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc2UucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdICs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdICs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD1cbiAgICAgICAgICB0aGlzLmNhbnZhc0ggJiYgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3JpZ2h0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5jYW52YXNXO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9uZS5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwICYmXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdLT0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQnVsbGV0O1xuIiwibGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG4vLyBJRiBCTEFOSyBSRU5ERVIgQkVGT1JFIFNQUklURSwgTkVFRCBUTyBSRVNFVCBTSElGVCBUTyAwISFcbmNvbnN0IGJ1bGxldFNwcml0ZVNoZWV0ID0ge1xuICByaWZsZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJyxcbiAgICBuYW1lOiAncmlmbGUnLFxuICAgIGZyYW1lSGVpZ2h0OiA2LFxuICAgIGZyYW1lV2lkdGg6IDE0LFxuICAgIGRhbWFnZTogMTAsXG4gIH0sXG5cbiAgbW9uc3Rlcjoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF92ZXJ0LnBuZycsXG4gICAgbmFtZTogJ21vbnN0ZXInLFxuICAgIGZyYW1lSGVpZ2h0OiAzMixcbiAgICBmcmFtZVdpZHRoOiA5LFxuICAgIGRhbWFnZTogMTAsXG4gIH0sXG59O1xuXG5jb25zdCBidWxsZXRTcHJpdGVzID0ge1xuICByaWZsZTogbmV3IFNwcml0ZShidWxsZXRTcHJpdGVTaGVldC5yaWZsZSksXG4gIG1vbnN0ZXI6IG5ldyBTcHJpdGUoYnVsbGV0U3ByaXRlU2hlZXQubW9uc3Rlcilcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYnVsbGV0U3ByaXRlcztcbiIsImxldCBCb2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcbmxldCBtb25zdGVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vbW9uc3Rlcl9zcHJpdGVzJyk7XG5sZXQgcGxheWVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vcGxheWVyX3Nwcml0ZXMnKTtcbmxldCBidWxsZXRTcHJpdGVzID0gcmVxdWlyZSgnLi9idWxsZXRfc3ByaXRlcycpO1xubGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG5sZXQgTW9uc3RlciA9IHJlcXVpcmUoJy4vbW9uc3RlcicpO1xubGV0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJyk7XG5sZXQgV2VhcG9ucyA9IHJlcXVpcmUoJy4vd2VhcG9ucycpO1xubGV0IEJ1bGxldCA9IHJlcXVpcmUoJy4vYnVsbGV0Jyk7XG5sZXQgcHJlbG9hZEltYWdlcyA9IHJlcXVpcmUoJy4vcmVzb3VyY2VzJyk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBsZXQgc3RhcnRCdXR0b24gPSAnYXNzZXRzL2ltYWdlcy9zdGFydF9idXR0b24ucG5nJztcbiAgbGV0IGdhbWVPdmVyU3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvZ2FtZV9vdmVyLnBuZyc7XG4gIGxldCBteVJlcTtcbiAgcHJlbG9hZEFzc2V0cygpO1xuXG4gIGZ1bmN0aW9uIGhvdmVyU291bmQgKCkge1xuXG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEdhbWUgKCkge1xuICAgIGxldCBzdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xuXG4gICAgc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHN0YXJ0LmNsYXNzTmFtZSA9ICdzdGFydF9idXR0b25faGlkZSc7XG4gICAgICAgIGdhbWVTdGFydCA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBsZXQgYXVkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW9faG92ZXInKTtcbiAgICBhdWRpby52b2x1bWUgPSAwLjQ7XG4gICAgc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBhdWRpby5sb2FkKCk7XG4gICAgICBhdWRpby5wbGF5KCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVsb2FkQXNzZXRzICgpIHtcbiAgICBwcmVsb2FkSW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4ge1xuICAgICAgbGV0IGxvYWRlZEltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICBsb2FkZWRJbWFnZS5zcmMgPSBpbWFnZTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdhbWVPdmVyUHJvbXB0ICgpIHtcblxuICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICBsZXQgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfSwgMjAwMCk7XG5cbiAgICBsZXQgYXVkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW9faG92ZXInKTtcbiAgICBhdWRpby52b2x1bWUgPSAwLjQ7XG4gICAgZ2FtZU92ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBhdWRpby5sb2FkKCk7XG4gICAgICBhdWRpby5wbGF5KCk7XG4gICAgfSk7XG5cbiAgICBnYW1lT3Zlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBtb25zdGVyU3ByaXRlcy5kZWFkLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICBtb25zdGVyU3ByaXRlcy5pZGxlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICBwbGF5ZXIuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgbW9uc3RlclNwcml0ZXMuaW50cm8uY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHJlc3RhcnRHYW1lKCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXN0YXJ0R2FtZSAoKSB7XG4gICAgbGV0IGdhbWVPdmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWVfb3ZlcicpO1xuICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBtb25zdGVyID0gbmV3IE1vbnN0ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgICBtb25zdGVyU3ByaXRlcy5pbnRybyk7XG4gICAgcGxheWVyID0gbmV3IFBsYXllcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICAgIHBsYXllclNwcml0ZXMuYWxpdmVSaWdodCk7XG4gICAgbW9uc3RlckJ1bGxldHMgPSBtb25zdGVyLmJ1bGxldHM7XG4gIH1cblxuICBsZXQgbW9uc3RlciA9IG5ldyBNb25zdGVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvKTtcbiAgbGV0IGdhbWVTdGFydCA9IGZhbHNlO1xuICBsZXQgYnVsbGV0cyA9IFtdO1xuICBsZXQgbW9uc3RlckJ1bGxldHMgPSBtb25zdGVyLmJ1bGxldHM7XG4gIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgIHBsYXllclNwcml0ZXMuYWxpdmVSaWdodCk7XG4gIGxldCBsYXN0VGltZSA9IERhdGUubm93KCk7XG4gIGxldCBrZXk7XG4gIGxldCBhbGxvd0ZpcmUgPSB0cnVlO1xuXG4gIGZ1bmN0aW9uIGNvbGxpc2lvbkRldGVjdGVkICgpIHtcbiAgICBsZXQgY29sbGlkZUJ1bGxldHMgPSBPYmplY3QuYXNzaWduKFtdLCBidWxsZXRzKTtcbiAgICBsZXQgYnVsbGV0WDtcbiAgICBsZXQgYnVsbGV0WTtcbiAgICBsZXQgcGxheWVyWCA9IHBsYXllci5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgcGxheWVyWSA9IHBsYXllci5jb29yZGluYXRlc1sxXTtcbiAgICBsZXQgbW9uc3RlclggPSBtb25zdGVyLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCBtb25zdGVyWSA9IG1vbnN0ZXIuY29vcmRpbmF0ZXNbMV07XG4gICAgbGV0IG1IQm9mZnNldCA9IDQwO1xuXG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICAgIGJ1bGxldFggPSBidWxsZXQuY29vcmRpbmF0ZXNbMF07XG4gICAgICAgIGJ1bGxldFkgPSBidWxsZXQuY29vcmRpbmF0ZXNbMV07XG4gICAgICAgIGlmIChidWxsZXRYIDwgbW9uc3RlclggKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAtIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFggKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID4gbW9uc3RlclggKyBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLSBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPiBtb25zdGVyWSArIG1IQm9mZnNldCkge1xuICAgICAgICAgICAgbW9uc3Rlci5yZWR1Y2VIZWFsdGgoYnVsbGV0LmN1cnJlbnRTcHJpdGUuZGFtYWdlKTtcbiAgICAgICAgICAgIGJ1bGxldHMuc3BsaWNlKDAsIDEpO1xuXG4gICAgICAgICAgICBpZiAobW9uc3Rlci5oZWFsdGggPD0gMCkge1xuICAgICAgICAgICAgICBtb25zdGVyLmRlZmVhdGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICBidWxsZXRYID0gYnVsbGV0LmNvb3JkaW5hdGVzWzBdO1xuICAgICAgYnVsbGV0WSA9IGJ1bGxldC5jb29yZGluYXRlc1sxXTtcbiAgICAgIGlmIChidWxsZXRYIDwgcGxheWVyWCArIHBsYXllci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggJiZcbiAgICAgICAgYnVsbGV0WCArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPiBwbGF5ZXJYICYmXG4gICAgICAgIGJ1bGxldFkgPCBwbGF5ZXJZICsgcGxheWVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgJiZcbiAgICAgICAgYnVsbGV0WSArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID4gcGxheWVyWSkge1xuICAgICAgICAgIHBsYXllci5kZWFkKCk7XG4gICAgICAgICAgbW9uc3Rlci5wbGF5ZXJEZWZlYXRlZCgpO1xuICAgICAgICAgIGdhbWVPdmVyUHJvbXB0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGxheWVyWCA8IG1vbnN0ZXJYICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLSBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWCArIHBsYXllci5oaXRCb3hXID4gbW9uc3RlclggKyBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWSA8IG1vbnN0ZXJZICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC0gbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclkgKyBwbGF5ZXIuaGl0Qm94SCA+IG1vbnN0ZXJZICsgbUhCb2Zmc2V0ICYmXG4gICAgICBnYW1lU3RhcnQpIHtcbiAgICAgICAgcGxheWVyLmRlYWQoKTtcbiAgICAgICAgbW9uc3Rlci5wbGF5ZXJEZWZlYXRlZCgpO1xuICAgICAgICBnYW1lT3ZlclByb21wdCgpO1xuICAgICAgfVxuICB9XG5cbiAgbGV0IGxhc3RCdWxsZXQ7XG4gIGZ1bmN0aW9uIEZpcmUgKCkge1xuICAgIGFsbG93RmlyZSA9IGZhbHNlO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgYWxsb3dGaXJlID0gdHJ1ZTtcbiAgICB9LCAyMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvb3QgKHBsYXllclBvcykge1xuICAgICAgYnVsbGV0cy5wdXNoKG5ldyBCdWxsZXQocGxheWVyUG9zLCBjYW52YXMud2lkdGgsXG4gICAgICAgIGNhbnZhcy5oZWlnaHQsIGN0eCwgYnVsbGV0U3ByaXRlcy5yaWZsZSkpO1xuXG4gICAgICBidWxsZXRzID0gYnVsbGV0cy5maWx0ZXIoYnVsbGV0ID0+IGJ1bGxldC5hY3RpdmUpO1xuXG4gICAgRmlyZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlIChrZXksIGR0LCBkZWx0YSkge1xuICAgIHBsYXllci51cGRhdGUoa2V5KTtcbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBtb25zdGVyLnVwZGF0ZShwbGF5ZXIuY29vcmRpbmF0ZXMsIGR0LCBkZWx0YSk7XG4gICAgfVxuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnVwZGF0ZShkdCwgJ3BsYXllcicpKTtcbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQudXBkYXRlKGR0LCAnbW9uc3RlcicpKTtcbiAgfVxuXG4gIGNvbnN0IGNsZWFyID0gKCkgPT4gIHtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVuZGVyIChub3cpIHtcbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBtb25zdGVyLnJlbmRlcihub3cpO1xuICAgIH1cbiAgICBwbGF5ZXIucmVuZGVyKG5vdyk7XG4gICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQucmVuZGVyKCkpO1xuICAgIG1vbnN0ZXJCdWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC5yZW5kZXIoKSk7XG4gIH1cblxuICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgbGV0IGtleXMgPSBbMzIsIDM3LCAzOCwgMzksIDQwXTtcbiAgICBrZXkgPSBldnQud2hpY2g7XG4gICAgaWYoa2V5cy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgLy8ga2V5LnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGxheWVyLmtleVByZXNzZWRba2V5XSA9IHRydWU7XG4gICAgaWYgKGtleSA9PT0gMzIgJiYgcGxheWVyLmFsaXZlICYmIGFsbG93RmlyZSkge1xuICAgICAgc2hvb3QocGxheWVyLmN1cnJlbnRQb3NpdGlvbigpKTtcbiAgICB9XG4gIH07XG5cbiAgZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBsYXllci5rZXlQcmVzc2VkW2V2dC53aGljaF0gPSBmYWxzZTtcbiAgICBrZXkgPSBudWxsO1xuICB9O1xuICAvLyBsZXQgZGVsdGE7XG4gIGZ1bmN0aW9uIG1haW4oKSB7XG4gICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgbGV0IGRlbHRhID0gbm93IC0gbGFzdFRpbWU7XG4gICAgbGV0IGR0ID0gKGRlbHRhKSAvIDUwMC4wO1xuICAgIG15UmVxID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluICk7XG4gICAgY29sbGlzaW9uRGV0ZWN0ZWQoKTtcbiAgICB1cGRhdGUoa2V5LCBkdCwgZGVsdGEpO1xuICAgIGNsZWFyKCk7XG4gICAgcmVuZGVyKG5vdyk7XG4gICAgbGFzdFRpbWUgPSBub3c7XG4gIH1cbiAgbXlSZXEgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG1haW4gKTtcbiAgc3RhcnRHYW1lKCk7XG59O1xuIiwibGV0IG1vbnN0ZXJTcHJpdGVzID0gcmVxdWlyZSgnLi9tb25zdGVyX3Nwcml0ZXMnKTtcbmxldCBidWxsZXRTcHJpdGVzID0gcmVxdWlyZSgnLi9idWxsZXRfc3ByaXRlcycpO1xubGV0IEJ1bGxldCA9IHJlcXVpcmUoJy4vYnVsbGV0Jyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY2xhc3MgTW9uc3RlciB7XG4gIGNvbnN0cnVjdG9yIChjdHgsIGNhbnZhc1csIGNhbnZhc0gsIHNwcml0ZSkge1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gWzcwMCwgMzAwXTtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5tYXhIUCA9IDMwMDtcbiAgICB0aGlzLmhlYWx0aCA9IDMwMDtcbiAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcblxuICAgIHRoaXMudGFyZ2V0UG9zID0gW107XG4gICAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG4gICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW107XG4gICAgdGhpcy5jZW50ZXJDb29yZHMgPSBbMCwgMF07XG4gICAgdGhpcy5yYW5kQ291bnQgPSAyMDA7XG4gICAgdGhpcy5wYXVzZUFuaW1hdGlvbiA9IGZhbHNlO1xuICAgIHRoaXMuYnVsbGV0cyA9IFtdO1xuICAgIHRoaXMuYnVsbGV0c0xvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFBvc2l0aW9uID0gdGhpcy5jdXJyZW50UG9zaXRpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGN1cnJlbnRQb3NpdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvb3JkaW5hdGVzOiB0aGlzLnNldENlbnRlckNvb3JkcygpLFxuICAgIH07XG4gIH1cblxuICBzZXRDZW50ZXJDb29yZHMgKCkge1xuICAgIGxldCB4ID0gdGhpcy5jb29yZGluYXRlc1swXSArXG4gICAgICAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLyAyKTtcbiAgICBsZXQgeSA9IHRoaXMuY29vcmRpbmF0ZXNbMV0gK1xuICAgICAgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAvIDIpO1xuXG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfVxuXG4gIGRlZmVhdGVkICgpIHtcbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG4gIH1cblxuICBwbGF5ZXJEZWZlYXRlZCgpIHtcbiAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgfVxuXG4gIHJlZHVjZUhlYWx0aCAoZGFtYWdlKSB7XG4gICAgdGhpcy5oZWFsdGggLT0gZGFtYWdlO1xuICB9XG5cbiAgcmVuZGVyKG5vdykge1xuICAgIHZhciBtb25zdGVyU3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgbW9uc3RlclNwcml0ZS5zcmMgPSB0aGlzLmN1cnJlbnRTcHJpdGUudXJsO1xuICAgIHRoaXMuY3R4LmRyYXdJbWFnZShtb25zdGVyU3ByaXRlLCB0aGlzLnNoaWZ0LCAwLFxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCxcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0sIHRoaXMuY29vcmRpbmF0ZXNbMV0sIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLFxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0KTtcbiAgICBpZiAoIXRoaXMucGF1c2VBbmltYXRpb24pIHtcblxuICAgICAgbGV0IGZwcyA9IHRoaXMuY3VycmVudFNwcml0ZS5mcHMgKiB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzWDtcbiAgICAgIGlmIChub3cgLSB0aGlzLmxhc3RVcGRhdGUgPiBmcHMpICB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcHMgPSBmcHM7XG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IG5vdztcbiAgICAgICAgdGhpcy5zaGlmdCA9IHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aDtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2ludHJvJykge1xuXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW3RoaXMuY29vcmRpbmF0ZXNbMF0gLSAxNSxcbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gKyAxNV07XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5pZGxlO1xuICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnZGVhZCcpIHtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDI7XG4gICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGg7XG4gICAgICAgICAgICAgIHRoaXMucGF1c2VBbmltYXRpb24gPSB0cnVlO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSArPSAxO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmREaXJlY3Rpb25WZWN0b3IgKCkge1xuICAgIGxldCB4ID0gdGhpcy5maW5hbFBsYXllclBvc1swXSAtIHRoaXMuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IHkgPSB0aGlzLmZpbmFsUGxheWVyUG9zWzFdIC0gdGhpcy5jb29yZGluYXRlc1sxXTtcbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZmluZE1hZ25pdHVkZSAoeCwgeSkge1xuICAgIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgcmV0dXJuIG1hZ25pdHVkZTtcbiAgfVxuICBub3JtYWxpemVWZWN0b3IgKHBsYXllckRpciwgbWFnbml0dWRlKSB7XG4gICAgcmV0dXJuIFsocGxheWVyRGlyWzBdL21hZ25pdHVkZSksIChwbGF5ZXJEaXJbMV0vbWFnbml0dWRlKV07XG4gIH1cblxuICBjaGFzZVBsYXllciAoZGVsdGEpIHtcbiAgICAgIGxldCBwbGF5ZXJEaXIgPSB0aGlzLmZpbmREaXJlY3Rpb25WZWN0b3IoKTtcbiAgICAgIGxldCBtYWduaXR1ZGUgPSB0aGlzLmZpbmRNYWduaXR1ZGUocGxheWVyRGlyWzBdLCBwbGF5ZXJEaXJbMV0pO1xuICAgICAgbGV0IG5vcm1hbGl6ZWQgPSB0aGlzLm5vcm1hbGl6ZVZlY3RvcihwbGF5ZXJEaXIsIG1hZ25pdHVkZSk7XG4gICAgICBsZXQgdmVsb2NpdHkgPSAyO1xuXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5jb29yZGluYXRlc1swXSArIChub3JtYWxpemVkWzBdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdID0gdGhpcy5jb29yZGluYXRlc1sxXSArIChub3JtYWxpemVkWzFdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG4gIH1cblxuICByYW5kb21Db3VudCgpIHtcbiAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAyMDApICsgMTgwO1xuICB9XG5cbiAgYnVsbGV0QXR0YWNrICgpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCA4KSB7XG4gICAgICBsZXQgYnVsbGV0Q291bnQgPSBpO1xuICAgICAgdGhpcy5idWxsZXRzLnB1c2gobmV3IEJ1bGxldCh0aGlzLmN1cnJlbnRQb3NpdGlvbigpLCB0aGlzLmNhbnZhc1csXG4gICAgICAgIHRoaXMuY2FudmFzSCwgdGhpcy5jdHgsIGJ1bGxldFNwcml0ZXMubW9uc3RlciwgYnVsbGV0Q291bnQpKTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgdGhpcy5idWxsZXRzTG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmJ1bGxldHMuZmlsdGVyKGJ1bGxldCA9PiBidWxsZXQuYWN0aXZlKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmJ1bGxldHMubGVuZ3RoKTtcbiAgfVxuXG4gIGhhbmRsZUlkbGUgKCkge1xuICAgIGlmICghdGhpcy5idWxsZXRzTG9hZGVkKSB7XG4gICAgICB0aGlzLmJ1bGxldEF0dGFjaygpO1xuICAgIH1cbiAgICBsZXQgc3BlZWQgPSAyMDA7XG4gICAgaWYgKHRoaXMuaGVhbHRoIDw9IHRoaXMubWF4SFAgKiAuNzUgJiYgdGhpcy5oZWFsdGggPiB0aGlzLm1heEhQICogLjUpIHtcbiAgICAgIHNwZWVkID0gMTgwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oZWFsdGggPD0gdGhpcy5tYXhIUCAqIC41ICYmIHRoaXMuaGVhbHRoID4gdGhpcy5tYXhIUCAqIC4yNSkge1xuICAgICAgc3BlZWQgPSAxNjA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogLjI1KSB7XG4gICAgICBzcGVlZCA9IDE1MDtcbiAgICB9XG4gICAgaWYgKHRoaXMuY291bnRlciA+PSBzcGVlZCAmJiAhdGhpcy5nYW1lT3Zlcikge1xuICAgICAgdGhpcy5idWxsZXRzTG9hZGVkID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLnRhcmdldFBvc1swXSA+PSB0aGlzLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5iaXRlX2U7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmJpdGVfdztcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQml0ZVdlc3QgKGRlbHRhKSB7XG4gICAgLy8gQklORFMgRklOQUwgUE9TSVRJT04gQkVGT1JFIEJJVEVcbiAgICBpZiAodGhpcy5maW5hbFBsYXllclBvcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmICh0aGlzLnRhcmdldFBvc1sxXSArIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+PSB0aGlzLmNhbnZhc0gpIHtcbiAgICAgICAgdGhpcy50YXJnZXRQb3NbMV0gPSB0aGlzLmNhbnZhc0ggLSB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQ7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gWzAgKyB0aGlzLnRhcmdldFBvc1swXSwgdGhpcy50YXJnZXRQb3NbMV1dO1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKXtcbiAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPD1cbiAgICAgICAgMCl7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF07XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jaGFzZVBsYXllcihkZWx0YSk7XG4gICAgfVxuICB9XG4gIC8vIENIQVJHRSBET0VTTlQgSElUIElGIElOIENFTlRFUiBPRiBCT1RUT00gT1IgdG9wXG4gIC8vIFNIT1VMRCBGSU5EIEEgV0FZIFRPIFNUSUxMIEdPIFRPV0FSRFMgVEFSR0VUIFggQlVUIEZVTExZXG4gIGhhbmRsZUJpdGVFYXN0IChkZWx0YSkge1xuICAgIGlmICh0aGlzLmZpbmFsUGxheWVyUG9zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0UG9zWzFdICsgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID49IHRoaXMuY2FudmFzSCkge1xuICAgICAgICB0aGlzLnRhcmdldFBvc1sxXSA9IHRoaXMuY2FudmFzSCAtIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodDtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbdGhpcy5jYW52YXNXIC1cbiAgICAgICAgKHRoaXMuY2FudmFzVyAtIHRoaXMudGFyZ2V0UG9zWzBdKSwgdGhpcy50YXJnZXRQb3NbMV1dO1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5pZGxlO1xuICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA+PVxuICAgICAgICB0aGlzLmNhbnZhc1cpe1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdIC1cbiAgICAgICAgICAodGhpcy5jYW52YXNXIC0gdGhpcy5maW5hbFBsYXllclBvc1swXSk7XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jaGFzZVBsYXllcihkZWx0YSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKHBsYXllclBvcywgZHQsIGRlbHRhKSB7XG4gICAgaWYgKCF0aGlzLmFsaXZlICYmICF0aGlzLmdhbWVPdmVyKSB7XG4gICAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmRlYWQ7XG4gICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgIC8vIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgIH1cbiAgICAvLyBUUkFDS1MgUE9TSVRJT04gT0YgUExBWUVSXG4gICAgaWYgKHRoaXMudGFyZ2V0UG9zLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50YXJnZXRQb3MgPSBPYmplY3QuYXNzaWduKFtdLCBwbGF5ZXJQb3MpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICAvLyBPRkZTRVQgRk9SIElETEUgQU5JTUFUSU9OXG4gICAgdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyIHx8IDA7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY3VycmVudFNwcml0ZS5uYW1lKSB7XG4gICAgICBjYXNlICdpZGxlJzpcbiAgICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgICB0aGlzLmhhbmRsZUlkbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiaXRlX3cnOlxuICAgICAgICB0aGlzLmhhbmRsZUJpdGVXZXN0KGRlbHRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiaXRlX2UnOlxuICAgICAgICB0aGlzLmhhbmRsZUJpdGVFYXN0KGRlbHRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9uc3RlcjtcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuLy8gSUYgQkxBTksgUkVOREVSIEJFRk9SRSBTUFJJVEUsIE5FRUQgVE8gUkVTRVQgU0hJRlQgVE8gMCEhXG5jb25zdCBtb25zdGVyU3ByaXRlU2hlZXQgPSB7XG4gIGRpcnQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faW50cm8ucG5nJyxcbiAgICBuYW1lOiAnaW50cm8nLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjYsXG4gICAgZnJhbWVXaWR0aDogMTUzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGludHJvOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG4gICAgbmFtZTogJ2ludHJvJyxcbiAgICBmcmFtZUhlaWdodDogMTY2LFxuICAgIGZyYW1lV2lkdGg6IDE1MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDE2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAxMDAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBpZGxlOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2lkbGUucG5nJyxcbiAgICBuYW1lOiAnaWRsZScsXG4gICAgZnJhbWVIZWlnaHQ6IDE3MyxcbiAgICBmcmFtZVdpZHRoOiAyMDMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxMixcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDEyNSxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGJpdGVfdzoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV93ZXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfdycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEuNSxcbiAgfSxcblxuICBiaXRlX2U6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2JpdGVfZWFzdC5wbmcnLFxuICAgIG5hbWU6ICdiaXRlX2UnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjMsXG4gICAgZnJhbWVXaWR0aDogMTkyLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNSxcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDIwMCxcbiAgICBmcHNYOiAxLjUsXG4gIH0sXG5cbiAgZGVhZDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9kZWFkLnBuZycsXG4gICAgbmFtZTogJ2RlYWQnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjMsXG4gICAgZnJhbWVXaWR0aDogMTU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNCxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEsXG4gIH1cbn07XG5cbmNvbnN0IG1vbnN0ZXJTcHJpdGVzID0ge1xuICBpbnRybzogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuaW50cm8pLFxuICBpZGxlOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5pZGxlKSxcbiAgZGVhZDogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuZGVhZCksXG4gIGJpdGVfdzogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuYml0ZV93KSxcbiAgYml0ZV9lOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5iaXRlX2UpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vbnN0ZXJTcHJpdGVzO1xuIiwibGV0IHBsYXllclNwcml0ZXMgPSByZXF1aXJlKCcuL3BsYXllcl9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IgKGN0eCwgY2FudmFzVywgY2FudmFzSCwgc3ByaXRlKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbMCwgMF07XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuZmFjaW5nUG9zID0gXCJyaWdodFwiO1xuICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgIHRoaXMuaGl0Qm94VyA9IDY5O1xuICAgIHRoaXMua2V5UHJlc3NlZCA9IHt9O1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuY2VudGVyQ29vcmRzID0gWzAsIDBdO1xuICB9XG5cbiAgc2V0Q2VudGVyQ29vcmRzICh4LCB5KSB7XG4gICAgbGV0IGNlbnRlclggPSB4ICsgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC8gMik7XG4gICAgbGV0IGNlbnRlclkgPSB5ICsgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAvIDIpO1xuXG4gICAgcmV0dXJuIFtjZW50ZXJYLCBjZW50ZXJZXTtcbiAgfVxuXG4gIHJlbmRlcihub3cpIHtcbiAgICBpZiAoIXRoaXMuZ2FtZU92ZXIpIHtcblxuICAgICAgdmFyIHBsYXllclNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgcGxheWVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZS51cmw7XG5cbiAgICAgIC8vIHBsYXllclNwcml0ZS5hZGRFdmVudExpc3RlbmVyXG4gICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UocGxheWVyU3ByaXRlLCB0aGlzLnNoaWZ0LCAwLFxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgLy8gZGVidWdnZXJcblxuICAgICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzICYmICF0aGlzLmdhbWVPdmVyKSAge1xuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcHMgPSBmcHM7XG4gICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aDtcblxuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2RlYWQnKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZWFkICgpIHtcbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG4gIH1cblxuICBzZXRIaXRCb3ggKGZhY2luZ1Bvcykge1xuICAgIHN3aXRjaCAoZmFjaW5nUG9zKSB7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA1NTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDY5O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA1NTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNTU7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDY5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDY5O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA1NTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFjaW5nUG9zO1xuICAgIH1cbiAgfVxuXG4gIGN1cnJlbnRQb3NpdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvb3JkaW5hdGVzOiB0aGlzLmNvb3JkaW5hdGVzLFxuICAgICAgcGxheWVyRmFjZTogdGhpcy5mYWNpbmdQb3NcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlKGtleSkge1xuICAgIGNvbnN0IHNwcml0ZUhlaWdodCA9IDEyNTtcbiAgICB0aGlzLnNldEhpdEJveCh0aGlzLmZhY2luZ1Bvcyk7XG4gICAgbGV0IHNwZWVkID0gMTI7XG4gICAgLy8ga2V5LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAodGhpcy5hbGl2ZSkge1xuICAgICAgaWYodGhpcy5rZXlQcmVzc2VkWzM3XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlTGVmdDtcbiAgICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcImxlZnRcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gNSkge3RoaXMuY29vcmRpbmF0ZXNbMF0tPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszOF0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZVVwO1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwidXBcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMTUpIHt0aGlzLmNvb3JkaW5hdGVzWzFdLT1zcGVlZDt9XG4gICAgICB9XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzldKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVSaWdodDtcbiAgICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcInJpZ2h0XCI7XG4gICAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIDw9ICh0aGlzLmNhbnZhc1cgLSB0aGlzLmhpdEJveEggLSAzMCkpXG4gICAgICAgIHt0aGlzLmNvb3JkaW5hdGVzWzBdKz1zcGVlZDt9XG4gICAgICB9XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbNDBdKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVEb3duO1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwiZG93blwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA8PSAodGhpcy5jYW52YXNIIC0gdGhpcy5oaXRCb3hIKSlcbiAgICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMV0rPXNwZWVkO31cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5kZWFkO1xuICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY29uc3QgcGxheWVyU3ByaXRlU2hlZXQgPSB7XG4gIGRlYWQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2Jsb29kX3NtYWxsLnBuZycsXG4gICAgbmFtZTogJ2RlYWQnLFxuICAgIGZyYW1lSGVpZ2h0OiAxMjQsXG4gICAgZnJhbWVXaWR0aDogKDc2MyAvIDYpLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMTUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgZW1wdHk6IHtcbiAgICB1cmw6ICcnLFxuICAgIG5hbWU6ICcnLFxuICAgIGZyYW1lSGVpZ2h0OiAwLFxuICAgIGZyYW1lV2lkdGg6IDAsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAwLFxuICAgIG9uY2U6IDAsXG4gICAgZnBzOiAwLFxuICAgIGZwc1g6IDAsXG4gIH0sXG5cbiAgYWxpdmVMZWZ0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfbGVmdC5wbmcnLFxuICAgIG5hbWU6ICdsZWZ0JyxcbiAgICBmcmFtZUhlaWdodDogNTUsXG4gICAgZnJhbWVXaWR0aDogOTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIC8vIGhpdEJveEhlaWdodE9mZnNldDpcbiAgICAvLyBoaXRCb3hXaWR0aE9mZnNldDpcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIGFsaXZlVXA6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV91cC5wbmcnLFxuICAgIG5hbWU6ICd1cCcsXG4gICAgZnJhbWVIZWlnaHQ6IDkzLFxuICAgIGZyYW1lV2lkdGg6IDU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIGFsaXZlUmlnaHQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZS5wbmcnLFxuICAgIG5hbWU6ICdyaWdodCcsXG4gICAgZnJhbWVIZWlnaHQ6IDU1LFxuICAgIGZyYW1lV2lkdGg6IDkzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIGFsaXZlRG93bjoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2Rvd24ucG5nJyxcbiAgICBuYW1lOiAnZG93bicsXG4gICAgZnJhbWVIZWlnaHQ6IDkzLFxuICAgIGZyYW1lV2lkdGg6IDU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG59O1xuXG5jb25zdCBwbGF5ZXJTcHJpdGVzID0ge1xuICBkZWFkOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmRlYWQpLFxuICBhbGl2ZUxlZnQ6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVMZWZ0KSxcbiAgYWxpdmVVcDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZVVwKSxcbiAgYWxpdmVSaWdodDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZVJpZ2h0KSxcbiAgYWxpdmVEb3duOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlRG93biksXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGxheWVyU3ByaXRlcztcbiIsImNvbnN0IGltYWdlcyA9IFtcbiAgJ2Fzc2V0cy9pbWFnZXMvYXJyb3dfa2V5cy5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9hcnJvd3NfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JnX2ZpbmFsLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfZWFzdC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9iaXRlX25vcnRoLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfc291dGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV93ZXN0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2Jsb29kX3NtYWxsLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2RpcnRfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2dhbWVfb3Zlcl9hZ2Fpbi5qcGcnLFxuICAnYXNzZXRzL2ltYWdlcy9kaXJ0X3BvcC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9naXRodWItb3JpZ2luYWwucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvZ2xvYmUucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbGlua2VkaW5fbG9nby5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X2xlZnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9uZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X253LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfcmlnaHQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NvdXRoLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc3cucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF92ZXJ0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9kb3duLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9sZWZ0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV91cC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGUucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvc3BhY2ViYXIucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvc3RhcnRfYnV0dG9uLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dvcm1fZGVhZC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy93b3JtX2lkbGUucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbWFnZXM7XG4iLCJjbGFzcyBTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybDtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5mcmFtZVdpZHRoID0gb3B0aW9ucy5mcmFtZVdpZHRoO1xuICAgIHRoaXMuZnJhbWVIZWlnaHQgPSBvcHRpb25zLmZyYW1lSGVpZ2h0O1xuICAgIHRoaXMuY3VycmVudEZyYW1lID0gb3B0aW9ucy5jdXJyZW50RnJhbWU7XG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IG9wdGlvbnMudG90YWxGcmFtZXM7XG4gICAgdGhpcy5vbmNlID0gb3B0aW9ucy5vbmNlO1xuICAgIHRoaXMuZnBzID0gb3B0aW9ucy5mcHM7XG4gICAgdGhpcy5mcHNYID0gb3B0aW9ucy5mcHNYO1xuICAgIHRoaXMuZGFtYWdlID0gb3B0aW9ucy5kYW1hZ2U7XG4gIH1cbn1cbi8vIHVybCwgbmFtZSwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2VcblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7XG4iLCIvLyBIT1cgVE8gQlVJTEQgUEhZU0lDUyBGT1IgQSBXRUFQT04/XG4vLyBCVUxMRVQgU1BFRUQsIFNQUkVBRCwgREFNQUdFP1xuLy8gRE8gUEhZU0lDUyBORUVEIFRPIEJFIEEgU0VQQVJBVEUgQ0xBU1M/IENBTiBJIElNUE9SVCBBIExJQlJBUlkgVE8gSEFORExFIFRIQVQgTE9HSUM/XG5cbmNsYXNzIFdlYXBvbiB7XG4gIGNvbnN0cnVjdG9yIChhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5yYXRlID0gYXR0cmlidXRlcy5yYXRlO1xuICAgIHRoaXMubW9kZWwgPSBhdHRyaWJ1dGVzLm1vZGVsO1xuICAgIHRoaXMucG93ZXIgPSBhdHRyaWJ1dGVzLnBvd2VyO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXZWFwb247XG4iXX0=
