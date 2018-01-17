// MONSTER WILL CHASE PLAYER, TAKE SHORTEST ROUTE IF POSSIBLE

class Monster {
  constructor (ctx, options) {
    // this.name = options.name;
    // this.power = options.power;
    // this.sprite = options.sprite;
    this.ctx = ctx;
    this.coordinates = [750, 350];
    this.currentSprite = 'assets/images/bossworm_front.png';
  }

  render() {
    var monsterSprite = new Image();
    monsterSprite.src = this.currentSprite;
    this.ctx.drawImage(monsterSprite, this.coordinates[0], this.coordinates[1]);
  }

  update() {
    // random movement
  }

  // set new image and then call src on that image path
  //

}

module.exports = Monster;
