class Player {
  // player physics
  // FIGURE OUT HOW TO MAKE IT SO WHEN A KEY IS RELEASED,
  // MOVEMENT GOES BACK TO LAST PRESSED KEY IF STILL HELD DOWN

  constructor (ctx, canvasW, canvasH) {
    this.ctx = ctx;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.coordinates = [100, 100];
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
    let speed = 15;

    if(key === 37) {
      this.currentSprite = 'assets/images/player_rifle_left.png';
      this.facingPos = "left";
      if (this.coordinates[0] >= 5) {this.coordinates[0]-=speed;}
    }
    if(key === 38) {
      this.currentSprite = 'assets/images/player_rifle_up.png';
      this.facingPos = "up";
      if (this.coordinates[1] >= 15) {this.coordinates[1]-=speed;}
    }
    if(key === 39) {
      this.currentSprite = 'assets/images/player_rifle.png';
      this.facingPos = "right";
      if (this.coordinates[0] <= (this.canvasW - this.height - 30))
      {this.coordinates[0]+=speed;}
    }
    if(key === 40) {
      this.currentSprite = 'assets/images/player_rifle_down.png';
      this.facingPos = "down";
      if (this.coordinates[1] <= (this.canvasH - this.height))
      {this.coordinates[1]+=speed;}
    }
  }

}

module.exports = Player;
