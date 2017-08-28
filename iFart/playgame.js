
const TUNNEL_WIDTH = 640;
const SHIP_HORIZONTAL_SPEED = 100;
const SHIP_MOVE_DELAY = 0;
const SHIP_VERTICAL_SPEED = 0;
const SWIPE_DISTANCE = 10;

const BARRIER_GAP = 120;

const FAN_SPEED = 200;

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

		//fan properties
		this.fanSpeed = FAN_SPEED;
		this.fanGroup = game.add.group();
		this.addFan(this.fanGroup, "fan");
	}

	update(){
		this.smokeEmitter.x = this.ship.x;
		this.smokeEmitter.y = this.ship.y;

		// make the ship follow the mouse from side to side
		this.ship.x = game.input.activePointer.position.x;
	}
	//addFan
	addFan(group){
	let fan = new Fan(game, FAN_SPEED,this);
	game.add.existing(fan);
	group.add(fan);
	fan.scale.setTo(0.1,0.1);
	}
}

// Fan class	
class Fan extends Phaser.Sprite{
constructor(game, speed,playGame) {

	//randomise fan positions
	let fanPositions = 
	[Math.floor(Math.random() * (600 - 100)) + 100, 
	Math.floor(Math.random() * (600 - 100)) + 100];
	let fanPosition = game.rnd.between(0, 1);
	super(game, fanPositions[fanPosition], -100, "fan");
	this.playGame = playGame;

	//enable phaser ARCADE physics
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.anchor.set(0.5);
	this.body.velocity.y = speed;
	this.placeFan = true;

	//make fan image not movable upon collision
	this.body.immovable = true;
};
	update(){

		//generate fan image continuously
		if (this.placeFan && this.y > BARRIER_GAP){
			this.placeFan = false;
			this.playGame.addFan(this.parent, "fan");
		}

		//destroy fan image after passing the screen to improve performances
		if(this.y > game.height){
			this.destroy();
		}
	}
}