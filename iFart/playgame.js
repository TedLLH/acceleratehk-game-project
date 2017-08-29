const TUNNEL_WIDTH = 640;
const SHIP_HORIZONTAL_SPEED = 100;
const SHIP_MOVE_DELAY = 0;
const SHIP_VERTICAL_SPEED = 0;
const SWIPE_DISTANCE = 10;
const HOLE_SPEED = 200;
const BARRIER_INCREASE_SPEED = 1.1;
const HOLE_GAP = 100;
const FAN_GAP = 300;
const FAN_SPEED = 200;



class PlayGame{
	create(){

		this.background = game.add.tileSprite(0,0,game.width,game.height,"export");
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
		this.background.tilePosition.y += 8;
		
		var obstacle = [this.holeGroup];

		if(!this.ship.destroyed){
			game.physics.arcade.collide(this.ship, obstacle, function(s, b)
				{
				this.ship.destroyed = true
				this.smokeEmitter.destroy();
				let destroyTween = game.add.tween(this.ship).to({
					x: this.ship.x + game.rnd.between(-100, 100),
					y: this.ship.y - 100,
					rotation: 10
				}, 1000, Phaser.Easing.Linear.None, true);
				destroyTween.onComplete.add(function(){
					let explosionEmitter = game.add.emitter(this.ship.x,
						this.ship.y, 200);
					explosionEmitter.makeParticles("smoke");
					explosionEmitter.setAlpha(0.5, 1);
					explosionEmitter.minParticleScale = 0.5;
					explosionEmitter.maxParticleScale = 2;
					explosionEmitter.start(true, 2000, null, 200);
					this.ship.destroy();
					game.time.events.add(Phaser.Timer.SECOND * 2, function() {
						game.state.start("GameOverScreen");
					});
				}, this);
			}, null, this)
		}

		/*
		game.physics.arcade.collide(this.ship, obstacle, function(){
			if(this.ship.destroyed = false){
				this.ship.destroyed = true;
				game.state.start("GameOverScreen");
			}
		});
		*/
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

	updateScore(){
		if (this.shi){}
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
		if (this.placeFan && this.y > FAN_GAP){
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
		if(this.placeHole && this.y > HOLE_GAP){
			this.placeHole = false;
			this.playGame.addHole(this.parent, "hole");
		}

		if(this.y > game.height){
			this.destroy();
		}
	}
}

// We need to create a 5 column system which will randomly generate whether it's a fan or a hole.
// This system is better because it makes gameplay more structured: prevents overlapping, ...
/*
let holePositions = [ 1 , 2 , 3 , 4 , 5 ]
let holePosition = game.rnd.between(0,4);
*/
