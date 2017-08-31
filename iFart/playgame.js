const TUNNEL_WIDTH = 640;
const SHIP_HORIZONTAL_SPEED = 100;
const SHIP_MOVE_DELAY = 0;
const SHIP_VERTICAL_SPEED = 0;
const SHIP_INCREASE_SPEED = 2;
const SWIPE_DISTANCE = 10;
const HOLE_SPEED = 300;
const HOLE_GAP = 170;
const FAN_GAP = 630;
const FAN_SPEED = 300;
const BLOW_LEFT_FAN_SPEED = 300;
const BLOW_LEFT_FAN_GAP = 500;
const FUEL_DISPENSER_SPEED = 300;
const FUEL_DISPENSER_GAP = 170;
const BARRIER_INCREASE_SPEED = 1.2;


let resultScore = 0;
// let transparent 

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
		//make ship bounce to the edge
		this.ship.body.collideWorldBounds = true;
		//setting bounce energy level
		this.ship.body.bounce.setTo(5,5);
				
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

		// hole properties
		this.holeSpeed = HOLE_SPEED;
		this.holeGroup = game.add.group();
		this.addHole(this.holeGroup, "hole");
		
		//fan properties (blowright)
		this.fanSpeed = FAN_SPEED;
		this.fanGroup = game.add.group();
		this.addFan(this.fanGroup, "fan");

		//fuel dispenser properties (blowright)
		this.fuelDispenserSpeed = FUEL_DISPENSER_SPEED;
		this.fuelDispenserGroup = game.add.group();
		this.addFuelDispenser(this.fuelDispenserGroup, "fuelDispenser");

		////fan properties (blowleft)
		this.blowLeftFanSpeed = BLOW_LEFT_FAN_SPEED;
		this.blowLeftFanGroup = game.add.group();
		this.addBlowLeftFan(this.blowLeftFanGroup, "blowLeftFan");

		//timer
        var me = this;

        me.startTime = new Date();
        me.createTimer();
        me.gameTimer = game.time.events.loop(100, function(){
            me.updateTimer();
        });

		this.cursors = game.input.keyboard.createCursorKeys();
		//sorting all obstacles in array for convenience
		document.getElementById("all").style.cursor = "none";
	}

	updateTimer(){
        var me = this;

        var currentTime = new Date();
        var timeDifference = me.startTime.getTime() - currentTime.getTime();

        //Time elapsed in seconds
        me.timeElapsed = Math.abs(timeDifference / 1000)

        //Time elapsed in minutes and seconds
        var minutes = Math.floor(me.timeElapsed / 60);
        var seconds = Math.floor(me.timeElapsed) - (60 * minutes);

        //Displaying time to put a "0" before 10 minutes/seconds
        resultScore = (minutes < 10) ? "0" + minutes : minutes;
        resultScore += (seconds < 10) ? ":0" + seconds : ":" + seconds;

		me.timeLabel.text = resultScore;
	}
	
	createTimer(){
        var me = this;

        me.timeLabel = me.game.add.text(me.game.world.centerX, 30, "00:00", {font: "50px Arial", fill: "#fff"});
        me.timeLabel.anchor.setTo(0.5,0);
        me.timeLabel.align = 'center';
    }
	
	update(){
		if(this.ship.x < 510){
			if (this.cursors.right.isDown) {
				this.ship.body.x += 6;
			}
		}
		if(this.ship.x > 140){
			if (this.cursors.left.isDown) {
				this.ship.body.x -= 6;
			}
		}
		if (this.cursors.up.isDown) {
			this.ship.body.y -= 6;
		}
		if (this.cursors.down.isDown) {
				this.ship.body.y += 6;
		}
		this.smokeEmitter.x = this.ship.x;
		this.smokeEmitter.y = this.ship.y + 70;
		this.background.tilePosition.y += 10;
		
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
					var me = this;
                    me.game.time.events.remove(me.gameTimer);
                    me.game.time.reset(me.gameTimer);
					game.time.events.add(Phaser.Timer.SECOND * 2, function() {
						game.state.start("GameOverScreen");
					});
				}, this);
			}, null, this)
		}
			//ship hit blowright fan
			if(game.physics.arcade.overlap(this.fanGroup, this.ship))
			{
				let moveTween = game.add.tween(this.ship).to({
					x: this.ship.x + 100,
					//y: this.ship.y,
				}, 50, Phaser.Easing.Linear.None, true);
			}

			//ship hit blowleft fan
			if(game.physics.arcade.overlap(this.blowLeftFanGroup, this.ship))
			{
				let moveTween = game.add.tween(this.ship).to({
					x: this.ship.x - 100,
					//y: this.ship.y,
				}, 50, Phaser.Easing.Linear.None, true);
			}
			
			//ship hit fuel dispenser
			let ship = this.ship;
			let holeGroup = this.holeGroup;
			let fanGroup = this.fanGroup;
			let blowLeftFanGroup = this.blowLeftFanGroup;
			let fuelDispenserGroup = this.fuelDispenserGroup;
			let that = this;
			
			switch (true) {
				case game.physics.arcade.overlap(holeGroup, fanGroup, function(h, f){
					holeGroup.children[holeGroup.getIndex(h)].destroy();
					console.log("holegroup destroy with fangroup")
					console.log("fangroup destroyed with hole group, ", fanGroup.getIndex(f))
					fanGroup.children[fanGroup.getIndex(f)].destroy();}):
				break;

				case game.physics.arcade.overlap(holeGroup, fuelDispenserGroup, function(h, f){
					holeGroup.children[holeGroup.getIndex(h)].destroy();
					console.log("holegroup destroy with fuel group")
					fuelDispenserGroup.children[fuelDispenserGroup.getIndex(f)].destroy();}):
					console.log("fule group destroy with holegroup")
				break;

				case game.physics.arcade.overlap(holeGroup, blowLeftFanGroup, function(h, f){
					holeGroup.children[holeGroup.getIndex(h)].destroy();
					console.log("holegroup destroy with left fan group")
					blowLeftFanGroup.children[blowLeftFanGroup.getIndex(f)].destroy();}):
					console.log("blow left fan destroy with hole group")
				break;

				case game.physics.arcade.overlap(fanGroup, fuelDispenserGroup, function(h, f){
					console.log("fangroup = fuel group", fanGroup.getIndex(h))
					fanGroup.children[fanGroup.getIndex(h)].destroy();
					fuelDispenserGroup.children[fuelDispenserGroup.getIndex(f)].destroy();}):
					console.log("fuel group to fangroup")
				break;
				
				case game.physics.arcade.overlap(fanGroup, blowLeftFanGroup, function(h, f){
					console.log("fangroup = blowleftfan", fanGroup.getIndex(h))
					fanGroup.children[fanGroup.getIndex(h)].destroy();
					blowLeftFanGroup.children[blowLeftFanGroup.getIndex(f)].destroy();}):
					console.log("blowleftgroup = fangroup")
				break;
				
				case game.physics.arcade.overlap(fuelDispenserGroup, blowLeftFanGroup, function(h, f){
					fuelDispenserGroup.children[fuelDispenserGroup.getIndex(h)].destroy();
					console.log("fuel group = blowleft")
					blowLeftFanGroup.children[blowLeftFanGroup.getIndex(f)].destroy();}):
					console.log("blowleft = fuel group")
				break;
			}
			
			this.fuelDispenserGroup.forEach(function(a) {
				game.physics.arcade.overlap(a, ship,function() {
					let holeSpeed = that.holeSpeed;
					let fanSpeed = that.fanSpeed;
					let blowLeftFanSpeed = that.blowLeftFanSpeed;
					let fuelDispenserSpeed = that.fuelDispenserSpeed;
					holeSpeed *= BARRIER_INCREASE_SPEED;
					console.log(holeSpeed);
					fanSpeed *= BARRIER_INCREASE_SPEED;
					console.log(fanSpeed);
					blowLeftFanSpeed *= BARRIER_INCREASE_SPEED;
					console.log(blowLeftFanSpeed);
					fuelDispenserSpeed *= BARRIER_INCREASE_SPEED;
					console.log(fuelDispenserSpeed);
					for(let i = 0; i < holeGroup.length; i++){
						holeGroup.getChildAt(i).body.velocity.y = holeSpeed;
					}
					for(let i = 0; i < fanGroup.length; i++){
						fanGroup.getChildAt(i).body.velocity.y = fanSpeed;
					}
					for(let i = 0; i < blowLeftFanGroup.length; i++){
						blowLeftFanGroup.getChildAt(i).body.velocity.y = blowLeftFanSpeed;
					}
					for(let i = 0; i < that.fuelDispenserGroup.length; i++){
						that.fuelDispenserGroup.getChildAt(i).body.velocity.y = fuelDispenserSpeed;
					}

					that.increaseItemsSpeed();
					a.kill();
				})
			})
			/* if(game.physics.arcade.overlap(this.fuelDispenserGroup, this.ship))
			{
				this.ship.speed = 2;
				this.fuelDispenserGroup.destroy();
			} */

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
        // var blow = game.physics.arcade.collide(this.ship, this.fanGroup, function (s,b)
        //     {
        //         let moveTwen = game.add.tween(this.ship).to({
        //             x: this.ship.x + 150,
        //             y: this.ship.y - 20,
        //         }, 200, Phaser.Easing.Linear.None, true);
		// 	}, null, this)
	} //update closing bracket
	increaseItemsSpeed(){
		this.holeSpeed *= BARRIER_INCREASE_SPEED;
		console.log(this.holeSpeed);
		this.fanSpeed *= BARRIER_INCREASE_SPEED;
		console.log(this.fanSpeed);
		this.blowLeftFanSpeed *= BARRIER_INCREASE_SPEED;
		console.log(this.blowLeftFanSpeed);
		this.fuelDispenserSpeed *= BARRIER_INCREASE_SPEED;
		console.log(this.fuelDispenserSpeed);
	}
	addBlowLeftFan(group){
		let blowleftfan = new BlowLeftFan(game, this.blowLeftFanSpeed, this);
		game.add.existing(blowleftfan);
		group.add(blowleftfan);
		blowleftfan.scale.setTo(0.1,0.1);
	}
	addFan(group){
		let fan = new Fan(game, this.fanSpeed, this);
		game.add.existing(fan);
		group.add(fan);
		fan.scale.setTo(0.1,0.1);
	}
	addHole(group){
		let hole = new Hole(game, this.holeSpeed, this);
		game.add.existing(hole);
		group.add(hole);
		hole.scale.setTo(0.3,0.3);
	}
	addFuelDispenser(group){
		let fuelDispenser = new FuelDispenser(game, this.fuelDispenserSpeed, this);
		game.add.existing(fuelDispenser);
		group.add(fuelDispenser);
		fuelDispenser.scale.setTo(0.1,0.1);
	}

	updateScore(){
		if (this.shi){}
	}
	// addTransparent(group){
	// 	let transparent = new Transparent(game, TRANSPARENT_SPEED, this);
	// 	game.add.existing(transparent);
	// 	group.add(transparent);
	// 	transparent.scale.setTo(0.1,0.1);
	// }
}


