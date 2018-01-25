class Bullet {
  constructor(playerAttr, canvasW, canvasH, ctx, sprite, bulletCount) {
    this.currentSprite = sprite;
    this.active = true;
    this.playerPos = Object.assign([], playerAttr.playerPos);
    this.playerFace = playerAttr.playerFace;
    this.coordinates = this.setCoordinates(this.playerPos);
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.ctx = ctx;
    this.bulletCounter = 0;
    this.bulletCount = bulletCount;

    this.setCoordinates = this.setCoordinates.bind(this);
    this.setHitBox = this.setHitBox.bind(this);
  }

  render () {
    var bulletSprite = new Image();
    bulletSprite.src = this.currentSprite.url;
    this.ctx.drawImage(bulletSprite, this.coordinates[0], this.coordinates[1]);
  }

  setHitBox (playerFace) {
    let dimensionsCopy = Object.assign([],
      [this.currentSprite.frameWidth, this.currentSprite.frameHeight]);
    switch (playerFace) {
      case "left":
        this.currentSprite.frameHeight = dimensionsCopy[1];
        this.currentSprite.frameWidth = dimensionsCopy[0];
        break;
      case "up":
        this.currentSprite.frameHeight = dimensionsCopy[0];
        this.currentSprite.frameWidth = dimensionsCopy[1];
        break;
      case "right":
        this.currentSprite.frameHeight = dimensionsCopy[1];
        this.currentSprite.frameWidth = dimensionsCopy[0];
        break;
      case "down":
        this.currentSprite.frameHeight = dimensionsCopy[0];
        this.currentSprite.frameWidth = dimensionsCopy[1];
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

  update(dt, owner) {

    if (owner === 'player') {
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
    } else {

      // ORIENT MONSTER BULLETS
    }
  }
}


module.exports = Bullet;
