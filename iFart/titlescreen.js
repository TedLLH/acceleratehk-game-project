class TitleScreen{
	create(){
		var backgroundLayer = game.add.group();
		var spriteLayer = game.add.group();
		var foregroundLayer = game.add.group();

		var background = backgroundLayer.create(0, 0, "background");
		var sprite = spriteLayer.create(0, 420, "sprite");
		var foreground = foregroundLayer.create(0, 0, "foreground");

		var spriteArrives = game.add.tween(sprite);
		spriteArrives.to({x: 260}, 3000, Phaser.Easing.Linear.None);
		spriteArrives.start();

		var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
		playButton.anchor.set(0.5);
		var tween = game.add.tween(playButton).to({
			width: 220,
			height: 220
		}, 1500, "Linear", true, 0, -1);
		tween.yoyo(true);
		console.log("titlescreen started");
	}
	
	startGame(){
		console.log("playButton pressed");
		game.state.start("PlayGame");
	}
}