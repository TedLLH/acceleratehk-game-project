class TitleScreen{
	create(){
        var titleBG = game.add.tileSprite(0, 0, game.width, game.height, "backsplash");
        titleBG.tint = BG_COLORS[game.rnd.between(0, BG_COLORS.length - 1)];	
		var title = game.add.image(game.width / 2, 25, "title");
		title.anchor.set(0.5,0);
		var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
		playButton.anchor.set(0.5);
		console.log("titlescreen started");
	}
	startGame(){
		console.log("playButton pressed");
	}
}