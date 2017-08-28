class GameOverScreen{
	create(){
		this.ship.destroy();
		game.time.events.add(Phaser.Timer.SECOND * 2, function(){
			game.state.start("GameOverScreen");
		});
	}
}