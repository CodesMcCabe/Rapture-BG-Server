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
// CURRENTLY PULLS IN AND RENDERS/MOVES ON CANVAS
// IS THIS THE BEST PLACE FOR THIS LOGIC? CAN I HOLD ELSEWHERE AND PULL IN?
// SHOULD MOVEMENT IN GENERAL BE A FIXED CLASS/FUNCTION OR INDIVIDUAL TO THE USER?

let Board = require('./board');
let MonsterSprite = require('./monster_sprites');
let Sprite = require('./sprite');
let Monster = require('./monster');
let Player = require('./player');
let Weapons = require('./weapons');
let Bullet = require('./bullet');


window.onload = function() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');


  let bullets = [];
  let player = new Player(ctx, canvas.width, canvas.height);
  let monster = new Monster(ctx, canvas.width, canvas.height);
  let key;

  function collisionDetected () {
    let collideBullets = Object.assign([], bullets);
    let bulletX;
    let bulletY;
    let playerX = player.coordinates[0];
    let playerY = player.coordinates[1];
    let monsterX = monster.coordinates[0];
    let monsterY = monster.coordinates[1];

    bullets.forEach(bullet => {
      bulletX = bullet.coordinates[0];
      bulletY = bullet.coordinates[1];
      if (bulletX < monsterX + monster.frameWidth &&
        bulletX + bullet.width > monsterX &&
        bulletY < monsterY + monster.frameHeight &&
        bulletY + bullet.height > monsterY) {
        monster.reduceHealth(bullet);
        bullets.splice(0, 1);

        if (monster.health <= 0) {
          monster.defeated();
        }
      }
    }
  );

  if (playerX < monsterX + monster.width &&
    playerX + player.width > monsterX &&
    playerY < monsterY + monster.height &&
    playerY + player.height > monsterY &&
    monster.alive) {
      alert('Game Over!');
    }
  }

  function shoot (playerPos) {
    bullets.push(new Bullet(playerPos, canvas.width,
      canvas.height, ctx));
    bullets = bullets.filter(bullet => bullet.active);
  }

  function update (key, dt, delta) {
    player.update(key);

    let fps = 1000/10;

    console.log(delta);
    if (delta > fps) {

      monster.update();
    }
    bullets.forEach(bullet => bullet.update(dt));
  }

  const clear = () =>  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  function render (now) {
    monster.render(now);
    player.render();
    bullets.forEach(bullet => bullet.render());
  }

  let lastTime = Date.now();
  function main() {
    document.onkeydown = function (evt) {
      key = evt.which;
      if (key === 32) {
        shoot(player.currentPosition());
      }
    };
    document.onkeyup = function(evt) {
      key = null;
    };

    collisionDetected();

    window.requestAnimationFrame( main );

    let now = Date.now();
    let delta = now - lastTime;
    let dt = (delta) / 500.0;
    update(key, dt, delta);
    clear();
    render(now);

    lastTime = now;
  }
   main();
};

},{"./board":1,"./bullet":2,"./monster":4,"./monster_sprites":5,"./player":6,"./sprite":7,"./weapons":8}],4:[function(require,module,exports){
// MONSTER WILL CHASE PLAYER, TAKE SHORTEST ROUTE IF POSSIBLE
let spriteSheet = require('./monster_sprites');
let Sprite = require('./sprite');

class Monster {
  constructor (ctx, canvasW, canvasH, options) {
    // this.name = options.name;
    // this.power = options.power;
    // this.sprite = options.sprite;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.coordinates = [700, 300];
    // this.currentSprite = 'assets/images/bossworm_front.png';
    // debugger
    this.currentSprite = 'assets/images/worm_intro.png';
    this.spriteName = 'intro';
    this.frameWidth = 153;
    this.frameHeight = 166;
    this.currentFrame = 0;
    this.shift = 0;
    this.totalFrames = 16;
    this.health = 100;
    this.alive = true;
    this.once = true;

    this.lastUpdate = Date.now();
  }

  defeated () {
    this.alive = false;
  }

  reduceHealth (bullet) {
    this.health -= bullet.damage;
  }

  // createSprite(sprite) {
  //   if (sprite !== this.currentSprite) {
  //     this.currentSprite = new Sprite(sprite);
  //   }
  // }

  render(now) {
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite;
    this.ctx.drawImage(monsterSprite, this.shift, 0, this.frameWidth,
      this.frameHeight, this.coordinates[0], this.coordinates[1],
      this.frameWidth, this.frameHeight);

    if (now - this.lastUpdate > 80) {
      this.lastUpdate = now;
      this.shift += this.frameWidth + 1;

      if (this.currentFrame === this.totalFrames &&
        this.spriteName === 'intro') {
        this.currentSprite = 'assets/images/worm_idle.png';
        this.spriteName = 'idle';
        this.shift = 0;
        this.currentFrame = 0;
      } else if (this.currentFrame === this.totalFrames) {
        this.shift = 0;
        this.currentFrame = 0;
      }

      this.currentFrame++;
    }
  }

  update(delta) {
    if (!this.alive) {
      this.currentSprite = 'assets/images/boss_die.png';
      return null;
    }

    const keys = [37, 38, 39, 40];
    const random = Math.floor(Math.random() * (keys.length - 1));
    const key = keys[random];
    const spriteHeight = 125;

    if(key === 37) {
      this.currentSprite = 'assets/images/bossworm_front.png';
      if (this.coordinates[0] >= 0) {this.coordinates[0]+=10;}
    }
    if(key === 38) {
      this.currentSprite = 'assets/images/bossworm_front.png';
      if (this.coordinates[1] >= 0) {this.coordinates[1]-=10;}
    }
    if(key === 39) {
      this.currentSprite = 'assets/images/bossworm_front.png';
      if (this.coordinates[0] <= (this.canvasW - spriteHeight))
      {this.coordinates[0]-=10;}
    }
    if(key === 40) {
      this.currentSprite = 'assets/images/bossworm_front.png';
      if (this.coordinates[1] <= (this.canvasH - spriteHeight))
      {this.coordinates[1]+=10;}
    }
  }

  // set new image and then call src on that image path
  //

}

module.exports = Monster;

},{"./monster_sprites":5,"./sprite":7}],5:[function(require,module,exports){
const monsterSprites = {
  intro: {
    url: 'assets/images/worm_intro.png',
    name: 'intro',
    spriteHeight: 166,
    spriteWidth: 153,
    currentFrame: 0,
    frameCount: 16,
    srcX: 0,
    srcY: 0,
    x: 0,
    y: 0,
    once: true,
  }
};

module.export = monsterSprites;

// const devil = {
//   sprite: new Sprite(()),
//   monster: new Monster()
// }

},{}],6:[function(require,module,exports){
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

    if(key === 37) {
      this.currentSprite = 'assets/images/player_rifle_left.png';
      this.facingPos = "left";
      if (this.coordinates[0] >= 5) {this.coordinates[0]-=10;}
    }
    if(key === 38) {
      this.currentSprite = 'assets/images/player_rifle_up.png';
      this.facingPos = "up";
      if (this.coordinates[1] >= 15) {this.coordinates[1]-=10;}
    }
    if(key === 39) {
      this.currentSprite = 'assets/images/player_rifle.png';
      this.facingPos = "right";
      if (this.coordinates[0] <= (this.canvasW - this.height - 30))
      {this.coordinates[0]+=10;}
    }
    if(key === 40) {
      this.currentSprite = 'assets/images/player_rifle_down.png';
      this.facingPos = "down";
      if (this.coordinates[1] <= (this.canvasH - this.height))
      {this.coordinates[1]+=10;}
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
    this.totalFrames = options.frames;
    this.once = options.once;

    // this.lastUpdate = Date.now();
  }
}
// url, name, pos, size, speed, frames, dir, once

module.export = Sprite;

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

},{}]},{},[3]);
