class Bullet {
  constructor(playerAttr, canvasW, canvasH, ctx, sprite) {
    // create bounding box attributes
    // set heigh and width attributs for each which will simulate the hitbox
    this.currentSprite = sprite;
    this.active = true;
    this.playerPos = Object.assign([], playerAttr.playerPos);
    this.playerFace = playerAttr.playerFace;
    this.coordinates = this.setCoordinates(this.playerPos);
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;

    this.setCoordinates = this.setCoordinates.bind(this);
    this.setHitBox = this.setHitBox.bind(this);
  }

  render () {
    var bulletSprite = new Image();
    bulletSprite.src = this.currentSprite.url;
    this.ctx.drawImage(bulletSprite, this.coordinates[0], this.coordinates[1]);
  }

  setHitBox (playerFace) {
    switch (playerFace) {
      case "left":
        this.currentSprite.frameHeight = 6;
        this.currentSprite.frameWidth = 14;
        break;
      case "up":
        this.currentSprite.frameHeight = 14;
        this.currentSprite.frameWidth = 6;
        break;
      case "right":
        this.currentSprite.frameHeight = 6;
        this.currentSprite.frameWidth = 14;
        break;
      case "down":
        this.currentSprite.frameHeight = 14;
        this.currentSprite.frameWidth = 6;
        break;
      default:
        return playerFace;
    }
  }

  setCoordinates (playerPos) {
    let x = playerPos[0];
    let y = playerPos[1];
    this.setHitBox(this.playerFace);
    switch (this.playerFace) {
      case "left":
        x += 4;
        y += 11;
        return [x, y];
      case "up":
        x += 40;
        y += 5;
        return [x, y];
      case "right":
        x += 75;
        y += 40;
        return [x, y];
      case "down":
        x += 11;
        y += 80;
        return[x, y];
      default:
        return playerPos;
    }

  }

  update(dt) {
    switch (this.playerFace) {
      case 'left':
        this.currentSprite.url = 'assets/images/bullet_horz.png';
        this.coordinates[0]-= (800 * dt);
        this.active = this.active && this.coordinates[0] >= 0;
        break;
      case 'up':
        this.currentSprite.url = 'assets/images/bullet_vert.png';
        this.coordinates[1]-= (800 * dt);
        this.active = this.active && this.coordinates[1] >= 0;
        break;
      case 'right':
        this.currentSprite.url = 'assets/images/bullet_horz.png';
        this.coordinates[0]+= (800 * dt);
        this.active = this.active && this.coordinates[0] <= this.canvasW;
        break;
      case 'down':
        this.currentSprite.url = 'assets/images/bullet_vert.png';
        this.coordinates[1]+= (800 * dt);
        this.active = this.active && this.coordinates[1] <= this.canvasH;
        break;
    }
  }
    // if (this.playerFace === "left") {
    //   this.currentSprite = 'assets/images/bullet_horz.png';
    //   this.coordinates[0]-= (800 * dt);
    //   this.active = this.active && this.coordinates[0] >= 0;
    // }
    //
    // if (this.playerFace === "up") {
    //   this.currentSprite = 'assets/images/bullet_vert.png';
    //   this.coordinates[1]-= (800 * dt);
    //   this.active = this.active && this.coordinates[1] >= 0;
    // }
    //
    // if (this.playerFace === "right") {
    // }
    //
    // if (this.playerFace === "down") {
    // }
}


module.exports = Bullet;
