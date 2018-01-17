(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// drop event listener here
// SHOULD SET IT UP FOR FURTHER MAPS
// BOARD INSTANCE CAN BE INVOKED UPON GAME START AND PASSED IN A SPECIFIC Board
// HOW DO I CREATE THE BOARD AND PASS IT IN?

class Board {
  constructor (ctx) {
    this.board = ctx.fillRect(100, 100, 250, 50);
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

document.addEventListener('DOMContentLoaded', () => {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  let player = new Player(ctx, canvas);
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
    player.clear();
    player.render();
  }

  main();
});

// dont use set interval/timeout
// request animation frame

},{"./board":1,"./monster":3,"./player":4,"./weapons":5}],3:[function(require,module,exports){
// MONSTER WILL CHASE PLAYER, TAKE SHORTEST ROUTE IF POSSIBLE

class Monster {
  constructor (attributes) {
    this.name = attributes.name;
    this.power = attributes.power;
    // this.model = sprite image;
  }

}

module.exports = Monster;

},{}],4:[function(require,module,exports){
class Player {
  // player movement
  // player physics
  // sprite model for player
  // HOW TO MAKE PLAYER MOVE ON CANVAS???
  // FIGURE OUT HOW TO MAKE IT SO WHEN A KEY IS RELEASED, MOVEMENT GOES BACK TO LAST PRESSED KEY IF STILL HELD DOWN

  constructor (ctx, canvas) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.coordinates = [0, 0];
    // this.model = playerModel;
  }


  render() {
    this.ctx.fillRect(this.coordinates[0], this.coordinates[1], 50, 50);
  }

  update(key) {
    if(key === 37) {
    	this.coordinates[0]--;
    }
    if(key === 38) {
    	this.coordinates[1]--;
    }
    if(key === 39) {
    	this.coordinates[0]++;
    }
    if(key === 40) {
    	this.coordinates[1]++;
    }
  }

  clear() {
	   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
   }

//
//   update() {
//     if(key === 37) {
//     	coordinates[0]--;
//     }
//     if(key === 38) {
//     	coordinates[1]--;
//     }
//     if(key === 39) {
//     	coordinates[0]++;
//     }
//     if(key === 40) {
//     	coordinates[1]++;
//     }
// }

  // render () {
  //   this.model
  // }
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
