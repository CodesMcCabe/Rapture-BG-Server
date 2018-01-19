class Sprite {
  constructor(url, pos, size, speed, frames, dir, once) {
    this.spriteHeight = options.spriteHeight;
    this.spriteWidth = options.spriteWidth;
    this.rows = options.rows;
    this.cols = options.cols;
    this.width = options.width;
    this.height = options.height;
    this.curFrame =options.curFrame;
    this.frameCount = options.frameCount;
    this.srcX = options.srcX;
    this.srcY = options.srcY;
    this.x =  options.x;
    this.y = options.y;
  }
}

module.export = Sprite;
