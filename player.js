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
