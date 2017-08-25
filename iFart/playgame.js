const TUNNEL_HEIGHT = 512;
class PlayGame {
	create(){
		var tintColor = BG_COLORS[game.rnd.between(0, BG_COLORS.length - 1)]
		/*var tunnelBG = game.add.tileSprite(0, 0, game.width, game.height, "tunnelbg");
		tunnelBG.tint = tintColor;
		var leftWallBG = game.add.tileSprite(- TUNNEL_WIDTH / 2, 0, game.width /2, game.height, "wall");
		leftWallBG.tint = tintColor;*/
		var floorBG = game.add.tileSprite((game.height + TUNNEL_HEIGHT) / 2, 0, game.height / 2, game.width, "floor");
		floorBG.tint = tintColor;
		console.log("playgame started");
	}
}