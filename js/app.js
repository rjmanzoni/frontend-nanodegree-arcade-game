//limite maximo que o enemy pode correr
const MAX_SCREEN = 600;
//limite minimo que o enemy começa correr
const MIN_SCREEN = -200;

//enemy ou player tem tamanos 101 x 171
const IMAGE_WIDTH = 101
const IMAGE_HEIGHT = 171
const DELTA = 20;

var Root = function(sprite, initX, initY){
    this.sprite = sprite;
    this.x = initX;
    this.y = initY;
}

Root.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    updateScore();
};

var Enemy = function(sprite, speed, initX, initY) {
    Root.call(this, sprite, initX, initY);
    this.speed = speed;
    this.maxWidthScreen = MAX_SCREEN;
    this.minWidthScreen = MIN_SCREEN;
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
    this.win = 0;
    this.loss = 0;
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

    for(var enemy in allEnemies){
        //estas quatro variaveis representam os limites da imagem do enemy
        var enemyXMinColision = allEnemies[enemy].x;
        var enemyXMaxColision = allEnemies[enemy].x + IMAGE_WIDTH;
        var enemyYMinColision = allEnemies[enemy].y;
        var enemyXMaxColision = allEnemies[enemy].y + IMAGE_HEIGHT;

        //verifica que os limites do player colide com os limites do enemy
        // DELTA representa um valor a ser subtraído para que a colisão seja mais visível
        if(((currentX > allEnemies.x && currentX < (allEnemies[enemy].x + IMAGE_WIDTH - DELTA))
            || ((currentX + IMAGE_WIDTH - DELTA) > allEnemies[enemy].x) && currentX < (allEnemies[enemy].x + IMAGE_WIDTH - DELTA))
            && (currentY === allEnemies[enemy].y )) {
            return true;
        }
    }
    return false;
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
        this.loss++;
    }
    if(this.checkWin()){
        this.win++;
        this.xPosition  = this.initXPosition;
        this.yPosition  = this.initYPosition;
    }
};

Player.prototype.handleInput = function(key) {
    var x = this.xPosition;
    var y = this.yPosition;
    if(key === 'left'){
        x--;
    }
    if(key === 'up'){
         y--;
    }
    if(key === 'right'){
        x++;
    }
    if(key === 'down'){
        y++;
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
    }else if(y < 0){
        y = 0;
    }

    this.xPosition = x;
    this.yPosition = y;
    this.update();
};

/* funcao que converta uma posicao logica para uma posicao na tela do canvas no eixo Y*/
var retrieveYReal = function(h){
    return (83*h - 20);
};
/* funcao que converta uma posicao logica para uma posicao na tela do canvas no eixo X*/
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

var updateScore = function(){
    ctx.font = "20px Arial";
    ctx.fillText("Win: "+player.win,10,30);
    ctx.fillText("Loss: "+player.loss,150,30);
}


var allEnemies = createEnemies(5);

var player = new Player('images/char-boy.png');

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
