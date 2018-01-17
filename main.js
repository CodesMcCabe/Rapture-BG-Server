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
