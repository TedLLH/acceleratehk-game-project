let game;
const BG_COLORS = [0xF16745, 0xFFC65D, 0x7BC8A4, 0x4CC3D9, 0x93648D, 0x7c786a, 0x588c73, 0x8c4646, 0x2a5b84, 0x73503c];

window.onload = () => {
    game = new Phaser.Game(960, 640);
    game.state.add("Boot", Boot);
    game.state.add("Preload", Preload);
    game.state.add("TitleScreen", TitleScreen);
    game.state.add("PlayGame", PlayGame);
    game.state.start("Boot");
}

class Boot {
    preload(){
        game.load.image("loading", "assets/sprites/loading.png");
    }
    create() {        
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.state.start("Preload");

    }
}