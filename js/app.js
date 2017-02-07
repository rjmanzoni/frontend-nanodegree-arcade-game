var Root = function(sprite, initX, initY){
    this.sprite = sprite;
    this.x = initX;
    this.y = initY;
}

Root.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Enemy = function(sprite, speed, initX, initY) {
    Root.call(this, sprite, initX, initY);
    this.speed = speed;
    this.maxWidthScreen = 600;
    this.minWidthScreen = -200;
};
Enemy.prototype = Object.create(Root.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed*dt;

    if(this.x > this.maxWidthScreen){
        this.x = this.minWidthScreen;
    }
};

var Player = function(sprite){
    // inital player position
    this.initXPosition = 2;
    this.initYPosition = 5;

    this.xPosition = this.initXPosition;
    this.yPosition = this.initYPosition;

    Root.call(this, sprite, retrieveXReal(this.xPosition), retrieveYReal(this.yPosition));
};

Player.prototype = Object.create(Root.prototype);
Player.prototype.constructor = Player;

Player.prototype.checkCollisions = function(allEnemies){
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
    return shouldReset;
}


Player.prototype.checkWin = function(){
    if (this.yPosition == 0){
        return true;
    }
    return false;
}

Player.prototype.update = function(){
    if(this.checkCollisions(allEnemies)){
        this.xPosition = this.initXPosition;
        this.yPosition = this.initYPosition;
    }
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
        case 'space':
            init();
            break;

        default:
    }
    //max Player X position
    if(x > 4){
        x = 4;
    //min Player X position
    }else if (x < 0){
        x = 0;
    }
    //min Player Y position
    if(y > 5){
        y = 5;
    //max Player Y position
    }

    this.xPosition = x;
    this.yPosition = y;
    this.update();
    if(this.checkWin()){
    }
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
        enemies.push(new Enemy('images/enemy-bug.png', speed, xReal, retrieveYReal(y)));
    }
    return enemies;
}

var allEnemies = createEnemies(5);

var player = new Player('images/char-boy.png');

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
