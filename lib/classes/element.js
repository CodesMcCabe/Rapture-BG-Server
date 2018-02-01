class Element {
  constructor (delta) {
    this.currentSprite = sprite;
    this.ctx = ctx;
    this.playerPos = Object.assign([], playerAttr.coordinates);
    this.coordinates = playerAttr.coordinates;
    this.lastUpdate = Date.now();
    this.shift = 0;
    this.collision = false;
  }

  render (now) {
    var bloodHitSprite = new Image();
    bloodHitSprite.src = this.currentSprite.url;
    this.ctx.drawImage(bloodHitSprite, this.shift, 0,
      this.currentSprite.frameWidth, this.currentSprite.frameHeight,
      this.coordinates[0], this.coordinates[1], this.currentSprite.frameWidth,
      this.currentSprite.frameHeight);

      let fps = this.currentSprite.fps * this.currentSprite.fpsX;
      if (now - this.lastUpdate > fps)  {
        this.currentSprite.fps = fps;
        this.lastUpdate = now;
        this.shift = this.currentSprite.currentFrame *
        this.currentSprite.frameWidth;

        // if (this.currentSprite.currentFrame ===
        //   this.currentSprite.totalFrames &&
        //   this.currentSprite.name === 'dead') {
        //     this.gameOver = true;

       if (this.currentSprite.currentFrame ===
            this.currentSprite.totalFrames) {
              this.collision = false;
              this.shift = 0;
              this.currentSprite.currentFrame = 0;
            }
            this.currentSprite.currentFrame += 1;
          }
  }
}

module.exports = BloodHit;
