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
		game.load.image("hole", "assets/sprites/hole.png");
		game.load.spritesheet("fan", "assets/sprites/fansheet.png", 1100, 512, 4);
		game.load.image("transparent", "assets/sprites/transparent.png");
		game.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
		game.load.spritesheet("ship", "assets/sprites/man.png", 62, 90, 6);
		game.load.image("box", "assets/sprites/barrier.png");
		game.load.image("export", "assets/sprites/trainbackground.png");
		game.load.spritesheet("blowLeftFan", "assets/sprites/fansheetleft.png", 1100, 512, 4);
		game.load.spritesheet("fuelDispenser", "assets/sprites/upspritesheet.png", 512, 512, 8);
		game.load.image("background", "assets/sprites/background.png");
		game.load.image("foreground", "assets/sprites/foreground.png");
		game.load.spritesheet("sprite", "assets/sprites/rightsprite.png", 52, 68, 7);
		game.load.image("fart", "assets/sprites/particle.png");
		game.load.image("shy", "assets/sprites/surprise.png");
		game.load.image("text", "assets/sprites/text.png");
		game.load.audio("bgmusic", "assets/sprites/flight_of_the_bumblebee_2.mp3");
	}
	
	create(){
		console.log("preload started");
		game.state.start("TitleScreen");
	}
}