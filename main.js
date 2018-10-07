let monsterSprites = require('./lib/sprites/monster_sprites.js');
let playerSprites = require('./lib/sprites/player_sprites.js');
let bulletSprites = require('./lib/sprites/bullet_sprites.js');
let bloodHitSprites = require('./lib/sprites/blood_hit_sprites.js');
let Sprite = require('./lib/classes/sprite.js');
let Monster = require('./lib/classes/monster.js');
let BloodHit = require('./lib/classes/blood_hit.js');
let Player = require('./lib/classes/player.js');
let Weapons = require('./lib/classes/weapons.js');
let Bullet = require('./lib/classes/bullet.js');
let preloadImages = require('./resources.js');
let Web3 = require('web3');
let NomadAbi = require('./lib/Nomad.json');
let NomadAssetAbi = require('./lib/NomadAsset.json');
const WORLD_ID = 1;

window.onload = function() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let myReq;
  let WorldItems = false;
  let UserItems = false;
  let userAddress;
  let userItemId;
  preloadAssets();
  var web3 = window.web3;
  // let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/a40a265b039d483c99260493e718f673'));

  web3.eth.getAccounts(function (err, acc) {
      userAddress = acc[0];
      web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/a40a265b039d483c99260493e718f673'));
      var NomadContract = new web3.eth.Contract(NomadAbi.abi)
      NomadContract.options.address = '0xeeba5b5fe49d03293e6c5b6d2a6c822785aef8f8';
      var NomadAssetContract = new web3.eth.Contract(NomadAssetAbi.abi)
      NomadAssetContract.options.address = '0x5b6e41062ef13c0aa569117b44b79693bee51fa7';
      NomadAssetContract.methods.addressToItemIds(userAddress, 0).call().then(itemId => {
          if(itemId > 0) {
              NomadAssetContract.methods.ownerOf(itemId).call().then(ownerAddress => {
                  console.log(ownerAddress)
                  console.log(userAddress)
                  if(ownerAddress.toLowerCase() === userAddress.toLowerCase()) {
                      console.log('yes')
                      userItemId = itemId;
                      UserItems = true;
                  }
              });
          }
      });
  });

  let sounds = document.getElementsByTagName('audio');
  let audioMute = document.getElementById('audio');
  audioMute.addEventListener('click', function(e) {
    let i;
    if (sounds[0].muted === true) {
      audioMute.src = "assets/images/audio_play.png";
      // audioMute = document.getElementById('audio');
    } else {
      audioMute.src = "assets/images/audio_mute.png";
      // audioMute = document.getElementById('audio');
    }

    for (i = 0; i < sounds.length; i++) {
      if(sounds[i].muted === true) {
        sounds[i].muted = false;
      } else {
        sounds[i].muted = true;
      }
    }
  });

  function startGame () {
    let start = document.getElementById('start');
    let music = document.getElementById('music');
    let introMusic = document.getElementById('cave_theme');
    let healthBar = document.getElementById('healthbar');
    introMusic.volume = 1;

    start.addEventListener('click', function(e) {
        healthBar.style.display = "block";
        start.className = 'start_button_hide';
        gameStart = true;
        gameWin = false;
        gameTimerStart = Date.now();
        introMusic.pause();
        music.volume = .7;
        music.play();
    });

    document.onkeypress = function (evt) {
      if (evt.keyCode === 13) {
        healthBar.style.display = "block";
        start.className = 'start_button_hide';
        gameStart = true;
        gameWin = false;
        gameTimerStart = Date.now();
        introMusic.pause();
        music.volume = .7;
        music.play();
      }
    };

    let audio = document.getElementById('audio_hover');
    audio.volume = 0.4;
    start.addEventListener('mouseover', function(evt) {
      audio.play();
    });
  }

  function preloadAssets () {
    preloadImages.forEach(image => {
      let loadedImage = new Image();
      loadedImage.src = image;
    });
  }
  let timeout;
  let restartReady = false;
  function gameOverPrompt () {
    let introMusic = document.getElementById('cave_theme');
    introMusic.volume = 1;
    introMusic.play();
    let music = document.getElementById('music');
    music.pause();
    gameTimerStop = true;
    let gameOver = document.getElementById('game_over');
    let audio = document.getElementById('audio_hover');
    let scoreScreen = document.getElementById('score_screen');
    if (gameWin) {
      scoreScreen.innerHTML = `Worm Boss defeated in ${elapsed} seconds!`;
    } else {
      scoreScreen.innerHTML = `You survived for ${elapsed} seconds.`;
    }

    gameOver.style.display = 'block';
    scoreScreen.style.display = 'block';
    audio.volume = 0.4;
    gameOver.addEventListener('mouseover', function(evt) {
      audio.play();
    });

    gameOver.addEventListener('click', function(e) {
      clearTimeout(timeout);
      gameOver.style.display = 'none';
      scoreScreen.style.display = 'none';
      monsterSprites.dead.currentFrame = 0;
      monsterSprites.idle.currentFrame = 0;
      player.currentSprite.currentFrame = 0;
      monsterSprites.intro.currentFrame = 0;
      restartGame();
    });
  }

  function restartGame () {
    let music = document.getElementById('music');
    let gameOver = document.getElementById('game_over');
    let scoreScreen = document.getElementById('score_screen');
    let healthbar = document.getElementById('healthbar');
    healthbar.value = monster.maxHP;
    music.volume = .7;
    music.play();
    gameTimerStop = false;
    gameTimerStart = Date.now();
    gameWin = false;
    scoreScreen.style.display = 'none';
    gameOver.style.display = "none";
    monster = new Monster(ctx, canvas.width, canvas.height,
      monsterSprites.intro);
    player = new Player(ctx, canvas.width, canvas.height,
      playerSprites.aliveRight);
    monsterBullets = monster.bullets;
  }

  let monster = new Monster(ctx, canvas.width, canvas.height,
    monsterSprites.intro);
  let gameStart = false;
  let bullets = [];
  let monsterBullets = monster.bullets;
  let player = new Player(ctx, canvas.width, canvas.height,
    playerSprites.aliveRight);
  let lastTime = Date.now();
  let key;
  let allowFire = true;
  let playerHit = new BloodHit(player.currentPosition(), ctx,
    bloodHitSprites.playerHit);
  let monsterHit = new BloodHit(monster.currentPosition(), ctx,
    bloodHitSprites.monsterHit);

  let gameWin = false;
  function collisionDetected () {
    let collideBullets = Object.assign([], bullets);
    let bulletX;
    let bulletY;
    let playerX = player.coordinates[0];
    let playerY = player.coordinates[1];
    let monsterX = monster.coordinates[0];
    let monsterY = monster.coordinates[1];
    let mHBoffset = 40;

    if (gameStart) {
      let bloodSquirt = document.getElementById('monster_hit');
      bullets.forEach(bullet => {
        bulletX = bullet.coordinates[0];
        bulletY = bullet.coordinates[1];
        if (bulletX < monsterX + monster.currentSprite.frameWidth - mHBoffset &&
          bulletX + bullet.currentSprite.frameWidth > monsterX + mHBoffset &&
          bulletY < monsterY + monster.currentSprite.frameHeight - mHBoffset &&
          bulletY + bullet.currentSprite.frameHeight > monsterY + mHBoffset) {
            bloodSquirt.volume = 1;
            bloodSquirt.playbackRate = 4;
            bloodSquirt.play();
            monster.reduceHealth(bullet.currentSprite.damage);
            bullets.splice(0, 1);
            monsterHit = new BloodHit(monster.currentPosition(), ctx,
            bloodHitSprites.monsterHit);
            monsterHit.collision = true;
            let health = document.getElementById('healthbar');
            health.value -= bullet.currentSprite.damage;

            if (monster.health <= 0) {
              let death = document.getElementById('monster_death');
              death.volume = 1;
              death.play();
              monsterHit.collision = false;
              gameWin = true;
              monster.defeated();
              gameOverPrompt();
            }

          }
        }
      );
    }

    let grunt = document.getElementById('grunt');
    monsterBullets.forEach(bullet => {
      bulletX = bullet.coordinates[0];
      bulletY = bullet.coordinates[1];
      if (bulletX < playerX + player.currentSprite.frameWidth &&
        bulletX + bullet.currentSprite.frameWidth > playerX &&
        bulletY < playerY + player.currentSprite.frameHeight &&
        bulletY + bullet.currentSprite.frameHeight > playerY) {
          player.reduceHealth(bullet.currentSprite.damage);
          grunt.volume = 1;
          grunt.playbackRate = 2;
          grunt.play();
          let index = monsterBullets.indexOf(bullet);
          monsterBullets.splice(index, 1);
          if (player.health > 0) {
            playerHit = new BloodHit(player.currentPosition(), ctx,
            bloodHitSprites.playerHit);
            playerHit.collision = true;
          }

          if (player.health <= 0) {
            playerHit.collision = false;
            player.dead();
            monster.playerDefeated();
            gameOverPrompt();
          }
      }
    });

    if (playerX < monsterX + monster.currentSprite.frameWidth - mHBoffset&&
      playerX + player.hitBoxW > monsterX + mHBoffset&&
      playerY < monsterY + monster.currentSprite.frameHeight - mHBoffset&&
      playerY + player.hitBoxH > monsterY + mHBoffset &&
      gameStart && monster.alive) {
        player.dead();
        monster.playerDefeated();
        gameOverPrompt();
      }
  }

  let lastBullet;
  function Fire () {
    allowFire = false;
    setTimeout(() => {
      allowFire = true;
    }, 200);
  }

  function shoot (playerPos) {
      let shootSprite = UserItems ? bulletSprites.nomad : bulletSprites.rifle;
      bullets.push(new Bullet(playerPos, canvas.width,
        canvas.height, ctx, shootSprite, undefined, UserItems));

      bullets = bullets.filter(bullet => bullet.active);

    Fire();
    let bulletSound = document.getElementById('bullet');
    bulletSound.volume = 0.7;
    bulletSound.load();
    bulletSound.play();
  }

  function update (key, dt, delta) {
    player.update(key);
    if (gameStart) {
      monster.update(player.coordinates, dt, delta);
    }
    bullets.forEach(bullet => bullet.update(dt, 'player'));
    monsterBullets.forEach(bullet => bullet.update(dt, 'monster'));
  }

  const clear = () =>  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  function render (now) {
    if (playerHit.collision) {
      playerHit.render(now);
    }

    if (monsterHit.collision) {
      monsterHit.render(now);
    }

    if (gameStart) {
      monster.render(now);
    }

    player.render(now);

    bullets.forEach(bullet => bullet.render());

    monsterBullets.forEach(bullet => bullet.render());
    if (monster.currentSprite.name === 'intro' &&
    gameStart && monster.currentSprite.currentFrame === 1) {
      let intro = document.getElementById('intro_monster');
      intro.volume = 1;
      intro.play();
    } else if (monster.currentSprite.name !== 'intro' && gameStart &&
    monster.alive) {
      let monBG = document.getElementById('monster_bg');
      monBG.volume = 1;
      monBG.playbackRate = 3.5;
      monBG.play();
    }
  }

  document.onkeydown = function (evt) {
    let keys = [32, 37, 38, 39, 40];
    key = evt.which;
    if(keys.includes(key)) {
      evt.preventDefault();
    }
    player.keyPressed[key] = true;
    if (key === 32 && player.alive && allowFire) {
      shoot(player.currentPosition());
    }

    if (!monster.alive || !player.alive) {
      let gameOver = document.getElementById('game_over');
      if (key === 13) {
        gameOver.style.display = 'none';
        monsterSprites.dead.currentFrame = 0;
        monsterSprites.idle.currentFrame = 0;
        player.currentSprite.currentFrame = 0;
        monsterSprites.intro.currentFrame = 0;
        restartGame();
      }
    }
  };

  document.onkeyup = function(evt) {
    evt.preventDefault();
    player.keyPressed[evt.which] = false;
    key = null;
  };
  let gameTimerStop = false;
  let gameTimerStart = (0).toFixed(1);
  let elapsed;
  function timer() {
    let time = document.getElementById('timer');

    if (gameStart && !gameTimerStop) {
      elapsed = ((Date.now() - gameTimerStart) / 1000).toFixed(1);
      time.innerHTML = `${elapsed}`;
    } else if (gameTimerStop) {
      time.innerHTML = elapsed;
    } else {
      time.innerHTML = gameTimerStart;
    }
  }

  function main() {
    let now = Date.now();
    let delta = now - lastTime;
    let dt = (delta) / 500.0;
    myReq = requestAnimationFrame( main );
    collisionDetected();
    timer();
    update(key, dt, delta);
    clear();
    render(now);
    lastTime = now;
  }
  myReq = requestAnimationFrame( main );
  startGame();
};
