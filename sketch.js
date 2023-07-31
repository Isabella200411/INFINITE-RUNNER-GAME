var panda, panda_running, panda_collided;
var obstacle, obstacleImg;
var ground, invisibleGround;
var backgroundImg;
var score=0;
var gameOver, restart;
var rand;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload(){
  backgroundImg = loadImage("backgroundimage.jpg");
  panda_running = loadAnimation("pandarun1.png", "pandarun2.png");
  panda_collided = loadImage("pandarun2.png");
  obstacleImg = loadImage("obstacle1.png");

  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";

  panda = createSprite(50,height-300,20,50);
  
  panda.addAnimation("running", panda_running);
  panda.addAnimation("collided", panda_collided);
  panda.setCollider('circle',0,0,300)
  panda.scale = 0.25;
  
  ground = createSprite(width/2,height,width,2);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 1.9;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup = new Group();

  score - 0;
}

function draw() {
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && panda.y  >= height-300) {
      panda.velocityY = -15;
       touches = [];
    }
    
    panda.velocityY = panda.velocityY + 1.4
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    panda.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(panda)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    panda.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    panda.changeAnimation("collided",panda_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,300,200);
    obstacle.scale = 0.4;
    obstacle.setCollider('circle',0,0,100)
    obstacle.addImage(obstacleImg);
    //obstacle.debug = true;
    //panda.debug = true;
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    /*var rand = Math.round(random(1));
    switch(rand) {
      case 1: obstacle.addImage(obstacleImg);
              break;
      default: break;
    }*/
           
    obstacle.lifetime = 300;
    obstacle.depth = panda.depth;
    panda.depth +=1;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  panda.changeAnimation("running",panda_running);
  
  score = 0;
  
}

