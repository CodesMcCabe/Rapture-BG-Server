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
    // HITBOX
    this.height = 106;
    this.width = 115;
    this.health = 100;
    this.alive = true;
  }

  defeated () {
    this.alive = false;
  }

  reduceHealth (bullet) {
    this.health -= bullet.damage;
  }

  render() {
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite;
    this.ctx.drawImage(monsterSprite, this.coordinates[0], this.coordinates[1]);
  }

  update() {
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
