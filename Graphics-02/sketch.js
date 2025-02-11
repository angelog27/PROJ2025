let characters = [];
let characterSprites = {};

function preload() {
  characterSprites.cyclops = loadImage("media/cyclops.png");
  characterSprites.blue = loadImage("media/blue.png");
  characterSprites.gold = loadImage("media/gold.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  
  characters.push(new Character(random(80, width-80), random(80, height-80), characterSprites.cyclops));
  characters.push(new Character(random(80, width-80), random(80, height-80), characterSprites.blue));
  characters.push(new Character(random(80, width-80), random(80, height-80), characterSprites.gold));
}

function draw() {
  background(220);
  
  characters.forEach(character => character.draw());
}

function keyPressed() {
  characters.forEach(character => character.keyPressed());
}

function keyReleased() {
  characters.forEach(character => character.keyReleased());
}

class Character {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.currentAnimation = "stand";
    this.animations = {};
    this.speed = 2;
    this.addAnimations();
  }

  addAnimations() {
    this.animations = {
      up: new SpriteAnimation(this.sprite, 0, 5, 6),
      down: new SpriteAnimation(this.sprite, 6, 5, 6),
      left: new SpriteAnimation(this.sprite, 0, 3, 6),
      right: new SpriteAnimation(this.sprite, 6, 3, 6),
      stand: new SpriteAnimation(this.sprite, 0, 0, 1)
    };
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch (this.currentAnimation) {
        case "up": this.y -= this.speed; break;
        case "down": this.y += this.speed; break;
        case "left": this.x -= this.speed; break;
        case "right": this.x += this.speed; break;
      }
      push();
      translate(this.x, this.y);
      if (this.currentAnimation === "left") {
        scale(-1, 1);
      }
      animation.draw();
      pop();
    }
  }

  keyPressed() {
    switch (keyCode) {
      case UP_ARROW: this.currentAnimation = "up"; break;
      case DOWN_ARROW: this.currentAnimation = "down"; break;
      case LEFT_ARROW: this.currentAnimation = "left"; break;
      case RIGHT_ARROW: this.currentAnimation = "right"; break;
    }
  }

  keyReleased() {
    this.currentAnimation = "stand";
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
  }

  draw() {
    image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);
    this.frameCount++;
    if (this.frameCount % 10 === 0) this.u++;
    if (this.u === this.startU + this.duration) this.u = this.startU;
  }
}
