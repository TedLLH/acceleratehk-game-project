const TUNNEL_WIDTH = 640;
const SHIP_HORIZONTAL_SPEED = 100;
const SHIP_MOVE_DELAY = 0;
const SHIP_VERTICAL_SPEED = 0;
const SWIPE_DISTANCE = 10;
const HOLE_SPEED = 200;
const BARRIER_DELAY = 1200;
const BARRIER_INCREASE_SPEED = 1.1;
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
		this.ship.enableBody = true;
		this.ship.anchor.set(0.5, 0);
		this.ship.destroyed = false;
		game.physics.enable(this.ship, Phaser.Physics.ARCADE);
		
		//ship animation
		var walk = this.ship.animations.add('walk');
		this.ship.animations.play('walk',20, true);

		//smoke emitter and parameters
		this.smokeEmitter = game.add.emitter((this.ship.x ), (this.ship.y ));
		this.smokeEmitter.makeParticles("smoke");
		this.smokeEmitter.setXSpeed(-15, 15);
		this.smokeEmitter.setYSpeed(50, 150);
		this.smokeEmitter.setAlpha(0.5, 1);
		this.smokeEmitter.start(false, 1000, 40);

		//hole properties
		this.holeSpeed = HOLE_SPEED;
		this.holeGroup = game.add.group();
		this.addHole(this.holeGroup, "hole");

		
		//fan properties
		this.fanSpeed = FAN_SPEED;
		this.fanGroup = game.add.group();
		this.addFan(this.fanGroup, "fan");

		this.cursors = game.input.keyboard.createCursorKeys();
		//sorting all obstacles in array for convenience
		document.getElementById("all").style.cursor = "none";

	}
	
	update(){
		
		this.smokeEmitter.x = this.ship.x;
		this.smokeEmitter.y = this.ship.y + 70;
		
		var obstacle = [this.holeGroup];

		game.physics.arcade.collide(this.ship, obstacle, function(){
			game.state.start("PlayGame");
		});
		// make the ship follow the mouse from side to side
		//this.ship.x = game.input.activePointer.position.x;
		this.mousePointer = null;

		//game.add.sprite(0, 0, "box").alignTo(fan, Phaser.RIGHT_CENTER);
		//ship hit fan rectangle
        var blow = game.physics.arcade.collide(this.ship, this.fanGroup, function (s,b)
            {
                let moveTwen = game.add.tween(this.ship).to({
                    x: this.ship.x + 100,
                    //y: this.ship.y - 300,
                }, 200, Phaser.Easing.Linear.None, true);
			}, null, this)
		

			if (this.cursors.left.isDown) {
				this.ship.body.x -= 6;
			}
			if (this.cursors.right.isDown) {
				this.ship.body.x += 6;
			}
			if (this.cursors.up.isDown) {
				this.ship.body.y -= 6;
			}
			if (this.cursors.down.isDown) {
				this.ship.body.y += 6;
			
			}
		}
	

	addFan(group){
		let fan = new Fan(game, FAN_SPEED, this);
		game.add.existing(fan);
		group.add(fan);
		fan.scale.setTo(0.1,0.1);
	}

	addHole(group){
		let hole = new Hole(game, HOLE_SPEED, this);
		game.add.existing(hole);
		group.add(hole);
		hole.scale.setTo(0.3,0.3);
	}
	addBox(group){
		let box = new Box(game, FAN_SPEED, this);
		game.add.existing(box);
		group.add(box);
		hole.scale.setTo(0.3,0.3);
	}
	

}
// Fan class	
class Fan extends Phaser.Sprite{
constructor(game, speed, playGame) {

	//randomise fan positions
	let fanPositions = [Math.floor(Math.random() * (600 - 100)) + 100, Math.floor(Math.random() * (600 - 100)) + 100];
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
		
	}
}

// hole class
class Hole extends Phaser.Sprite{
	constructor(game, speed, playGame){
		let holePositions = [Math.floor(Math.random() * (600 - 100)) + 100, Math.floor(Math.random() * (600 - 100)) + 100];
		let holePosition = game.rnd.between(0,1);
		super(game, holePositions[holePosition], -100, "hole");
		this.playGame = playGame;
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor.set(0.5);
		this.body.velocity.y = speed;
		this.placeHole = true;
		this.body.immovable = true;
	};

	update(){
		if(this.placeHole && this.y > BARRIER_GAP){
			this.placeHole = false;
			this.playGame.addHole(this.parent, "hole");
		}

		if(this.y > game.height){
			this.destroy();
		}
	}
}
