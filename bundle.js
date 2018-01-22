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
  constructor(playerAttr, canvasW, canvasH, ctx) {
    // create bounding box attributes
    // set heigh and width attributs for each which will simulate the hitbox
    this.active = true;
    this.playerPos = Object.assign([], playerAttr.playerPos);
    this.playerFace = playerAttr.playerFace;
    this.coordinates = this.setCoordinates(this.playerPos);
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.currentSprite = 'assets/images/bullet_horz.png';
    this.damage = 10;
    // USED FOR HITBOX
    // WILL HAVE TO SWAP DEPENING ON DIRECTION OR JUST USE ELSEWHERE
    this.height = 6;
    this.width = 14;


    this.setCoordinates = this.setCoordinates.bind(this);
    this.setHitBox = this.setHitBox.bind(this);
  }

  render () {
    var bulletSprite = new Image();
    bulletSprite.src = this.currentSprite;
    this.ctx.drawImage(bulletSprite, this.coordinates[0], this.coordinates[1]);
  }

  setHitBox (playerFace) {
    switch (playerFace) {
      case "left":
        this.height = 6;
        this.width = 14;
        break;
      case "up":
        this.height = 14;
        this.width = 6;
        break;
      case "right":
        this.height = 6;
        this.width = 14;
        break;
      case "down":
        this.height = 14;
        this.width = 6;
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
        // return [playerPos[0], playerPos[1]];
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
    // this.setCoordinates(this.playerPos);

    if (this.playerFace === "left") {
      this.currentSprite = 'assets/images/bullet_horz.png';
      this.coordinates[0]-= (500 * dt);
      this.active = this.active && this.coordinates[0] >= 0;
    }

    if (this.playerFace === "up") {
      this.currentSprite = 'assets/images/bullet_vert.png';
      this.coordinates[1]-= (500 * dt);
      this.active = this.active && this.coordinates[1] >= 0;
    }

    if (this.playerFace === "right") {
      this.currentSprite = 'assets/images/bullet_horz.png';
      this.coordinates[0]+= (500 * dt);
      this.active = this.active && this.coordinates[0] <= this.canvasW;
    }

    if (this.playerFace === "down") {
      this.currentSprite = 'assets/images/bullet_vert.png';
      this.coordinates[1]+= (500 * dt);
      this.active = this.active && this.coordinates[1] <= this.canvasH;
    }
  }
}


