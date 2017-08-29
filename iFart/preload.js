class Preload{
	preload(){
		var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loading");
		loadingBar.anchor.setTo(0.5,0.5);
		game.load.setPreloadSprite(loadingBar);
		game.load.image("title","assets/sprites/title.png");
		game.load.image("playbutton","assets/sprites/playbutton.png");
		game.load.image("backsplash", "assets/sprites/backsplash.png");
		game.load.image("tunnelbg", "assets/sprites/tunnelbg.png");
		game.load.image("wall", "assets/sprites/wall.png");
		game.load.image("man", "assets/sprites/ship.png");
		game.load.image("smoke", "assets/sprites/smoke3.png");
		game.load.image("hole", "assets/sprites/hole.png")
		game.load.image("fan", "assets/sprites/blowleft.png");
		game.load.spritesheet("ship", "assets/sprites/man.png", 62, 90);
		game.load.image("box", "assets/sprites/barrier.png");
	}

	create(){
		console.log("preload started");
		game.state.start("TitleScreen");
	}
}