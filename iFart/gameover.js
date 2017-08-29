class GameOverScreen{
	create(){
		console.log("Game Over")
		const titleBG = game.add.tileSprite(0, 0, game.width, game.height, "backsplash");
		titleBG.tint = BG_COLORS[game.rnd.between(0, BG_COLORS.length - 1)];
		game.add.bitmapText(game.width/2, 50, "font", "Your score", 48).anchor.x = 0.5;
		//game.add.bitmapText(game.width / 2, 150, "font", score.toString, 72)
		const playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
		playButton.anchor.set(0.5);
		const tween = game.add.tween(playButton).to({
			width: 220,
			height: 220
		}, 1500, "Linear", true, 0, -1);
		tween.yoyo(true);
		
		//document.getElementById("all").style.cursor = "pointer";
	}
	startGame(){
		game.state.start("PlayGame");
	}
}