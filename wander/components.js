// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		})
	},

	// Locate this entity at the given position on the grid
	at: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x / Game.map_grid.tile.width, y: this.y / Game.map_grid.tile.height }
		} else {
			this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
			return this;
		}
	}
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Solid, spr_tree');
	},
});

// A Bush is just an Actor with a certain sprite
Crafty.c('Bush', {
	init: function() {
		this.requires('Actor, Solid, spr_bush');
	},
});

// A Rock is just an Actor with a certain sprite
Crafty.c('Rock', {
	init: function() {
		this.requires('Actor, Moveable, Collision, spr_rock')
			.onHit('Solid', this.hitSolid);
		this.attr({
			// need axis of move?
			canMove: 1
		})
	},
	// Stops the movement
	stopMovement: function() {
		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},
	
	hitSolid: function(data) {
		rock = data[0].obj;
		Game.rockHitSolid(rock);
		//processCollideSolid(this, rock);
		this.stopMovement();
		this.canMove = 0;
	}
});

// A ladder is just an Actor with a certain sprite
Crafty.c('Ladder', {
	init: function() {
		this.requires('Actor, Magic, spr_ladder')
	},
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
	init: function() {
		this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
			.fourway(2)
			.stopOnSolids()
			.onHit('Moveable', this.hitMoveable)
			.onHit('Village', this.visitVillage)
			// These next lines define our four animations
			//  each call to .animate specifies:
			//  - the name of the animation
			//  - the x and y coordinates within the sprite
			//     map at which the animation set begins
			//  - the number of animation frames *in addition to* the first one
			.animate('PlayerMovingUp',    0, 0, 2)
			.animate('PlayerMovingRight', 0, 1, 2)
			.animate('PlayerMovingDown',  0, 2, 2)
			.animate('PlayerMovingLeft',  0, 3, 2);

		// Watch for a change of direction and switch animations accordingly
		var animation_speed = 4;
		this.bind('NewDirection', function(data) {
			if (data.x > 0) {
				this.animate('PlayerMovingRight', animation_speed, -1);
			} else if (data.x < 0) {
				this.animate('PlayerMovingLeft', animation_speed, -1);
			} else if (data.y > 0) {
				this.animate('PlayerMovingDown', animation_speed, -1);
			} else if (data.y < 0) {
				this.animate('PlayerMovingUp', animation_speed, -1);
			} else {
				this.stop();
			}
		});
		this.bind('EnterFrame', function() { 
			// send co-ords to html
			Game.trackPlayer(this);
		});		
	},
	// Registers a stop-movement function to be called when
	//  this entity hits an entity with the "Solid" component
	stopOnSolids: function() {
		this.onHit('Solid', this.hitSolid);
		this.onHit('Magic', this.hitMagic);
		return this;
	},

	// Stops the movement
	stopMovement: function() {
		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},
	
	hitSolid: function() {
		Game.hitSolid();
		this.stopMovement();
	},
	
	hitMagic: function() {
		// diff type of magic thing?
		Game.hitMagicLadder();
		this.stopMovement();		
	},
	
	hitMoveable: function(data) {
		rock = data[0].obj;
		Game.hitMoveableRock(rock);
		if (this._movement && rock.canMove === 1) {
			rock.x += this._movement.x;
			rock.y += this._movement.y;
		}
		else {
			this.stopMovement();
		}
	},	

	// Respond to this player visiting a village
	visitVillage: function(data) {
		Game.visitVille();
		data[0].obj.visit();
	}
});

// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
	init: function() {
		this.requires('Actor, spr_village');
	},

	// Process a visitation with this village
	visit: function() {
		this.destroy();
		//Crafty.audio.play('knock');
		Crafty.trigger('VillageVisited', this);
	}
});



/*

Crafty.c('bullet', {
    init: function() {
        this.requires('2D, DOM');
    },
    bullet: function(parameters) {
        // do the stuff you were doing in your init function
        return this;
    }
});
Then your shoot function looks like this:

shoot: function() {
    Crafty.e('bullet').attr({x: this._x+someMath, y: this._y+someMath})
        .bullet(this._rotation);
}



*/