module.exports = Bullet;

},{}],3:[function(require,module,exports){
let Board = require('./board');
let monsterSprites = require('./monster_sprites');
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

  // function setStartButton () {
  //   debugger
  //   let button = document.getElementsByTagName('img')[0];
  //   button.addEventListener('click', function(e) {
  //     requestAnimationFrame( main );
  //   });
  // }

  function startGame () {
    let start = new Image();
    start.src = startButton;
    start.onload = function () {
      ctx.drawImage(start, 600, 300);
      canvas.addEventListener('click', function(e) {
          gameStart = true;
          myReq = requestAnimationFrame( main );
        });
    };
  }

  let gameStart = false;
  let bullets = [];
  let player = new Player(ctx, canvas.width, canvas.height);
  let monster = new Monster(ctx, canvas.width, canvas.height,
    monsterSprites.intro);
  let lastTime = Date.now();
  let key;

  function collisionDetected () {
    let collideBullets = Object.assign([], bullets);
    let bulletX;
    let bulletY;
    let playerX = player.coordinates[0];
    let playerY = player.coordinates[1];
    let monsterX = monster.coordinates[0];
    let monsterY = monster.coordinates[1];

    if (gameStart) {
      bullets.forEach(bullet => {
        bulletX = bullet.coordinates[0];
        bulletY = bullet.coordinates[1];
        if (bulletX < monsterX + monster.currentSprite.frameWidth &&
          bulletX + bullet.width > monsterX &&
          bulletY < monsterY + monster.currentSprite.frameHeight &&
          bulletY + bullet.height > monsterY) {
            monster.reduceHealth(bullet);
            bullets.splice(0, 1);

            if (monster.health <= 0) {
              monster.defeated();
            }
          }
        }
      );
    }
    if (playerX < monsterX + monster.currentSprite.frameWidth &&
      playerX + player.width > monsterX &&
      playerY < monsterY + monster.currentSprite.frameHeight &&
      playerY + player.height > monsterY &&
      monster.alive) {
        // cancelAnimationFrame(myReq);
        let gameOver = new Image();
        gameOver.src = gameOverSprite;
        ctx.drawImage(gameOver, 600, 300);
        setTimeout(() => {
          startGame();
        }, 3000);
      }
  }


  function shoot (playerPos) {
    bullets.push(new Bullet(playerPos, canvas.width,
      canvas.height, ctx));
    bullets = bullets.filter(bullet => bullet.active);
  }

  function update (key, dt, delta) {
    player.update(key);
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
    player.render();
    bullets.forEach(bullet => bullet.render());
  }

  document.onkeydown = function (evt) {
    key = evt.which;
    if (key === 32) {
      shoot(player.currentPosition());
    }
  };

  document.onkeyup = function(evt) {
    key = null;
  };

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
  startGame();
};

},{"./board":1,"./bullet":2,"./monster":4,"./monster_sprites":5,"./player":6,"./sprite":7,"./weapons":8}],4:[function(require,module,exports){
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
    this.health = 2000;
    this.alive = true;
    this.lastUpdate = Date.now();
    this.gameOver = false;

    this.targetPos = [];
    this.interval = null;
    this.counter = 0;
    this.finalPlayerPos = [];
  }

  defeated () {
    this.alive = false;
  }

  reduceHealth (bullet) {
    this.health -= bullet.damage;
  }

  render(now) {
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite.url;
    this.ctx.drawImage(monsterSprite, this.shift, 0,
      this.currentSprite.frameWidth, this.currentSprite.frameHeight,
      this.coordinates[0], this.coordinates[1], this.currentSprite.frameWidth,
      this.currentSprite.frameHeight);

    let fps = this.currentSprite.fps * this.currentSprite.fpsX;
    if (now - this.lastUpdate > fps && !this.gameOver)  {
      this.currentSprite.fps = fps;
      this.lastUpdate = now;
      this.shift = this.currentSprite.currentFrame *
      this.currentSprite.frameWidth;

      if (this.currentSprite.currentFrame === this.currentSprite.totalFrames &&
        this.currentSprite.name === 'intro') {

        this.coordinates = [this.coordinates[0] - 15, this.coordinates[1] + 15];
        this.currentSprite = monsterSprites.idle;
        this.shift = 0;
        this.currentSprite.currentFrame = 0;

      } else if (this.currentSprite.currentFrame ===
        this.currentSprite.totalFrames) {

        this.shift = 0;
        this.currentSprite.currentFrame = 0;
      }
      this.currentSprite.currentFrame += 1;
    }
  }

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
      let playerDir = this.findDirectionVector(this.finalPlayerPos);
      let magnitude = this.findMagnitude(playerDir[0], playerDir[1]);
      let normalized = this.normalizeVector(playerDir, magnitude);
      let velocity = 2;

      this.coordinates[0] = this.coordinates[0] + (normalized[0] *
        velocity * delta);
      this.coordinates[1] = this.coordinates[1] + (normalized[1] *
        velocity * delta);
  }

  handleIdle () {
      if (this.counter === 200) {
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
      this.finalPlayerPos = Object.assign([], this.targetPos);
    }

    if (this.coordinates[0] <= this.finalPlayerPos[0] +50){
      this.currentSprite = monsterSprites.idle;
      this.currentSprite.currentFrame = 0;
      this.coordinates = [this.finalPlayerPos[0] + 10, this.finalPlayerPos[1]];
      this.finalPlayerPos = [];
      this.targetPos = [];
    } else if (this.coordinates[0] >= this.finalPlayerPos[0]) {
      this.chasePlayer(this.finalPlayerPos, delta);
    }
  }

  handleBiteEast (delta) {
    if (this.finalPlayerPos.length === 0) {
      this.finalPlayerPos = Object.assign([], this.targetPos);
    }

    if (this.coordinates[0] >= this.finalPlayerPos[0] -50){
      this.currentSprite = monsterSprites.idle;
      this.currentSprite.currentFrame = 0;
      this.coordinates = [this.finalPlayerPos[0] -10, this.finalPlayerPos[1]];
      this.finalPlayerPos = [];
      this.targetPos = [];
    } else if (this.coordinates[0] <= this.finalPlayerPos[0]) {
      this.chasePlayer(this.finalPlayerPos, delta);
    }
  }

  update(playerPos, dt, delta) {
    if (!this.alive) {
      this.currentSprite = monsterSprites.dead;
      return null;
    }
    // TRACKS POSITION OF PLAYER
    if (this.targetPos.length === 0) {
      this.interval = setInterval(() => {
          this.targetPos = Object.assign([], playerPos);
      }, 1000);
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

},{"./monster_sprites":5,"./sprite":7}],5:[function(require,module,exports){
let Sprite = require('./sprite');

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
    fps: 250,
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
    fpsX: 1,
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
    fpsX: 1,
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
    fpsX: 1.5,
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

},{"./sprite":7}],6:[function(require,module,exports){
class Player {
  // player physics
  // FIGURE OUT HOW TO MAKE IT SO WHEN A KEY IS RELEASED,
  // MOVEMENT GOES BACK TO LAST PRESSED KEY IF STILL HELD DOWN

  constructor (ctx, canvasW, canvasH) {
    this.ctx = ctx;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.coordinates = [0, 0];
    this.currentSprite = 'assets/images/player_rifle.png';
    this.facingPos = "right";
    this.height = 40;
    this.width = 80;
  }

  render() {
    var playerSprite = new Image();
    playerSprite.src = this.currentSprite;
    this.ctx.drawImage(playerSprite, this.coordinates[0], this.coordinates[1]);
  }

  setHitBox (facingPos) {
    switch (facingPos) {
      case "left":
        this.height = 40;
        this.width = 80;
        break;
      case "up":
        this.height = 80;
        this.width = 40;
        break;
      case "right":
        this.height = 40;
        this.width = 80;
        break;
      case "down":
        this.height = 80;
        this.width = 40;
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
    let speed = 15;

    if(key === 37) {
      this.currentSprite = 'assets/images/player_rifle_left.png';
      this.facingPos = "left";
      if (this.coordinates[0] >= 5) {this.coordinates[0]-=speed;}
    }
    if(key === 38) {
      this.currentSprite = 'assets/images/player_rifle_up.png';
      this.facingPos = "up";
      if (this.coordinates[1] >= 15) {this.coordinates[1]-=speed;}
    }
    if(key === 39) {
      this.currentSprite = 'assets/images/player_rifle.png';
      this.facingPos = "right";
      if (this.coordinates[0] <= (this.canvasW - this.height - 30))
      {this.coordinates[0]+=speed;}
    }
    if(key === 40) {
      this.currentSprite = 'assets/images/player_rifle_down.png';
      this.facingPos = "down";
      if (this.coordinates[1] <= (this.canvasH - this.height))
      {this.coordinates[1]+=speed;}
    }
  }

}

module.exports = Player;

},{}],7:[function(require,module,exports){
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
  }
}
// url, name, pos, size, speed, frames, dir, once

module.exports = Sprite;

},{}],8:[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJvYXJkLmpzIiwiYnVsbGV0LmpzIiwibWFpbi5qcyIsIm1vbnN0ZXIuanMiLCJtb25zdGVyX3Nwcml0ZXMuanMiLCJwbGF5ZXIuanMiLCJzcHJpdGUuanMiLCJ3ZWFwb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGRyb3AgZXZlbnQgbGlzdGVuZXIgaGVyZVxuLy8gU0hPVUxEIFNFVCBJVCBVUCBGT1IgRlVSVEhFUiBNQVBTXG4vLyBCT0FSRCBJTlNUQU5DRSBDQU4gQkUgSU5WT0tFRCBVUE9OIEdBTUUgU1RBUlQgQU5EIFBBU1NFRCBJTiBBIFNQRUNJRklDIEJvYXJkXG4vLyBIT1cgRE8gSSBDUkVBVEUgVEhFIEJPQVJEIEFORCBQQVNTIElUIElOP1xuXG4vLyBjb25zdCBib2FyZCA9IHtcbi8vICAgYmdJbWFnZTogbmV3IEltYWdlKClcbi8vXG4vLyB9XG5jbGFzcyBCb2FyZCB7XG4gIGNvbnN0cnVjdG9yIChjdHgpIHtcbiAgICAvLyB0aGlzLmJhY2tncm91bmQgPSBuZXc7XG4gICAgLy8gdGhpcy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZGltYWdlO1xuICAgIC8vIHRoaXMuYm9hcmQgPSBwbGF0Zm9ybXM7XG4gIH1cbn1cblxuLy8gY2FuIGFsc28gc2V0IHRoaXMgYXMgYSBzaW5nbGUgZnVuY3Rpb25cblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDtcbiIsImNsYXNzIEJ1bGxldCB7XG4gIGNvbnN0cnVjdG9yKHBsYXllckF0dHIsIGNhbnZhc1csIGNhbnZhc0gsIGN0eCkge1xuICAgIC8vIGNyZWF0ZSBib3VuZGluZyBib3ggYXR0cmlidXRlc1xuICAgIC8vIHNldCBoZWlnaCBhbmQgd2lkdGggYXR0cmlidXRzIGZvciBlYWNoIHdoaWNoIHdpbGwgc2ltdWxhdGUgdGhlIGhpdGJveFxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnBsYXllclBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllckF0dHIucGxheWVyUG9zKTtcbiAgICB0aGlzLnBsYXllckZhY2UgPSBwbGF5ZXJBdHRyLnBsYXllckZhY2U7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IHRoaXMuc2V0Q29vcmRpbmF0ZXModGhpcy5wbGF5ZXJQb3MpO1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgIHRoaXMuZGFtYWdlID0gMTA7XG4gICAgLy8gVVNFRCBGT1IgSElUQk9YXG4gICAgLy8gV0lMTCBIQVZFIFRPIFNXQVAgREVQRU5JTkcgT04gRElSRUNUSU9OIE9SIEpVU1QgVVNFIEVMU0VXSEVSRVxuICAgIHRoaXMuaGVpZ2h0ID0gNjtcbiAgICB0aGlzLndpZHRoID0gMTQ7XG5cblxuICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMgPSB0aGlzLnNldENvb3JkaW5hdGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZXRIaXRCb3ggPSB0aGlzLnNldEhpdEJveC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgYnVsbGV0U3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgYnVsbGV0U3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZTtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYnVsbGV0U3ByaXRlLCB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdKTtcbiAgfVxuXG4gIHNldEhpdEJveCAocGxheWVyRmFjZSkge1xuICAgIHN3aXRjaCAocGxheWVyRmFjZSkge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA2O1xuICAgICAgICB0aGlzLndpZHRoID0gMTQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMTQ7XG4gICAgICAgIHRoaXMud2lkdGggPSA2O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmhlaWdodCA9IDY7XG4gICAgICAgIHRoaXMud2lkdGggPSAxNDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmhlaWdodCA9IDE0O1xuICAgICAgICB0aGlzLndpZHRoID0gNjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyRmFjZTtcbiAgICB9XG4gIH1cblxuICBzZXRDb29yZGluYXRlcyAocGxheWVyUG9zKSB7XG4gICAgbGV0IHggPSBwbGF5ZXJQb3NbMF07XG4gICAgbGV0IHkgPSBwbGF5ZXJQb3NbMV07XG4gICAgdGhpcy5zZXRIaXRCb3godGhpcy5wbGF5ZXJGYWNlKTtcbiAgICBzd2l0Y2ggKHRoaXMucGxheWVyRmFjZSkge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgeCArPSA0O1xuICAgICAgICB5ICs9IDExO1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHggKz0gNDA7XG4gICAgICAgIHkgKz0gNTtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgLy8gcmV0dXJuIFtwbGF5ZXJQb3NbMF0sIHBsYXllclBvc1sxXV07XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgeCArPSA3NTtcbiAgICAgICAgeSArPSA0MDtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHggKz0gMTE7XG4gICAgICAgIHkgKz0gODA7XG4gICAgICAgIHJldHVyblt4LCB5XTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwbGF5ZXJQb3M7XG4gICAgfVxuXG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICAvLyB0aGlzLnNldENvb3JkaW5hdGVzKHRoaXMucGxheWVyUG9zKTtcblxuICAgIGlmICh0aGlzLnBsYXllckZhY2UgPT09IFwibGVmdFwiKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgdGhpcy5jb29yZGluYXRlc1swXS09ICg1MDAgKiBkdCk7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wbGF5ZXJGYWNlID09PSBcInVwXCIpIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdLT0gKDUwMCAqIGR0KTtcbiAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBsYXllckZhY2UgPT09IFwicmlnaHRcIikge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJztcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0rPSAoNTAwICogZHQpO1xuICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wbGF5ZXJGYWNlID09PSBcImRvd25cIikge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0rPSAoNTAwICogZHQpO1xuICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9IHRoaXMuY2FudmFzSDtcbiAgICB9XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGxldDtcbiIsImxldCBCb2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcbmxldCBtb25zdGVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vbW9uc3Rlcl9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcbmxldCBNb25zdGVyID0gcmVxdWlyZSgnLi9tb25zdGVyJyk7XG5sZXQgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcbmxldCBXZWFwb25zID0gcmVxdWlyZSgnLi93ZWFwb25zJyk7XG5sZXQgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGxldCBzdGFydEJ1dHRvbiA9ICdhc3NldHMvaW1hZ2VzL3N0YXJ0X2J1dHRvbi5wbmcnO1xuICBsZXQgZ2FtZU92ZXJTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9nYW1lX292ZXIucG5nJztcbiAgbGV0IG15UmVxO1xuXG4gIC8vIGZ1bmN0aW9uIHNldFN0YXJ0QnV0dG9uICgpIHtcbiAgLy8gICBkZWJ1Z2dlclxuICAvLyAgIGxldCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJylbMF07XG4gIC8vICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAvLyAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluICk7XG4gIC8vICAgfSk7XG4gIC8vIH1cblxuICBmdW5jdGlvbiBzdGFydEdhbWUgKCkge1xuICAgIGxldCBzdGFydCA9IG5ldyBJbWFnZSgpO1xuICAgIHN0YXJ0LnNyYyA9IHN0YXJ0QnV0dG9uO1xuICAgIHN0YXJ0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2Uoc3RhcnQsIDYwMCwgMzAwKTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBnYW1lU3RhcnQgPSB0cnVlO1xuICAgICAgICAgIG15UmVxID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluICk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBsZXQgZ2FtZVN0YXJ0ID0gZmFsc2U7XG4gIGxldCBidWxsZXRzID0gW107XG4gIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgbGV0IG1vbnN0ZXIgPSBuZXcgTW9uc3RlcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICBtb25zdGVyU3ByaXRlcy5pbnRybyk7XG4gIGxldCBsYXN0VGltZSA9IERhdGUubm93KCk7XG4gIGxldCBrZXk7XG5cbiAgZnVuY3Rpb24gY29sbGlzaW9uRGV0ZWN0ZWQgKCkge1xuICAgIGxldCBjb2xsaWRlQnVsbGV0cyA9IE9iamVjdC5hc3NpZ24oW10sIGJ1bGxldHMpO1xuICAgIGxldCBidWxsZXRYO1xuICAgIGxldCBidWxsZXRZO1xuICAgIGxldCBwbGF5ZXJYID0gcGxheWVyLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCBwbGF5ZXJZID0gcGxheWVyLmNvb3JkaW5hdGVzWzFdO1xuICAgIGxldCBtb25zdGVyWCA9IG1vbnN0ZXIuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IG1vbnN0ZXJZID0gbW9uc3Rlci5jb29yZGluYXRlc1sxXTtcblxuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xuICAgICAgICBidWxsZXRYID0gYnVsbGV0LmNvb3JkaW5hdGVzWzBdO1xuICAgICAgICBidWxsZXRZID0gYnVsbGV0LmNvb3JkaW5hdGVzWzFdO1xuICAgICAgICBpZiAoYnVsbGV0WCA8IG1vbnN0ZXJYICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggJiZcbiAgICAgICAgICBidWxsZXRYICsgYnVsbGV0LndpZHRoID4gbW9uc3RlclggJiZcbiAgICAgICAgICBidWxsZXRZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgJiZcbiAgICAgICAgICBidWxsZXRZICsgYnVsbGV0LmhlaWdodCA+IG1vbnN0ZXJZKSB7XG4gICAgICAgICAgICBtb25zdGVyLnJlZHVjZUhlYWx0aChidWxsZXQpO1xuICAgICAgICAgICAgYnVsbGV0cy5zcGxpY2UoMCwgMSk7XG5cbiAgICAgICAgICAgIGlmIChtb25zdGVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICAgIG1vbnN0ZXIuZGVmZWF0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChwbGF5ZXJYIDwgbW9uc3RlclggKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAmJlxuICAgICAgcGxheWVyWCArIHBsYXllci53aWR0aCA+IG1vbnN0ZXJYICYmXG4gICAgICBwbGF5ZXJZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgJiZcbiAgICAgIHBsYXllclkgKyBwbGF5ZXIuaGVpZ2h0ID4gbW9uc3RlclkgJiZcbiAgICAgIG1vbnN0ZXIuYWxpdmUpIHtcbiAgICAgICAgLy8gY2FuY2VsQW5pbWF0aW9uRnJhbWUobXlSZXEpO1xuICAgICAgICBsZXQgZ2FtZU92ZXIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgZ2FtZU92ZXIuc3JjID0gZ2FtZU92ZXJTcHJpdGU7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoZ2FtZU92ZXIsIDYwMCwgMzAwKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgc3RhcnRHYW1lKCk7XG4gICAgICAgIH0sIDMwMDApO1xuICAgICAgfVxuICB9XG5cblxuICBmdW5jdGlvbiBzaG9vdCAocGxheWVyUG9zKSB7XG4gICAgYnVsbGV0cy5wdXNoKG5ldyBCdWxsZXQocGxheWVyUG9zLCBjYW52YXMud2lkdGgsXG4gICAgICBjYW52YXMuaGVpZ2h0LCBjdHgpKTtcbiAgICBidWxsZXRzID0gYnVsbGV0cy5maWx0ZXIoYnVsbGV0ID0+IGJ1bGxldC5hY3RpdmUpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlIChrZXksIGR0LCBkZWx0YSkge1xuICAgIHBsYXllci51cGRhdGUoa2V5KTtcbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBtb25zdGVyLnVwZGF0ZShwbGF5ZXIuY29vcmRpbmF0ZXMsIGR0LCBkZWx0YSk7XG4gICAgfVxuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnVwZGF0ZShkdCkpO1xuICB9XG5cbiAgY29uc3QgY2xlYXIgPSAoKSA9PiAge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgfTtcblxuICBmdW5jdGlvbiByZW5kZXIgKG5vdykge1xuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIG1vbnN0ZXIucmVuZGVyKG5vdyk7XG4gICAgfVxuICAgIHBsYXllci5yZW5kZXIoKTtcbiAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC5yZW5kZXIoKSk7XG4gIH1cblxuICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAga2V5ID0gZXZ0LndoaWNoO1xuICAgIGlmIChrZXkgPT09IDMyKSB7XG4gICAgICBzaG9vdChwbGF5ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xuICAgIH1cbiAgfTtcblxuICBkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAga2V5ID0gbnVsbDtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWluKCkge1xuICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGxldCBkZWx0YSA9IG5vdyAtIGxhc3RUaW1lO1xuICAgIGxldCBkdCA9IChkZWx0YSkgLyA1MDAuMDtcbiAgICBteVJlcSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSggbWFpbiApO1xuICAgIGNvbGxpc2lvbkRldGVjdGVkKCk7XG4gICAgdXBkYXRlKGtleSwgZHQsIGRlbHRhKTtcbiAgICBjbGVhcigpO1xuICAgIHJlbmRlcihub3cpO1xuICAgIGxhc3RUaW1lID0gbm93O1xuICB9XG4gIHN0YXJ0R2FtZSgpO1xufTtcbiIsIi8vIE1PTlNURVIgV0lMTCBDSEFTRSBQTEFZRVIsIFRBS0UgU0hPUlRFU1QgUk9VVEUgSUYgUE9TU0lCTEVcbmxldCBtb25zdGVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vbW9uc3Rlcl9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY2xhc3MgTW9uc3RlciB7XG4gIGNvbnN0cnVjdG9yIChjdHgsIGNhbnZhc1csIGNhbnZhc0gsIHNwcml0ZSkge1xuICAgIC8vIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICAvLyB0aGlzLnBvd2VyID0gb3B0aW9ucy5wb3dlcjtcbiAgICAvLyB0aGlzLnNwcml0ZSA9IG9wdGlvbnMuc3ByaXRlO1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gWzcwMCwgMzAwXTtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5oZWFsdGggPSAyMDAwO1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuXG4gICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB0aGlzLmludGVydmFsID0gbnVsbDtcbiAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBbXTtcbiAgfVxuXG4gIGRlZmVhdGVkICgpIHtcbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG4gIH1cblxuICByZWR1Y2VIZWFsdGggKGJ1bGxldCkge1xuICAgIHRoaXMuaGVhbHRoIC09IGJ1bGxldC5kYW1hZ2U7XG4gIH1cblxuICByZW5kZXIobm93KSB7XG4gICAgdmFyIG1vbnN0ZXJTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBtb25zdGVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZS51cmw7XG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKG1vbnN0ZXJTcHJpdGUsIHRoaXMuc2hpZnQsIDAsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgdGhpcy5jb29yZGluYXRlc1swXSwgdGhpcy5jb29yZGluYXRlc1sxXSwgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGgsXG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQpO1xuXG4gICAgbGV0IGZwcyA9IHRoaXMuY3VycmVudFNwcml0ZS5mcHMgKiB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzWDtcbiAgICBpZiAobm93IC0gdGhpcy5sYXN0VXBkYXRlID4gZnBzICYmICF0aGlzLmdhbWVPdmVyKSAge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZwcyA9IGZwcztcbiAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IG5vdztcbiAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICpcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9PT0gdGhpcy5jdXJyZW50U3ByaXRlLnRvdGFsRnJhbWVzICYmXG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5uYW1lID09PSAnaW50cm8nKSB7XG5cbiAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IFt0aGlzLmNvb3JkaW5hdGVzWzBdIC0gMTUsIHRoaXMuY29vcmRpbmF0ZXNbMV0gKyAxNV07XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcblxuICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PVxuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMpIHtcblxuICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lICs9IDE7XG4gICAgfVxuICB9XG5cbiAgZmluZERpcmVjdGlvblZlY3RvciAocGxheWVyUG9zKSB7XG4gICAgbGV0IHggPSBwbGF5ZXJQb3NbMF0gLSB0aGlzLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCB5ID0gcGxheWVyUG9zWzFdIC0gdGhpcy5jb29yZGluYXRlc1sxXTtcbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZmluZE1hZ25pdHVkZSAoeCwgeSkge1xuICAgIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgcmV0dXJuIG1hZ25pdHVkZTtcbiAgfVxuICBub3JtYWxpemVWZWN0b3IgKHBsYXllckRpciwgbWFnbml0dWRlKSB7XG4gICAgcmV0dXJuIFsocGxheWVyRGlyWzBdL21hZ25pdHVkZSksIChwbGF5ZXJEaXJbMV0vbWFnbml0dWRlKV07XG4gIH1cblxuICBjaGFzZVBsYXllciAocGxheWVyUG9zLCBkZWx0YSkge1xuICAgICAgbGV0IHBsYXllckRpciA9IHRoaXMuZmluZERpcmVjdGlvblZlY3Rvcih0aGlzLmZpbmFsUGxheWVyUG9zKTtcbiAgICAgIGxldCBtYWduaXR1ZGUgPSB0aGlzLmZpbmRNYWduaXR1ZGUocGxheWVyRGlyWzBdLCBwbGF5ZXJEaXJbMV0pO1xuICAgICAgbGV0IG5vcm1hbGl6ZWQgPSB0aGlzLm5vcm1hbGl6ZVZlY3RvcihwbGF5ZXJEaXIsIG1hZ25pdHVkZSk7XG4gICAgICBsZXQgdmVsb2NpdHkgPSAyO1xuXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdID0gdGhpcy5jb29yZGluYXRlc1swXSArIChub3JtYWxpemVkWzBdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdID0gdGhpcy5jb29yZGluYXRlc1sxXSArIChub3JtYWxpemVkWzFdICpcbiAgICAgICAgdmVsb2NpdHkgKiBkZWx0YSk7XG4gIH1cblxuICBoYW5kbGVJZGxlICgpIHtcbiAgICAgIGlmICh0aGlzLmNvdW50ZXIgPT09IDIwMCkge1xuICAgICAgICBpZiAodGhpcy50YXJnZXRQb3NbMF0gPj0gdGhpcy5jb29yZGluYXRlc1swXSkge1xuXG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuYml0ZV9lO1xuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmJpdGVfdztcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgICAgfVxuICB9XG5cbiAgaGFuZGxlQml0ZVdlc3QgKGRlbHRhKSB7XG4gICAgLy8gQklORFMgRklOQUwgUE9TSVRJT04gQkVGT1JFIEJJVEVcbiAgICBpZiAodGhpcy5maW5hbFBsYXllclBvcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBPYmplY3QuYXNzaWduKFtdLCB0aGlzLnRhcmdldFBvcyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5maW5hbFBsYXllclBvc1swXSArNTApe1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5jb29yZGluYXRlcyA9IFt0aGlzLmZpbmFsUGxheWVyUG9zWzBdICsgMTAsIHRoaXMuZmluYWxQbGF5ZXJQb3NbMV1dO1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jaGFzZVBsYXllcih0aGlzLmZpbmFsUGxheWVyUG9zLCBkZWx0YSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQml0ZUVhc3QgKGRlbHRhKSB7XG4gICAgaWYgKHRoaXMuZmluYWxQbGF5ZXJQb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gT2JqZWN0LmFzc2lnbihbXSwgdGhpcy50YXJnZXRQb3MpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdID49IHRoaXMuZmluYWxQbGF5ZXJQb3NbMF0gLTUwKXtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmlkbGU7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbdGhpcy5maW5hbFBsYXllclBvc1swXSAtMTAsIHRoaXMuZmluYWxQbGF5ZXJQb3NbMV1dO1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICAgICAgdGhpcy50YXJnZXRQb3MgPSBbXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gdGhpcy5maW5hbFBsYXllclBvc1swXSkge1xuICAgICAgdGhpcy5jaGFzZVBsYXllcih0aGlzLmZpbmFsUGxheWVyUG9zLCBkZWx0YSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKHBsYXllclBvcywgZHQsIGRlbHRhKSB7XG4gICAgaWYgKCF0aGlzLmFsaXZlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5kZWFkO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIFRSQUNLUyBQT1NJVElPTiBPRiBQTEFZRVJcbiAgICBpZiAodGhpcy50YXJnZXRQb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudGFyZ2V0UG9zID0gT2JqZWN0LmFzc2lnbihbXSwgcGxheWVyUG9zKTtcbiAgICAgIH0sIDEwMDApO1xuICB9XG4gICAgLy8gT0ZGU0VUIEZPUiBJRExFIEFOSU1BVElPTlxuICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciB8fCAwO1xuXG4gICAgc3dpdGNoICh0aGlzLmN1cnJlbnRTcHJpdGUubmFtZSkge1xuICAgICAgY2FzZSAnaWRsZSc6XG4gICAgICAgICAgdGhpcy5jb3VudGVyKys7XG4gICAgICAgICAgdGhpcy5oYW5kbGVJZGxlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYml0ZV93JzpcbiAgICAgICAgdGhpcy5oYW5kbGVCaXRlV2VzdChkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYml0ZV9lJzpcbiAgICAgICAgdGhpcy5oYW5kbGVCaXRlRWFzdChkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vbnN0ZXI7XG4iLCJsZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY29uc3QgbW9uc3RlclNwcml0ZVNoZWV0ID0ge1xuICBkaXJ0OiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG4gICAgbmFtZTogJ2ludHJvJyxcbiAgICBmcmFtZUhlaWdodDogMTY2LFxuICAgIGZyYW1lV2lkdGg6IDE1MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDE2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBpbnRybzoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pbnRyby5wbmcnLFxuICAgIG5hbWU6ICdpbnRybycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2NixcbiAgICBmcmFtZVdpZHRoOiAxNTMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxNixcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjUwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgaWRsZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9pZGxlLnBuZycsXG4gICAgbmFtZTogJ2lkbGUnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNzMsXG4gICAgZnJhbWVXaWR0aDogMjAzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTIsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAxMjUsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBiaXRlX3c6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL2JpdGVfd2VzdC5wbmcnLFxuICAgIG5hbWU6ICdiaXRlX3cnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjMsXG4gICAgZnJhbWVXaWR0aDogMTkyLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNSxcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDIwMCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGJpdGVfZToge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV9lYXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfZScsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgZGVhZDoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvd29ybV9kZWFkLnBuZycsXG4gICAgbmFtZTogJ2RlYWQnLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjMsXG4gICAgZnJhbWVXaWR0aDogMTU1LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogNCxcbiAgICBvbmNlOiB0cnVlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEuNSxcbiAgfVxufTtcblxuY29uc3QgbW9uc3RlclNwcml0ZXMgPSB7XG4gIGludHJvOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5pbnRybyksXG4gIGlkbGU6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmlkbGUpLFxuICBkZWFkOiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5kZWFkKSxcbiAgYml0ZV93OiBuZXcgU3ByaXRlKG1vbnN0ZXJTcHJpdGVTaGVldC5iaXRlX3cpLFxuICBiaXRlX2U6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmJpdGVfZSlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbW9uc3RlclNwcml0ZXM7XG4iLCJjbGFzcyBQbGF5ZXIge1xuICAvLyBwbGF5ZXIgcGh5c2ljc1xuICAvLyBGSUdVUkUgT1VUIEhPVyBUTyBNQUtFIElUIFNPIFdIRU4gQSBLRVkgSVMgUkVMRUFTRUQsXG4gIC8vIE1PVkVNRU5UIEdPRVMgQkFDSyBUTyBMQVNUIFBSRVNTRUQgS0VZIElGIFNUSUxMIEhFTEQgRE9XTlxuXG4gIGNvbnN0cnVjdG9yIChjdHgsIGNhbnZhc1csIGNhbnZhc0gpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmNhbnZhc1cgPSBjYW52YXNXO1xuICAgIHRoaXMuY2FudmFzSCA9IGNhbnZhc0g7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFswLCAwXTtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGUucG5nJztcbiAgICB0aGlzLmZhY2luZ1BvcyA9IFwicmlnaHRcIjtcbiAgICB0aGlzLmhlaWdodCA9IDQwO1xuICAgIHRoaXMud2lkdGggPSA4MDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgcGxheWVyU3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgcGxheWVyU3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZTtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UocGxheWVyU3ByaXRlLCB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdKTtcbiAgfVxuXG4gIHNldEhpdEJveCAoZmFjaW5nUG9zKSB7XG4gICAgc3dpdGNoIChmYWNpbmdQb3MpIHtcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gNDA7XG4gICAgICAgIHRoaXMud2lkdGggPSA4MDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA4MDtcbiAgICAgICAgdGhpcy53aWR0aCA9IDQwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmhlaWdodCA9IDQwO1xuICAgICAgICB0aGlzLndpZHRoID0gODA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA4MDtcbiAgICAgICAgdGhpcy53aWR0aCA9IDQwO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWNpbmdQb3M7XG4gICAgfVxuICB9XG5cbiAgY3VycmVudFBvc2l0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcGxheWVyUG9zOiB0aGlzLmNvb3JkaW5hdGVzLFxuICAgICAgcGxheWVyRmFjZTogdGhpcy5mYWNpbmdQb3NcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlKGtleSkge1xuICAgIGNvbnN0IHNwcml0ZUhlaWdodCA9IDEyNTtcbiAgICB0aGlzLnNldEhpdEJveCh0aGlzLmZhY2luZ1Bvcyk7XG4gICAgbGV0IHNwZWVkID0gMTU7XG5cbiAgICBpZihrZXkgPT09IDM3KSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGVfbGVmdC5wbmcnO1xuICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcImxlZnRcIjtcbiAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdID49IDUpIHt0aGlzLmNvb3JkaW5hdGVzWzBdLT1zcGVlZDt9XG4gICAgfVxuICAgIGlmKGtleSA9PT0gMzgpIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV91cC5wbmcnO1xuICAgICAgdGhpcy5mYWNpbmdQb3MgPSBcInVwXCI7XG4gICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA+PSAxNSkge3RoaXMuY29vcmRpbmF0ZXNbMV0tPXNwZWVkO31cbiAgICB9XG4gICAgaWYoa2V5ID09PSAzOSkge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlLnBuZyc7XG4gICAgICB0aGlzLmZhY2luZ1BvcyA9IFwicmlnaHRcIjtcbiAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzBdIDw9ICh0aGlzLmNhbnZhc1cgLSB0aGlzLmhlaWdodCAtIDMwKSlcbiAgICAgIHt0aGlzLmNvb3JkaW5hdGVzWzBdKz1zcGVlZDt9XG4gICAgfVxuICAgIGlmKGtleSA9PT0gNDApIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9kb3duLnBuZyc7XG4gICAgICB0aGlzLmZhY2luZ1BvcyA9IFwiZG93blwiO1xuICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMV0gPD0gKHRoaXMuY2FudmFzSCAtIHRoaXMuaGVpZ2h0KSlcbiAgICAgIHt0aGlzLmNvb3JkaW5hdGVzWzFdKz1zcGVlZDt9XG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCJjbGFzcyBTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybDtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5mcmFtZVdpZHRoID0gb3B0aW9ucy5mcmFtZVdpZHRoO1xuICAgIHRoaXMuZnJhbWVIZWlnaHQgPSBvcHRpb25zLmZyYW1lSGVpZ2h0O1xuICAgIHRoaXMuY3VycmVudEZyYW1lID0gb3B0aW9ucy5jdXJyZW50RnJhbWU7XG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IG9wdGlvbnMudG90YWxGcmFtZXM7XG4gICAgdGhpcy5vbmNlID0gb3B0aW9ucy5vbmNlO1xuICAgIHRoaXMuZnBzID0gb3B0aW9ucy5mcHM7XG4gICAgdGhpcy5mcHNYID0gb3B0aW9ucy5mcHNYO1xuICB9XG59XG4vLyB1cmwsIG5hbWUsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlXG5cbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlO1xuIiwiLy8gSE9XIFRPIEJVSUxEIFBIWVNJQ1MgRk9SIEEgV0VBUE9OP1xuLy8gQlVMTEVUIFNQRUVELCBTUFJFQUQsIERBTUFHRT9cbi8vIERPIFBIWVNJQ1MgTkVFRCBUTyBCRSBBIFNFUEFSQVRFIENMQVNTPyBDQU4gSSBJTVBPUlQgQSBMSUJSQVJZIFRPIEhBTkRMRSBUSEFUIExPR0lDP1xuXG5jbGFzcyBXZWFwb24ge1xuICBjb25zdHJ1Y3RvciAoYXR0cmlidXRlcykge1xuICAgIHRoaXMucmF0ZSA9IGF0dHJpYnV0ZXMucmF0ZTtcbiAgICB0aGlzLm1vZGVsID0gYXR0cmlidXRlcy5tb2RlbDtcbiAgICB0aGlzLnBvd2VyID0gYXR0cmlidXRlcy5wb3dlcjtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2VhcG9uO1xuIl19
