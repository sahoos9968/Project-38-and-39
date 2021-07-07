/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisibleJungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;



function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  trex = createSprite(50,200,20,50);
  trex.addAnimation("running", kangaroo_running);
  trex.addAnimation("animation", kangaroo_collided);
  trex.scale = 0.15;
  trex.setCollider("circle", 0,0,300);


  invisibleJungle = createSprite(400,350,800,10);
  invisibleJungle.visible = false;
  gameOver = createSprite(400,200);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restart = createSprite(400,240);
  restart.addImage(restartImg);
  restart.scale = 0.09;
}

function draw() {
  background(255);
  
  trex.x = camera.position.x - 270;

  if (gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;

    jungle.velocityX = -3;
    if(jungle.x < 0){
      jungle.x = 400;
    }
    if (keyDown("space")){
      trex.velocityY = -10;
    }

    trex.velocityY += 1;
    trex.collide(invisibleJungle);

    spawnShrubs();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)){
      gameState = END;
    }

    if (shrubsGroup.isTouching(trex)){
      shrubsGroup.destroyEach();
    }
  }
if (gameState === END){
  gameOver.visible = true;
  restart.visible = true;

  trex.velocityY = 0;
  jungle.velocityX = 0;
  obstaclesGroup.setVelocityXEach(0);
  shrubsGroup.setVelocityXEach(0);
  obstaclesGroup.setLifetimeEach(-1);
  shrubsGroup.setLifetimeEach(-1);
  trex.changeAnimation("animation", kangaroo_collided);
  if (mousePressedOver(restart)){
    reset()
  }
}

  drawSprites();

}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  trex.changeAnimation("running", kangaroo_running);

}

function spawnShrubs(){
  if (frameCount % 150 === 0){
    var shrub = createSprite(camera.position.x+500,330,40,10); 
    shrub.velocityX = -(6 + 3*score/100);
    shrub.scale = 0.6; 
    var rand = Math.round(random(1,3)); 
    switch(rand) { 
      case 1: shrub.addImage(shrub1); 
      break; 
      case 2: shrub.addImage(shrub2); 
      break; 
      case 3: shrub.addImage(shrub3); 
      break; 
      default: break;
     } //assign scale and lifetime to the shrub
      shrub.scale = 0.05; 
      //assign lifetime to the variable 
      shrub.lifetime = 400; 
      shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2) 
      //add each cloud to the group 
      shrubsGroup.add(shrub);
  }
}

function spawnObstacles() { 
  if(frameCount % 120 === 0) { 
    var obstacle = createSprite(camera.position.x+400,330,40,40);
     obstacle.setCollider("rectangle",0,0,200,200); 
     obstacle.addImage(obstacle1); 
     obstacle.velocityX = -(6 + 3*score/100); 
     obstacle.scale = 0.15;
      //assign scale and lifetime to the obstacle 
      obstacle.lifetime = 400; 
      //add each obstacle to the group 
      obstaclesGroup.add(obstacle); 
    } 
  }