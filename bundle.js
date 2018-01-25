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
  constructor(playerAttr, canvasW, canvasH, ctx, sprite) {
    // create bounding box attributes
    // set heigh and width attributs for each which will simulate the hitbox
    this.currentSprite = sprite;
    this.active = true;
    this.playerPos = Object.assign([], playerAttr.playerPos);
    this.playerFace = playerAttr.playerFace;
    this.coordinates = this.setCoordinates(this.playerPos);
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;

    this.setCoordinates = this.setCoordinates.bind(this);
    this.setHitBox = this.setHitBox.bind(this);
  }

  render () {
    var bulletSprite = new Image();
    bulletSprite.src = this.currentSprite.url;
    this.ctx.drawImage(bulletSprite, this.coordinates[0], this.coordinates[1]);
  }

  setHitBox (playerFace) {
    switch (playerFace) {
      case "left":
        this.currentSprite.frameHeight = 6;
        this.currentSprite.frameWidth = 14;
        break;
      case "up":
        this.currentSprite.frameHeight = 14;
        this.currentSprite.frameWidth = 6;
        break;
      case "right":
        this.currentSprite.frameHeight = 6;
        this.currentSprite.frameWidth = 14;
        break;
      case "down":
        this.currentSprite.frameHeight = 14;
        this.currentSprite.frameWidth = 6;
        break;
      default:
        return playerFace;
    }
  }

  setCoordinates (playerPos) {
    let x = playerPos[0];
    let y = playerPos[1];
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

  }

  update(dt) {
    switch (this.playerFace) {
      case 'left':
        this.currentSprite.url = 'assets/images/bullet_horz.png';
        this.coordinates[0]-= (800 * dt);
        this.active = this.active && this.coordinates[0] >= 0;
        break;
      case 'up':
        this.currentSprite.url = 'assets/images/bullet_vert.png';
        this.coordinates[1]-= (800 * dt);
        this.active = this.active && this.coordinates[1] >= 0;
        break;
      case 'right':
        this.currentSprite.url = 'assets/images/bullet_horz.png';
        this.coordinates[0]+= (800 * dt);
        this.active = this.active && this.coordinates[0] <= this.canvasW;
        break;
      case 'down':
        this.currentSprite.url = 'assets/images/bullet_vert.png';
        this.coordinates[1]+= (800 * dt);
        this.active = this.active && this.coordinates[1] <= this.canvasH;
        break;
    }
  }
    // if (this.playerFace === "left") {
    //   this.currentSprite = 'assets/images/bullet_horz.png';
    //   this.coordinates[0]-= (800 * dt);
    //   this.active = this.active && this.coordinates[0] >= 0;
    // }
    //
    // if (this.playerFace === "up") {
    //   this.currentSprite = 'assets/images/bullet_vert.png';
    //   this.coordinates[1]-= (800 * dt);
    //   this.active = this.active && this.coordinates[1] >= 0;
    // }
    //
    // if (this.playerFace === "right") {
    // }
    //
    // if (this.playerFace === "down") {
    // }
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

  function restartGame () {
    let gameOver = document.getElementById('game_over');
    // let gameOver = document.getElementById('game_over');
    gameOver.style.display = "none";
    monster = new Monster(ctx, canvas.width, canvas.height,
      monsterSprites.intro);
    player = new Player(ctx, canvas.width, canvas.height,
      playerSprites.aliveRight);
  }

  let monster = new Monster(ctx, canvas.width, canvas.height,
    monsterSprites.intro);
  let gameStart = false;
  let bullets = [];
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
        // debugger
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
    if (playerX < monsterX + monster.currentSprite.frameWidth - mHBoffset&&
      playerX + player.hitBoxW > monsterX + mHBoffset&&
      playerY < monsterY + monster.currentSprite.frameHeight - mHBoffset&&
      playerY + player.hitBoxH > monsterY + mHBoffset&&
      monster.alive) {
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
    bullets.forEach(bullet => bullet.update(dt));
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
    this.health = 10;
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

        if (this.currentSprite.currentFrame === this.currentSprite.totalFrames &&
          this.currentSprite.name === 'intro') {

            this.coordinates = [this.coordinates[0] - 15, this.coordinates[1] + 15];
            this.currentSprite = monsterSprites.idle;
            this.shift = 0;
            // this.currentSprite.currentFrame = 0;

          } else if (this.currentSprite.currentFrame === this.currentSprite.totalFrames &&
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

  handleIdle () {
      if (this.counter >= 200 && !this.gameOver) {

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
      if (this.targetPos[1] + this.currentSprite.frameHeight >= this.canvasH) {
        this.targetPos[1] = this.canvasH - this.currentSprite.frameHeight;
      }
      this.finalPlayerPos = [0 + this.targetPos[0], this.targetPos[1]];
      clearInterval(this.interval);
    }

    if (this.coordinates[0] <= this.finalPlayerPos[0]){
      this.currentSprite = monsterSprites.idle;
      if (this.coordinates[0] - this.currentSprite.frameWidth <=
        0){
          this.coordinates[0] = this.finalPlayerPos[0];
        }
      this.currentSprite.currentFrame = 0;
      // this.coordinates = [this.finalPlayerPos[0] + 50, this.finalPlayerPos[1] - ];
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
      this.finalPlayerPos = [this.canvasW - (this.canvasW - this.targetPos[0]), this.targetPos[1]];
      clearInterval(this.interval);
    }

    if (this.coordinates[0] >= this.finalPlayerPos[0]) {
      this.currentSprite = monsterSprites.idle;
      if (this.coordinates[0] + this.currentSprite.frameWidth >=
        this.canvasW){
          this.coordinates[0] = this.finalPlayerPos[0] - (this.canvasW - this.finalPlayerPos[0]);
        }
      this.currentSprite.currentFrame = 0;
      this.finalPlayerPos = [];
      this.targetPos = [];
      // this.coordinates = [this.finalPlayerPos[0] -10, this.finalPlayerPos[1]];
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

},{"./monster_sprites":6,"./sprite":9}],6:[function(require,module,exports){
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
      playerPos: this.coordinates,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJvYXJkLmpzIiwiYnVsbGV0LmpzIiwiYnVsbGV0X3Nwcml0ZXMuanMiLCJtYWluLmpzIiwibW9uc3Rlci5qcyIsIm1vbnN0ZXJfc3ByaXRlcy5qcyIsInBsYXllci5qcyIsInBsYXllcl9zcHJpdGVzLmpzIiwic3ByaXRlLmpzIiwid2VhcG9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gZHJvcCBldmVudCBsaXN0ZW5lciBoZXJlXG4vLyBTSE9VTEQgU0VUIElUIFVQIEZPUiBGVVJUSEVSIE1BUFNcbi8vIEJPQVJEIElOU1RBTkNFIENBTiBCRSBJTlZPS0VEIFVQT04gR0FNRSBTVEFSVCBBTkQgUEFTU0VEIElOIEEgU1BFQ0lGSUMgQm9hcmRcbi8vIEhPVyBETyBJIENSRUFURSBUSEUgQk9BUkQgQU5EIFBBU1MgSVQgSU4/XG5cbi8vIGNvbnN0IGJvYXJkID0ge1xuLy8gICBiZ0ltYWdlOiBuZXcgSW1hZ2UoKVxuLy9cbi8vIH1cbmNsYXNzIEJvYXJkIHtcbiAgY29uc3RydWN0b3IgKGN0eCkge1xuICAgIC8vIHRoaXMuYmFja2dyb3VuZCA9IG5ldztcbiAgICAvLyB0aGlzLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kaW1hZ2U7XG4gICAgLy8gdGhpcy5ib2FyZCA9IHBsYXRmb3JtcztcbiAgfVxufVxuXG4vLyBjYW4gYWxzbyBzZXQgdGhpcyBhcyBhIHNpbmdsZSBmdW5jdGlvblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvYXJkO1xuIiwiY2xhc3MgQnVsbGV0IHtcbiAgY29uc3RydWN0b3IocGxheWVyQXR0ciwgY2FudmFzVywgY2FudmFzSCwgY3R4LCBzcHJpdGUpIHtcbiAgICAvLyBjcmVhdGUgYm91bmRpbmcgYm94IGF0dHJpYnV0ZXNcbiAgICAvLyBzZXQgaGVpZ2ggYW5kIHdpZHRoIGF0dHJpYnV0cyBmb3IgZWFjaCB3aGljaCB3aWxsIHNpbXVsYXRlIHRoZSBoaXRib3hcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMucGxheWVyUG9zID0gT2JqZWN0LmFzc2lnbihbXSwgcGxheWVyQXR0ci5wbGF5ZXJQb3MpO1xuICAgIHRoaXMucGxheWVyRmFjZSA9IHBsYXllckF0dHIucGxheWVyRmFjZTtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gdGhpcy5zZXRDb29yZGluYXRlcyh0aGlzLnBsYXllclBvcyk7XG4gICAgdGhpcy5jYW52YXNXID0gY2FudmFzVztcbiAgICB0aGlzLmNhbnZhc0ggPSBjYW52YXNIO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuXG4gICAgdGhpcy5zZXRDb29yZGluYXRlcyA9IHRoaXMuc2V0Q29vcmRpbmF0ZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNldEhpdEJveCA9IHRoaXMuc2V0SGl0Qm94LmJpbmQodGhpcyk7XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHZhciBidWxsZXRTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBidWxsZXRTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYnVsbGV0U3ByaXRlLCB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdKTtcbiAgfVxuXG4gIHNldEhpdEJveCAocGxheWVyRmFjZSkge1xuICAgIHN3aXRjaCAocGxheWVyRmFjZSkge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gNjtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSAxNDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gMTQ7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID0gNjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0ID0gNjtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSAxNDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPSAxNDtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggPSA2O1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwbGF5ZXJGYWNlO1xuICAgIH1cbiAgfVxuXG4gIHNldENvb3JkaW5hdGVzIChwbGF5ZXJQb3MpIHtcbiAgICBsZXQgeCA9IHBsYXllclBvc1swXTtcbiAgICBsZXQgeSA9IHBsYXllclBvc1sxXTtcbiAgICB0aGlzLnNldEhpdEJveCh0aGlzLnBsYXllckZhY2UpO1xuICAgIHN3aXRjaCAodGhpcy5wbGF5ZXJGYWNlKSB7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICB4ICs9IDQ7XG4gICAgICAgIHkgKz0gMTE7XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgeCArPSA0MDtcbiAgICAgICAgeSArPSA1O1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHggKz0gNzU7XG4gICAgICAgIHkgKz0gNDA7XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB4ICs9IDExO1xuICAgICAgICB5ICs9IDgwO1xuICAgICAgICByZXR1cm5beCwgeV07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyUG9zO1xuICAgIH1cblxuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgc3dpdGNoICh0aGlzLnBsYXllckZhY2UpIHtcbiAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudXJsID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJztcbiAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXS09ICg4MDAgKiBkdCk7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1swXSA+PSAwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0tPSAoODAwICogZHQpO1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS51cmwgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdKz0gKDgwMCAqIGR0KTtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLnVybCA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0rPSAoODAwICogZHQpO1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gdGhpcy5jYW52YXNIO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgICAvLyBpZiAodGhpcy5wbGF5ZXJGYWNlID09PSBcImxlZnRcIikge1xuICAgIC8vICAgdGhpcy5jdXJyZW50U3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJztcbiAgICAvLyAgIHRoaXMuY29vcmRpbmF0ZXNbMF0tPSAoODAwICogZHQpO1xuICAgIC8vICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdID49IDA7XG4gICAgLy8gfVxuICAgIC8vXG4gICAgLy8gaWYgKHRoaXMucGxheWVyRmFjZSA9PT0gXCJ1cFwiKSB7XG4gICAgLy8gICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfdmVydC5wbmcnO1xuICAgIC8vICAgdGhpcy5jb29yZGluYXRlc1sxXS09ICg4MDAgKiBkdCk7XG4gICAgLy8gICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMV0gPj0gMDtcbiAgICAvLyB9XG4gICAgLy9cbiAgICAvLyBpZiAodGhpcy5wbGF5ZXJGYWNlID09PSBcInJpZ2h0XCIpIHtcbiAgICAvLyB9XG4gICAgLy9cbiAgICAvLyBpZiAodGhpcy5wbGF5ZXJGYWNlID09PSBcImRvd25cIikge1xuICAgIC8vIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGxldDtcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuLy8gSUYgQkxBTksgUkVOREVSIEJFRk9SRSBTUFJJVEUsIE5FRUQgVE8gUkVTRVQgU0hJRlQgVE8gMCEhXG5jb25zdCBidWxsZXRTcHJpdGVTaGVldCA9IHtcbiAgcmlmbGU6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2J1bGxldF9ob3J6LnBuZycsXG4gICAgbmFtZTogJ3JpZmxlJyxcbiAgICBmcmFtZUhlaWdodDogNixcbiAgICBmcmFtZVdpZHRoOiAxNCxcbiAgICBkYW1hZ2U6IDEwLFxuICB9LFxuXG4gIG1vbnN0ZXI6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faW50cm8ucG5nJyxcbiAgICBuYW1lOiAnaW50cm8nLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjYsXG4gICAgZnJhbWVXaWR0aDogMTUzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxufTtcblxuY29uc3QgYnVsbGV0U3ByaXRlcyA9IHtcbiAgcmlmbGU6IG5ldyBTcHJpdGUoYnVsbGV0U3ByaXRlU2hlZXQucmlmbGUpLFxuICBtb25zdGVyOiBuZXcgU3ByaXRlKGJ1bGxldFNwcml0ZVNoZWV0Lm1vbnN0ZXIpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1bGxldFNwcml0ZXM7XG4iLCJsZXQgQm9hcmQgPSByZXF1aXJlKCcuL2JvYXJkJyk7XG5sZXQgbW9uc3RlclNwcml0ZXMgPSByZXF1aXJlKCcuL21vbnN0ZXJfc3ByaXRlcycpO1xubGV0IHBsYXllclNwcml0ZXMgPSByZXF1aXJlKCcuL3BsYXllcl9zcHJpdGVzJyk7XG5sZXQgYnVsbGV0U3ByaXRlcyA9IHJlcXVpcmUoJy4vYnVsbGV0X3Nwcml0ZXMnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xubGV0IE1vbnN0ZXIgPSByZXF1aXJlKCcuL21vbnN0ZXInKTtcbmxldCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpO1xubGV0IFdlYXBvbnMgPSByZXF1aXJlKCcuL3dlYXBvbnMnKTtcbmxldCBCdWxsZXQgPSByZXF1aXJlKCcuL2J1bGxldCcpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gIGxldCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG4gIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgbGV0IHN0YXJ0QnV0dG9uID0gJ2Fzc2V0cy9pbWFnZXMvc3RhcnRfYnV0dG9uLnBuZyc7XG4gIGxldCBnYW1lT3ZlclNwcml0ZSA9ICdhc3NldHMvaW1hZ2VzL2dhbWVfb3Zlci5wbmcnO1xuICBsZXQgbXlSZXE7XG5cbiAgZnVuY3Rpb24gc3RhcnRHYW1lICgpIHtcblxuICAgIGxldCBzdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xuICAgIHN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBzdGFydC5jbGFzc05hbWUgPSAnc3RhcnRfYnV0dG9uX2hpZGUnO1xuICAgICAgICBnYW1lU3RhcnQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzdGFydEdhbWUgKCkge1xuICAgIGxldCBnYW1lT3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lX292ZXInKTtcbiAgICAvLyBsZXQgZ2FtZU92ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZV9vdmVyJyk7XG4gICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIG1vbnN0ZXIgPSBuZXcgTW9uc3RlcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICAgIG1vbnN0ZXJTcHJpdGVzLmludHJvKTtcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgICAgcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0KTtcbiAgfVxuXG4gIGxldCBtb25zdGVyID0gbmV3IE1vbnN0ZXIoY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsXG4gICAgbW9uc3RlclNwcml0ZXMuaW50cm8pO1xuICBsZXQgZ2FtZVN0YXJ0ID0gZmFsc2U7XG4gIGxldCBidWxsZXRzID0gW107XG4gIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LFxuICAgIHBsYXllclNwcml0ZXMuYWxpdmVSaWdodCk7XG4gIGxldCBsYXN0VGltZSA9IERhdGUubm93KCk7XG4gIGxldCBrZXk7XG4gIGxldCBhbGxvd0ZpcmUgPSB0cnVlO1xuXG4gIGZ1bmN0aW9uIGNvbGxpc2lvbkRldGVjdGVkICgpIHtcbiAgICBsZXQgY29sbGlkZUJ1bGxldHMgPSBPYmplY3QuYXNzaWduKFtdLCBidWxsZXRzKTtcbiAgICBsZXQgYnVsbGV0WDtcbiAgICBsZXQgYnVsbGV0WTtcbiAgICBsZXQgcGxheWVyWCA9IHBsYXllci5jb29yZGluYXRlc1swXTtcbiAgICBsZXQgcGxheWVyWSA9IHBsYXllci5jb29yZGluYXRlc1sxXTtcbiAgICBsZXQgbW9uc3RlclggPSBtb25zdGVyLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCBtb25zdGVyWSA9IG1vbnN0ZXIuY29vcmRpbmF0ZXNbMV07XG4gICAgbGV0IG1IQm9mZnNldCA9IDQwO1xuXG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XG4gICAgICAgIC8vIGRlYnVnZ2VyXG4gICAgICAgIGJ1bGxldFggPSBidWxsZXQuY29vcmRpbmF0ZXNbMF07XG4gICAgICAgIGJ1bGxldFkgPSBidWxsZXQuY29vcmRpbmF0ZXNbMV07XG4gICAgICAgIGlmIChidWxsZXRYIDwgbW9uc3RlclggKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAtIG1IQm9mZnNldCAmJlxuICAgICAgICAgIGJ1bGxldFggKyBidWxsZXQuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID4gbW9uc3RlclggKyBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgLSBtSEJvZmZzZXQgJiZcbiAgICAgICAgICBidWxsZXRZICsgYnVsbGV0LmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPiBtb25zdGVyWSArIG1IQm9mZnNldCkge1xuICAgICAgICAgICAgbW9uc3Rlci5yZWR1Y2VIZWFsdGgoYnVsbGV0LmN1cnJlbnRTcHJpdGUuZGFtYWdlKTtcbiAgICAgICAgICAgIGJ1bGxldHMuc3BsaWNlKDAsIDEpO1xuXG4gICAgICAgICAgICBpZiAobW9uc3Rlci5oZWFsdGggPD0gMCkge1xuICAgICAgICAgICAgICBtb25zdGVyLmRlZmVhdGVkKCk7XG5cblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHBsYXllclggPCBtb25zdGVyWCArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoIC0gbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclggKyBwbGF5ZXIuaGl0Qm94VyA+IG1vbnN0ZXJYICsgbUhCb2Zmc2V0JiZcbiAgICAgIHBsYXllclkgPCBtb25zdGVyWSArIG1vbnN0ZXIuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCAtIG1IQm9mZnNldCYmXG4gICAgICBwbGF5ZXJZICsgcGxheWVyLmhpdEJveEggPiBtb25zdGVyWSArIG1IQm9mZnNldCYmXG4gICAgICBtb25zdGVyLmFsaXZlKSB7XG4gICAgICAgIHBsYXllci5kZWFkKCk7XG4gICAgICAgIG1vbnN0ZXIucGxheWVyRGVmZWF0ZWQoKTtcbiAgICAgICAgbGV0IGdhbWVPdmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWVfb3ZlcicpO1xuICAgICAgICBsZXQgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGdhbWVPdmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB9LCAyMDAwKTtcblxuICAgICAgICBnYW1lT3Zlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgZ2FtZU92ZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICBtb25zdGVyU3ByaXRlcy5kZWFkLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgbW9uc3RlclNwcml0ZXMuaWRsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgIHBsYXllci5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgbW9uc3RlclNwcml0ZXMuaW50cm8uY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICByZXN0YXJ0R2FtZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgfVxuXG4gIGxldCBsYXN0QnVsbGV0O1xuICBmdW5jdGlvbiBGaXJlICgpIHtcbiAgICBhbGxvd0ZpcmUgPSBmYWxzZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGFsbG93RmlyZSA9IHRydWU7XG4gICAgfSwgMjUwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob290IChwbGF5ZXJQb3MpIHtcbiAgICBpZiAoYWxsb3dGaXJlKSB7XG4gICAgICBidWxsZXRzLnB1c2gobmV3IEJ1bGxldChwbGF5ZXJQb3MsIGNhbnZhcy53aWR0aCxcbiAgICAgICAgY2FudmFzLmhlaWdodCwgY3R4LCBidWxsZXRTcHJpdGVzLnJpZmxlKSk7XG4gICAgICAgIGJ1bGxldHMgPSBidWxsZXRzLmZpbHRlcihidWxsZXQgPT4gYnVsbGV0LmFjdGl2ZSk7XG4gICAgfVxuXG4gICAgRmlyZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlIChrZXksIGR0LCBkZWx0YSkge1xuICAgIHBsYXllci51cGRhdGUoa2V5KTtcbiAgICAvLyBsZXQgcGxheWVyQ2VudGVyUG9zID1cbiAgICAgIC8vIHBsYXllci5zZXRDZW50ZXJDb29yZHMocGxheWVyLmNvb3JkaW5hdGVzWzBdLCBwbGF5ZXIuY29vcmRpbmF0ZXNbMV0pO1xuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIG1vbnN0ZXIudXBkYXRlKHBsYXllci5jb29yZGluYXRlcywgZHQsIGRlbHRhKTtcbiAgICB9XG4gICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQudXBkYXRlKGR0KSk7XG4gIH1cblxuICBjb25zdCBjbGVhciA9ICgpID0+ICB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlbmRlciAobm93KSB7XG4gICAgaWYgKGdhbWVTdGFydCkge1xuICAgICAgbW9uc3Rlci5yZW5kZXIobm93KTtcbiAgICB9XG4gICAgcGxheWVyLnJlbmRlcihub3cpO1xuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnJlbmRlcigpKTtcbiAgfVxuXG4gIGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBrZXkgPSBldnQud2hpY2g7XG4gICAgcGxheWVyLmtleVByZXNzZWRba2V5XSA9IHRydWU7XG4gICAgaWYgKGtleSA9PT0gMzIgJiYgcGxheWVyLmFsaXZlKSB7XG4gICAgICBzaG9vdChwbGF5ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xuICAgIH1cbiAgfTtcblxuICBkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgcGxheWVyLmtleVByZXNzZWRbZXZ0LndoaWNoXSA9IGZhbHNlO1xuICAgIGtleSA9IG51bGw7XG4gIH07XG4gIC8vIGxldCBkZWx0YTtcbiAgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBsZXQgZGVsdGEgPSBub3cgLSBsYXN0VGltZTtcbiAgICBsZXQgZHQgPSAoZGVsdGEpIC8gNTAwLjA7XG4gICAgbXlSZXEgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG1haW4gKTtcbiAgICBjb2xsaXNpb25EZXRlY3RlZCgpO1xuICAgIHVwZGF0ZShrZXksIGR0LCBkZWx0YSk7XG4gICAgY2xlYXIoKTtcbiAgICByZW5kZXIobm93KTtcbiAgICBsYXN0VGltZSA9IG5vdztcbiAgfVxuICBteVJlcSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSggbWFpbiApO1xuICBzdGFydEdhbWUoKTtcbn07XG4iLCIvLyBNT05TVEVSIFdJTEwgQ0hBU0UgUExBWUVSLCBUQUtFIFNIT1JURVNUIFJPVVRFIElGIFBPU1NJQkxFXG5sZXQgbW9uc3RlclNwcml0ZXMgPSByZXF1aXJlKCcuL21vbnN0ZXJfc3ByaXRlcycpO1xubGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG5cbmNsYXNzIE1vbnN0ZXIge1xuICBjb25zdHJ1Y3RvciAoY3R4LCBjYW52YXNXLCBjYW52YXNILCBzcHJpdGUpIHtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFs3MDAsIDMwMF07XG4gICAgdGhpcy5jdXJyZW50U3ByaXRlID0gc3ByaXRlO1xuICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgIHRoaXMuaGVhbHRoID0gMTA7XG4gICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG5cbiAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgIHRoaXMuY2VudGVyQ29vcmRzID0gWzAsIDBdO1xuICAgIHRoaXMucmFuZENvdW50ID0gMjAwO1xuICAgIHRoaXMucGF1c2VBbmltYXRpb24gPSBmYWxzZTtcbiAgfVxuXG4gIHNldENlbnRlckNvb3JkcyAoKSB7XG4gICAgbGV0IHggPSB0aGlzLmNvb3JkaW5hdGVzWzBdICtcbiAgICAgICh0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAvIDIpO1xuICAgIGxldCB5ID0gdGhpcy5jb29yZGluYXRlc1sxXSArXG4gICAgICAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC8gMik7XG5cbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZGVmZWF0ZWQgKCkge1xuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHBsYXllckRlZmVhdGVkKCkge1xuICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICB9XG5cbiAgcmVkdWNlSGVhbHRoIChkYW1hZ2UpIHtcbiAgICB0aGlzLmhlYWx0aCAtPSBkYW1hZ2U7XG4gIH1cblxuICByZW5kZXIobm93KSB7XG4gICAgdmFyIG1vbnN0ZXJTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBtb25zdGVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZS51cmw7XG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKG1vbnN0ZXJTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgdGhpcy5jb29yZGluYXRlc1swXSwgdGhpcy5jb29yZGluYXRlc1sxXSwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuICAgIGlmICghdGhpcy5wYXVzZUFuaW1hdGlvbikge1xuXG4gICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgaWYgKG5vdyAtIHRoaXMubGFzdFVwZGF0ZSA+IGZwcykgIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PSB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSA9PT0gJ2ludHJvJykge1xuXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW3RoaXMuY29vcmRpbmF0ZXNbMF0gLSAxNSwgdGhpcy5jb29yZGluYXRlc1sxXSArIDE1XTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgICAgIC8vIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PSB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnZGVhZCcpIHtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDI7XG4gICAgICAgICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGg7XG4gICAgICAgICAgICAgIHRoaXMucGF1c2VBbmltYXRpb24gPSB0cnVlO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSArPSAxO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmREaXJlY3Rpb25WZWN0b3IgKCkge1xuICAgIGxldCB4ID0gdGhpcy5maW5hbFBsYXllclBvc1swXSAtIHRoaXMuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IHkgPSB0aGlzLmZpbmFsUGxheWVyUG9zWzFdIC0gdGhpcy5jb29yZGluYXRlc1sxXTtcbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZmluZE1hZ25pdHVkZSAoeCwgeSkge1xuICAgIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgcmV0dXJuIG1hZ25pdHVkZTtcbiAgfVxuICBub3JtYWxpemVWZWN0b3IgKHBsYXllckRpciwgbWFnbml0dWRlKSB7XG4gICAgcmV0dXJuIFsocGxheWVyRGlyWzBdL21hZ25pdHVkZSksIChwbGF5ZXJEaXJbMV0vbWFnbml0dWRlKV07XG4gIH1cblxuICBjaGFzZVBsYXllciAoZGVsdGEpIHtcbiAgICAgIGxldCBwbGF5ZXJEaXIgPSB0aGlzLmZpbmREaXJlY3Rpb25WZWN0b3IoKTtcbiAgICAgIGxldCBtYWduaXR1ZGUgPSB0aGlzLmZpbmRNYWduaXR1ZGUocGxheWVyRGlyWzBdLCBwbGF5ZXJEaXJbMV0pO1xuICAgICAgbGV0IG5vcm1hbGl6ZWQgPSB0aGlzLm5vcm1hbGl6ZVZlY3RvcihwbGF5ZXJEaXIsIG1hZ25pdHVkZSk7XG4gICAgICBsZXQgdmVsb2NpdHkgPSAyO1xuXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5jb29yZGluYXRlc1swXSArIChub3JtYWxpemVkWzBdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdID0gdGhpcy5jb29yZGluYXRlc1sxXSArIChub3JtYWxpemVkWzFdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG4gIH1cblxuICByYW5kb21Db3VudCgpIHtcbiAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAyMDApICsgMTgwO1xuICB9XG5cbiAgaGFuZGxlSWRsZSAoKSB7XG4gICAgICBpZiAodGhpcy5jb3VudGVyID49IDIwMCAmJiAhdGhpcy5nYW1lT3Zlcikge1xuXG4gICAgICAgIGlmICh0aGlzLnRhcmdldFBvc1swXSA+PSB0aGlzLmNvb3JkaW5hdGVzWzBdKSB7XG5cbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5iaXRlX2U7XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuYml0ZV93O1xuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICAgIH1cbiAgfVxuXG4gIGhhbmRsZUJpdGVXZXN0IChkZWx0YSkge1xuICAgIC8vIEJJTkRTIEZJTkFMIFBPU0lUSU9OIEJFRk9SRSBCSVRFXG4gICAgaWYgKHRoaXMuZmluYWxQbGF5ZXJQb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMV0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPj0gdGhpcy5jYW52YXNIKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0UG9zWzFdID0gdGhpcy5jYW52YXNIIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0O1xuICAgICAgfVxuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFswICsgdGhpcy50YXJnZXRQb3NbMF0sIHRoaXMudGFyZ2V0UG9zWzFdXTtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5maW5hbFBsYXllclBvc1swXSl7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5pZGxlO1xuICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCA8PVxuICAgICAgICAwKXtcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5maW5hbFBsYXllclBvc1swXTtcbiAgICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAvLyB0aGlzLmNvb3JkaW5hdGVzID0gW3RoaXMuZmluYWxQbGF5ZXJQb3NbMF0gKyA1MCwgdGhpcy5maW5hbFBsYXllclBvc1sxXSAtIF07XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW107XG4gICAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmNoYXNlUGxheWVyKGRlbHRhKTtcbiAgICB9XG4gIH1cbiAgLy8gQ0hBUkdFIERPRVNOVCBISVQgSUYgSU4gQ0VOVEVSIE9GIEJPVFRPTSBPUiB0b3BcbiAgLy8gU0hPVUxEIEZJTkQgQSBXQVkgVE8gU1RJTEwgR08gVE9XQVJEUyBUQVJHRVQgWCBCVVQgRlVMTFlcbiAgaGFuZGxlQml0ZUVhc3QgKGRlbHRhKSB7XG4gICAgaWYgKHRoaXMuZmluYWxQbGF5ZXJQb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXRQb3NbMV0gKyB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgPj0gdGhpcy5jYW52YXNIKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0UG9zWzFdID0gdGhpcy5jYW52YXNIIC0gdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0O1xuICAgICAgfVxuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFt0aGlzLmNhbnZhc1cgLSAodGhpcy5jYW52YXNXIC0gdGhpcy50YXJnZXRQb3NbMF0pLCB0aGlzLnRhcmdldFBvc1sxXV07XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdID49IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0pIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSArIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoID49XG4gICAgICAgIHRoaXMuY2FudmFzVyl7XG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlc1swXSA9IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0gLSAodGhpcy5jYW52YXNXIC0gdGhpcy5maW5hbFBsYXllclBvc1swXSk7XG4gICAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICAgIC8vIHRoaXMuY29vcmRpbmF0ZXMgPSBbdGhpcy5maW5hbFBsYXllclBvc1swXSAtMTAsIHRoaXMuZmluYWxQbGF5ZXJQb3NbMV1dO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmNoYXNlUGxheWVyKGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUocGxheWVyUG9zLCBkdCwgZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuYWxpdmUgJiYgIXRoaXMuZ2FtZU92ZXIpIHtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuZGVhZDtcbiAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgLy8gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgfVxuICAgIC8vIFRSQUNLUyBQT1NJVElPTiBPRiBQTEFZRVJcbiAgICBpZiAodGhpcy50YXJnZXRQb3MubGVuZ3RoID09PSAwICkge1xuICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRhcmdldFBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllclBvcyk7XG4gICAgICB9LCAxMDApO1xuICB9XG5cblxuXG4gICAgLy8gT0ZGU0VUIEZPUiBJRExFIEFOSU1BVElPTlxuICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciB8fCAwO1xuXG4gICAgc3dpdGNoICh0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSkge1xuICAgICAgY2FzZSAnaWRsZSc6XG4gICAgICAgICAgdGhpcy5jb3VudGVyKys7XG4gICAgICAgICAgdGhpcy5oYW5kbGVJZGxlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYml0ZV93JzpcbiAgICAgICAgdGhpcy5oYW5kbGVCaXRlV2VzdChkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYml0ZV9lJzpcbiAgICAgICAgdGhpcy5oYW5kbGVCaXRlRWFzdChkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb25zdGVyO1xuIiwibGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJyk7XG4vLyBJRiBCTEFOSyBSRU5ERVIgQkVGT1JFIFNQUklURSwgTkVFRCBUTyBSRVNFVCBTSElGVCBUTyAwISFcbmNvbnN0IG1vbnN0ZXJTcHJpdGVTaGVldCA9IHtcbiAgZGlydDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuICAgIG5hbWU6ICdpbnRybycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2NixcbiAgICBmcmFtZVdpZHRoOiAxNTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgaW50cm86IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faW50cm8ucG5nJyxcbiAgICBuYW1lOiAnaW50cm8nLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjYsXG4gICAgZnJhbWVXaWR0aDogMTUzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDEwMCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGlkbGU6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faWRsZS5wbmcnLFxuICAgIG5hbWU6ICdpZGxlJyxcbiAgICBmcmFtZUhlaWdodDogMTczLFxuICAgIGZyYW1lV2lkdGg6IDIwMyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEyLFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMTI1LFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgYml0ZV93OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9iaXRlX3dlc3QucG5nJyxcbiAgICBuYW1lOiAnYml0ZV93JyxcbiAgICBmcmFtZUhlaWdodDogMTYzLFxuICAgIGZyYW1lV2lkdGg6IDE5MixcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDUsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMS41LFxuICB9LFxuXG4gIGJpdGVfZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV9lYXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfZScsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEuNSxcbiAgfSxcblxuICBkZWFkOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2RlYWQucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA0LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMSxcbiAgfVxufTtcblxuY29uc3QgbW9uc3RlclNwcml0ZXMgPSB7XG4gIGludHJvOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5pbnRybyksXG4gIGlkbGU6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmlkbGUpLFxuICBkZWFkOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5kZWFkKSxcbiAgYml0ZV93OiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5iaXRlX3cpLFxuICBiaXRlX2U6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmJpdGVfZSlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbW9uc3RlclNwcml0ZXM7XG4iLCJsZXQgcGxheWVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vcGxheWVyX3Nwcml0ZXMnKTtcbmxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvciAoY3R4LCBjYW52YXNXLCBjYW52YXNILCBzcHJpdGUpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFswLCAwXTtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5mYWNpbmdQb3MgPSBcInJpZ2h0XCI7XG4gICAgdGhpcy5oaXRCb3hIID0gNTU7XG4gICAgdGhpcy5oaXRCb3hXID0gNjk7XG4gICAgdGhpcy5rZXlQcmVzc2VkID0ge307XG4gICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5jZW50ZXJDb29yZHMgPSBbMCwgMF07XG4gIH1cblxuICBzZXRDZW50ZXJDb29yZHMgKHgsIHkpIHtcbiAgICBsZXQgY2VudGVyWCA9IHggKyAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggLyAyKTtcbiAgICBsZXQgY2VudGVyWSA9IHkgKyAodGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0IC8gMik7XG5cbiAgICByZXR1cm4gW2NlbnRlclgsIGNlbnRlclldO1xuICB9XG5cbiAgcmVuZGVyKG5vdykge1xuICAgIHZhciBwbGF5ZXJTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBwbGF5ZXJTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcblxuICAgIC8vIHBsYXllclNwcml0ZS5hZGRFdmVudExpc3RlbmVyXG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKHBsYXllclNwcml0ZSwgdGhpcy5zaGlmdCwgMCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCk7XG4gICAgICAvLyBkZWJ1Z2dlclxuXG4gICAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgICAgaWYgKG5vdyAtIHRoaXMubGFzdFVwZGF0ZSA+IGZwcyAmJiAhdGhpcy5nYW1lT3ZlcikgIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgICB0aGlzLnNoaWZ0ID0gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSAqXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyAmJiAhdGhpcy5hbGl2ZSkge1xuICAgICAgICAgICAgLy8gdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcblxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcyApIHtcblxuICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICs9IDE7XG4gICAgfVxuICB9XG5cbiAgZGVhZCAoKSB7XG4gICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xuICB9XG5cbiAgc2V0SGl0Qm94IChmYWNpbmdQb3MpIHtcbiAgICBzd2l0Y2ggKGZhY2luZ1Bvcykge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5oaXRCb3hIID0gNTU7XG4gICAgICAgIHRoaXMuaGl0Qm94VyA9IDY5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA2OTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNTU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHRoaXMuaGl0Qm94SCA9IDU1O1xuICAgICAgICB0aGlzLmhpdEJveFcgPSA2OTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmhpdEJveEggPSA2OTtcbiAgICAgICAgdGhpcy5oaXRCb3hXID0gNTU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhY2luZ1BvcztcbiAgICB9XG4gIH1cblxuICBjdXJyZW50UG9zaXRpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwbGF5ZXJQb3M6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBwbGF5ZXJGYWNlOiB0aGlzLmZhY2luZ1Bvc1xuICAgIH07XG4gIH1cblxuICB1cGRhdGUoa2V5KSB7XG4gICAgY29uc3Qgc3ByaXRlSGVpZ2h0ID0gMTI1O1xuICAgIHRoaXMuc2V0SGl0Qm94KHRoaXMuZmFjaW5nUG9zKTtcbiAgICBsZXQgc3BlZWQgPSAxMjtcblxuICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICBpZih0aGlzLmtleVByZXNzZWRbMzddKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IHBsYXllclNwcml0ZXMuYWxpdmVMZWZ0O1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwibGVmdFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSA1KSB7dGhpcy5jb29yZGluYXRlc1swXS09c3BlZWQ7fVxuICAgICAgfVxuICAgICAgaWYodGhpcy5rZXlQcmVzc2VkWzM4XSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmFsaXZlVXA7XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJ1cFwiO1xuICAgICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA+PSAxNSkge3RoaXMuY29vcmRpbmF0ZXNbMV0tPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFszOV0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZVJpZ2h0O1xuICAgICAgICB0aGlzLmZhY2luZ1BvcyA9IFwicmlnaHRcIjtcbiAgICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gKHRoaXMuY2FudmFzVyAtIHRoaXMuaGl0Qm94SCAtIDMwKSlcbiAgICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMF0rPXNwZWVkO31cbiAgICAgIH1cbiAgICAgIGlmKHRoaXMua2V5UHJlc3NlZFs0MF0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gcGxheWVyU3ByaXRlcy5hbGl2ZURvd247XG4gICAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJkb3duXCI7XG4gICAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzFdIDw9ICh0aGlzLmNhbnZhc0ggLSB0aGlzLmhpdEJveEgpKVxuICAgICAgICB7dGhpcy5jb29yZGluYXRlc1sxXSs9c3BlZWQ7fVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBwbGF5ZXJTcHJpdGVzLmRlYWQ7XG4gICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jb25zdCBwbGF5ZXJTcHJpdGVTaGVldCA9IHtcbiAgZGVhZDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYmxvb2Rfc21hbGwucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDEyNCxcbiAgICBmcmFtZVdpZHRoOiAoNzYzIC8gNiksXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAxNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBlbXB0eToge1xuICAgIHVybDogJycsXG4gICAgbmFtZTogJycsXG4gICAgZnJhbWVIZWlnaHQ6IDAsXG4gICAgZnJhbWVXaWR0aDogMCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDAsXG4gICAgb25jZTogMCxcbiAgICBmcHM6IDAsXG4gICAgZnBzWDogMCxcbiAgfSxcblxuICBhbGl2ZUxlZnQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9sZWZ0LnBuZycsXG4gICAgbmFtZTogJ2xlZnQnLFxuICAgIGZyYW1lSGVpZ2h0OiA1NSxcbiAgICBmcmFtZVdpZHRoOiA5MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDEsXG4gICAgLy8gaGl0Qm94SGVpZ2h0T2Zmc2V0OlxuICAgIC8vIGhpdEJveFdpZHRoT2Zmc2V0OlxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVVcDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX3VwLnBuZycsXG4gICAgbmFtZTogJ3VwJyxcbiAgICBmcmFtZUhlaWdodDogOTMsXG4gICAgZnJhbWVXaWR0aDogNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVSaWdodDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlLnBuZycsXG4gICAgbmFtZTogJ3JpZ2h0JyxcbiAgICBmcmFtZUhlaWdodDogNTUsXG4gICAgZnJhbWVXaWR0aDogOTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbiAgYWxpdmVEb3duOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfZG93bi5wbmcnLFxuICAgIG5hbWU6ICdkb3duJyxcbiAgICBmcmFtZUhlaWdodDogOTMsXG4gICAgZnJhbWVXaWR0aDogNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxLFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcbn07XG5cbmNvbnN0IHBsYXllclNwcml0ZXMgPSB7XG4gIGRlYWQ6IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuZGVhZCksXG4gIGFsaXZlTGVmdDogbmV3IFNwcml0ZShwbGF5ZXJTcHJpdGVTaGVldC5hbGl2ZUxlZnQpLFxuICBhbGl2ZVVwOiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlVXApLFxuICBhbGl2ZVJpZ2h0OiBuZXcgU3ByaXRlKHBsYXllclNwcml0ZVNoZWV0LmFsaXZlUmlnaHQpLFxuICBhbGl2ZURvd246IG5ldyBTcHJpdGUocGxheWVyU3ByaXRlU2hlZXQuYWxpdmVEb3duKSxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwbGF5ZXJTcHJpdGVzO1xuIiwiY2xhc3MgU3ByaXRlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmw7XG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgIHRoaXMuZnJhbWVXaWR0aCA9IG9wdGlvbnMuZnJhbWVXaWR0aDtcbiAgICB0aGlzLmZyYW1lSGVpZ2h0ID0gb3B0aW9ucy5mcmFtZUhlaWdodDtcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IG9wdGlvbnMuY3VycmVudEZyYW1lO1xuICAgIHRoaXMudG90YWxGcmFtZXMgPSBvcHRpb25zLnRvdGFsRnJhbWVzO1xuICAgIHRoaXMub25jZSA9IG9wdGlvbnMub25jZTtcbiAgICB0aGlzLmZwcyA9IG9wdGlvbnMuZnBzO1xuICAgIHRoaXMuZnBzWCA9IG9wdGlvbnMuZnBzWDtcbiAgICB0aGlzLmRhbWFnZSA9IG9wdGlvbnMuZGFtYWdlO1xuICB9XG59XG4vLyB1cmwsIG5hbWUsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlXG5cbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlO1xuIiwiLy8gSE9XIFRPIEJVSUxEIFBIWVNJQ1MgRk9SIEEgV0VBUE9OP1xuLy8gQlVMTEVUIFNQRUVELCBTUFJFQUQsIERBTUFHRT9cbi8vIERPIFBIWVNJQ1MgTkVFRCBUTyBCRSBBIFNFUEFSQVRFIENMQVNTPyBDQU4gSSBJTVBPUlQgQSBMSUJSQVJZIFRPIEhBTkRMRSBUSEFUIExPR0lDP1xuXG5jbGFzcyBXZWFwb24ge1xuICBjb25zdHJ1Y3RvciAoYXR0cmlidXRlcykge1xuICAgIHRoaXMucmF0ZSA9IGF0dHJpYnV0ZXMucmF0ZTtcbiAgICB0aGlzLm1vZGVsID0gYXR0cmlidXRlcy5tb2RlbDtcbiAgICB0aGlzLnBvd2VyID0gYXR0cmlidXRlcy5wb3dlcjtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2VhcG9uO1xuIl19
