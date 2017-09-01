class TitleScreen{
	create(){
		console.log("titlescreen started");

		var backgroundLayer = game.add.group();
		var spriteLayer = game.add.group();
		var foregroundLayer = game.add.group();

		var background = backgroundLayer.create(0, 0, "background");
		var sprite = spriteLayer.create(0, 420, "sprite");
		var foreground = foregroundLayer.create(0, 0, "foreground");



		var spriteArrives = game.add.tween(sprite);
		spriteArrives.to({x:270}, 3000, Phaser.Easing.Linear.None);
		game.physics.arcade.enableBody(sprite);

		spriteArrives.onComplete.add(function() {
			let emitter = game.add.emitter(sprite.x+12, sprite.y + 55, 50);
			emitter.makeParticles("fart");
			emitter.gravity = -100;
			emitter.minParticleScale = 0.001;
			emitter.maxParticleScale = 0.1;
			emitter.lifespan = 'zero';
			emitter.start(true, 2000, null, 200);
			sprite.loadTexture("shy", 5000, false);
			game.time.events.add(3000, destroyEmitter, this);

			function destroyEmitter() {

				let spriteLeaves = game.add.tween(sprite);
				spriteLeaves.to({x:700}, 1000, Phaser.Easing.Linear.None);
				spriteLeaves.start();
				game.time.events.add(500, textDrop, this);
			}
			

			function textDrop() {
				let text = game.add.sprite(106, 0, "text")
				let textdrops = game.add.tween(text);
				textdrops.to({y:240}, 0, Phaser.Easing.Bounce.Out);
				textdrops.start();
				game.time.events.add(500, playme, );

			}
			function playme() {
				var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", startGame);
				playButton.anchor.set(0.5);
				var tween = game.add.tween(playButton).to({
					width: 220,
					height: 220
				}, 1500, "Linear", true, 0, -1);
				tween.yoyo(true);

				function startGame() {
					game.state.start("PlayGame");
				}
			}

		});
		
		
		spriteArrives.start();


	}
}