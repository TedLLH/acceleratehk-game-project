
const TUNNEL_WIDTH = 640;
const SHIP_HORIZONTAL_SPEED = 100;
const SHIP_MOVE_DELAY = 0;
const SHIP_VERTICAL_SPEED = 0;
const SWIPE_DISTANCE = 10;

class PlayGame{
	create(){
		var tintColor = BG_COLORS[game.rnd.between(0, BG_COLORS.length - 1)]
		var tunnelBG = game.add.tileSprite(0,0,game.width,game.height,"tunnelbg");
		tunnelBG.tint = tintColor;
		console.log("playgame started");

		//ship and parameters
		this.ship = game.add.sprite(320,720,"ship");
		this.ship.inputEnabled = true;
		this.ship.anchor.set(0.5, 0);

		//smoke emitter and parameters
		this.smokeEmitter = game.add.emitter((this.ship.x ), (this.ship.y));
		this.smokeEmitter.makeParticles("smoke");
		this.smokeEmitter.setXSpeed(-15, 15);
		this.smokeEmitter.setYSpeed(50, 150);
		this.smokeEmitter.setAlpha(0.5, 1);
		this.smokeEmitter.start(false, 1000, 40);
	}

	update(){
		this.smokeEmitter.x = this.ship.x;
		this.smokeEmitter.y = this.ship.y;

		// make the ship follow the mouse from side to side
		this.ship.x = game.input.activePointer.position.x;
	}
}