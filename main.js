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
