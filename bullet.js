class Bullet {
  constructor(playerAttr, canvasW, canvasH, ctx) {
    // debugger
    this.active = true;
    this.coordinates = playerAttr.playerPos;
    this.playerFace = playerAttr.playerFace;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.currentSprite = 'assets/images/bullet_horz.png';
  }

  render () {
    var bulletSprite = new Image();
    bulletSprite.src = this.currentSprite;
    this.ctx.drawImage(bulletSprite, this.coordinates[0], this.coordinates[1]);
  }

  update() {
    if (this.playerFace === "left") {
      this.currentSprite = 'assets/images/bullet_horz.png';
      if (this.active && this.coordinates[0] >= 0) {
        this.coordinates[0]-= 2;}
    } else {
      this.active = false;
    }

    if (this.playerFace === "up") {
      this.currentSprite = 'assets/images/bullet_vert.png';
      if (this.active && this.coordinates[1] >= 0) {this.coordinates[1]-= 2;}
    } else {
      this.active = false;
    }

    if (this.playerFace === "right") {
      this.currentSprite = 'assets/images/bullet_horz.png';
      if( this.active && this.coordinates[0] <= this.canvasW)
      {this.coordinates[0]+= 2;}
    } else {
      this.active = false;
    }

    if (this.playerFace === "down") {
      this.currentSprite = 'assets/images/bullet_vert.png';
      if (this.active && this.coordinates[1] <= this.canvasH)
      {this.coordinates[1]+= 2;}
    } else {
      this.active = false;
    }
  }
}


module.exports = Bullet;
