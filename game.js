window.onload = function() {
    var tileSize = 80;
    var numRows = 4;
    var numCols = 5;
    var tileSpacing = 10;
    var tilesArray =[];
    var selectedArray = [];
    var playSound;
    var score;
    var timeLeft;
    var tilesLeft;
    var game = new Phaser.Game(500, 500);
    var playGame = function(game) {}
        playGame.prototype = {
            scoreText: null,
            timeText: null,
            soundArray: [],
            preload: function() {
                game.load.spritesheet("tiles", "tiles.png", tileSize, tileSize);
                game.load.audio("select", ["select.mp3", "select.ogg"]);
                game.load.audio("right", ["right.mp3", "right.ogg"]);
                game.load.audio("wrong", ["wrong.mp3", "wrong.ogg"]);
            },
            create: function() {
                score = 0;
                timeLeft =  60;
                this.placeTiles();
                if(playSound) {
                    this.soundArray[0] = game.add.audio("select", 1);
                    this.soundArray[1] = game.add.audio("right", 1);
                    this.soundArray[2] = game.add.audio("wrong", 1);
                }
                var style = {
                    font: "32px Monospace",
                    fill: "#00ff00",
                    align: "center"
                }
                this.scoreText = game.add.text(5, 5, "Score: " + score, style);
                this.timeText = game.add.text(5, game.height - 5, "Time left: " + timeLeft, style);
                this.timeText.anchor.set(0,1);
                game.time.events.loop(Phaser.Timer.SECOND, this.decreaseTime, this);
            },
            placeTiles: function() {
                tilesLeft = numRows * numCols;
                var leftSpace = (game.width - (numCols * tileSize) - ((numCols - 1) * tileSpacing))/2;
                var topSapce = (game.height - (numRows * tileSize) - ((numRows - 1) * tileSpacing)) /2;
                for(var i = 0; i < numRows * numCols; i++) {
                    tilesArray.push(Math.floor(i / 2));
                }
                for(i = 0; i < numRows * numCols; i++) {
                    var from = game.rnd.between(0, tilesArray.length-1);
                    var to = game.rnd.between(0, tilesArray.length-1);
                    var temp = tilesArray[from];
                    tilesArray[from] = tilesArray[to];
                    tilesArray[to] = temp;
                }
                for( i =0; i < numCols; i++) {
                    for(var j = 0; j < numRows; j++) {
                       var tile = game.add.button(leftSpace + i * (tileSize + tileSpacing), topSapce + j * (tileSize + tileSpacing), "tiles", this.showTile, this);
                        tile.frame = 10;
                        tile.value = tilesArray[j * numCols + i];
                    }
                }
            },
            showTile: function(target) {
                if(selectedArray.length < 2 && selectedArray.indexOf(target) == -1) {
                    if(playSound) {
                        this.soundArray[0].play();
                    }
                    target.frame = target.value;
                   selectedArray.push(target);
                    if(selectedArray.length ==2) {
                        game.time.events.add(Phaser.Timer.SECOND, this.checkTiles, this);
                    }
                }
            },
            checkTiles: function() {  
                        if(selectedArray[0].value == selectedArray[1].value) {
                            if(playSound) {
                                this.soundArray[1].play();
                            }
                            score ++;
                            timeLeft += 2;
                            this.timeText.text - "Time left: " + timeLeft;
                            this.scoreText.text = "Score: " + score;
                            selectedArray[0].destroy();
                            selectedArray[1].destroy();
                            tilesLeft -= 2;
                            if(tilesLeft == 0) {
                                tilesArray.length = 0;
                                selectedArray.length = 0;
                                this.placeTiles();
                            }
                        } else {
                            if(playSound) {
                                this.soundArray[2].play();
                            }
                            selectedArray[0].frame = 10;
                            selectedArray[1].frame = 10;
                        }
                        selectedArray.length = 0;
                    },
            decreaseTime: function() {
                timeLeft --;
                this.timeText.text = "Time left: " + timeLeft;
                if(timeLeft == 0) {
                    game.state.start("GameOver");
                }
            }
        }
        var titleScreen = function(game) {}
        titleScreen.prototype = {
            preload: function() {
                game.load.spritesheet("soundicons", "soundicons.png", 80, 80);
            },
            create: function() {
                game.scale.pageAlignHorizontally = true;
                game.scale.pageAlignVertically = true;
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                game.stage.disableVisibilityChange = true;
                var style = {
                    font: "48px Monospace",
                    fill: "#00ff00",
                    align: "center"
                };
                var text = game.add.text(game.width / 2, game.height / 2 - 100,
                                         "The Alien Enigma", style);
                text.anchor.set(0.5);
                var soundButton = game.add.button(game.width / 2 - 100,
                                                  game.height / 2 + 100, "soundicons", this.startGame, this);
                soundButton.anchor.set(0.5);
                    soundButton = game.add.button(game.width / 2 + 100, game.height / 2 + 100, "soundicons", this.startGame, this);
                soundButton.frame = 1;
                soundButton.anchor.set(0.5);
            },
            startGame : function(target) {
                if(target.frame == 0) {
                    playSound = true;
                } else {
                    playSound = false;
                }
                game.state.start("PlayGame");
            
        }
    }
    
    var gameOver = function(game) {}
    gameOver.prototype = {
        create: function() {
            var style = {
                font: "32px Monospace",
                fill: "#00ff00",
                align: "center"
            }
            var text = game.add.text(game.width / 2, game.height / 2, "Game over\n\nYour score: " + score + "\n\nTap to restart", style);
            text.anchor.set(0.5);
            game.input.onDown.add(this.restartGame, this);
        },
        restartGame: function() {
            tilesArray.length = 0;
            selectedArray.length = 0;
            game.state.start("TitleScreen");
        }
    }
    
        game.state.add("TitleScreen", titleScreen);
        game.state.add("PlayGame", playGame);
        game.state.add("GameOver", gameOver);
        game.state.start("TitleScreen");
}