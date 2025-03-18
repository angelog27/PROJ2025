let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});

let bugs = [];
let gameState = GameStates.START;
let score = 0;
let highScore = 0;
let time = 30;
let textPadding = 15;
let bugSpriteSheet, gameFont;
let squishSound, missSound, skitterSynth, backgroundMusic, percussionSeq;
let bugCount = 5;
let frenzyLevel = 1;
let lastSkitterTime = 0;

class SpriteAnimation {
  constructor(spriteSheet, frameCount, frameWidth, frameHeight, row = 0) {
    this.spriteSheet = spriteSheet;
    this.frameCount = frameCount;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.row = row;
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
    let sy = this.row * this.frameHeight;
    image(this.spriteSheet, x, y, this.frameWidth, this.frameHeight, sx, sy, this.frameWidth, this.frameHeight);
  }
}

function preload() {
  bugSpriteSheet = loadImage("media/bugs.png");
  gameFont = loadFont("font/PressStart2P-Regular.ttf");
  squishSound = new Tone.Player("media/squish.mp3").toDestination();
  missSound = new Tone.Player("media/miss.mp3").toDestination();
}

function setup() {
  createCanvas(400, 400);
  textFont(gameFont);

  skitterSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    volume: -20,
    envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
  }).toDestination();

  for (let i = 0; i < bugCount; i++) {
    addNewBug();
  }

  document.addEventListener("click", async () => {
    await Tone.start();
    console.log("Audio context started");
  });
}

function draw() {
  background(220);

  switch (gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start", width / 2, height / 2);
      Tone.Transport.stop();
      break;

    case GameStates.PLAY:
      textAlign(LEFT, TOP);
      textSize(14);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);

      let currentTime = millis();
      for (let bug of bugs) {
        bug.move();
        bug.display();
      }
      
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
      text("Press ENTER to Restart", width / 2, height / 2 + 40);
      break;
  }
}

class Bug {
  constructor(spriteSheet, x, y, speed) {
    this.spriteSheet = spriteSheet;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isSquished = false;
    this.frameSize = 80;
    this.animations = {};
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  move() {
    if (!this.isSquished) {
      this.x += random(-this.speed, this.speed);
      this.y += random(-this.speed, this.speed);
    }
  }

  display() {
    let currentAnimation = this.isSquished ? this.animations["squished"] : this.animations["moving"];
    currentAnimation.update();
    currentAnimation.draw(this.x, this.y);
  }

  checkSquish(mx, my) {
    let halfSize = this.frameSize / 2;
    if (!this.isSquished && mx >= this.x - halfSize && mx <= this.x + halfSize &&
        my >= this.y - halfSize && my <= this.y + halfSize) {
      this.isSquished = true;
      score++;
      squishSound.start();
      setTimeout(() => this.respawn(), 500);
    } else if (!this.isSquished) {
      missSound.start();
    }
  }

  respawn() {
    this.x = random(width);
    this.y = random(height);
    this.isSquished = false;
  }
}

function addNewBug() {
  let bug = new Bug(bugSpriteSheet, random(width), random(height), 2);
  bug.addAnimation("moving", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 0));
  bug.addAnimation("squished", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 1));
  bugs.push(bug);
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === GameStates.START || gameState === GameStates.END) {
      gameState = GameStates.PLAY;
      score = 0;
      time = 30;
      bugs = [];
      for (let i = 0; i < bugCount; i++) {
        addNewBug();
      }
    }
  }
}

function mousePressed() {
  if (gameState === GameStates.PLAY) {
    for (let bug of bugs) {
      bug.checkSquish(mouseX, mouseY);
    }
  }
}
