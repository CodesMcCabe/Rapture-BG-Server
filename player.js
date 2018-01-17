class Player {
  // player movement
  // player physics
  // sprite model for player
  // HOW TO MAKE PLAYER MOVE ON CANVAS???
  // FIGURE OUT HOW TO MAKE IT SO WHEN A KEY IS RELEASED, MOVEMENT GOES BACK TO LAST PRESSED KEY IF STILL HELD DOWN

  constructor (ctx, canvas) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.coordinates = [0, 0];
    // this.model = playerModel;
  }


  render() {
    this.ctx.fillRect(this.coordinates[0], this.coordinates[1], 50, 50);
  }

  update(key) {
    if(key === 37) {
    	this.coordinates[0]--;
    }
    if(key === 38) {
    	this.coordinates[1]--;
    }
    if(key === 39) {
    	this.coordinates[0]++;
    }
    if(key === 40) {
    	this.coordinates[1]++;
    }
  }

  clear() {
	   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
   }

//
//   update() {
//     if(key === 37) {
//     	coordinates[0]--;
//     }
//     if(key === 38) {
//     	coordinates[1]--;
//     }
//     if(key === 39) {
//     	coordinates[0]++;
//     }
//     if(key === 40) {
//     	coordinates[1]++;
//     }
// }

  // render () {
  //   this.model
  // }
}

module.exports = Player;
