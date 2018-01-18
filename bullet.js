class Bullet {
  constructor(playerAttr, canvasW, canvasH, ctx) {

    this.active = true;
    this.playerPos = Object.assign([], playerAttr.playerPos);
    this.playerFace = playerAttr.playerFace;
    this.coordinates = this.setCoordinates(this.playerPos);
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.currentSprite = 'assets/images/bullet_horz.png';

    this.setCoordinates = this.setCoordinates.bind(this);
  }

  render () {
    var bulletSprite = new Image();
    bulletSprite.src = this.currentSprite;
    this.ctx.drawImage(bulletSprite, this.coordinates[0], this.coordinates[1]);
  }

  setCoordinates (playerPos) {
    let x = playerPos[0];
    let y = playerPos[1];

    switch (this.playerFace) {
      case "left":
        x -= 3;
        y += 6;
        return [x, y];
      case "up":
        x += 35;
        y -= 6;
        return [x, y];
        // return [playerPos[0], playerPos[1]];
      case "right":
        x += 85;
        y += 34;
        return [x, y];
      case "down":
        x += 6;
        y += 83;
        return[x, y];
      default:
        return playerPos;
    }

  }

  update(dt) {
    // this.setCoordinates(this.playerPos);

    if (this.playerFace === "left") {
      this.currentSprite = 'assets/images/bullet_horz.png';
      this.coordinates[0]-= (500 * dt);
      this.active = this.active && this.coordinates[0] >= 0;
    }

    if (this.playerFace === "up") {
      this.currentSprite = 'assets/images/bullet_vert.png';
      this.coordinates[1]-= (500 * dt);
      this.active = this.active && this.coordinates[1] >= 0;
    }

    if (this.playerFace === "right") {
      this.currentSprite = 'assets/images/bullet_horz.png';
      this.coordinates[0]+= (500 * dt);
      this.active = this.active && this.coordinates[0] <= this.canvasW;
    }

    if (this.playerFace === "down") {
      this.currentSprite = 'assets/images/bullet_vert.png';
      this.coordinates[1]+= (500 * dt);
      this.active = this.active && this.coordinates[1] <= this.canvasH;
    }
  }
}


module.exports = Bullet;
