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
    // debugger
    this.active = true;
    this.coordinates = playerAttr.playerPos;
    this.playerFace = playerAttr.playerFace;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.currentSprite = 'assets/images/bullet_horz.png';
  }

  render () {
    var bulletSprite = new Image();
    bulletSprite.src = this.currentSprite;
    this.ctx.drawImage(bulletSprite, this.coordinates[0], this.coordinates[1]);
  }

  update() {
    if (this.playerFace === "left") {
      this.currentSprite = 'assets/images/bullet_horz.png';
      if (this.active && this.coordinates[0] >= 0) {
        this.coordinates[0]-= 2;}
    } else {
      this.active = false;
    }

    if (this.playerFace === "up") {
      this.currentSprite = 'assets/images/bullet_vert.png';
      if (this.active && this.coordinates[1] >= 0) {this.coordinates[1]-= 2;}
    } else {
      this.active = false;
    }

    if (this.playerFace === "right") {
      this.currentSprite = 'assets/images/bullet_horz.png';
      if( this.active && this.coordinates[0] <= this.canvasW)
      {this.coordinates[0]+= 2;}
    } else {
      this.active = false;
    }

    if (this.playerFace === "down") {
      this.currentSprite = 'assets/images/bullet_vert.png';
      if (this.active && this.coordinates[1] <= this.canvasH)
      {this.coordinates[1]+= 2;}
    } else {
      this.active = false;
    }
  }
}


module.exports = Bullet;

},{}],3:[function(require,module,exports){
// CURRENTLY PULLS IN AND RENDERS/MOVES ON CANVAS
// IS THIS THE BEST PLACE FOR THIS LOGIC? CAN I HOLD ELSEWHERE AND PULL IN?
// SHOULD MOVEMENT IN GENERAL BE A FIXED CLASS/FUNCTION OR INDIVIDUAL TO THE USER?
// WOULD A SINGLE SPACE BE GOOD OR A RUNNER THAT WILL STOP AT CHECKPOINTS TO FIGHT MORE
// THE PLAYER WOULD HAVE TO DODGE OTHER OBJECTS ALONG THE WAY

let Board = require('./board');
let Monster = require('./monster');
let Player = require('./player');
let Weapons = require('./weapons');
let Bullet = require('./bullet');

window.onload = function() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  const clear = () =>  {
	   ctx.clearRect(0, 0, canvas.width, canvas.height);
   };

  let player = new Player(ctx, canvas.width, canvas.height);
  let board = new Board(ctx);
  let monster = new Monster(ctx, canvas.width, canvas.height);
  let key;

  document.onkeydown = function (evt) {
  	key = evt.which;
    if (key === 32) {
      shoot(player.currentPosition());
    }
  };

  document.onkeyup = function(evt) {
  	key = null;
  };

  // RANDOM SLUG MOVEMENT
  function slugMove () {
    setInterval(() => monster.update(), 100);
  }

  let bullets = [];
  // IF BULLET NOT CREATED YET
  function shoot (playerPos) {
    // debugger
    bullets.push(new Bullet(playerPos, canvas.width,
      canvas.height, ctx));
    bullets = bullets.filter(bullet => bullet.active);
  }

  function update (key) {
    player.update(key);
    bullets.forEach(bullet => bullet.update());
    // if (bullet) {
    //   bullet.update();
    // }
  }

  function render () {
    player.render();
    monster.render();
    bullets.forEach(bullet => bullet.render());
    // if (bullet) {
    //   bullet.render();
    // }
  }

  function main() {
   window.requestAnimationFrame( main );
   update(key);
   clear();
   render();
  }
  // debugger
   main();
   // debugger
   slugMove();
};


// document.addEventListener('DOMContentLoaded', () => {
//   let canvas = document.getElementById('canvas');
//   let ctx = canvas.getContext('2d');
//
//
//
//   let player = new Player(ctx, canvas);
//   let board = new Board(ctx);
//
//   let key;
//
//   document.onkeydown = function (evt) {
//    	key = evt.which;
//   };
//
//   document.onkeyup = function(evt) {
//   	key = null;
//   };
//
//   function main() {
//     window.requestAnimationFrame( main );
//
//     player.update(key);
//     player.clear();
//     player.render();
//
//
//
//   }
//   // bgImage.addEventListener('load', function() {
//   // }, false);
//
//
//   main();
//
//
// });
//
// // dont use set interval/timeout
// // request animation frame

},{"./board":1,"./bullet":2,"./monster":4,"./player":5,"./weapons":6}],4:[function(require,module,exports){
// MONSTER WILL CHASE PLAYER, TAKE SHORTEST ROUTE IF POSSIBLE

class Monster {
  constructor (ctx, canvasW, canvasH, options) {
    // this.name = options.name;
    // this.power = options.power;
    // this.sprite = options.sprite;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.coordinates = [750, 350];
    this.currentSprite = 'assets/images/bossworm_front.png';
  }

  render() {
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite;
    this.ctx.drawImage(monsterSprite, this.coordinates[0], this.coordinates[1]);
  }

  update() {
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

},{}],5:[function(require,module,exports){
class Player {
  // player movement
  // player physics
  // sprite model for player
  // HOW TO MAKE PLAYER MOVE ON CANVAS???
  // FIGURE OUT HOW TO MAKE IT SO WHEN A KEY IS RELEASED, MOVEMENT GOES BACK TO LAST PRESSED KEY IF STILL HELD DOWN

  constructor (ctx, canvasW, canvasH) {
    this.ctx = ctx;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.coordinates = [0, 0];
    this.currentSprite = 'assets/images/player_rifle.png';
    this.facingPos = "right";
  }

  render() {
    var playerSprite = new Image();
    playerSprite.src = this.currentSprite;
    this.ctx.drawImage(playerSprite, this.coordinates[0], this.coordinates[1]);
  }

  currentPosition () {
    return {
      playerPos: this.coordinates,
      playerFace: this.facingPos
    };
  }

  //
  update(key) {
    const spriteHeight = 125;

    if(key === 37) {
      this.currentSprite = 'assets/images/player_rifle_left.png';
      this.facingPos = "left";
      if (this.coordinates[0] >= 0) {this.coordinates[0]-=10;}
    }
    if(key === 38) {
      this.currentSprite = 'assets/images/player_rifle_up.png';
      this.facingPos = "up";
      if (this.coordinates[1] >= 0) {this.coordinates[1]-=10;}
    }
    if(key === 39) {
      this.currentSprite = 'assets/images/player_rifle.png';
      this.facingPos = "right";
      if (this.coordinates[0] <= (this.canvasW - spriteHeight))
      {this.coordinates[0]+=10;}
    }
    if(key === 40) {
      this.currentSprite = 'assets/images/player_rifle_down.png';
      this.facingPos = "down";
      if (this.coordinates[1] <= (this.canvasH - spriteHeight))
      {this.coordinates[1]+=10;}
    }
  }

  // CAN ABSTRACT OUT AS NOT PARTICULAR TO CLASS, CLEARS ENTIRE CANVAS

}

module.exports = Player;

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

},{}]},{},[3]);
