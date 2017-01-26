// Enemies our player must avoid
var Enemy = function(speed, initX, initY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
    this.x = initX;
    this.y = initY;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed*dt;

    if(this.x > 600){
        this.x = -200;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.xPosition = 2;
    this.yPosition = 5;

    this.sprite = 'images/char-boy.png';

    this.x = retrieveXReal(this.xPosition);
    this.y = retrieveYReal(this.yPosition);
};

Player.prototype.update = function(){
    this.x = retrieveXReal(this.xPosition);
    this.y = retrieveYReal(this.yPosition);
    var currentX = this.x;
    var currentY = this.y;
    var shouldReset = false;

    allEnemies.forEach(function(enemy){
        var enemyXMinColision = enemy.x;
        var enemyXMaxColision = enemy.x + 101;
        var enemyYMinColision = enemy.y;
        var enemyXMaxColision = enemy.y + 171;

        if(((currentX > enemy.x && currentX < (enemy.x + 101 - 20))
            || ((currentX + 101 - 20) > enemy.x) && currentX < (enemy.x + 101 - 20))
            && (currentY === enemy.y )) {
            shouldReset = true;
        }
    });
    if(shouldReset){
        this.xPosition = 2;
        this.yPosition = 5;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    var x = this.xPosition;
    var y = this.yPosition;
    switch(key){
        case 'left':
            x--;
            break;
        case 'up':
            y--;
            break;
        case 'right':
            x++;
            break;
        case 'down':
            y++;
            break;
        default:
    }
    if(x > 4){
        x = 4;
    }else if (x < 0){
        x = 0;
    }
    if(y > 5){
        y = 5;
    }else if (y < 0){
        y = 0;
    }

    this.xPosition = x;
    this.yPosition = y;

};

var retrieveYReal = function(h){
    return (83*h - 20);
};
var retrieveXReal = function(w){
    return (100*w);
};

var createEnemies = function(size){
    var enemies = [];

    for (i = 0; i < size; i++) {
        var speed = Math.floor((Math.random() * 400) + 100);
        var xReal = Math.floor((Math.random() * 400) - 100);
        var y = Math.floor((Math.random() * 3) + 1);
        enemies.push(new Enemy(speed, xReal, retrieveYReal(y)));
    }
    return enemies;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = createEnemies(5);
// Place the player object in a variable called player

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
