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
    this.health = 100;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMC4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJvYXJkLmpzIiwiYnVsbGV0LmpzIiwibWFpbi5qcyIsIm1vbnN0ZXIuanMiLCJtb25zdGVyX3Nwcml0ZXMuanMiLCJwbGF5ZXIuanMiLCJzcHJpdGUuanMiLCJ3ZWFwb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGRyb3AgZXZlbnQgbGlzdGVuZXIgaGVyZVxuLy8gU0hPVUxEIFNFVCBJVCBVUCBGT1IgRlVSVEhFUiBNQVBTXG4vLyBCT0FSRCBJTlNUQU5DRSBDQU4gQkUgSU5WT0tFRCBVUE9OIEdBTUUgU1RBUlQgQU5EIFBBU1NFRCBJTiBBIFNQRUNJRklDIEJvYXJkXG4vLyBIT1cgRE8gSSBDUkVBVEUgVEhFIEJPQVJEIEFORCBQQVNTIElUIElOP1xuXG4vLyBjb25zdCBib2FyZCA9IHtcbi8vICAgYmdJbWFnZTogbmV3IEltYWdlKClcbi8vXG4vLyB9XG5jbGFzcyBCb2FyZCB7XG4gIGNvbnN0cnVjdG9yIChjdHgpIHtcbiAgICAvLyB0aGlzLmJhY2tncm91bmQgPSBuZXc7XG4gICAgLy8gdGhpcy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZGltYWdlO1xuICAgIC8vIHRoaXMuYm9hcmQgPSBwbGF0Zm9ybXM7XG4gIH1cbn1cblxuLy8gY2FuIGFsc28gc2V0IHRoaXMgYXMgYSBzaW5nbGUgZnVuY3Rpb25cblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDtcbiIsImNsYXNzIEJ1bGxldCB7XG4gIGNvbnN0cnVjdG9yKHBsYXllckF0dHIsIGNhbnZhc1csIGNhbnZhc0gsIGN0eCkge1xuICAgIC8vIGNyZWF0ZSBib3VuZGluZyBib3ggYXR0cmlidXRlc1xuICAgIC8vIHNldCBoZWlnaCBhbmQgd2lkdGggYXR0cmlidXRzIGZvciBlYWNoIHdoaWNoIHdpbGwgc2ltdWxhdGUgdGhlIGhpdGJveFxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnBsYXllclBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHBsYXllckF0dHIucGxheWVyUG9zKTtcbiAgICB0aGlzLnBsYXllckZhY2UgPSBwbGF5ZXJBdHRyLnBsYXllckZhY2U7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IHRoaXMuc2V0Q29vcmRpbmF0ZXModGhpcy5wbGF5ZXJQb3MpO1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgIHRoaXMuZGFtYWdlID0gMTA7XG4gICAgLy8gVVNFRCBGT1IgSElUQk9YXG4gICAgLy8gV0lMTCBIQVZFIFRPIFNXQVAgREVQRU5JTkcgT04gRElSRUNUSU9OIE9SIEpVU1QgVVNFIEVMU0VXSEVSRVxuICAgIHRoaXMuaGVpZ2h0ID0gNjtcbiAgICB0aGlzLndpZHRoID0gMTQ7XG5cblxuICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMgPSB0aGlzLnNldENvb3JkaW5hdGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZXRIaXRCb3ggPSB0aGlzLnNldEhpdEJveC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgYnVsbGV0U3ByaXRlID0gbmV3IEltYWdlKCk7XG4gICAgYnVsbGV0U3ByaXRlLnNyYyA9IHRoaXMuY3VycmVudFNwcml0ZTtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYnVsbGV0U3ByaXRlLCB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdKTtcbiAgfVxuXG4gIHNldEhpdEJveCAocGxheWVyRmFjZSkge1xuICAgIHN3aXRjaCAocGxheWVyRmFjZSkge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA2O1xuICAgICAgICB0aGlzLndpZHRoID0gMTQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMTQ7XG4gICAgICAgIHRoaXMud2lkdGggPSA2O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLmhlaWdodCA9IDY7XG4gICAgICAgIHRoaXMud2lkdGggPSAxNDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmhlaWdodCA9IDE0O1xuICAgICAgICB0aGlzLndpZHRoID0gNjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcGxheWVyRmFjZTtcbiAgICB9XG4gIH1cblxuICBzZXRDb29yZGluYXRlcyAocGxheWVyUG9zKSB7XG4gICAgbGV0IHggPSBwbGF5ZXJQb3NbMF07XG4gICAgbGV0IHkgPSBwbGF5ZXJQb3NbMV07XG4gICAgdGhpcy5zZXRIaXRCb3godGhpcy5wbGF5ZXJGYWNlKTtcbiAgICBzd2l0Y2ggKHRoaXMucGxheWVyRmFjZSkge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgeCArPSA0O1xuICAgICAgICB5ICs9IDExO1xuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHggKz0gNDA7XG4gICAgICAgIHkgKz0gNTtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgLy8gcmV0dXJuIFtwbGF5ZXJQb3NbMF0sIHBsYXllclBvc1sxXV07XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgeCArPSA3NTtcbiAgICAgICAgeSArPSA0MDtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHggKz0gMTE7XG4gICAgICAgIHkgKz0gODA7XG4gICAgICAgIHJldHVyblt4LCB5XTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwbGF5ZXJQb3M7XG4gICAgfVxuXG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICAvLyB0aGlzLnNldENvb3JkaW5hdGVzKHRoaXMucGxheWVyUG9zKTtcblxuICAgIGlmICh0aGlzLnBsYXllckZhY2UgPT09IFwibGVmdFwiKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9idWxsZXRfaG9yei5wbmcnO1xuICAgICAgdGhpcy5jb29yZGluYXRlc1swXS09ICg1MDAgKiBkdCk7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuYWN0aXZlICYmIHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wbGF5ZXJGYWNlID09PSBcInVwXCIpIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9ICdhc3NldHMvaW1hZ2VzL2J1bGxldF92ZXJ0LnBuZyc7XG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzFdLT0gKDUwMCAqIGR0KTtcbiAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5hY3RpdmUgJiYgdGhpcy5jb29yZGluYXRlc1sxXSA+PSAwO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBsYXllckZhY2UgPT09IFwicmlnaHRcIikge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X2hvcnoucG5nJztcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0rPSAoNTAwICogZHQpO1xuICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzBdIDw9IHRoaXMuY2FudmFzVztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wbGF5ZXJGYWNlID09PSBcImRvd25cIikge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvYnVsbGV0X3ZlcnQucG5nJztcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0rPSAoNTAwICogZHQpO1xuICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmFjdGl2ZSAmJiB0aGlzLmNvb3JkaW5hdGVzWzFdIDw9IHRoaXMuY2FudmFzSDtcbiAgICB9XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGxldDtcbiIsImxldCBCb2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcbmxldCBtb25zdGVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vbW9uc3Rlcl9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcbmxldCBNb25zdGVyID0gcmVxdWlyZSgnLi9tb25zdGVyJyk7XG5sZXQgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcbmxldCBXZWFwb25zID0gcmVxdWlyZSgnLi93ZWFwb25zJyk7XG5sZXQgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGxldCBzdGFydEJ1dHRvbiA9ICdhc3NldHMvaW1hZ2VzL3N0YXJ0X2J1dHRvbi5wbmcnO1xuICBsZXQgZ2FtZU92ZXJTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9nYW1lX292ZXIucG5nJztcbiAgbGV0IG15UmVxO1xuXG4gIC8vIGZ1bmN0aW9uIHNldFN0YXJ0QnV0dG9uICgpIHtcbiAgLy8gICBkZWJ1Z2dlclxuICAvLyAgIGxldCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJylbMF07XG4gIC8vICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAvLyAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluICk7XG4gIC8vICAgfSk7XG4gIC8vIH1cblxuICBmdW5jdGlvbiBzdGFydEdhbWUgKCkge1xuICAgIGxldCBzdGFydCA9IG5ldyBJbWFnZSgpO1xuICAgIHN0YXJ0LnNyYyA9IHN0YXJ0QnV0dG9uO1xuICAgIHN0YXJ0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2Uoc3RhcnQsIDYwMCwgMzAwKTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBnYW1lU3RhcnQgPSB0cnVlO1xuICAgICAgICAgIG15UmVxID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluICk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBsZXQgZ2FtZVN0YXJ0ID0gZmFsc2U7XG4gIGxldCBidWxsZXRzID0gW107XG4gIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKGN0eCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgbGV0IG1vbnN0ZXIgPSBuZXcgTW9uc3RlcihjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICBtb25zdGVyU3ByaXRlcy5pbnRybyk7XG4gIGxldCBsYXN0VGltZSA9IERhdGUubm93KCk7XG4gIGxldCBrZXk7XG5cbiAgZnVuY3Rpb24gY29sbGlzaW9uRGV0ZWN0ZWQgKCkge1xuICAgIGxldCBjb2xsaWRlQnVsbGV0cyA9IE9iamVjdC5hc3NpZ24oW10sIGJ1bGxldHMpO1xuICAgIGxldCBidWxsZXRYO1xuICAgIGxldCBidWxsZXRZO1xuICAgIGxldCBwbGF5ZXJYID0gcGxheWVyLmNvb3JkaW5hdGVzWzBdO1xuICAgIGxldCBwbGF5ZXJZID0gcGxheWVyLmNvb3JkaW5hdGVzWzFdO1xuICAgIGxldCBtb25zdGVyWCA9IG1vbnN0ZXIuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IG1vbnN0ZXJZID0gbW9uc3Rlci5jb29yZGluYXRlc1sxXTtcblxuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xuICAgICAgICBidWxsZXRYID0gYnVsbGV0LmNvb3JkaW5hdGVzWzBdO1xuICAgICAgICBidWxsZXRZID0gYnVsbGV0LmNvb3JkaW5hdGVzWzFdO1xuICAgICAgICBpZiAoYnVsbGV0WCA8IG1vbnN0ZXJYICsgbW9uc3Rlci5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGggJiZcbiAgICAgICAgICBidWxsZXRYICsgYnVsbGV0LndpZHRoID4gbW9uc3RlclggJiZcbiAgICAgICAgICBidWxsZXRZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgJiZcbiAgICAgICAgICBidWxsZXRZICsgYnVsbGV0LmhlaWdodCA+IG1vbnN0ZXJZKSB7XG4gICAgICAgICAgICBtb25zdGVyLnJlZHVjZUhlYWx0aChidWxsZXQpO1xuICAgICAgICAgICAgYnVsbGV0cy5zcGxpY2UoMCwgMSk7XG5cbiAgICAgICAgICAgIGlmIChtb25zdGVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICAgIG1vbnN0ZXIuZGVmZWF0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChwbGF5ZXJYIDwgbW9uc3RlclggKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCAmJlxuICAgICAgcGxheWVyWCArIHBsYXllci53aWR0aCA+IG1vbnN0ZXJYICYmXG4gICAgICBwbGF5ZXJZIDwgbW9uc3RlclkgKyBtb25zdGVyLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQgJiZcbiAgICAgIHBsYXllclkgKyBwbGF5ZXIuaGVpZ2h0ID4gbW9uc3RlclkgJiZcbiAgICAgIG1vbnN0ZXIuYWxpdmUpIHtcbiAgICAgICAgLy8gY2FuY2VsQW5pbWF0aW9uRnJhbWUobXlSZXEpO1xuICAgICAgICBsZXQgZ2FtZU92ZXIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgZ2FtZU92ZXIuc3JjID0gZ2FtZU92ZXJTcHJpdGU7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoZ2FtZU92ZXIsIDYwMCwgMzAwKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgc3RhcnRHYW1lKCk7XG4gICAgICAgIH0sIDMwMDApO1xuICAgICAgfVxuICB9XG5cblxuICBmdW5jdGlvbiBzaG9vdCAocGxheWVyUG9zKSB7XG4gICAgYnVsbGV0cy5wdXNoKG5ldyBCdWxsZXQocGxheWVyUG9zLCBjYW52YXMud2lkdGgsXG4gICAgICBjYW52YXMuaGVpZ2h0LCBjdHgpKTtcbiAgICBidWxsZXRzID0gYnVsbGV0cy5maWx0ZXIoYnVsbGV0ID0+IGJ1bGxldC5hY3RpdmUpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlIChrZXksIGR0LCBkZWx0YSkge1xuICAgIHBsYXllci51cGRhdGUoa2V5KTtcbiAgICBpZiAoZ2FtZVN0YXJ0KSB7XG4gICAgICBtb25zdGVyLnVwZGF0ZShwbGF5ZXIuY29vcmRpbmF0ZXMsIGR0LCBkZWx0YSk7XG4gICAgfVxuICAgIGJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4gYnVsbGV0LnVwZGF0ZShkdCkpO1xuICB9XG5cbiAgY29uc3QgY2xlYXIgPSAoKSA9PiAge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgfTtcblxuICBmdW5jdGlvbiByZW5kZXIgKG5vdykge1xuICAgIGlmIChnYW1lU3RhcnQpIHtcbiAgICAgIG1vbnN0ZXIucmVuZGVyKG5vdyk7XG4gICAgfVxuICAgIHBsYXllci5yZW5kZXIoKTtcbiAgICBidWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IGJ1bGxldC5yZW5kZXIoKSk7XG4gIH1cblxuICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAga2V5ID0gZXZ0LndoaWNoO1xuICAgIGlmIChrZXkgPT09IDMyKSB7XG4gICAgICBzaG9vdChwbGF5ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xuICAgIH1cbiAgfTtcblxuICBkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAga2V5ID0gbnVsbDtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWluKCkge1xuICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGxldCBkZWx0YSA9IG5vdyAtIGxhc3RUaW1lO1xuICAgIGxldCBkdCA9IChkZWx0YSkgLyA1MDAuMDtcbiAgICBteVJlcSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSggbWFpbiApO1xuICAgIGNvbGxpc2lvbkRldGVjdGVkKCk7XG4gICAgdXBkYXRlKGtleSwgZHQsIGRlbHRhKTtcbiAgICBjbGVhcigpO1xuICAgIHJlbmRlcihub3cpO1xuICAgIGxhc3RUaW1lID0gbm93O1xuICB9XG4gIHN0YXJ0R2FtZSgpO1xufTtcbiIsIi8vIE1PTlNURVIgV0lMTCBDSEFTRSBQTEFZRVIsIFRBS0UgU0hPUlRFU1QgUk9VVEUgSUYgUE9TU0lCTEVcbmxldCBtb25zdGVyU3ByaXRlcyA9IHJlcXVpcmUoJy4vbW9uc3Rlcl9zcHJpdGVzJyk7XG5sZXQgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcblxuY2xhc3MgTW9uc3RlciB7XG4gIGNvbnN0cnVjdG9yIChjdHgsIGNhbnZhc1csIGNhbnZhc0gsIHNwcml0ZSkge1xuICAgIC8vIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICAvLyB0aGlzLnBvd2VyID0gb3B0aW9ucy5wb3dlcjtcbiAgICAvLyB0aGlzLnNwcml0ZSA9IG9wdGlvbnMuc3ByaXRlO1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gWzcwMCwgMzAwXTtcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBzcHJpdGU7XG4gICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgdGhpcy5oZWFsdGggPSAxMDA7XG4gICAgdGhpcy5hbGl2ZSA9IHRydWU7XG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG5cbiAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgdGhpcy5maW5hbFBsYXllclBvcyA9IFtdO1xuICB9XG5cbiAgZGVmZWF0ZWQgKCkge1xuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHJlZHVjZUhlYWx0aCAoYnVsbGV0KSB7XG4gICAgdGhpcy5oZWFsdGggLT0gYnVsbGV0LmRhbWFnZTtcbiAgfVxuXG4gIHJlbmRlcihub3cpIHtcbiAgICB2YXIgbW9uc3RlclNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgIG1vbnN0ZXJTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlLnVybDtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UobW9uc3RlclNwcml0ZSwgdGhpcy5zaGlmdCwgMCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzWzBdLCB0aGlzLmNvb3JkaW5hdGVzWzFdLCB0aGlzLmN1cnJlbnRTcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5mcmFtZUhlaWdodCk7XG5cbiAgICBsZXQgZnBzID0gdGhpcy5jdXJyZW50U3ByaXRlLmZwcyAqIHRoaXMuY3VycmVudFNwcml0ZS5mcHNYO1xuICAgIGlmIChub3cgLSB0aGlzLmxhc3RVcGRhdGUgPiBmcHMgJiYgIXRoaXMuZ2FtZU92ZXIpICB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuZnBzID0gZnBzO1xuICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xuICAgICAgdGhpcy5zaGlmdCA9IHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKlxuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmZyYW1lV2lkdGg7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID09PSB0aGlzLmN1cnJlbnRTcHJpdGUudG90YWxGcmFtZXMgJiZcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLm5hbWUgPT09ICdpbnRybycpIHtcblxuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW3RoaXMuY29vcmRpbmF0ZXNbMF0gLSAxNSwgdGhpcy5jb29yZGluYXRlc1sxXSArIDE1XTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgICAgdGhpcy5zaGlmdCA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPT09XG4gICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS50b3RhbEZyYW1lcykge1xuXG4gICAgICAgIHRoaXMuc2hpZnQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgKz0gMTtcbiAgICB9XG4gIH1cblxuICBmaW5kRGlyZWN0aW9uVmVjdG9yIChwbGF5ZXJQb3MpIHtcbiAgICBsZXQgeCA9IHBsYXllclBvc1swXSAtIHRoaXMuY29vcmRpbmF0ZXNbMF07XG4gICAgbGV0IHkgPSBwbGF5ZXJQb3NbMV0gLSB0aGlzLmNvb3JkaW5hdGVzWzFdO1xuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBmaW5kTWFnbml0dWRlICh4LCB5KSB7XG4gICAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICByZXR1cm4gbWFnbml0dWRlO1xuICB9XG4gIG5vcm1hbGl6ZVZlY3RvciAocGxheWVyRGlyLCBtYWduaXR1ZGUpIHtcbiAgICByZXR1cm4gWyhwbGF5ZXJEaXJbMF0vbWFnbml0dWRlKSwgKHBsYXllckRpclsxXS9tYWduaXR1ZGUpXTtcbiAgfVxuXG4gIGNoYXNlUGxheWVyIChwbGF5ZXJQb3MsIGRlbHRhKSB7XG4gICAgICBsZXQgcGxheWVyRGlyID0gdGhpcy5maW5kRGlyZWN0aW9uVmVjdG9yKHRoaXMuZmluYWxQbGF5ZXJQb3MpO1xuICAgICAgbGV0IG1hZ25pdHVkZSA9IHRoaXMuZmluZE1hZ25pdHVkZShwbGF5ZXJEaXJbMF0sIHBsYXllckRpclsxXSk7XG4gICAgICBsZXQgbm9ybWFsaXplZCA9IHRoaXMubm9ybWFsaXplVmVjdG9yKHBsYXllckRpciwgbWFnbml0dWRlKTtcbiAgICAgIGxldCB2ZWxvY2l0eSA9IDI7XG5cbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMF0gPSB0aGlzLmNvb3JkaW5hdGVzWzBdICsgKG5vcm1hbGl6ZWRbMF0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbMV0gPSB0aGlzLmNvb3JkaW5hdGVzWzFdICsgKG5vcm1hbGl6ZWRbMV0gKlxuICAgICAgICB2ZWxvY2l0eSAqIGRlbHRhKTtcbiAgfVxuXG4gIGhhbmRsZUlkbGUgKCkge1xuICAgICAgaWYgKHRoaXMuY291bnRlciA9PT0gMjAwKSB7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldFBvc1swXSA+PSB0aGlzLmNvb3JkaW5hdGVzWzBdKSB7XG5cbiAgICAgICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5iaXRlX2U7XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuYml0ZV93O1xuICAgICAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgICB9XG4gIH1cblxuICBoYW5kbGVCaXRlV2VzdCAoZGVsdGEpIHtcbiAgICAvLyBCSU5EUyBGSU5BTCBQT1NJVElPTiBCRUZPUkUgQklURVxuICAgIGlmICh0aGlzLmZpbmFsUGxheWVyUG9zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5maW5hbFBsYXllclBvcyA9IE9iamVjdC5hc3NpZ24oW10sIHRoaXMudGFyZ2V0UG9zKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdICs1MCl7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSBtb25zdGVyU3ByaXRlcy5pZGxlO1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW3RoaXMuZmluYWxQbGF5ZXJQb3NbMF0gKyAxMCwgdGhpcy5maW5hbFBsYXllclBvc1sxXV07XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW107XG4gICAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb29yZGluYXRlc1swXSA+PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmNoYXNlUGxheWVyKHRoaXMuZmluYWxQbGF5ZXJQb3MsIGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVCaXRlRWFzdCAoZGVsdGEpIHtcbiAgICBpZiAodGhpcy5maW5hbFBsYXllclBvcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZmluYWxQbGF5ZXJQb3MgPSBPYmplY3QuYXNzaWduKFtdLCB0aGlzLnRhcmdldFBvcyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gdGhpcy5maW5hbFBsYXllclBvc1swXSAtNTApe1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gbW9uc3RlclNwcml0ZXMuaWRsZTtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgdGhpcy5jb29yZGluYXRlcyA9IFt0aGlzLmZpbmFsUGxheWVyUG9zWzBdIC0xMCwgdGhpcy5maW5hbFBsYXllclBvc1sxXV07XG4gICAgICB0aGlzLmZpbmFsUGxheWVyUG9zID0gW107XG4gICAgICB0aGlzLnRhcmdldFBvcyA9IFtdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb29yZGluYXRlc1swXSA8PSB0aGlzLmZpbmFsUGxheWVyUG9zWzBdKSB7XG4gICAgICB0aGlzLmNoYXNlUGxheWVyKHRoaXMuZmluYWxQbGF5ZXJQb3MsIGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUocGxheWVyUG9zLCBkdCwgZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuYWxpdmUpIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9IG1vbnN0ZXJTcHJpdGVzLmRlYWQ7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gVFJBQ0tTIFBPU0lUSU9OIE9GIFBMQVlFUlxuICAgIGlmICh0aGlzLnRhcmdldFBvcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50YXJnZXRQb3MgPSBPYmplY3QuYXNzaWduKFtdLCBwbGF5ZXJQb3MpO1xuICAgICAgfSwgMTAwMCk7XG4gIH1cbiAgICAvLyBPRkZTRVQgRk9SIElETEUgQU5JTUFUSU9OXG4gICAgdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyIHx8IDA7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY3VycmVudFNwcml0ZS5uYW1lKSB7XG4gICAgICBjYXNlICdpZGxlJzpcbiAgICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgICB0aGlzLmhhbmRsZUlkbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiaXRlX3cnOlxuICAgICAgICB0aGlzLmhhbmRsZUJpdGVXZXN0KGRlbHRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiaXRlX2UnOlxuICAgICAgICB0aGlzLmhhbmRsZUJpdGVFYXN0KGRlbHRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9uc3RlcjtcbiIsImxldCBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG5jb25zdCBtb25zdGVyU3ByaXRlU2hlZXQgPSB7XG4gIGRpcnQ6IHtcbiAgICB1cmw6ICdhc3NldHMvaW1hZ2VzL3dvcm1faW50cm8ucG5nJyxcbiAgICBuYW1lOiAnaW50cm8nLFxuICAgIGZyYW1lSGVpZ2h0OiAxNjYsXG4gICAgZnJhbWVXaWR0aDogMTUzLFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogMTYsXG4gICAgb25jZTogdHJ1ZSxcbiAgICBmcHM6IDI1MCxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGludHJvOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2ludHJvLnBuZycsXG4gICAgbmFtZTogJ2ludHJvJyxcbiAgICBmcmFtZUhlaWdodDogMTY2LFxuICAgIGZyYW1lV2lkdGg6IDE1MyxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDE2LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyNTAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBpZGxlOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2lkbGUucG5nJyxcbiAgICBuYW1lOiAnaWRsZScsXG4gICAgZnJhbWVIZWlnaHQ6IDE3MyxcbiAgICBmcmFtZVdpZHRoOiAyMDMsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiAxMixcbiAgICBvbmNlOiBmYWxzZSxcbiAgICBmcHM6IDEyNSxcbiAgICBmcHNYOiAxLFxuICB9LFxuXG4gIGJpdGVfdzoge1xuICAgIHVybDogJ2Fzc2V0cy9pbWFnZXMvYml0ZV93ZXN0LnBuZycsXG4gICAgbmFtZTogJ2JpdGVfdycsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxOTIsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA1LFxuICAgIG9uY2U6IGZhbHNlLFxuICAgIGZwczogMjAwLFxuICAgIGZwc1g6IDEsXG4gIH0sXG5cbiAgYml0ZV9lOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy9iaXRlX2Vhc3QucG5nJyxcbiAgICBuYW1lOiAnYml0ZV9lJyxcbiAgICBmcmFtZUhlaWdodDogMTYzLFxuICAgIGZyYW1lV2lkdGg6IDE5MixcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IDUsXG4gICAgb25jZTogZmFsc2UsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMSxcbiAgfSxcblxuICBkZWFkOiB7XG4gICAgdXJsOiAnYXNzZXRzL2ltYWdlcy93b3JtX2RlYWQucG5nJyxcbiAgICBuYW1lOiAnZGVhZCcsXG4gICAgZnJhbWVIZWlnaHQ6IDE2MyxcbiAgICBmcmFtZVdpZHRoOiAxNTUsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiA0LFxuICAgIG9uY2U6IHRydWUsXG4gICAgZnBzOiAyMDAsXG4gICAgZnBzWDogMS41LFxuICB9XG59O1xuXG5jb25zdCBtb25zdGVyU3ByaXRlcyA9IHtcbiAgaW50cm86IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmludHJvKSxcbiAgaWRsZTogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuaWRsZSksXG4gIGRlYWQ6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmRlYWQpLFxuICBiaXRlX3c6IG5ldyBTcHJpdGUobW9uc3RlclNwcml0ZVNoZWV0LmJpdGVfdyksXG4gIGJpdGVfZTogbmV3IFNwcml0ZShtb25zdGVyU3ByaXRlU2hlZXQuYml0ZV9lKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtb25zdGVyU3ByaXRlcztcbiIsImNsYXNzIFBsYXllciB7XG4gIC8vIHBsYXllciBwaHlzaWNzXG4gIC8vIEZJR1VSRSBPVVQgSE9XIFRPIE1BS0UgSVQgU08gV0hFTiBBIEtFWSBJUyBSRUxFQVNFRCxcbiAgLy8gTU9WRU1FTlQgR09FUyBCQUNLIFRPIExBU1QgUFJFU1NFRCBLRVkgSUYgU1RJTEwgSEVMRCBET1dOXG5cbiAgY29uc3RydWN0b3IgKGN0eCwgY2FudmFzVywgY2FudmFzSCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuY2FudmFzVyA9IGNhbnZhc1c7XG4gICAgdGhpcy5jYW52YXNIID0gY2FudmFzSDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gWzAsIDBdO1xuICAgIHRoaXMuY3VycmVudFNwcml0ZSA9ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZS5wbmcnO1xuICAgIHRoaXMuZmFjaW5nUG9zID0gXCJyaWdodFwiO1xuICAgIHRoaXMuaGVpZ2h0ID0gNDA7XG4gICAgdGhpcy53aWR0aCA9IDgwO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBwbGF5ZXJTcHJpdGUgPSBuZXcgSW1hZ2UoKTtcbiAgICBwbGF5ZXJTcHJpdGUuc3JjID0gdGhpcy5jdXJyZW50U3ByaXRlO1xuICAgIHRoaXMuY3R4LmRyYXdJbWFnZShwbGF5ZXJTcHJpdGUsIHRoaXMuY29vcmRpbmF0ZXNbMF0sIHRoaXMuY29vcmRpbmF0ZXNbMV0pO1xuICB9XG5cbiAgc2V0SGl0Qm94IChmYWNpbmdQb3MpIHtcbiAgICBzd2l0Y2ggKGZhY2luZ1Bvcykge1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA0MDtcbiAgICAgICAgdGhpcy53aWR0aCA9IDgwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICB0aGlzLmhlaWdodCA9IDgwO1xuICAgICAgICB0aGlzLndpZHRoID0gNDA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gNDA7XG4gICAgICAgIHRoaXMud2lkdGggPSA4MDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLmhlaWdodCA9IDgwO1xuICAgICAgICB0aGlzLndpZHRoID0gNDA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhY2luZ1BvcztcbiAgICB9XG4gIH1cblxuICBjdXJyZW50UG9zaXRpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwbGF5ZXJQb3M6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBwbGF5ZXJGYWNlOiB0aGlzLmZhY2luZ1Bvc1xuICAgIH07XG4gIH1cblxuICB1cGRhdGUoa2V5KSB7XG4gICAgY29uc3Qgc3ByaXRlSGVpZ2h0ID0gMTI1O1xuICAgIHRoaXMuc2V0SGl0Qm94KHRoaXMuZmFjaW5nUG9zKTtcbiAgICBsZXQgc3BlZWQgPSAxNTtcblxuICAgIGlmKGtleSA9PT0gMzcpIHtcbiAgICAgIHRoaXMuY3VycmVudFNwcml0ZSA9ICdhc3NldHMvaW1hZ2VzL3BsYXllcl9yaWZsZV9sZWZ0LnBuZyc7XG4gICAgICB0aGlzLmZhY2luZ1BvcyA9IFwibGVmdFwiO1xuICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPj0gNSkge3RoaXMuY29vcmRpbmF0ZXNbMF0tPXNwZWVkO31cbiAgICB9XG4gICAgaWYoa2V5ID09PSAzOCkge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX3VwLnBuZyc7XG4gICAgICB0aGlzLmZhY2luZ1BvcyA9IFwidXBcIjtcbiAgICAgIGlmICh0aGlzLmNvb3JkaW5hdGVzWzFdID49IDE1KSB7dGhpcy5jb29yZGluYXRlc1sxXS09c3BlZWQ7fVxuICAgIH1cbiAgICBpZihrZXkgPT09IDM5KSB7XG4gICAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAnYXNzZXRzL2ltYWdlcy9wbGF5ZXJfcmlmbGUucG5nJztcbiAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJyaWdodFwiO1xuICAgICAgaWYgKHRoaXMuY29vcmRpbmF0ZXNbMF0gPD0gKHRoaXMuY2FudmFzVyAtIHRoaXMuaGVpZ2h0IC0gMzApKVxuICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMF0rPXNwZWVkO31cbiAgICB9XG4gICAgaWYoa2V5ID09PSA0MCkge1xuICAgICAgdGhpcy5jdXJyZW50U3ByaXRlID0gJ2Fzc2V0cy9pbWFnZXMvcGxheWVyX3JpZmxlX2Rvd24ucG5nJztcbiAgICAgIHRoaXMuZmFjaW5nUG9zID0gXCJkb3duXCI7XG4gICAgICBpZiAodGhpcy5jb29yZGluYXRlc1sxXSA8PSAodGhpcy5jYW52YXNIIC0gdGhpcy5oZWlnaHQpKVxuICAgICAge3RoaXMuY29vcmRpbmF0ZXNbMV0rPXNwZWVkO31cbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsImNsYXNzIFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsO1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLmZyYW1lV2lkdGggPSBvcHRpb25zLmZyYW1lV2lkdGg7XG4gICAgdGhpcy5mcmFtZUhlaWdodCA9IG9wdGlvbnMuZnJhbWVIZWlnaHQ7XG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSBvcHRpb25zLmN1cnJlbnRGcmFtZTtcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gb3B0aW9ucy50b3RhbEZyYW1lcztcbiAgICB0aGlzLm9uY2UgPSBvcHRpb25zLm9uY2U7XG4gICAgdGhpcy5mcHMgPSBvcHRpb25zLmZwcztcbiAgICB0aGlzLmZwc1ggPSBvcHRpb25zLmZwc1g7XG4gIH1cbn1cbi8vIHVybCwgbmFtZSwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2VcblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7XG4iLCIvLyBIT1cgVE8gQlVJTEQgUEhZU0lDUyBGT1IgQSBXRUFQT04/XG4vLyBCVUxMRVQgU1BFRUQsIFNQUkVBRCwgREFNQUdFP1xuLy8gRE8gUEhZU0lDUyBORUVEIFRPIEJFIEEgU0VQQVJBVEUgQ0xBU1M/IENBTiBJIElNUE9SVCBBIExJQlJBUlkgVE8gSEFORExFIFRIQVQgTE9HSUM/XG5cbmNsYXNzIFdlYXBvbiB7XG4gIGNvbnN0cnVjdG9yIChhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5yYXRlID0gYXR0cmlidXRlcy5yYXRlO1xuICAgIHRoaXMubW9kZWwgPSBhdHRyaWJ1dGVzLm1vZGVsO1xuICAgIHRoaXMucG93ZXIgPSBhdHRyaWJ1dGVzLnBvd2VyO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXZWFwb247XG4iXX0=
