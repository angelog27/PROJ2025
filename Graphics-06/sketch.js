


let GameStates = Object.freeze({ 
  START: "start",
  PLAY: "play",
  END: "end"
});
class SpriteAnimation {
  constructor(spriteSheet, frameCount, frameWidth, frameHeight, row = 0) {
    this.spriteSheet = spriteSheet;
    this.frameCount = frameCount;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.row = row; // Add row property
    this.currentFrame = 0;
    this.frameDelay = 5;
    this.frameCounter = 0;
  }

  update() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.frameCounter = 0;
    }
  }

  draw(x, y) {
    let sx = this.currentFrame * this.frameWidth;
    let sy = this.row * this.frameHeight; // Move to correct row
    image(this.spriteSheet, x, y, this.frameWidth, this.frameHeight, sx, sy, this.frameWidth, this.frameHeight);
  }
}

let bugs = [];
let gameState = GameStates.START;
let score = 0;
let highScore = 0;
let time = 30;
let textPadding = 15;
let gameFont = null;
let bugSpriteSheet;

function preload() {
  bugSpriteSheet = loadImage("media/bugs.png"); // Load bug sprite sheet
  gameFont = loadFont("font/PressStart2P-Regular.ttf"); // Load  font
}

function setup() {
  createCanvas(400,400);
  textFont(gameFont);

  // Create initial bugs
  for (let i = 0; i < 5; i++) {
    let bug = new Bug(bugSpriteSheet, random(width), random(height), 2);

    // Moving animation on row 0
    bug.addAnimation("moving", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 0));

    // Squished animation on row 1
    bug.addAnimation("squished", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 1));

    bugs.push(bug);
  }
}

function draw() {
  background(220);

  switch (gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start", width / 2, height / 2);
      break;

    case GameStates.PLAY:
      textAlign(LEFT, TOP);
      textSize(14);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);

      // Update and display bugs
      for (let bug of bugs) {
        bug.move();
        bug.display();
      }

      // Update timer
      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
      }
      break;

    case GameStates.END:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Game Over!", width / 2, height / 2 - 20);
      text("Score: " + score, width / 2, height / 2);
      if (score > highScore) highScore = score;
      text("High Score: " + highScore, width / 2, height / 2 + 20);
      text("Press ENTER to Restart", width / 2, height / 2 + 40);
      break;
  }
}

// Bug class
class Bug {
  constructor(spriteSheet, x, y, speed) {
    this.spriteSheet = spriteSheet;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.direction = p5.Vector.random2D();
    this.angle = atan2(this.direction.y, this.direction.x); // Store initial angle
    this.isSquished = false;
    this.frameSize = 80; // Adjust based on sprite sheet frame size
    this.animations = {};
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  move() {
    if (!this.isSquished) {
      this.x += this.direction.x * this.speed;
      this.y += this.direction.y * this.speed;

      this.angle = atan2(this.direction.y, this.direction.x);

      if (this.x < 0 || this.x > width) this.direction.x *= -1;
      if (this.y < 0 || this.y > height) this.direction.y *= -1;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle + HALF_PI); 

    let currentAnimation = this.isSquished ? this.animations["squished"] : this.animations["moving"];
    currentAnimation.update();
    currentAnimation.draw(-this.frameSize / 2, -this.frameSize / 2);

    pop();
  }

  checkSquish(mx, my) {
    if (!this.isSquished && dist(mx, my, this.x, this.y) < this.frameSize / 2) {
      this.isSquished = true;
      score++;
  
      this.speed += 0.2; 
  
      setTimeout(() => this.respawn(), 500);
    }
  }
  

  respawn() {
    this.x = random(width);
    this.y = random(height);
    this.direction = p5.Vector.random2D();
    this.angle = atan2(this.direction.y, this.direction.x); 
    this.isSquished = false;
  }
}


function mousePressed() {
  for (let bug of bugs) {
    bug.checkSquish(mouseX, mouseY);
  }
}

function keyPressed() {
  switch (gameState) {
    case GameStates.START:
      if (keyCode === ENTER) {
        gameState = GameStates.PLAY;
        score = 0;
        time = 30;
      }
      break;
    case GameStates.END:
      if (keyCode === ENTER) {
        gameState = GameStates.PLAY;
        score = 0;
        time = 30;
        bugs = []; // Clear existing bugs

        for (let i = 0; i < 5; i++) {
          let bug = new Bug(bugSpriteSheet, random(width), random(height), 2);

          // Moving animation on row 0
          bug.addAnimation("moving", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 0));

          // Squished animation on row 1
          bug.addAnimation("squished", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 1));

          bugs.push(bug);
        }
      }
      break;
  }
}
