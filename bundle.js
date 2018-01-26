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
    let music = document.getElementById('music');
    let introMusic = document.getElementById('cave_theme');
    let timer = Date.now();
    // set up date now
    // convert to seconds
    // end when gameOver
    // have timer div set up and append to the id of the div tag

    start.addEventListener('click', function(e) {
        start.className = 'start_button_hide';
        gameStart = true;
        introMusic.pause();
        music.volume = .7;
        music.play();
    });

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

    let gameOver = document.getElementById('game_over');
    let timeout = setTimeout(() => {
      gameOver.style.display = 'block';
    }, 2000);

    let audio = document.getElementById('audio_hover');
    audio.volume = 0.4;
    gameOver.addEventListener('mouseover', function(evt) {
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
          player.dead();
          monster.playerDefeated();
          gameOverPrompt();
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
    bulletSound.volume = 0.3;
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
    if (gameStart) {
      monster.render(now);
    }
    player.render(now);
    bullets.forEach(bullet => bullet.render());
    monsterBullets.forEach(bullet => bullet.render());
    if (monster.currentSprite.name === 'intro' &&
    gameStart && monster.currentSprite.currentFrame === 1) {
      let intro = document.getElementById('intro_monster');
      intro.volume = 0.9;
      intro.play();
    } else if (monster.currentSprite.name !== 'intro' && gameStart &&
    monster.alive) {
      let monBG = document.getElementById('monster_bg');
      monBG.volume = .6;
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

      if (this.currentSprite.currentFrame === 0) {
        let charge = document.getElementById('charge');
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
      spit.volume = 0.5;
      this.bulletAttack();
      spit.play();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJvYXJkLmpzIiwiYnVsbGV0LmpzIiwiYnVsbGV0X3Nwcml0ZXMuanMiLCJtYWluLmpzIiwibW9uc3Rlci5qcyIsIm1vbnN0ZXJfc3ByaXRlcy5qcyIsInBsYXllci5qcyIsInBsYXllcl9zcHJpdGVzLmpzIiwicmVzb3VyY2VzLmpzIiwic3ByaXRlLmpzIiwid2VhcG9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gZHJvcCBldmVudCBsaXN0ZW5lciBoZXJlXG4vLyBTSE9VTEQgU0VUIElUIFVQIEZPUiBGVVJUSEVSIE1BUFNcbi8vIEJPQVJEIElOU1RBTkNFIENBTiBCRSBJTlZPS0VEIFVQT04gR0FNRSBTVEFSVCBBTkQgUEFTU0VEIElOIEEgU1BFQ0lGSUMgQm9hcmRcbi8vIEhPVyBETyBJIENSRUFURSBUSEUgQk9BUkQgQU5EIFBBU1MgSVQgSU4/XG5cbi8vIGNvbnN0IGJvYXJkID0ge1xuLy8gICBiZ0ltYWdlOiBuZXcgSW1hZ2UoKVxuLy9cbi8vIH1cbmNsYXNzIEJvYXJkIHtcbiAgY29uc3RydWN0b3IgKGN0eCkge1xuICAgIC8vIHRoaXMuYmFja2dyb3VuZCA9IG5ldztcbiAgICAvLyB0aGlzLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kaW1hZ2U7XG4gICAgLy8gdGhpcy5ib2FyZCA9IHBsYXRmb3JtcztcbiAgfVxufVxuXG4vLyBjYW4gYWxzbyBzZXQgdGhpcyBhcyBhIHNpbmdsZSBmdW5jdGlvblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvYXJkO1xuIiwiY2xhc3MgQnVsbGV0IHtcbiAgY29uc3RydWN0b3IocGxheWVyQXR0ciwgY2FudmFzVywgY2FudmFzSCwgY3R4LCBzcHJpdGUsIGJ1bGxldENvdW50KSB7XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnBsYXllclBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllckF0dHIuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMucGxheWVyRmFjZSA9IHBsYXllckF0dHIucGxheWVyRmFjZTtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gdGhpcy5zZXRDb29yZGluYXRlcyh0aGlzLnBsYXllclBvcyk7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuYnVsbGV0Q291bnRlciA9IDA7XG4gICAgdGhpcy5idWxsZXRDb3VudCA9IGJ1bGxldENvdW50O1xuXG4gICAgLy8gQkFORCBBSUQgRk9SIE1PTlNURVIgQlVMTEVUU1xuICAgIC8vIFNIT1VMRCBBTFNPIFdPUksgRk9SIFBMQVlFUiBCVUxMRVRTIFNISUZUSU5HXG4gICAgLy8gQUNUVUFMTFkgV09SS1MgUFJFVFRZIE5JQ0VMWSwgTk9UIFNVUkUgSUYgQkVUVEVSIFdBWSBUT1xuICAgIC8vIERPIFRISVMgQUNUSU9OIFNJTkNFIE9OTFkgVVNJTkcgMSBTUFJJVEVcbiAgICB0aGlzLmN1cnJlbnRVUkwgPSBcIlwiO1xuXG5cbiAgICB0aGlzLnNldENvb3JkaW5hdGVzID0gdGhpcy5zZXRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2V0SGl0Qm94ID0gdGhpcy5zZXRIaXRCb3guYmluZCh0aGlzKTtcbiAgfVxuICAvLyBCVUxMRVRTIFdJTEwgQ0hBTkdFIFNQUklURVMgV0hFTiBBTk9USEVSIFNIT1QgSVMgVEFLRU5cbiAgLy8gTkVFRCBUTyBLRUVQIFRIRSBJTUFHRSBXSEVOIFNIT1QgSVMgVEFLRU5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgYnVsbGV0U3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgYnVsbGV0U3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYnVsbGV0U3ByaXRlLCB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdKTtcbiAgfVxuXG4gIHNldEhpdEJveCAocGxheWVyRmFjZSkge1xuICAgIGxldCBkaW1lbnNpb25zQ29weSA9IE9iamVjdC5hc3NpZ24oW10sXG4gICAgICBbdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodF0pO1xuICAgIHN3aXRjaCAocGxheWVyRmFjZSkge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyRmFjZTtcbiAgICB9XG4gIH1cblxuICBzZXRDb29yZGluYXRlcyAocGxheWVyUG9zKSB7XG4gICAgbGV0IHggPSBwbGF5ZXJQb3NbMF07XG4gICAgbGV0IHkgPSBwbGF5ZXJQb3NbMV07XG4gICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAncmlmbGUnKSB7XG4gICAgICB0aGlzLnNldEhpdEJveCh0aGlzLnBsYXllckZhY2UpO1xuICAgICAgc3dpdGNoICh0aGlzLnBsYXllckZhY2UpIHtcbiAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgeCArPSA0O1xuICAgICAgICB5ICs9IDExO1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgeCArPSA0MDtcbiAgICAgICAgeSArPSA1O1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgeCArPSA3NTtcbiAgICAgICAgeSArPSA0MDtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgeCArPSAxMTtcbiAgICAgICAgeSArPSA4MDtcbiAgICAgICAgcmV0dXJuW3gsIHldO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyUG9zO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGxheWVyUG9zO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkdCwgb3duZXIpIHtcbiAgICBsZXQgYnVsbGV0U3BlZWQ7XG4gICAgaWYgKG93bmVyID09PSAncGxheWVyJykge1xuICAgICAgYnVsbGV0U3BlZWQgPSA4MDA7XG4gICAgICBzd2l0Y2ggKHRoaXMucGxheWVyRmFjZSkge1xuICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1bGxldFNwZWVkID0gNTAwO1xuICAgICAgLy8gZGVidWdnZXJcbiAgICAgIHN3aXRjaCAodGhpcy5idWxsZXRDb3VudCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9udy5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gLT0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMCAmJlxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbGVmdC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3N3LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdICs9KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwICYmXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NvdXRoLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gdGhpcy5jYW52YXNIO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zZS5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PVxuICAgICAgICAgIHRoaXMuY2FudmFzSCAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfcmlnaHQucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmNhbnZhc1c7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X25lLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSArPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSAtPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDAgJiZcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0tPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdID49IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCdWxsZXQ7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcbi8vIElGIEJMQU5LIFJFTkRFUiBCRUZPUkUgU1BSSVRFLCBORUVEIFRPIFJFU0VUIFNISUZUIFRPIDAhIVxuY29uc3QgYnVsbGV0U3ByaXRlU2hlZXQgPSB7XG4gIHJpZmxlOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnLFxuICAgIG5hbWU6ICdyaWZsZScsXG4gICAgZnJhbWVIZWlnaHQ6IDYsXG4gICAgZnJhbWVXaWR0aDogMTQsXG4gICAgZGFtYWdlOiAxMCxcbiAgfSxcblxuICBtb25zdGVyOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3ZlcnQucG5nJyxcbiAgICBuYW1lOiAnbW9uc3RlcicsXG4gICAgZnJhbWVIZWlnaHQ6IDMyLFxuICAgIGZyYW1lV2lkdGg6IDksXG4gICAgZGFtYWdlOiAxMCxcbiAgfSxcbn07XG5cbmNvbnN0IGJ1bGxldFNwcml0ZXMgPSB7XG4gIHJpZmxlOiBuZXcgU3ByaXRlKGJ1bGxldFNwcml0ZVNoZWV0LnJpZmxlKSxcbiAgbW9uc3RlcjogbmV3IFNwcml0ZShidWxsZXRTcHJpdGVTaGVldC5tb25zdGVyKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBidWxsZXRTcHJpdGVzO1xuIiwibGV0IEJvYXJkID0gcmVxdWlyZSgnLi9ib2FyZCcpO1xubGV0IG1vbnN0ZXJTcHJpdGVzID0gcmVxdWlyZSgnLi9tb25zdGVyX3Nwcml0ZXMnKTtcbmxldCBwbGF5ZXJTcHJpdGVzID0gcmVxdWlyZSgnLi9wbGF5ZXJfc3ByaXRlcycpO1xubGV0IGJ1bGxldFNwcml0ZXMgPSByZXF1aXJlKCcuL2J1bGxldF9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcbmxldCBNb25zdGVyID0gcmVxdWlyZSgnLi9tb25zdGVyJyk7XG5sZXQgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcbmxldCBXZWFwb25zID0gcmVxdWlyZSgnLi93ZWFwb25zJyk7XG5sZXQgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcbmxldCBwcmVsb2FkSW1hZ2VzID0gcmVxdWlyZSgnLi9yZXNvdXJjZXMnKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGxldCBzdGFydEJ1dHRvbiA9ICdhc3NldHMvaW1hZ2VzL3N0YXJ0X2J1dHRvbi5wbmcnO1xuICBsZXQgZ2FtZU92ZXJTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9nYW1lX292ZXIucG5nJztcbiAgbGV0IG15UmVxO1xuICBwcmVsb2FkQXNzZXRzKCk7XG5cbiAgZnVuY3Rpb24gc3RhcnRHYW1lICgpIHtcbiAgICBsZXQgc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKTtcbiAgICBsZXQgbXVzaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVzaWMnKTtcbiAgICBsZXQgaW50cm9NdXNpYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXZlX3RoZW1lJyk7XG4gICAgbGV0IHRpbWVyID0gRGF0ZS5ub3coKTtcbiAgICAvLyBzZXQgdXAgZGF0ZSBub3dcbiAgICAvLyBjb252ZXJ0IHRvIHNlY29uZHNcbiAgICAvLyBlbmQgd2hlbiBnYW1lT3ZlclxuICAgIC8vIGhhdmUgdGltZXIgZGl2IHNldCB1cCBhbmQgYXBwZW5kIHRvIHRoZSBpZCBvZiB0aGUgZGl2IHRhZ1xuXG4gICAgc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHN0YXJ0LmNsYXNzTmFtZSA9ICdzdGFydF9idXR0b25faGlkZSc7XG4gICAgICAgIGdhbWVTdGFydCA9IHRydWU7XG4gICAgICAgIGludHJvTXVzaWMucGF1c2UoKTtcbiAgICAgICAgbXVzaWMudm9sdW1lID0gLjc7XG4gICAgICAgIG11c2ljLnBsYXkoKTtcbiAgICB9KTtcblxuICAgIGxldCBhdWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdWRpb19ob3ZlcicpO1xuICAgIGF1ZGlvLnZvbHVtZSA9IDAuNDtcbiAgICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbihldnQpIHtcbiAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWxvYWRBc3NldHMgKCkge1xuICAgIHByZWxvYWRJbWFnZXMuZm9yRWFjaChpbWFnZSA9PiB7XG4gICAgICBsZXQgbG9hZGVkSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGxvYWRlZEltYWdlLnNyYyA9IGltYWdlO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXJQcm9tcHQgKCkge1xuXG4gICAgbGV0IGdhbWVPdmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWVfb3ZlcicpO1xuICAgIGxldCB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBnYW1lT3Zlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9LCAyMDAwKTtcblxuICAgIGxldCBhdWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdWRpb19ob3ZlcicpO1xuICAgIGF1ZGlvLnZvbHVtZSA9IDAuNDtcbiAgICBnYW1lT3Zlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbihldnQpIHtcbiAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICB9KTtcblxuICAgIGdhbWVPdmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmRlYWQuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmlkbGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHBsYXllci5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICBtb25zdGVyU3ByaXRlcy5pbnRyby5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgcmVzdGFydEdhbWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3RhcnRHYW1lICgpIHtcbiAgICBsZXQgZ2FtZU92ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZV9vdmVyJyk7XG4gICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIG1vbnN0ZXIgPSBuZXcgTW9uc3RlcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvKTtcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgICAgcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0KTtcbiAgICBtb25zdGVyQnVsbGV0cyA9IG1vbnN0ZXIuYnVsbGV0cztcbiAgfVxuXG4gIGxldCBtb25zdGVyID0gbmV3IE1vbnN0ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgbW9uc3RlclNwcml0ZXMuaW50cm8pO1xuICBsZXQgZ2FtZVN0YXJ0ID0gZmFsc2U7XG4gIGxldCBidWxsZXRzID0gW107XG4gIGxldCBtb25zdGVyQnVsbGV0cyA9IG1vbnN0ZXIuYnVsbGV0cztcbiAgbGV0IHBsYXllciA9IG5ldyBQbGF5ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0KTtcbiAgbGV0IGxhc3RUaW1lID0gRGF0ZS5ub3coKTtcbiAgbGV0IGtleTtcbiAgbGV0IGFsbG93RmlyZSA9IHRydWU7XG5cbiAgZnVuY3Rpb24gY29sbGlzaW9uRGV0ZWN0ZWQgKCkge1xuICAgIGxldCBjb2xsaWRlQnVsbGV0cyA9IE9iamVjdC5hc3NpZ24oW10sIGJ1bGxldHMpO1xuICAgIGxldCBidWxsZXRYO1xuICAgIGxldCBidWxsZXRZO1xuICAgIGxldCBwbGF5ZXJYID0gcGxheWVyLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCBwbGF5ZXJZID0gcGxheWVyLmNvb3JkaW5hdGVzWzFdO1xuICAgIGxldCBtb25zdGVyWCA9IG1vbnN0ZXIuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IG1vbnN0ZXJZID0gbW9uc3Rlci5jb29yZGluYXRlc1sxXTtcbiAgICBsZXQgbUhCb2Zmc2V0ID0gNDA7XG5cbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IHtcbiAgICAgICAgYnVsbGV0WCA9IGJ1bGxldC5jb29yZGluYXRlc1swXTtcbiAgICAgICAgYnVsbGV0WSA9IGJ1bGxldC5jb29yZGluYXRlc1sxXTtcbiAgICAgICAgaWYgKGJ1bGxldFggPCBtb25zdGVyWCArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC0gbUhCb2Zmc2V0ICYmXG4gICAgICAgICAgYnVsbGV0WCArIGJ1bGxldC5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPiBtb25zdGVyWCArIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFkgPCBtb25zdGVyWSArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAtIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFkgKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+IG1vbnN0ZXJZICsgbUhCb2Zmc2V0KSB7XG4gICAgICAgICAgICBtb25zdGVyLnJlZHVjZUhlYWx0aChidWxsZXQuY3VycmVudFNwcml0ZS5kYW1hZ2UpO1xuICAgICAgICAgICAgYnVsbGV0cy5zcGxpY2UoMCwgMSk7XG5cbiAgICAgICAgICAgIGlmIChtb25zdGVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICAgIG1vbnN0ZXIuZGVmZWF0ZWQoKTtcbiAgICAgICAgICAgICAgZ2FtZU92ZXJQcm9tcHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgbW9uc3RlckJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xuICAgICAgYnVsbGV0WCA9IGJ1bGxldC5jb29yZGluYXRlc1swXTtcbiAgICAgIGJ1bGxldFkgPSBidWxsZXQuY29vcmRpbmF0ZXNbMV07XG4gICAgICBpZiAoYnVsbGV0WCA8IHBsYXllclggKyBwbGF5ZXIuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoICYmXG4gICAgICAgIGJ1bGxldFggKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID4gcGxheWVyWCAmJlxuICAgICAgICBidWxsZXRZIDwgcGxheWVyWSArIHBsYXllci5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ICYmXG4gICAgICAgIGJ1bGxldFkgKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+IHBsYXllclkpIHtcbiAgICAgICAgICBwbGF5ZXIuZGVhZCgpO1xuICAgICAgICAgIG1vbnN0ZXIucGxheWVyRGVmZWF0ZWQoKTtcbiAgICAgICAgICBnYW1lT3ZlclByb21wdCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBsYXllclggPCBtb25zdGVyWCArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC0gbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclggKyBwbGF5ZXIuaGl0Qm94VyA+IG1vbnN0ZXJYICsgbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclkgPCBtb25zdGVyWSArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAtIG1IQm9mZnNldCYmXG4gICAgICBwbGF5ZXJZICsgcGxheWVyLmhpdEJveEggPiBtb25zdGVyWSArIG1IQm9mZnNldCAmJlxuICAgICAgZ2FtZVN0YXJ0ICYmIG1vbnN0ZXIuYWxpdmUpIHtcbiAgICAgICAgcGxheWVyLmRlYWQoKTtcbiAgICAgICAgbW9uc3Rlci5wbGF5ZXJEZWZlYXRlZCgpO1xuICAgICAgICBnYW1lT3ZlclByb21wdCgpO1xuICAgICAgfVxuICB9XG5cbiAgbGV0IGxhc3RCdWxsZXQ7XG4gIGZ1bmN0aW9uIEZpcmUgKCkge1xuICAgIGFsbG93RmlyZSA9IGZhbHNlO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgYWxsb3dGaXJlID0gdHJ1ZTtcbiAgICB9LCAyMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvb3QgKHBsYXllclBvcykge1xuICAgICAgYnVsbGV0cy5wdXNoKG5ldyBCdWxsZXQocGxheWVyUG9zLCBjYW52YXMud2lkdGgsXG4gICAgICAgIGNhbnZhcy5oZWlnaHQsIGN0eCwgYnVsbGV0U3ByaXRlcy5yaWZsZSkpO1xuXG4gICAgICBidWxsZXRzID0gYnVsbGV0cy5maWx0ZXIoYnVsbGV0ID0+IGJ1bGxldC5hY3RpdmUpO1xuXG4gICAgRmlyZSgpO1xuICAgIGxldCBidWxsZXRTb3VuZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidWxsZXQnKTtcbiAgICBidWxsZXRTb3VuZC52b2x1bWUgPSAwLjM7XG4gICAgYnVsbGV0U291bmQubG9hZCgpO1xuICAgIGJ1bGxldFNvdW5kLnBsYXkoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSAoa2V5LCBkdCwgZGVsdGEpIHtcbiAgICBwbGF5ZXIudXBkYXRlKGtleSk7XG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgbW9uc3Rlci51cGRhdGUocGxheWVyLmNvb3JkaW5hdGVzLCBkdCwgZGVsdGEpO1xuICAgIH1cbiAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC51cGRhdGUoZHQsICdwbGF5ZXInKSk7XG4gICAgbW9uc3RlckJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnVwZGF0ZShkdCwgJ21vbnN0ZXInKSk7XG4gIH1cblxuICBjb25zdCBjbGVhciA9ICgpID0+ICB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlbmRlciAobm93KSB7XG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgbW9uc3Rlci5yZW5kZXIobm93KTtcbiAgICB9XG4gICAgcGxheWVyLnJlbmRlcihub3cpO1xuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnJlbmRlcigpKTtcbiAgICBtb25zdGVyQnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQucmVuZGVyKCkpO1xuICAgIGlmIChtb25zdGVyLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2ludHJvJyAmJlxuICAgIGdhbWVTdGFydCAmJiBtb25zdGVyLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PSAxKSB7XG4gICAgICBsZXQgaW50cm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW50cm9fbW9uc3RlcicpO1xuICAgICAgaW50cm8udm9sdW1lID0gMC45O1xuICAgICAgaW50cm8ucGxheSgpO1xuICAgIH0gZWxzZSBpZiAobW9uc3Rlci5jdXJyZW50U3ByaXRlLm5hbWUgIT09ICdpbnRybycgJiYgZ2FtZVN0YXJ0ICYmXG4gICAgbW9uc3Rlci5hbGl2ZSkge1xuICAgICAgbGV0IG1vbkJHID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vbnN0ZXJfYmcnKTtcbiAgICAgIG1vbkJHLnZvbHVtZSA9IC42O1xuICAgICAgbW9uQkcucGxheWJhY2tSYXRlID0gMy41O1xuICAgICAgbW9uQkcucGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBsZXQga2V5cyA9IFszMiwgMzcsIDM4LCAzOSwgNDBdO1xuICAgIGtleSA9IGV2dC53aGljaDtcbiAgICBpZihrZXlzLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBwbGF5ZXIua2V5UHJlc3NlZFtrZXldID0gdHJ1ZTtcbiAgICBpZiAoa2V5ID09PSAzMiAmJiBwbGF5ZXIuYWxpdmUgJiYgYWxsb3dGaXJlKSB7XG4gICAgICBzaG9vdChwbGF5ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xuICAgIH1cbiAgfTtcblxuICBkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGxheWVyLmtleVByZXNzZWRbZXZ0LndoaWNoXSA9IGZhbHNlO1xuICAgIGtleSA9IG51bGw7XG4gIH07XG4gIC8vIGxldCBkZWx0YTtcbiAgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBsZXQgZGVsdGEgPSBub3cgLSBsYXN0VGltZTtcbiAgICBsZXQgZHQgPSAoZGVsdGEpIC8gNTAwLjA7XG4gICAgbXlSZXEgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG1haW4gKTtcbiAgICBjb2xsaXNpb25EZXRlY3RlZCgpO1xuICAgIHVwZGF0ZShrZXksIGR0LCBkZWx0YSk7XG4gICAgY2xlYXIoKTtcbiAgICByZW5kZXIobm93KTtcbiAgICBsYXN0VGltZSA9IG5vdztcbiAgfVxuICBteVJlcSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSggbWFpbiApO1xuICBzdGFydEdhbWUoKTtcbn07XG4iLCJsZXQgbW9uc3RlclNwcml0ZXMgPSByZXF1aXJlKCcuL21vbnN0ZXJfc3ByaXRlcycpO1xubGV0IGJ1bGxldFNwcml0ZXMgPSByZXF1aXJlKCcuL2J1bGxldF9zcHJpdGVzJyk7XG5sZXQgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jbGFzcyBNb25zdGVyIHtcbiAgY29uc3RydWN0b3IgKGN0eCwgY2FudmFzVywgY2FudmFzSCwgc3ByaXRlKSB7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbNzAwLCAzMDBdO1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHNwcml0ZTtcbiAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICB0aGlzLm1heEhQID0gMzAwO1xuICAgIHRoaXMuaGVhbHRoID0gMzAwO1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuXG4gICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB0aGlzLmludGVydmFsID0gbnVsbDtcbiAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgICB0aGlzLmNlbnRlckNvb3JkcyA9IFswLCAwXTtcbiAgICB0aGlzLnJhbmRDb3VudCA9IDIwMDtcbiAgICB0aGlzLnBhdXNlQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5idWxsZXRzID0gW107XG4gICAgdGhpcy5idWxsZXRzTG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50UG9zaXRpb24gPSB0aGlzLmN1cnJlbnRQb3NpdGlvbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY3VycmVudFBvc2l0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuc2V0Q2VudGVyQ29vcmRzKCksXG4gICAgfTtcbiAgfVxuXG4gIHNldENlbnRlckNvb3JkcyAoKSB7XG4gICAgbGV0IHggPSB0aGlzLmNvb3JkaW5hdGVzWzBdICtcbiAgICAgICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAvIDIpO1xuICAgIGxldCB5ID0gdGhpcy5jb29yZGluYXRlc1sxXSArXG4gICAgICAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC8gMik7XG5cbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZGVmZWF0ZWQgKCkge1xuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHBsYXllckRlZmVhdGVkKCkge1xuICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICB9XG5cbiAgcmVkdWNlSGVhbHRoIChkYW1hZ2UpIHtcbiAgICB0aGlzLmhlYWx0aCAtPSBkYW1hZ2U7XG4gIH1cblxuICByZW5kZXIobm93KSB7XG4gICAgdmFyIG1vbnN0ZXJTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBtb25zdGVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZS51cmw7XG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKG1vbnN0ZXJTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgdGhpcy5jb29yZGluYXRlc1swXSwgdGhpcy5jb29yZGluYXRlc1sxXSwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuICAgIGlmICghdGhpcy5wYXVzZUFuaW1hdGlvbikge1xuXG4gICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgaWYgKG5vdyAtIHRoaXMubGFzdFVwZGF0ZSA+IGZwcykgIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyAmJlxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnaW50cm8nKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbdGhpcy5jb29yZGluYXRlc1swXSAtIDE1LFxuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSArIDE1XTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcblxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyAmJlxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdkZWFkJykge1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMjtcbiAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKlxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aDtcbiAgICAgICAgICAgICAgdGhpcy5wYXVzZUFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmluZERpcmVjdGlvblZlY3RvciAoKSB7XG4gICAgbGV0IHggPSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdIC0gdGhpcy5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgeSA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMV0gLSB0aGlzLmNvb3JkaW5hdGVzWzFdO1xuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBmaW5kTWFnbml0dWRlICh4LCB5KSB7XG4gICAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICByZXR1cm4gbWFnbml0dWRlO1xuICB9XG4gIG5vcm1hbGl6ZVZlY3RvciAocGxheWVyRGlyLCBtYWduaXR1ZGUpIHtcbiAgICByZXR1cm4gWyhwbGF5ZXJEaXJbMF0vbWFnbml0dWRlKSwgKHBsYXllckRpclsxXS9tYWduaXR1ZGUpXTtcbiAgfVxuXG4gIGNoYXNlUGxheWVyIChkZWx0YSkge1xuICAgICAgbGV0IHBsYXllckRpciA9IHRoaXMuZmluZERpcmVjdGlvblZlY3RvcigpO1xuICAgICAgbGV0IG1hZ25pdHVkZSA9IHRoaXMuZmluZE1hZ25pdHVkZShwbGF5ZXJEaXJbMF0sIHBsYXllckRpclsxXSk7XG4gICAgICBsZXQgbm9ybWFsaXplZCA9IHRoaXMubm9ybWFsaXplVmVjdG9yKHBsYXllckRpciwgbWFnbml0dWRlKTtcbiAgICAgIGxldCB2ZWxvY2l0eSA9IDI7XG5cbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmNvb3JkaW5hdGVzWzBdICsgKG5vcm1hbGl6ZWRbMF0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPSB0aGlzLmNvb3JkaW5hdGVzWzFdICsgKG5vcm1hbGl6ZWRbMV0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09IDApIHtcbiAgICAgICAgbGV0IGNoYXJnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFyZ2UnKTtcbiAgICAgICAgY2hhcmdlLnBsYXkoKTtcbiAgICAgIH1cbiAgfVxuXG4gIHJhbmRvbUNvdW50KCkge1xuICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSAqIDIwMCkgKyAxODA7XG4gIH1cblxuICBidWxsZXRBdHRhY2sgKCkge1xuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IDgpIHtcbiAgICAgIGxldCBidWxsZXRDb3VudCA9IGk7XG4gICAgICB0aGlzLmJ1bGxldHMucHVzaChuZXcgQnVsbGV0KHRoaXMuY3VycmVudFBvc2l0aW9uKCksIHRoaXMuY2FudmFzVyxcbiAgICAgICAgdGhpcy5jYW52YXNILCB0aGlzLmN0eCwgYnVsbGV0U3ByaXRlcy5tb25zdGVyLCBidWxsZXRDb3VudCkpO1xuICAgICAgaSsrO1xuICAgIH1cbiAgICB0aGlzLmJ1bGxldHNMb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuYnVsbGV0cy5maWx0ZXIoYnVsbGV0ID0+IGJ1bGxldC5hY3RpdmUpO1xuICB9XG5cbiAgaGFuZGxlSWRsZSAoKSB7XG4gICAgaWYgKCF0aGlzLmJ1bGxldHNMb2FkZWQpIHtcbiAgICAgIGxldCBzcGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaXQnKTtcbiAgICAgIHNwaXQudm9sdW1lID0gMC41O1xuICAgICAgdGhpcy5idWxsZXRBdHRhY2soKTtcbiAgICAgIHNwaXQucGxheSgpO1xuICAgIH1cbiAgICBsZXQgc3BlZWQgPSAyMDA7XG4gICAgaWYgKHRoaXMuaGVhbHRoIDw9IHRoaXMubWF4SFAgKiAuNzUgJiYgdGhpcy5oZWFsdGggPiB0aGlzLm1heEhQICogLjUpIHtcbiAgICAgIHNwZWVkID0gMTgwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oZWFsdGggPD0gdGhpcy5tYXhIUCAqIC41ICYmIHRoaXMuaGVhbHRoID4gdGhpcy5tYXhIUCAqIC4yNSkge1xuICAgICAgc3BlZWQgPSAxNjA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogLjI1KSB7XG4gICAgICBzcGVlZCA9IDE1MDtcbiAgICB9XG4gICAgaWYgKHRoaXMuY291bnRlciA+PSBzcGVlZCAmJiAhdGhpcy5nYW1lT3Zlcikge1xuICAgICAgdGhpcy5idWxsZXRzTG9hZGVkID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLnRhcmdldFBvc1swXSA+PSB0aGlzLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5iaXRlX2U7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmJpdGVfdztcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQml0ZVdlc3QgKGRlbHRhKSB7XG4gICAgLy8gQklORFMgRklOQUwgUE9TSVRJT04gQkVGT1JFIEJJVEVcbiAgICBpZiAodGhpcy5maW5hbFBsYXllclBvcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmICh0aGlzLnRhcmdldFBvc1sxXSArIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA+PSB0aGlzLmNhbnZhc0gpIHtcbiAgICAgICAgdGhpcy50YXJnZXRQb3NbMV0gPSB0aGlzLmNhbnZhc0ggLSB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQ7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gWzAgKyB0aGlzLnRhcmdldFBvc1swXSwgdGhpcy50YXJnZXRQb3NbMV1dO1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKXtcbiAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPD1cbiAgICAgICAgMCl7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF07XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jaGFzZVBsYXllcihkZWx0YSk7XG4gICAgfVxuICB9XG4gIC8vIENIQVJHRSBET0VTTlQgSElUIElGIElOIENFTlRFUiBPRiBCT1RUT00gT1IgdG9wXG4gIC8vIFNIT1VMRCBGSU5EIEEgV0FZIFRPIFNUSUxMIEdPIFRPV0FSRFMgVEFSR0VUIFggQlVUIEZVTExZXG4gIGhhbmRsZUJpdGVFYXN0IChkZWx0YSkge1xuICAgIGlmICh0aGlzLmZpbmFsUGxheWVyUG9zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0UG9zWzFdICsgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID49IHRoaXMuY2FudmFzSCkge1xuICAgICAgICB0aGlzLnRhcmdldFBvc1sxXSA9IHRoaXMuY2FudmFzSCAtIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodDtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbdGhpcy5jYW52YXNXIC1cbiAgICAgICAgKHRoaXMuY2FudmFzVyAtIHRoaXMudGFyZ2V0UG9zWzBdKSwgdGhpcy50YXJnZXRQb3NbMV1dO1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5pZGxlO1xuICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA+PVxuICAgICAgICB0aGlzLmNhbnZhc1cpe1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdIC1cbiAgICAgICAgICAodGhpcy5jYW52YXNXIC0gdGhpcy5maW5hbFBsYXllclBvc1swXSk7XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jaGFzZVBsYXllcihkZWx0YSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKHBsYXllclBvcywgZHQsIGRlbHRhKSB7XG4gICAgaWYgKCF0aGlzLmFsaXZlICYmICF0aGlzLmdhbWVPdmVyKSB7XG4gICAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmRlYWQ7XG4gICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgIC8vIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgIH1cbiAgICAvLyBUUkFDS1MgUE9TSVRJT04gT0YgUExBWUVSXG4gICAgaWYgKHRoaXMudGFyZ2V0UG9zLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50YXJnZXRQb3MgPSBPYmplY3QuYXNzaWduKFtdLCBwbGF5ZXJQb3MpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICAvLyBPRkZTRVQgRk9SIElETEUgQU5JTUFUSU9OXG4gICAgdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyIHx8IDA7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY3VycmVudFNwcml0ZS5uYW1lKSB7XG4gICAgICBjYXNlICdpZGxlJzpcbiAgICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgICB0aGlzLmhhbmRsZUlkbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiaXRlX3cnOlxuICAgICAgICB0aGlzLmhhbmRsZUJpdGVXZXN0KGRlbHRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiaXRlX2UnOlxuICAgICAgICB0aGlzLmhhbmRsZUJpdGVFYXN0KGRlbHRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9uc3RlcjtcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuLy8gSUYgQkxBTksgUkVOREVSIEJFRk9SRSBTUFJJVEUsIE5FRUQgVE8gUkVTRVQgU0hJRlQgVE8gMCEhXG5jb25zdCBtb25zdGVyU3ByaXRlU2hlZXQgPSB7XG4gIGRpcnQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faW50cm8ucG5nJyxcbiAgICBuYW1lOiAnaW50cm8nLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjYsXG4gICAgZnJhbWVXaWR0aDogMTUzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGludHJvOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG4gICAgbmFtZTogJ2ludHJvJyxcbiAgICBmcmFtZUhlaWdodDogMTY2LFxuICAgIGZyYW1lV2lkdGg6IDE1MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDE2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAxMDAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBpZGxlOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2lkbGUucG5nJyxcbiAgICBuYW1lOiAnaWRsZScsXG4gICAgZnJhbWVIZWlnaHQ6IDE3MyxcbiAgICBmcmFtZVdpZHRoOiAyMDMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxMixcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDEyNSxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGJpdGVfdzoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV93ZXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfdycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEuNSxcbiAgfSxcblxuICBiaXRlX2U6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2JpdGVfZWFzdC5wbmcnLFxuICAgIG5hbWU6ICdiaXRlX2UnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjMsXG4gICAgZnJhbWVXaWR0aDogMTkyLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNSxcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDIwMCxcbiAgICBmcHNYOiAxLjUsXG4gIH0sXG5cbiAgZGVhZDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9kZWFkLnBuZycsXG4gICAgbmFtZTogJ2RlYWQnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjMsXG4gICAgZnJhbWVXaWR0aDogMTU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNCxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEsXG4gIH1cbn07XG5cbmNvbnN0IG1vbnN0ZXJTcHJpdGVzID0ge1xuICBpbnRybzogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuaW50cm8pLFxuICBpZGxlOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5pZGxlKSxcbiAgZGVhZDogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuZGVhZCksXG4gIGJpdGVfdzogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuYml0ZV93KSxcbiAgYml0ZV9lOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5iaXRlX2UpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vbnN0ZXJTcHJpdGVzO1xuIiwibGV0IHBsYXllclNwcml0ZXMgPSByZXF1aXJlKCcuL3BsYXllcl9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IgKGN0eCwgY2FudmFzVywgY2FudmFzSCwgc3ByaXRlKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbMCwgMF07XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuZmFjaW5nUG9zID0gXCJyaWdodFwiO1xuICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgIHRoaXMuaGl0Qm94VyA9IDY5O1xuICAgIHRoaXMua2V5UHJlc3NlZCA9IHt9O1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuY2VudGVyQ29vcmRzID0gWzAsIDBdO1xuICB9XG5cbiAgc2V0Q2VudGVyQ29vcmRzICh4LCB5KSB7XG4gICAgbGV0IGNlbnRlclggPSB4ICsgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC8gMik7XG4gICAgbGV0IGNlbnRlclkgPSB5ICsgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAvIDIpO1xuXG4gICAgcmV0dXJuIFtjZW50ZXJYLCBjZW50ZXJZXTtcbiAgfVxuXG4gIHJlbmRlcihub3cpIHtcbiAgICBpZiAoIXRoaXMuZ2FtZU92ZXIpIHtcblxuICAgICAgdmFyIHBsYXllclNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgcGxheWVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZS51cmw7XG5cbiAgICAgIC8vIHBsYXllclNwcml0ZS5hZGRFdmVudExpc3RlbmVyXG4gICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UocGxheWVyU3ByaXRlLCB0aGlzLnNoaWZ0LCAwLFxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgLy8gZGVidWdnZXJcblxuICAgICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzICYmICF0aGlzLmdhbWVPdmVyKSAge1xuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcHMgPSBmcHM7XG4gICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aDtcblxuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2RlYWQnKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZWFkICgpIHtcbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG4gIH1cblxuICBzZXRIaXRCb3ggKGZhY2luZ1Bvcykge1xuICAgIHN3aXRjaCAoZmFjaW5nUG9zKSB7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA1NTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDY5O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA1NTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNTU7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDY5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDY5O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA1NTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFjaW5nUG9zO1xuICAgIH1cbiAgfVxuXG4gIGN1cnJlbnRQb3NpdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvb3JkaW5hdGVzOiB0aGlzLmNvb3JkaW5hdGVzLFxuICAgICAgcGxheWVyRmFjZTogdGhpcy5mYWNpbmdQb3NcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlKGtleSkge1xuICAgIGNvbnN0IHNwcml0ZUhlaWdodCA9IDEyNTtcbiAgICB0aGlzLnNldEhpdEJveCh0aGlzLmZhY2luZ1Bvcyk7XG4gICAgbGV0IHNwZWVkID0gMTI7XG4gICAgLy8ga2V5LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAodGhpcy5hbGl2ZSkge1xuICAgICAgaWYodGhpcy5rZXlQcmVzc2VkWzM3XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlTGVmdDtcbiAgICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcImxlZnRcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gNSkge3RoaXMuY29vcmRpbmF0ZXNbMF0tPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszOF0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZVVwO1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwidXBcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMTUpIHt0aGlzLmNvb3JkaW5hdGVzWzFdLT1zcGVlZDt9XG4gICAgICB9XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzldKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVSaWdodDtcbiAgICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcInJpZ2h0XCI7XG4gICAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIDw9ICh0aGlzLmNhbnZhc1cgLSB0aGlzLmhpdEJveEggLSAzMCkpXG4gICAgICAgIHt0aGlzLmNvb3JkaW5hdGVzWzBdKz1zcGVlZDt9XG4gICAgICB9XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbNDBdKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVEb3duO1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwiZG93blwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA8PSAodGhpcy5jYW52YXNIIC0gdGhpcy5oaXRCb3hIKSlcbiAgICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMV0rPXNwZWVkO31cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5kZWFkO1xuICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY29uc3QgcGxheWVyU3ByaXRlU2hlZXQgPSB7XG4gIGRlYWQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2Jsb29kX3NtYWxsLnBuZycsXG4gICAgbmFtZTogJ2RlYWQnLFxuICAgIGZyYW1lSGVpZ2h0OiAxMjQsXG4gICAgZnJhbWVXaWR0aDogKDc2MyAvIDYpLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMTUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgZW1wdHk6IHtcbiAgICB1cmw6ICcnLFxuICAgIG5hbWU6ICcnLFxuICAgIGZyYW1lSGVpZ2h0OiAwLFxuICAgIGZyYW1lV2lkdGg6IDAsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAwLFxuICAgIG9uY2U6IDAsXG4gICAgZnBzOiAwLFxuICAgIGZwc1g6IDAsXG4gIH0sXG5cbiAgYWxpdmVMZWZ0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfbGVmdC5wbmcnLFxuICAgIG5hbWU6ICdsZWZ0JyxcbiAgICBmcmFtZUhlaWdodDogNTUsXG4gICAgZnJhbWVXaWR0aDogOTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIC8vIGhpdEJveEhlaWdodE9mZnNldDpcbiAgICAvLyBoaXRCb3hXaWR0aE9mZnNldDpcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIGFsaXZlVXA6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV91cC5wbmcnLFxuICAgIG5hbWU6ICd1cCcsXG4gICAgZnJhbWVIZWlnaHQ6IDkzLFxuICAgIGZyYW1lV2lkdGg6IDU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIGFsaXZlUmlnaHQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZS5wbmcnLFxuICAgIG5hbWU6ICdyaWdodCcsXG4gICAgZnJhbWVIZWlnaHQ6IDU1LFxuICAgIGZyYW1lV2lkdGg6IDkzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG4gIGFsaXZlRG93bjoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2Rvd24ucG5nJyxcbiAgICBuYW1lOiAnZG93bicsXG4gICAgZnJhbWVIZWlnaHQ6IDkzLFxuICAgIGZyYW1lV2lkdGg6IDU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMSxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG59O1xuXG5jb25zdCBwbGF5ZXJTcHJpdGVzID0ge1xuICBkZWFkOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmRlYWQpLFxuICBhbGl2ZUxlZnQ6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVMZWZ0KSxcbiAgYWxpdmVVcDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZVVwKSxcbiAgYWxpdmVSaWdodDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZVJpZ2h0KSxcbiAgYWxpdmVEb3duOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlRG93biksXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGxheWVyU3ByaXRlcztcbiIsImNvbnN0IGltYWdlcyA9IFtcbiAgJ2Fzc2V0cy9pbWFnZXMvYXJyb3dfa2V5cy5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9hcnJvd3NfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JnX2ZpbmFsLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfZWFzdC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9iaXRlX25vcnRoLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfc291dGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV93ZXN0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2Jsb29kX3NtYWxsLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2RpcnRfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2dhbWVfb3Zlcl9hZ2Fpbi5qcGcnLFxuICAnYXNzZXRzL2ltYWdlcy9kaXJ0X3BvcC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9naXRodWItb3JpZ2luYWwucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvZ2xvYmUucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbGlua2VkaW5fbG9nby5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X2xlZnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9uZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X253LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfcmlnaHQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NvdXRoLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc3cucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF92ZXJ0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9kb3duLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9sZWZ0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV91cC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGUucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvc3BhY2ViYXIucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvc3RhcnRfYnV0dG9uLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dvcm1fZGVhZC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy93b3JtX2lkbGUucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbWFnZXM7XG4iLCJjbGFzcyBTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybDtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5mcmFtZVdpZHRoID0gb3B0aW9ucy5mcmFtZVdpZHRoO1xuICAgIHRoaXMuZnJhbWVIZWlnaHQgPSBvcHRpb25zLmZyYW1lSGVpZ2h0O1xuICAgIHRoaXMuY3VycmVudEZyYW1lID0gb3B0aW9ucy5jdXJyZW50RnJhbWU7XG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IG9wdGlvbnMudG90YWxGcmFtZXM7XG4gICAgdGhpcy5vbmNlID0gb3B0aW9ucy5vbmNlO1xuICAgIHRoaXMuZnBzID0gb3B0aW9ucy5mcHM7XG4gICAgdGhpcy5mcHNYID0gb3B0aW9ucy5mcHNYO1xuICAgIHRoaXMuZGFtYWdlID0gb3B0aW9ucy5kYW1hZ2U7XG4gIH1cbn1cbi8vIHVybCwgbmFtZSwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2VcblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7XG4iLCIvLyBIT1cgVE8gQlVJTEQgUEhZU0lDUyBGT1IgQSBXRUFQT04/XG4vLyBCVUxMRVQgU1BFRUQsIFNQUkVBRCwgREFNQUdFP1xuLy8gRE8gUEhZU0lDUyBORUVEIFRPIEJFIEEgU0VQQVJBVEUgQ0xBU1M/IENBTiBJIElNUE9SVCBBIExJQlJBUlkgVE8gSEFORExFIFRIQVQgTE9HSUM/XG5cbmNsYXNzIFdlYXBvbiB7XG4gIGNvbnN0cnVjdG9yIChhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5yYXRlID0gYXR0cmlidXRlcy5yYXRlO1xuICAgIHRoaXMubW9kZWwgPSBhdHRyaWJ1dGVzLm1vZGVsO1xuICAgIHRoaXMucG93ZXIgPSBhdHRyaWJ1dGVzLnBvd2VyO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXZWFwb247XG4iXX0=
