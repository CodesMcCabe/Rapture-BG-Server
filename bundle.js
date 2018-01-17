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
// CURRENTLY PULLS IN AND RENDERS/MOVES ON CANVAS
// IS THIS THE BEST PLACE FOR THIS LOGIC? CAN I HOLD ELSEWHERE AND PULL IN?
// SHOULD MOVEMENT IN GENERAL BE A FIXED CLASS/FUNCTION OR INDIVIDUAL TO THE USER?
// WOULD A SINGLE SPACE BE GOOD OR A RUNNER THAT WILL STOP AT CHECKPOINTS TO FIGHT MORE
// THE PLAYER WOULD HAVE TO DODGE OTHER OBJECTS ALONG THE WAY

let Board = require('./board');
let Monster = require('./monster');
let Player = require('./player');
let Weapons = require('./weapons');

window.onload = function() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  const clear = () =>  {
	   ctx.clearRect(0, 0, canvas.width, canvas.height);
   };

  let player = new Player(ctx, canvas.width, canvas.height);
  let board = new Board(ctx);

  let key;

  document.onkeydown = function (evt) {
  	key = evt.which;
  };

  document.onkeyup = function(evt) {
  	key = null;
  };

  function main() {
   window.requestAnimationFrame( main );
   player.update(key);
   clear();
   player.render();


  }
   main();
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

},{"./board":1,"./monster":3,"./player":4,"./weapons":5}],3:[function(require,module,exports){
// MONSTER WILL CHASE PLAYER, TAKE SHORTEST ROUTE IF POSSIBLE

class Monster {
  constructor (ctx, options) {
    // this.name = options.name;
    // this.power = options.power;
    // this.sprite = options.sprite;
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
    // random movement
  }

  // set new image and then call src on that image path
  //

}

module.exports = Monster;

},{}],4:[function(require,module,exports){
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
  }


  render() {
    var playerSprite = new Image();
    playerSprite.src = this.currentSprite;
    this.ctx.drawImage(playerSprite, this.coordinates[0], this.coordinates[1]);
  }

  update(key) {
    const spriteHeight = 125;

    if(key === 37) {
      this.currentSprite = 'assets/images/player_rifle_left.png';
      if (this.coordinates[0] !== 0) {this.coordinates[0]-=10;}
    }
    if(key === 38) {
      this.currentSprite = 'assets/images/player_rifle_up.png';
      if (this.coordinates[1] !== 0) {this.coordinates[1]-=10;}
    }
    if(key === 39) {
      this.currentSprite = 'assets/images/player_rifle.png';
      if (this.coordinates[0] <= (this.canvasW - spriteHeight))
      {this.coordinates[0]+=10;}
    }
    if(key === 40) {
      this.currentSprite = 'assets/images/player_rifle_down.png';
      if (this.coordinates[1] <= (this.canvasH - spriteHeight))
      {this.coordinates[1]+=10;}
    }
  }

  // CAN ABSTRACT OUT AS NOT PARTICULAR TO CLASS, CLEARS ENTIRE CANVAS

}

module.exports = Player;

},{}],5:[function(require,module,exports){
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

},{}]},{},[2]);