// blow right fan class	
class Fan extends Phaser.Sprite{
constructor(game, speed, playGame) {

	//randomise fan positions
	let fanFactor = (game.width - 440) / 2 + 211.2
	let fanPositions = [Math.floor(Math.random() * (fanFactor - 170) + 170), Math.floor(Math.random() * (fanFactor - 170) + 170)];
	let fanPosition = game.rnd.between(0, 1);
	super(game, fanPositions[fanPosition], -180, "fan");
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
		if(this.placeFan && this.y > FAN_GAP){
			this.placeFan = false;
			this.playGame.addFan(this.parent, "blowLeftFan");
		}

		if(this.y > game.height){
			this.destroy();
		}
	}
}

//blow left fan class
class BlowLeftFan extends Phaser.Sprite{
constructor(game, speed, playGame) {

	//randomise blow left fan positions
	let blowLeftFanFactor = (game.width - 440) / 2 + 211.2
	let blowLeftFanPositions = [Math.floor(Math.random() * (blowLeftFanFactor - 170)) + 170, Math.floor(Math.random() * (blowLeftFanFactor - 170)) + 170];
	let blowLeftFanPosition = game.rnd.between(0, 1);
	super(game, blowLeftFanPositions[blowLeftFanPosition], -500, "blowLeftFan");
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
		if(this.placeFan && this.y > BLOW_LEFT_FAN_GAP){
			this.placeFan = false;
			this.playGame.addBlowLeftFan(this.parent, "blowLeftFan");
		} 

		if(this.y > game.height){
			this.destroy();
		}
	}
}

// hole class
class Hole extends Phaser.Sprite{
	constructor(game, speed, playGame){
		let holePositions = [Math.floor(Math.random() * (540 - 150)) + 150, Math.floor(Math.random() * (540 - 150)) + 150];
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

// fuel dispenser class
class FuelDispenser extends Phaser.Sprite{
	constructor(game, speed, playGame){
		let fuelDispenserPositions = [Math.floor(Math.random() * (540 - 150)) + 150, Math.floor(Math.random() * (540 - 150)) + 150];
		let fuelDispenserPosition = game.rnd.between(0,1);
		super(game, fuelDispenserPositions[fuelDispenserPosition], -500, "fuelDispenser");
		this.playGame = playGame;
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor.set(0.5);
		this.body.velocity.y = speed;
		this.placeFuelDispenser = true;
	};
	update(){
		if(this.placeFuelDispenser && this.y > FUEL_DISPENSER_GAP){
			this.placeFuelDispenser = false;
			this.playGame.addFuelDispenser(this.parent, "fuelDispenser");
		}
		if(this.y > game.height){
			this.destroy();
		}	
		if(game.physics.arcade.overlap(this, this.ship)){
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
