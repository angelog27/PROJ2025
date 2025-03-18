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

  // Skitter Synth with dynamic pitch
  skitterSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    volume: -20,
    envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
  }).toDestination();

  // Background Music
  backgroundMusic = new Tone.Sequence(
    (time, note) => {
      let synth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.5 }
      }).toDestination();
      synth.triggerAttackRelease(note, "8n", time);
    },
    ["C4", "E4", "G4", "E4", "D4", "F4", "A4", "F4"],
    "4n"
  );

  percussionSeq = new Tone.Sequence(
    (time, note) => {
      let drum = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: { type: "sine" }
      }).toDestination();
      drum.triggerAttackRelease(note, "16n", time);
    },
    ["C2", null, "C2", null], 
    "4n"
  );

  for (let i = 0; i < bugCount; i++) {
    let bug = new Bug(bugSpriteSheet, random(width), random(height), 2);
    bug.addAnimation("moving", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 0));
    bug.addAnimation("squished", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 1));
    bugs.push(bug);
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
      playStartJingle(); // Play once on first frame
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
        if (!bug.isSquished && currentTime - lastSkitterTime > 200 && random() < 0.02 * frenzyLevel) {
          skitterSynth.volume.value = -20 + frenzyLevel * 5; // Louder with frenzy
          skitterSynth.triggerAttackRelease(0.05 + frenzyLevel * 0.02); // Longer with frenzy
          lastSkitterTime = currentTime;
        }
      }

                Tone.Transport.bpm.value = 120 + (30 - time) * 2;
      if (time < 20 && !percussionSeq.started) {
        percussionSeq.start(0);
      }
      if (time < 20 && bugs.length < 8) {
        addNewBug();
        playBugSpawnSound();
        frenzyLevel = 1.5;
      }
      if (time < 10) frenzyLevel = 2;

      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
        playGameOverSound();
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

class Bug {
  constructor(spriteSheet, x, y, speed) {
    this.spriteSheet = spriteSheet;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.direction = p5.Vector.random2D();
    this.angle = atan2(this.direction.y, this.direction.x);
    this.isSquished = false;
    this.frameSize = 80;
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
      squishSound.start();
      setTimeout(() => this.respawn(), 500);
    } else if (!this.isSquished) {
      missSound.start();
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

function addNewBug() {
  let bug = new Bug(bugSpriteSheet, random(width), random(height), 2);
  bug.addAnimation("moving", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 0));
  bug.addAnimation("squished", new SpriteAnimation(bugSpriteSheet, 3, 80, 80, 1));
  bugs.push(bug);
}

function playStartJingle() {
  if (!Tone.Transport.state === "started") {
    let synth = new Tone.Synth({ oscillator: { type: "square" } }).toDestination();
    synth.triggerAttackRelease("G4", "8n");
    synth.triggerAttackRelease("C5", "8n", "+0.25");
  }
}

function playBugSpawnSound() {
  let spawnSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    volume: -15
  }).toDestination();
  spawnSynth.triggerAttackRelease("E5", "16n");
}

function playGameOverSound() {
  Tone.Transport.stop();
  backgroundMusic.stop();
  percussionSeq.stop();
  let gameOverSynth = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    volume: -10
  }).toDestination();
  gameOverSynth.triggerAttackRelease("C3", "2n");
  gameOverSynth.triggerAttackRelease("G2", "2n", "+0.5");
  gameOverSynth.triggerAttackRelease("E2", "2n", "+1.0"); // Extra note for drama
}

function keyPressed() {
  switch (gameState) {
    case GameStates.START:
      if (keyCode === ENTER) {
        gameState = GameStates.PLAY;
        score = 0;
        time = 30;
        Tone.Transport.start();
        backgroundMusic.start(0);
      }
      break;
    case GameStates.END:
      if (keyCode === ENTER) {
        gameState = GameStates.PLAY;
        score = 0;
        time = 30;
        bugs = [];
        bugCount = 5;
        frenzyLevel = 1;
        for (let i = 0; i < bugCount; i++) {
          addNewBug();
        }
        Tone.Transport.start();
        backgroundMusic.start(0);
      }
      break;
  }
}

function mousePressed() {
  if (gameState === GameStates.PLAY) {
    for (let bug of bugs) {
      bug.checkSquish(mouseX, mouseY);
    }
  }
}