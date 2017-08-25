class Preload{
	preload(){
		var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loading");
		loadingBar.anchor.setTo(0.5,0.5);
        game.load.setPreloadSprite(loadingBar);
        game.load.image("tunnelbg", "assets/sprites/tunnelbg.png");
        game.load.image("wall", "assets/sprites/wall.png");
        game.load.image("backsplash", "assets/sprites/backsplash.png");
	}
	create(){
		console.log("preload started");
	}
}