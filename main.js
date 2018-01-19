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
  // let board = new Board(ctx);
  // let monsterSprite = MonsterSprite.intro;
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
      if (bulletX < monsterX + monster.width &&
        bulletX + bullet.width > monsterX &&
        bulletY < monsterY + monster.height &&
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

  // RANDOM SLUG MOVEMENT
  // function slugMove () {
  //   setInterval(() => monster.update(), 100);
  // }


  function shoot (playerPos) {
    bullets.push(new Bullet(playerPos, canvas.width,
      canvas.height, ctx));
    bullets = bullets.filter(bullet => bullet.active);
  }

  function update (key, dt, lastTime) {
    player.update(key);
    // monster.update(lastTime);
    bullets.forEach(bullet => bullet.update(dt));
  }

  const clear = () =>  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  function render () {
    monster.render();
    player.render();
    bullets.forEach(bullet => bullet.render());
  }


  let lastTime;
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
    let now = Date.now();
    let dt = (now - lastTime) / 500.0;
    update(key, dt, lastTime);
    clear();
    render();

    lastTime = now;
    window.requestAnimationFrame( main );
  }
   main();
   // slugMove();
};

// // dont use set interval/timeout
// // request animation frame
