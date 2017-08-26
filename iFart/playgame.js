
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
	}

	update(){
		this.smokeEmitter.x = this.ship.x;
		this.smokeEmitter.y = this.ship.y;
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

		let ghostShip = game.add.sprite(this.ship.x, this.ship.y, "ship");
		ghostShip.alpha = 0.5;
		ghostShip.anchor.set(0.5);
		let ghostTween = game.add.tween(ghostShip).to({
			alpha: 0
		}, 350, Phaser.Easing.Linear.None, true);
		ghostTween.onComplete.add(function(){
			ghostShip.destroy();
		})
	}
}