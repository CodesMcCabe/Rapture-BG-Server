class Sprite {
  constructor(options) {
    this.url = options.url;
    this.name = options.name;
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.currentFrame = options.currentFrame;
    this.totalFrames = options.frames;
    this.once = options.once;

    // this.lastUpdate = Date.now();
  }
}
// url, name, pos, size, speed, frames, dir, once

module.export = Sprite;
