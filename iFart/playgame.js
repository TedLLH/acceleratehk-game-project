
const TUNNEL_WIDTH = document.window.width;
const SHIP_HORIZONTAL_SPEED = 100;
const SHIP_MOVE_DELAY = 0;
const SHIP_VERTICAL_SPEED = 0;
const SWIPE_DISTANCE = 10;
const HOLE_SPEED = 200;
const BARRIER_DELAY = 1200;
const BARRIER_INCREASE_SPEED = 1.1;
const BARRIER_GAP = 120;

class PlayGame{
	create(){
		var tintColor = BG_COLORS[game.rnd.between(0, BG_COLORS.length - 1)]
		var tunnelBG = game.add.tileSprite(0,0,game.width,game.height,"tunnelbg");
		tunnelBG.tint = tintColor;
		console.log("playgame started");
		this.shipPositions = [(game.width - TUNNEL_WIDTH)/2+32, (game.width + TUNNEL_WIDTH)/2-32]; 
		this.ship = game.add.sprite(this.shipPositions[0],860,"ship");
		this.ship.side = 0;
		this.ship.anchor.set(0.5);
		this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
		this.ship.canMove = true;
		game.input.onDown.add(this.moveShip, this);
		this.smokeEmitter = game.add.emitter(this.ship.x, this.ship.y + 10,20);
		this.smokeEmitter.makeParticles("smoke");
		this.smokeEmitter.setXSpeed(-15, 15);
		this.smokeEmitter.setYSpeed(50, 150);
		this.smokeEmitter.setAlpha(0.5, 1);
		this.smokeEmitter.start(false, 1000, 40);

		this.holeSpeed = BARRIER_SPEED;
		this.holeGroup = game.add.group();
		// creating a constructor that will set the properties of the barrier
		var hole = new Hole(game, barrierSpeed, tintColor);
		// adds barrier to the game
		game.add.existing(hole);
		// adds every new barrier created from game.add.existing(barrier) to the barrier variable
		this.barrierGroup.add(hole);

		this.ship.destroyed = false;
	}

	update(){
		this.smokeEmitter.x = this.ship.x;
		this.smokeEmitter.y = this.ship.y;

		game.physics.arcade.collide(this.ship, this.barrierGroup, function(s, b){
			console.log("collision between ship and barrier");
			});
		
		restartShip(){
			if(!this.ship.destroyed && this.ship.alpha == 1){
				this.barrierSpeed *= BARRIER_INCREASE_SPEED;
				for(let i = 0; i < this.barrierGroup.length; i++){
					this.barrierGroup.getChildAt(i).body.velocity.y = this.barrierSpeed;
				}
				this.ship.canSwipe = false;
				this.verticalTween.stop();
				this.ship.alpha = 0.5;
				this.verticalTween = game.add.tween(this.ship).to({
					y: 860
				}, 100, Phaser.Easing.Linear.None, true);
				this.verticalTween.onComplete.add(function(){
					this.verticalTween = game.add.tween(this.ship).to({
						y: 0
					}, SHIP_VERTICAL_SPEED, Phaser.Easing.Linear.None, true);
					var alphaTween = game.add.tween(this.ship).to({
						alpha: 1
					}, SHIP_INVISIBILITY_TIME, Phaser.Easing.Bounce.In, true);
				}, this)
			}
		}

		// time tracker
		var thisTime = new Date();
		var diff = (thisTime.getTime() - this.startingTime.getTime())/1000;
		this.score.text = diff

		if (this.game.physics.ARCADE.)
	}

	moveShip(){
		if(this.ship.canMove){
			this.ship.canMove = false;
			this.ship.side = 1 - this.ship.side;
			var horizontalTween = game.add.tween(this.ship).to({
				x: this.shipPositions[this.ship.side]
			}, SHIP_HORIZONTAL_SPEED, Phaser.Easing.Linear.None, true);
			horizontalTween.onComplete.add(function(){
				game.time.events.add(SHIP_MOVE_DELAY,function(){
				this.ship.canMove = true;
				}, this);
			}, this);
		}

		// don't need ghostShip because no point we'll have sprites instead
		/* let ghostShip = game.add.sprite(this.ship.x, this.ship.y, "ship");
		ghostShip.alpha = 0.5;
		ghostShip.anchor.set(0.5);
		let ghostTween = game.add.tween(ghostShip).to({
			alpha: 0
		}, 350, Phaser.Easing.Linear.None, true);
		ghostTween.onComplete.add(function(){
			ghostShip.destroy();
		}) */
	}
}

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