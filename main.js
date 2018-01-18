// CURRENTLY PULLS IN AND RENDERS/MOVES ON CANVAS
// IS THIS THE BEST PLACE FOR THIS LOGIC? CAN I HOLD ELSEWHERE AND PULL IN?
// SHOULD MOVEMENT IN GENERAL BE A FIXED CLASS/FUNCTION OR INDIVIDUAL TO THE USER?

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

  function shoot (playerPos) {
    bullets.push(new Bullet(playerPos, canvas.width,
      canvas.height, ctx));
    bullets = bullets.filter(bullet => bullet.active);
  }

  function update (key, dt) {
    player.update(key);
    bullets.forEach(bullet => bullet.update(dt));
  }

  function render () {
    player.render();
    monster.render();
    bullets.forEach(bullet => bullet.render());
  }

  let lastTime;
  function main() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    update(key, dt);
    clear();
    render();

    lastTime = now;
    window.requestAnimationFrame( main );
  }
   main();
   slugMove();
};

// // dont use set interval/timeout
// // request animation frame
