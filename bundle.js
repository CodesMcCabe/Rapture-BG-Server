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
    introMusic.volume = 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJvYXJkLmpzIiwiYnVsbGV0LmpzIiwiYnVsbGV0X3Nwcml0ZXMuanMiLCJtYWluLmpzIiwibW9uc3Rlci5qcyIsIm1vbnN0ZXJfc3ByaXRlcy5qcyIsInBsYXllci5qcyIsInBsYXllcl9zcHJpdGVzLmpzIiwicmVzb3VyY2VzLmpzIiwic3ByaXRlLmpzIiwid2VhcG9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBkcm9wIGV2ZW50IGxpc3RlbmVyIGhlcmVcbi8vIFNIT1VMRCBTRVQgSVQgVVAgRk9SIEZVUlRIRVIgTUFQU1xuLy8gQk9BUkQgSU5TVEFOQ0UgQ0FOIEJFIElOVk9LRUQgVVBPTiBHQU1FIFNUQVJUIEFORCBQQVNTRUQgSU4gQSBTUEVDSUZJQyBCb2FyZFxuLy8gSE9XIERPIEkgQ1JFQVRFIFRIRSBCT0FSRCBBTkQgUEFTUyBJVCBJTj9cblxuLy8gY29uc3QgYm9hcmQgPSB7XG4vLyAgIGJnSW1hZ2U6IG5ldyBJbWFnZSgpXG4vL1xuLy8gfVxuY2xhc3MgQm9hcmQge1xuICBjb25zdHJ1Y3RvciAoY3R4KSB7XG4gICAgLy8gdGhpcy5iYWNrZ3JvdW5kID0gbmV3O1xuICAgIC8vIHRoaXMuYmFja2dyb3VuZCA9IGJhY2tncm91bmRpbWFnZTtcbiAgICAvLyB0aGlzLmJvYXJkID0gcGxhdGZvcm1zO1xuICB9XG59XG5cbi8vIGNhbiBhbHNvIHNldCB0aGlzIGFzIGEgc2luZ2xlIGZ1bmN0aW9uXG5cbm1vZHVsZS5leHBvcnRzID0gQm9hcmQ7XG4iLCJjbGFzcyBCdWxsZXQge1xuICBjb25zdHJ1Y3RvcihwbGF5ZXJBdHRyLCBjYW52YXNXLCBjYW52YXNILCBjdHgsIHNwcml0ZSwgYnVsbGV0Q291bnQpIHtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMucGxheWVyUG9zID0gT2JqZWN0LmFzc2lnbihbXSwgcGxheWVyQXR0ci5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5wbGF5ZXJGYWNlID0gcGxheWVyQXR0ci5wbGF5ZXJGYWNlO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSB0aGlzLnNldENvb3JkaW5hdGVzKHRoaXMucGxheWVyUG9zKTtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5idWxsZXRDb3VudGVyID0gMDtcbiAgICB0aGlzLmJ1bGxldENvdW50ID0gYnVsbGV0Q291bnQ7XG5cbiAgICAvLyBCQU5EIEFJRCBGT1IgTU9OU1RFUiBCVUxMRVRTXG4gICAgLy8gU0hPVUxEIEFMU08gV09SSyBGT1IgUExBWUVSIEJVTExFVFMgU0hJRlRJTkdcbiAgICAvLyBBQ1RVQUxMWSBXT1JLUyBQUkVUVFkgTklDRUxZLCBOT1QgU1VSRSBJRiBCRVRURVIgV0FZIFRPXG4gICAgLy8gRE8gVEhJUyBBQ1RJT04gU0lOQ0UgT05MWSBVU0lORyAxIFNQUklURVxuICAgIHRoaXMuY3VycmVudFVSTCA9IFwiXCI7XG5cblxuICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMgPSB0aGlzLnNldENvb3JkaW5hdGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZXRIaXRCb3ggPSB0aGlzLnNldEhpdEJveC5iaW5kKHRoaXMpO1xuICB9XG4gIC8vIEJVTExFVFMgV0lMTCBDSEFOR0UgU1BSSVRFUyBXSEVOIEFOT1RIRVIgU0hPVCBJUyBUQUtFTlxuICAvLyBORUVEIFRPIEtFRVAgVEhFIElNQUdFIFdIRU4gU0hPVCBJUyBUQUtFTlxuICByZW5kZXIgKCkge1xuICAgIHZhciBidWxsZXRTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBidWxsZXRTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50VXJsO1xuICAgIHRoaXMuY3R4LmRyYXdJbWFnZShidWxsZXRTcHJpdGUsIHRoaXMuY29vcmRpbmF0ZXNbMF0sIHRoaXMuY29vcmRpbmF0ZXNbMV0pO1xuICB9XG5cbiAgc2V0SGl0Qm94IChwbGF5ZXJGYWNlKSB7XG4gICAgbGV0IGRpbWVuc2lvbnNDb3B5ID0gT2JqZWN0LmFzc2lnbihbXSxcbiAgICAgIFt0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0XSk7XG4gICAgc3dpdGNoIChwbGF5ZXJGYWNlKSB7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSBkaW1lbnNpb25zQ29weVsxXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSBkaW1lbnNpb25zQ29weVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gZGltZW5zaW9uc0NvcHlbMF07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gZGltZW5zaW9uc0NvcHlbMV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCA9IGRpbWVuc2lvbnNDb3B5WzBdO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA9IGRpbWVuc2lvbnNDb3B5WzFdO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwbGF5ZXJGYWNlO1xuICAgIH1cbiAgfVxuXG4gIHNldENvb3JkaW5hdGVzIChwbGF5ZXJQb3MpIHtcbiAgICBsZXQgeCA9IHBsYXllclBvc1swXTtcbiAgICBsZXQgeSA9IHBsYXllclBvc1sxXTtcbiAgICBpZiAodGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdyaWZsZScpIHtcbiAgICAgIHRoaXMuc2V0SGl0Qm94KHRoaXMucGxheWVyRmFjZSk7XG4gICAgICBzd2l0Y2ggKHRoaXMucGxheWVyRmFjZSkge1xuICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICB4ICs9IDQ7XG4gICAgICAgIHkgKz0gMTE7XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICB4ICs9IDQwO1xuICAgICAgICB5ICs9IDU7XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB4ICs9IDc1O1xuICAgICAgICB5ICs9IDQwO1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB4ICs9IDExO1xuICAgICAgICB5ICs9IDgwO1xuICAgICAgICByZXR1cm5beCwgeV07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwbGF5ZXJQb3M7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwbGF5ZXJQb3M7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKGR0LCBvd25lcikge1xuICAgIGxldCBidWxsZXRTcGVlZDtcbiAgICBpZiAob3duZXIgPT09ICdwbGF5ZXInKSB7XG4gICAgICBidWxsZXRTcGVlZCA9IDgwMDtcbiAgICAgIHN3aXRjaCAodGhpcy5wbGF5ZXJGYWNlKSB7XG4gICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXS09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXAnOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXS09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5jYW52YXNXO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfdmVydC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9IHRoaXMuY2FudmFzSDtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYnVsbGV0U3BlZWQgPSA1MDA7XG4gICAgICAvLyBkZWJ1Z2dlclxuICAgICAgc3dpdGNoICh0aGlzLmJ1bGxldENvdW50KSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X253LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSAtPShidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdIC09KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwICYmXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9sZWZ0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXS09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc3cucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdIC09KGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gKz0oYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDAgJiZcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9IHRoaXMuY2FudmFzSDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc291dGgucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdKz0gKGJ1bGxldFNwZWVkICogZHQpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA8PSB0aGlzLmNhbnZhc0g7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NlLnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSArPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXSArPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9XG4gICAgICAgICAgdGhpcy5jYW52YXNIICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5jYW52YXNXO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9yaWdodC5wbmcnO1xuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0rPSAoYnVsbGV0U3BlZWQgKiBkdCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgIHRoaXMuY3VycmVudFVybCA9ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbmUucG5nJztcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdICs9IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdIC09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMCAmJlxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5jYW52YXNXO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgdGhpcy5jdXJyZW50VXJsID0gJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1sxXS09IChidWxsZXRTcGVlZCAqIGR0KTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGxldDtcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuLy8gSUYgQkxBTksgUkVOREVSIEJFRk9SRSBTUFJJVEUsIE5FRUQgVE8gUkVTRVQgU0hJRlQgVE8gMCEhXG5jb25zdCBidWxsZXRTcHJpdGVTaGVldCA9IHtcbiAgcmlmbGU6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZycsXG4gICAgbmFtZTogJ3JpZmxlJyxcbiAgICBmcmFtZUhlaWdodDogNixcbiAgICBmcmFtZVdpZHRoOiAxNCxcbiAgICBkYW1hZ2U6IDEwLFxuICB9LFxuXG4gIG1vbnN0ZXI6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfdmVydC5wbmcnLFxuICAgIG5hbWU6ICdtb25zdGVyJyxcbiAgICBmcmFtZUhlaWdodDogMzIsXG4gICAgZnJhbWVXaWR0aDogOSxcbiAgICBkYW1hZ2U6IDEwLFxuICB9LFxufTtcblxuY29uc3QgYnVsbGV0U3ByaXRlcyA9IHtcbiAgcmlmbGU6IG5ldyBTcHJpdGUoYnVsbGV0U3ByaXRlU2hlZXQucmlmbGUpLFxuICBtb25zdGVyOiBuZXcgU3ByaXRlKGJ1bGxldFNwcml0ZVNoZWV0Lm1vbnN0ZXIpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1bGxldFNwcml0ZXM7XG4iLCJsZXQgQm9hcmQgPSByZXF1aXJlKCcuL2JvYXJkJyk7XG5sZXQgbW9uc3RlclNwcml0ZXMgPSByZXF1aXJlKCcuL21vbnN0ZXJfc3ByaXRlcycpO1xubGV0IHBsYXllclNwcml0ZXMgPSByZXF1aXJlKCcuL3BsYXllcl9zcHJpdGVzJyk7XG5sZXQgYnVsbGV0U3ByaXRlcyA9IHJlcXVpcmUoJy4vYnVsbGV0X3Nwcml0ZXMnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xubGV0IE1vbnN0ZXIgPSByZXF1aXJlKCcuL21vbnN0ZXInKTtcbmxldCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpO1xubGV0IFdlYXBvbnMgPSByZXF1aXJlKCcuL3dlYXBvbnMnKTtcbmxldCBCdWxsZXQgPSByZXF1aXJlKCcuL2J1bGxldCcpO1xubGV0IHByZWxvYWRJbWFnZXMgPSByZXF1aXJlKCcuL3Jlc291cmNlcycpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gIGxldCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG4gIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgbGV0IHN0YXJ0QnV0dG9uID0gJ2Fzc2V0cy9pbWFnZXMvc3RhcnRfYnV0dG9uLnBuZyc7XG4gIGxldCBnYW1lT3ZlclNwcml0ZSA9ICdhc3NldHMvaW1hZ2VzL2dhbWVfb3Zlci5wbmcnO1xuICBsZXQgbXlSZXE7XG4gIHByZWxvYWRBc3NldHMoKTtcblxuICBmdW5jdGlvbiBzdGFydEdhbWUgKCkge1xuICAgIGxldCBzdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xuICAgIGxldCBtdXNpYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtdXNpYycpO1xuICAgIGxldCBpbnRyb011c2ljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhdmVfdGhlbWUnKTtcbiAgICBpbnRyb011c2ljLnZvbHVtZSA9IDE7XG4gICAgbGV0IHRpbWVyID0gRGF0ZS5ub3coKTtcbiAgICAvLyBzZXQgdXAgZGF0ZSBub3dcbiAgICAvLyBjb252ZXJ0IHRvIHNlY29uZHNcbiAgICAvLyBlbmQgd2hlbiBnYW1lT3ZlclxuICAgIC8vIGhhdmUgdGltZXIgZGl2IHNldCB1cCBhbmQgYXBwZW5kIHRvIHRoZSBpZCBvZiB0aGUgZGl2IHRhZ1xuXG4gICAgc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHN0YXJ0LmNsYXNzTmFtZSA9ICdzdGFydF9idXR0b25faGlkZSc7XG4gICAgICAgIGdhbWVTdGFydCA9IHRydWU7XG4gICAgICAgIGludHJvTXVzaWMucGF1c2UoKTtcbiAgICAgICAgbXVzaWMudm9sdW1lID0gLjc7XG4gICAgICAgIG11c2ljLnBsYXkoKTtcbiAgICB9KTtcblxuICAgIGxldCBhdWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdWRpb19ob3ZlcicpO1xuICAgIGF1ZGlvLnZvbHVtZSA9IDAuNDtcbiAgICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbihldnQpIHtcbiAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWxvYWRBc3NldHMgKCkge1xuICAgIHByZWxvYWRJbWFnZXMuZm9yRWFjaChpbWFnZSA9PiB7XG4gICAgICBsZXQgbG9hZGVkSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGxvYWRlZEltYWdlLnNyYyA9IGltYWdlO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXJQcm9tcHQgKCkge1xuICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICBsZXQgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfSwgMjAwMCk7XG5cbiAgICBsZXQgYXVkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW9faG92ZXInKTtcbiAgICBhdWRpby52b2x1bWUgPSAwLjQ7XG4gICAgZ2FtZU92ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBhdWRpby5wbGF5KCk7XG4gICAgfSk7XG5cbiAgICBnYW1lT3Zlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBtb25zdGVyU3ByaXRlcy5kZWFkLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICBtb25zdGVyU3ByaXRlcy5pZGxlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICBwbGF5ZXIuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgbW9uc3RlclNwcml0ZXMuaW50cm8uY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHJlc3RhcnRHYW1lKCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXN0YXJ0R2FtZSAoKSB7XG4gICAgbGV0IGdhbWVPdmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWVfb3ZlcicpO1xuICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBtb25zdGVyID0gbmV3IE1vbnN0ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgICBtb25zdGVyU3ByaXRlcy5pbnRybyk7XG4gICAgcGxheWVyID0gbmV3IFBsYXllcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICAgIHBsYXllclNwcml0ZXMuYWxpdmVSaWdodCk7XG4gICAgbW9uc3RlckJ1bGxldHMgPSBtb25zdGVyLmJ1bGxldHM7XG4gIH1cblxuICBsZXQgbW9uc3RlciA9IG5ldyBNb25zdGVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvKTtcbiAgbGV0IGdhbWVTdGFydCA9IGZhbHNlO1xuICBsZXQgYnVsbGV0cyA9IFtdO1xuICBsZXQgbW9uc3RlckJ1bGxldHMgPSBtb25zdGVyLmJ1bGxldHM7XG4gIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgIHBsYXllclNwcml0ZXMuYWxpdmVSaWdodCk7XG4gIGxldCBsYXN0VGltZSA9IERhdGUubm93KCk7XG4gIGxldCBrZXk7XG4gIGxldCBhbGxvd0ZpcmUgPSB0cnVlO1xuXG4gIGZ1bmN0aW9uIGNvbGxpc2lvbkRldGVjdGVkICgpIHtcbiAgICBsZXQgY29sbGlkZUJ1bGxldHMgPSBPYmplY3QuYXNzaWduKFtdLCBidWxsZXRzKTtcbiAgICBsZXQgYnVsbGV0WDtcbiAgICBsZXQgYnVsbGV0WTtcbiAgICBsZXQgcGxheWVyWCA9IHBsYXllci5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgcGxheWVyWSA9IHBsYXllci5jb29yZGluYXRlc1sxXTtcbiAgICBsZXQgbW9uc3RlclggPSBtb25zdGVyLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCBtb25zdGVyWSA9IG1vbnN0ZXIuY29vcmRpbmF0ZXNbMV07XG4gICAgbGV0IG1IQm9mZnNldCA9IDQwO1xuXG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICAgIGJ1bGxldFggPSBidWxsZXQuY29vcmRpbmF0ZXNbMF07XG4gICAgICAgIGJ1bGxldFkgPSBidWxsZXQuY29vcmRpbmF0ZXNbMV07XG4gICAgICAgIGlmIChidWxsZXRYIDwgbW9uc3RlclggKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAtIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFggKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID4gbW9uc3RlclggKyBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLSBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPiBtb25zdGVyWSArIG1IQm9mZnNldCkge1xuICAgICAgICAgICAgbW9uc3Rlci5yZWR1Y2VIZWFsdGgoYnVsbGV0LmN1cnJlbnRTcHJpdGUuZGFtYWdlKTtcbiAgICAgICAgICAgIGJ1bGxldHMuc3BsaWNlKDAsIDEpO1xuXG4gICAgICAgICAgICBpZiAobW9uc3Rlci5oZWFsdGggPD0gMCkge1xuICAgICAgICAgICAgICBtb25zdGVyLmRlZmVhdGVkKCk7XG4gICAgICAgICAgICAgIGdhbWVPdmVyUHJvbXB0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICAgIG1vbnN0ZXJCdWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IHtcbiAgICAgIGJ1bGxldFggPSBidWxsZXQuY29vcmRpbmF0ZXNbMF07XG4gICAgICBidWxsZXRZID0gYnVsbGV0LmNvb3JkaW5hdGVzWzFdO1xuICAgICAgaWYgKGJ1bGxldFggPCBwbGF5ZXJYICsgcGxheWVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAmJlxuICAgICAgICBidWxsZXRYICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA+IHBsYXllclggJiZcbiAgICAgICAgYnVsbGV0WSA8IHBsYXllclkgKyBwbGF5ZXIuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAmJlxuICAgICAgICBidWxsZXRZICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPiBwbGF5ZXJZKSB7XG4gICAgICAgICAgcGxheWVyLmRlYWQoKTtcbiAgICAgICAgICBtb25zdGVyLnBsYXllckRlZmVhdGVkKCk7XG4gICAgICAgICAgZ2FtZU92ZXJQcm9tcHQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwbGF5ZXJYIDwgbW9uc3RlclggKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAtIG1IQm9mZnNldCYmXG4gICAgICBwbGF5ZXJYICsgcGxheWVyLmhpdEJveFcgPiBtb25zdGVyWCArIG1IQm9mZnNldCYmXG4gICAgICBwbGF5ZXJZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLSBtSEJvZmZzZXQmJlxuICAgICAgcGxheWVyWSArIHBsYXllci5oaXRCb3hIID4gbW9uc3RlclkgKyBtSEJvZmZzZXQgJiZcbiAgICAgIGdhbWVTdGFydCAmJiBtb25zdGVyLmFsaXZlKSB7XG4gICAgICAgIHBsYXllci5kZWFkKCk7XG4gICAgICAgIG1vbnN0ZXIucGxheWVyRGVmZWF0ZWQoKTtcbiAgICAgICAgZ2FtZU92ZXJQcm9tcHQoKTtcbiAgICAgIH1cbiAgfVxuXG4gIGxldCBsYXN0QnVsbGV0O1xuICBmdW5jdGlvbiBGaXJlICgpIHtcbiAgICBhbGxvd0ZpcmUgPSBmYWxzZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGFsbG93RmlyZSA9IHRydWU7XG4gICAgfSwgMjAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob290IChwbGF5ZXJQb3MpIHtcbiAgICAgIGJ1bGxldHMucHVzaChuZXcgQnVsbGV0KHBsYXllclBvcywgY2FudmFzLndpZHRoLFxuICAgICAgICBjYW52YXMuaGVpZ2h0LCBjdHgsIGJ1bGxldFNwcml0ZXMucmlmbGUpKTtcblxuICAgICAgYnVsbGV0cyA9IGJ1bGxldHMuZmlsdGVyKGJ1bGxldCA9PiBidWxsZXQuYWN0aXZlKTtcblxuICAgIEZpcmUoKTtcbiAgICBsZXQgYnVsbGV0U291bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVsbGV0Jyk7XG4gICAgYnVsbGV0U291bmQudm9sdW1lID0gMC43O1xuICAgIGJ1bGxldFNvdW5kLmxvYWQoKTtcbiAgICBidWxsZXRTb3VuZC5wbGF5KCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUgKGtleSwgZHQsIGRlbHRhKSB7XG4gICAgcGxheWVyLnVwZGF0ZShrZXkpO1xuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIG1vbnN0ZXIudXBkYXRlKHBsYXllci5jb29yZGluYXRlcywgZHQsIGRlbHRhKTtcbiAgICB9XG4gICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQudXBkYXRlKGR0LCAncGxheWVyJykpO1xuICAgIG1vbnN0ZXJCdWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC51cGRhdGUoZHQsICdtb25zdGVyJykpO1xuICB9XG5cbiAgY29uc3QgY2xlYXIgPSAoKSA9PiAge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgfTtcblxuICBmdW5jdGlvbiByZW5kZXIgKG5vdykge1xuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIG1vbnN0ZXIucmVuZGVyKG5vdyk7XG4gICAgfVxuICAgIHBsYXllci5yZW5kZXIobm93KTtcbiAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC5yZW5kZXIoKSk7XG4gICAgbW9uc3RlckJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnJlbmRlcigpKTtcbiAgICBpZiAobW9uc3Rlci5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdpbnRybycgJiZcbiAgICBnYW1lU3RhcnQgJiYgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT0gMSkge1xuICAgICAgbGV0IGludHJvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ludHJvX21vbnN0ZXInKTtcbiAgICAgIGludHJvLnZvbHVtZSA9IDE7XG4gICAgICBpbnRyby5wbGF5KCk7XG4gICAgfSBlbHNlIGlmIChtb25zdGVyLmN1cnJlbnRTcHJpdGUubmFtZSAhPT0gJ2ludHJvJyAmJiBnYW1lU3RhcnQgJiZcbiAgICBtb25zdGVyLmFsaXZlKSB7XG4gICAgICBsZXQgbW9uQkcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9uc3Rlcl9iZycpO1xuICAgICAgbW9uQkcudm9sdW1lID0gMTtcbiAgICAgIG1vbkJHLnBsYXliYWNrUmF0ZSA9IDMuNTtcbiAgICAgIG1vbkJHLnBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgbGV0IGtleXMgPSBbMzIsIDM3LCAzOCwgMzksIDQwXTtcbiAgICBrZXkgPSBldnQud2hpY2g7XG4gICAgaWYoa2V5cy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgcGxheWVyLmtleVByZXNzZWRba2V5XSA9IHRydWU7XG4gICAgaWYgKGtleSA9PT0gMzIgJiYgcGxheWVyLmFsaXZlICYmIGFsbG93RmlyZSkge1xuICAgICAgc2hvb3QocGxheWVyLmN1cnJlbnRQb3NpdGlvbigpKTtcbiAgICB9XG4gIH07XG5cbiAgZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBsYXllci5rZXlQcmVzc2VkW2V2dC53aGljaF0gPSBmYWxzZTtcbiAgICBrZXkgPSBudWxsO1xuICB9O1xuICAvLyBsZXQgZGVsdGE7XG4gIGZ1bmN0aW9uIG1haW4oKSB7XG4gICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgbGV0IGRlbHRhID0gbm93IC0gbGFzdFRpbWU7XG4gICAgbGV0IGR0ID0gKGRlbHRhKSAvIDUwMC4wO1xuICAgIG15UmVxID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluICk7XG4gICAgY29sbGlzaW9uRGV0ZWN0ZWQoKTtcbiAgICB1cGRhdGUoa2V5LCBkdCwgZGVsdGEpO1xuICAgIGNsZWFyKCk7XG4gICAgcmVuZGVyKG5vdyk7XG4gICAgbGFzdFRpbWUgPSBub3c7XG4gIH1cbiAgbXlSZXEgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG1haW4gKTtcbiAgc3RhcnRHYW1lKCk7XG59O1xuIiwibGV0IG1vbnN0ZXJTcHJpdGVzID0gcmVxdWlyZSgnLi9tb25zdGVyX3Nwcml0ZXMnKTtcbmxldCBidWxsZXRTcHJpdGVzID0gcmVxdWlyZSgnLi9idWxsZXRfc3ByaXRlcycpO1xubGV0IEJ1bGxldCA9IHJlcXVpcmUoJy4vYnVsbGV0Jyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY2xhc3MgTW9uc3RlciB7XG4gIGNvbnN0cnVjdG9yIChjdHgsIGNhbnZhc1csIGNhbnZhc0gsIHNwcml0ZSkge1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gWzcwMCwgMzAwXTtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5tYXhIUCA9IDMwMDtcbiAgICB0aGlzLmhlYWx0aCA9IDMwMDtcbiAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcblxuICAgIHRoaXMudGFyZ2V0UG9zID0gW107XG4gICAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG4gICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW107XG4gICAgdGhpcy5jZW50ZXJDb29yZHMgPSBbMCwgMF07XG4gICAgdGhpcy5yYW5kQ291bnQgPSAyMDA7XG4gICAgdGhpcy5wYXVzZUFuaW1hdGlvbiA9IGZhbHNlO1xuICAgIHRoaXMuYnVsbGV0cyA9IFtdO1xuICAgIHRoaXMuYnVsbGV0c0xvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFBvc2l0aW9uID0gdGhpcy5jdXJyZW50UG9zaXRpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGN1cnJlbnRQb3NpdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvb3JkaW5hdGVzOiB0aGlzLnNldENlbnRlckNvb3JkcygpLFxuICAgIH07XG4gIH1cblxuICBzZXRDZW50ZXJDb29yZHMgKCkge1xuICAgIGxldCB4ID0gdGhpcy5jb29yZGluYXRlc1swXSArXG4gICAgICAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLyAyKTtcbiAgICBsZXQgeSA9IHRoaXMuY29vcmRpbmF0ZXNbMV0gK1xuICAgICAgKHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAvIDIpO1xuXG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfVxuXG4gIGRlZmVhdGVkICgpIHtcbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG4gIH1cblxuICBwbGF5ZXJEZWZlYXRlZCgpIHtcbiAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgfVxuXG4gIHJlZHVjZUhlYWx0aCAoZGFtYWdlKSB7XG4gICAgdGhpcy5oZWFsdGggLT0gZGFtYWdlO1xuICB9XG5cbiAgcmVuZGVyKG5vdykge1xuICAgIHZhciBtb25zdGVyU3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgbW9uc3RlclNwcml0ZS5zcmMgPSB0aGlzLmN1cnJlbnRTcHJpdGUudXJsO1xuICAgIHRoaXMuY3R4LmRyYXdJbWFnZShtb25zdGVyU3ByaXRlLCB0aGlzLnNoaWZ0LCAwLFxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCxcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0sIHRoaXMuY29vcmRpbmF0ZXNbMV0sIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLFxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0KTtcbiAgICBpZiAoIXRoaXMucGF1c2VBbmltYXRpb24pIHtcblxuICAgICAgbGV0IGZwcyA9IHRoaXMuY3VycmVudFNwcml0ZS5mcHMgKiB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzWDtcbiAgICAgIGlmIChub3cgLSB0aGlzLmxhc3RVcGRhdGUgPiBmcHMpICB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcHMgPSBmcHM7XG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IG5vdztcbiAgICAgICAgdGhpcy5zaGlmdCA9IHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aDtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2ludHJvJykge1xuXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW3RoaXMuY29vcmRpbmF0ZXNbMF0gLSAxNSxcbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gKyAxNV07XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5pZGxlO1xuICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnZGVhZCcpIHtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDI7XG4gICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGg7XG4gICAgICAgICAgICAgIHRoaXMucGF1c2VBbmltYXRpb24gPSB0cnVlO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSArPSAxO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmREaXJlY3Rpb25WZWN0b3IgKCkge1xuICAgIGxldCB4ID0gdGhpcy5maW5hbFBsYXllclBvc1swXSAtIHRoaXMuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IHkgPSB0aGlzLmZpbmFsUGxheWVyUG9zWzFdIC0gdGhpcy5jb29yZGluYXRlc1sxXTtcbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZmluZE1hZ25pdHVkZSAoeCwgeSkge1xuICAgIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgcmV0dXJuIG1hZ25pdHVkZTtcbiAgfVxuICBub3JtYWxpemVWZWN0b3IgKHBsYXllckRpciwgbWFnbml0dWRlKSB7XG4gICAgcmV0dXJuIFsocGxheWVyRGlyWzBdL21hZ25pdHVkZSksIChwbGF5ZXJEaXJbMV0vbWFnbml0dWRlKV07XG4gIH1cblxuICBjaGFzZVBsYXllciAoZGVsdGEpIHtcbiAgICAgIGxldCBwbGF5ZXJEaXIgPSB0aGlzLmZpbmREaXJlY3Rpb25WZWN0b3IoKTtcbiAgICAgIGxldCBtYWduaXR1ZGUgPSB0aGlzLmZpbmRNYWduaXR1ZGUocGxheWVyRGlyWzBdLCBwbGF5ZXJEaXJbMV0pO1xuICAgICAgbGV0IG5vcm1hbGl6ZWQgPSB0aGlzLm5vcm1hbGl6ZVZlY3RvcihwbGF5ZXJEaXIsIG1hZ25pdHVkZSk7XG4gICAgICBsZXQgdmVsb2NpdHkgPSAxLjU7XG5cbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmNvb3JkaW5hdGVzWzBdICsgKG5vcm1hbGl6ZWRbMF0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPSB0aGlzLmNvb3JkaW5hdGVzWzFdICsgKG5vcm1hbGl6ZWRbMV0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09IDApIHtcbiAgICAgICAgbGV0IGNoYXJnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFyZ2UnKTtcbiAgICAgICAgY2hhcmdlLnZvbHVtZSA9IDE7XG4gICAgICAgIGNoYXJnZS5wbGF5KCk7XG4gICAgICB9XG4gIH1cblxuICByYW5kb21Db3VudCgpIHtcbiAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAyMDApICsgMTgwO1xuICB9XG5cbiAgYnVsbGV0QXR0YWNrICgpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCA4KSB7XG4gICAgICBsZXQgYnVsbGV0Q291bnQgPSBpO1xuICAgICAgdGhpcy5idWxsZXRzLnB1c2gobmV3IEJ1bGxldCh0aGlzLmN1cnJlbnRQb3NpdGlvbigpLCB0aGlzLmNhbnZhc1csXG4gICAgICAgIHRoaXMuY2FudmFzSCwgdGhpcy5jdHgsIGJ1bGxldFNwcml0ZXMubW9uc3RlciwgYnVsbGV0Q291bnQpKTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgdGhpcy5idWxsZXRzTG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmJ1bGxldHMuZmlsdGVyKGJ1bGxldCA9PiBidWxsZXQuYWN0aXZlKTtcbiAgfVxuXG4gIGhhbmRsZUlkbGUgKCkge1xuICAgIGlmICghdGhpcy5idWxsZXRzTG9hZGVkKSB7XG4gICAgICBsZXQgc3BpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGl0Jyk7XG4gICAgICBzcGl0LnZvbHVtZSA9IDE7XG4gICAgICB0aGlzLmJ1bGxldEF0dGFjaygpO1xuICAgICAgc3BpdC5wbGF5KCk7XG4gICAgfVxuICAgIGxldCBzcGVlZCA9IDIwMDtcbiAgICBpZiAodGhpcy5oZWFsdGggPD0gdGhpcy5tYXhIUCAqIC43NSAmJiB0aGlzLmhlYWx0aCA+IHRoaXMubWF4SFAgKiAuNSkge1xuICAgICAgc3BlZWQgPSAxODA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWx0aCA8PSB0aGlzLm1heEhQICogLjUgJiYgdGhpcy5oZWFsdGggPiB0aGlzLm1heEhQICogLjI1KSB7XG4gICAgICBzcGVlZCA9IDE2MDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGVhbHRoIDw9IHRoaXMubWF4SFAgKiAuMjUpIHtcbiAgICAgIHNwZWVkID0gMTUwO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb3VudGVyID49IHNwZWVkICYmICF0aGlzLmdhbWVPdmVyKSB7XG4gICAgICB0aGlzLmJ1bGxldHNMb2FkZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMudGFyZ2V0UG9zWzBdID49IHRoaXMuY29vcmRpbmF0ZXNbMF0pIHtcbiAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmJpdGVfZTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuYml0ZV93O1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVCaXRlV2VzdCAoZGVsdGEpIHtcbiAgICAvLyBCSU5EUyBGSU5BTCBQT1NJVElPTiBCRUZPUkUgQklURVxuICAgIGlmICh0aGlzLmZpbmFsUGxheWVyUG9zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0UG9zWzFdICsgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID49IHRoaXMuY2FudmFzSCkge1xuICAgICAgICB0aGlzLnRhcmdldFBvc1sxXSA9IHRoaXMuY2FudmFzSCAtIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodDtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbMCArIHRoaXMudGFyZ2V0UG9zWzBdLCB0aGlzLnRhcmdldFBvc1sxXV07XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pe1xuICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5pZGxlO1xuICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA8PVxuICAgICAgICAwKXtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5maW5hbFBsYXllclBvc1swXTtcbiAgICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW107XG4gICAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmNoYXNlUGxheWVyKGRlbHRhKTtcbiAgICB9XG4gIH1cbiAgLy8gQ0hBUkdFIERPRVNOVCBISVQgSUYgSU4gQ0VOVEVSIE9GIEJPVFRPTSBPUiB0b3BcbiAgLy8gU0hPVUxEIEZJTkQgQSBXQVkgVE8gU1RJTEwgR08gVE9XQVJEUyBUQVJHRVQgWCBCVVQgRlVMTFlcbiAgaGFuZGxlQml0ZUVhc3QgKGRlbHRhKSB7XG4gICAgaWYgKHRoaXMuZmluYWxQbGF5ZXJQb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMV0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPj0gdGhpcy5jYW52YXNIKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0UG9zWzFdID0gdGhpcy5jYW52YXNIIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0O1xuICAgICAgfVxuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFt0aGlzLmNhbnZhc1cgLVxuICAgICAgICAodGhpcy5jYW52YXNXIC0gdGhpcy50YXJnZXRQb3NbMF0pLCB0aGlzLnRhcmdldFBvc1sxXV07XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdID49IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSArIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID49XG4gICAgICAgIHRoaXMuY2FudmFzVyl7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0gLVxuICAgICAgICAgICh0aGlzLmNhbnZhc1cgLSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKTtcbiAgICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW107XG4gICAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmNoYXNlUGxheWVyKGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUocGxheWVyUG9zLCBkdCwgZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuYWxpdmUgJiYgIXRoaXMuZ2FtZU92ZXIpIHtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuZGVhZDtcbiAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgLy8gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgfVxuICAgIC8vIFRSQUNLUyBQT1NJVElPTiBPRiBQTEFZRVJcbiAgICBpZiAodGhpcy50YXJnZXRQb3MubGVuZ3RoID09PSAwICkge1xuICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRhcmdldFBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllclBvcyk7XG4gICAgICB9LCAxMDApO1xuICAgIH1cblxuICAgIC8vIE9GRlNFVCBGT1IgSURMRSBBTklNQVRJT05cbiAgICB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgfHwgMDtcblxuICAgIHN3aXRjaCAodGhpcy5jdXJyZW50U3ByaXRlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ2lkbGUnOlxuICAgICAgICAgIHRoaXMuY291bnRlcisrO1xuICAgICAgICAgIHRoaXMuaGFuZGxlSWRsZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JpdGVfdyc6XG4gICAgICAgIHRoaXMuaGFuZGxlQml0ZVdlc3QoZGVsdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JpdGVfZSc6XG4gICAgICAgIHRoaXMuaGFuZGxlQml0ZUVhc3QoZGVsdGEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb25zdGVyO1xuIiwibGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG4vLyBJRiBCTEFOSyBSRU5ERVIgQkVGT1JFIFNQUklURSwgTkVFRCBUTyBSRVNFVCBTSElGVCBUTyAwISFcbmNvbnN0IG1vbnN0ZXJTcHJpdGVTaGVldCA9IHtcbiAgZGlydDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuICAgIG5hbWU6ICdpbnRybycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2NixcbiAgICBmcmFtZVdpZHRoOiAxNTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgaW50cm86IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faW50cm8ucG5nJyxcbiAgICBuYW1lOiAnaW50cm8nLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjYsXG4gICAgZnJhbWVXaWR0aDogMTUzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDEwMCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGlkbGU6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faWRsZS5wbmcnLFxuICAgIG5hbWU6ICdpZGxlJyxcbiAgICBmcmFtZUhlaWdodDogMTczLFxuICAgIGZyYW1lV2lkdGg6IDIwMyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEyLFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMTI1LFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgYml0ZV93OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9iaXRlX3dlc3QucG5nJyxcbiAgICBuYW1lOiAnYml0ZV93JyxcbiAgICBmcmFtZUhlaWdodDogMTYzLFxuICAgIGZyYW1lV2lkdGg6IDE5MixcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDUsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMS41LFxuICB9LFxuXG4gIGJpdGVfZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV9lYXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfZScsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEuNSxcbiAgfSxcblxuICBkZWFkOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2RlYWQucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA0LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMSxcbiAgfVxufTtcblxuY29uc3QgbW9uc3RlclNwcml0ZXMgPSB7XG4gIGludHJvOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5pbnRybyksXG4gIGlkbGU6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmlkbGUpLFxuICBkZWFkOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5kZWFkKSxcbiAgYml0ZV93OiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5iaXRlX3cpLFxuICBiaXRlX2U6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmJpdGVfZSlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbW9uc3RlclNwcml0ZXM7XG4iLCJsZXQgcGxheWVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vcGxheWVyX3Nwcml0ZXMnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvciAoY3R4LCBjYW52YXNXLCBjYW52YXNILCBzcHJpdGUpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFswLCAwXTtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5mYWNpbmdQb3MgPSBcInJpZ2h0XCI7XG4gICAgdGhpcy5oaXRCb3hIID0gNTU7XG4gICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgdGhpcy5rZXlQcmVzc2VkID0ge307XG4gICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5jZW50ZXJDb29yZHMgPSBbMCwgMF07XG4gIH1cblxuICBzZXRDZW50ZXJDb29yZHMgKHgsIHkpIHtcbiAgICBsZXQgY2VudGVyWCA9IHggKyAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLyAyKTtcbiAgICBsZXQgY2VudGVyWSA9IHkgKyAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC8gMik7XG5cbiAgICByZXR1cm4gW2NlbnRlclgsIGNlbnRlclldO1xuICB9XG5cbiAgcmVuZGVyKG5vdykge1xuICAgIGlmICghdGhpcy5nYW1lT3Zlcikge1xuXG4gICAgICB2YXIgcGxheWVyU3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgICBwbGF5ZXJTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcblxuICAgICAgLy8gcGxheWVyU3ByaXRlLmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShwbGF5ZXJTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0sIHRoaXMuY29vcmRpbmF0ZXNbMV0sIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLFxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICAvLyBkZWJ1Z2dlclxuXG4gICAgICAgIGxldCBmcHMgPSB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzICogdGhpcy5jdXJyZW50U3ByaXRlLmZwc1g7XG4gICAgICAgIGlmIChub3cgLSB0aGlzLmxhc3RVcGRhdGUgPiBmcHMgJiYgIXRoaXMuZ2FtZU92ZXIpICB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgICAgICAgdGhpcy5zaGlmdCA9IHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKlxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnZGVhZCcpIHtcbiAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSArPSAxO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlYWQgKCkge1xuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHNldEhpdEJveCAoZmFjaW5nUG9zKSB7XG4gICAgc3dpdGNoIChmYWNpbmdQb3MpIHtcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA2OTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNjk7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDU1O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA1NTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNjk7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDU1O1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWNpbmdQb3M7XG4gICAgfVxuICB9XG5cbiAgY3VycmVudFBvc2l0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBwbGF5ZXJGYWNlOiB0aGlzLmZhY2luZ1Bvc1xuICAgIH07XG4gIH1cblxuICB1cGRhdGUoa2V5KSB7XG4gICAgY29uc3Qgc3ByaXRlSGVpZ2h0ID0gMTI1O1xuICAgIHRoaXMuc2V0SGl0Qm94KHRoaXMuZmFjaW5nUG9zKTtcbiAgICBsZXQgc3BlZWQgPSAxMjtcbiAgICAvLyBrZXkucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzddKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVMZWZ0O1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwibGVmdFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSA1KSB7dGhpcy5jb29yZGluYXRlc1swXS09c3BlZWQ7fVxuICAgICAgfVxuICAgICAgaWYodGhpcy5rZXlQcmVzc2VkWzM4XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlVXA7XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJ1cFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA+PSAxNSkge3RoaXMuY29vcmRpbmF0ZXNbMV0tPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszOV0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0O1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwicmlnaHRcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gKHRoaXMuY2FudmFzVyAtIHRoaXMuaGl0Qm94SCAtIDMwKSlcbiAgICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMF0rPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFs0MF0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZURvd247XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJkb3duXCI7XG4gICAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzFdIDw9ICh0aGlzLmNhbnZhc0ggLSB0aGlzLmhpdEJveEgpKVxuICAgICAgICB7dGhpcy5jb29yZGluYXRlc1sxXSs9c3BlZWQ7fVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmRlYWQ7XG4gICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jb25zdCBwbGF5ZXJTcHJpdGVTaGVldCA9IHtcbiAgZGVhZDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYmxvb2Rfc21hbGwucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDEyNCxcbiAgICBmcmFtZVdpZHRoOiAoNzYzIC8gNiksXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAxNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBlbXB0eToge1xuICAgIHVybDogJycsXG4gICAgbmFtZTogJycsXG4gICAgZnJhbWVIZWlnaHQ6IDAsXG4gICAgZnJhbWVXaWR0aDogMCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDAsXG4gICAgb25jZTogMCxcbiAgICBmcHM6IDAsXG4gICAgZnBzWDogMCxcbiAgfSxcblxuICBhbGl2ZUxlZnQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9sZWZ0LnBuZycsXG4gICAgbmFtZTogJ2xlZnQnLFxuICAgIGZyYW1lSGVpZ2h0OiA1NSxcbiAgICBmcmFtZVdpZHRoOiA5MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgLy8gaGl0Qm94SGVpZ2h0T2Zmc2V0OlxuICAgIC8vIGhpdEJveFdpZHRoT2Zmc2V0OlxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVVcDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX3VwLnBuZycsXG4gICAgbmFtZTogJ3VwJyxcbiAgICBmcmFtZUhlaWdodDogOTMsXG4gICAgZnJhbWVXaWR0aDogNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVSaWdodDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlLnBuZycsXG4gICAgbmFtZTogJ3JpZ2h0JyxcbiAgICBmcmFtZUhlaWdodDogNTUsXG4gICAgZnJhbWVXaWR0aDogOTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVEb3duOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfZG93bi5wbmcnLFxuICAgIG5hbWU6ICdkb3duJyxcbiAgICBmcmFtZUhlaWdodDogOTMsXG4gICAgZnJhbWVXaWR0aDogNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbn07XG5cbmNvbnN0IHBsYXllclNwcml0ZXMgPSB7XG4gIGRlYWQ6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuZGVhZCksXG4gIGFsaXZlTGVmdDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZUxlZnQpLFxuICBhbGl2ZVVwOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlVXApLFxuICBhbGl2ZVJpZ2h0OiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlUmlnaHQpLFxuICBhbGl2ZURvd246IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVEb3duKSxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwbGF5ZXJTcHJpdGVzO1xuIiwiY29uc3QgaW1hZ2VzID0gW1xuICAnYXNzZXRzL2ltYWdlcy9hcnJvd19rZXlzLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2Fycm93c19wb3AucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYmdfZmluYWwucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV9lYXN0LnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2JpdGVfbm9ydGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYml0ZV9zb3V0aC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9iaXRlX3dlc3QucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYmxvb2Rfc21hbGwucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvZGlydF9wb3AucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvZ2FtZV9vdmVyX2FnYWluLmpwZycsXG4gICdhc3NldHMvaW1hZ2VzL2RpcnRfcG9wLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL2dpdGh1Yi1vcmlnaW5hbC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9nbG9iZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9saW5rZWRpbl9sb2dvLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbGVmdC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X25lLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfbncucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9yaWdodC5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3NlLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL21vbl9idWxsZXRfc291dGgucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvbW9uX2J1bGxldF9zdy5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9tb25fYnVsbGV0X3ZlcnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2Rvd24ucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2xlZnQucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX3VwLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9zcGFjZWJhci5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy9zdGFydF9idXR0b24ucG5nJyxcbiAgJ2Fzc2V0cy9pbWFnZXMvd29ybV9kZWFkLnBuZycsXG4gICdhc3NldHMvaW1hZ2VzL3dvcm1faWRsZS5wbmcnLFxuICAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGltYWdlcztcbiIsImNsYXNzIFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsO1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLmZyYW1lV2lkdGggPSBvcHRpb25zLmZyYW1lV2lkdGg7XG4gICAgdGhpcy5mcmFtZUhlaWdodCA9IG9wdGlvbnMuZnJhbWVIZWlnaHQ7XG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSBvcHRpb25zLmN1cnJlbnRGcmFtZTtcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gb3B0aW9ucy50b3RhbEZyYW1lcztcbiAgICB0aGlzLm9uY2UgPSBvcHRpb25zLm9uY2U7XG4gICAgdGhpcy5mcHMgPSBvcHRpb25zLmZwcztcbiAgICB0aGlzLmZwc1ggPSBvcHRpb25zLmZwc1g7XG4gICAgdGhpcy5kYW1hZ2UgPSBvcHRpb25zLmRhbWFnZTtcbiAgfVxufVxuLy8gdXJsLCBuYW1lLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcbiIsIi8vIEhPVyBUTyBCVUlMRCBQSFlTSUNTIEZPUiBBIFdFQVBPTj9cbi8vIEJVTExFVCBTUEVFRCwgU1BSRUFELCBEQU1BR0U/XG4vLyBETyBQSFlTSUNTIE5FRUQgVE8gQkUgQSBTRVBBUkFURSBDTEFTUz8gQ0FOIEkgSU1QT1JUIEEgTElCUkFSWSBUTyBIQU5ETEUgVEhBVCBMT0dJQz9cblxuY2xhc3MgV2VhcG9uIHtcbiAgY29uc3RydWN0b3IgKGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLnJhdGUgPSBhdHRyaWJ1dGVzLnJhdGU7XG4gICAgdGhpcy5tb2RlbCA9IGF0dHJpYnV0ZXMubW9kZWw7XG4gICAgdGhpcy5wb3dlciA9IGF0dHJpYnV0ZXMucG93ZXI7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYXBvbjtcbiJdfQ==
