// dev to debug, false for production
var DEBUG = true;
// A 2D array to keep track of all occupied tiles
var MAX_WIDTH = 48;
var MAX_HEIGHT = 32;
var CELL_SIZE = 16;
var STARTX = 5;
var STARTY = 5;

var occupied = new Array(MAX_WIDTH);

function logger(message) {
	if (DEBUG) {
		console.log(message);
	}	
}

Game = {
	// This defines our grid's size and the size of each of its tiles
	map_grid: {
		width:  MAX_WIDTH,
		height: MAX_HEIGHT,
		tile: {
			width:  CELL_SIZE,
			height: CELL_SIZE
		}
	},

	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},

	// The total height of the game screen. Since our grid takes up the entire screen
	//  this is just the height of a tile times the height of the grid
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},

	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		Crafty.background('rgb(155, 155, 155)');

		initArray();
		
		// Simply start the "Loading" scene to get things going
		Crafty.scene('Loading');
	},
	
	hitSolid: function() {
		document.getElementById("playerResult").innerHTML = "hit a solid - ouch";
	},
	
	visitVille: function() {
		document.getElementById("playerResult").innerHTML = "visited ville.";
	},
	
	hitMagicLadder: function() {
		document.getElementById("playerResult").innerHTML = "hit the magic ladder!";
	},
	
	hitMoveableRock: function(rock) {
		document.getElementById("playerResult").innerHTML = 
			"hit the moveable rock at x: " + rock.x + ", y: " + rock.y;
		
	},
	
	rockHitSolid: function(rock) {		
		document.getElementById("playerResult").innerHTML = "rock hit solid! rock.xy: " + rock.x + ", " + rock.y;
	},
	
	trackPlayer: function(player) {
		document.getElementById("playerPosition").innerHTML = 
			"x: " + player.x + " y: " + player.y;
	}
}

function initArray() {
	logger("in the initArray");
	for (var x = 0; x < MAX_WIDTH; x++) {
		occupied[x] = new Array(MAX_HEIGHT);
		for (var y = 0; y < MAX_HEIGHT; y++) {
			occupied[x][y] = false;
		}
	}
}

function processCollideSolid(collider, object) {
	// require 2 objects, collider, object collided with	
	logger("collider xy: " + collider.x + ", " + collider.y);
	logger("object xy: " + object.x + ", " + object.y);
}

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }