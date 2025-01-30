let colors = [
  'red', 
  'orange', 
  'yellow', 
  'green', 
  'cyan', 
  'blue', 
  'magenta', 
  'brown', 
  'white',
  'black'
];
let selectedColor = 'black';
let paletteWidth = 35;
let boxHeight = 35;  


function setup() {
  createCanvas(600, 400);
  background(255);
  drawPalette();
}

function drawPalette() {
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    stroke('white');
    strokeWeight(3);
    rect(0, i * 35, paletteWidth, boxHeight);
  }
}

function mousePressed() {
  if (mouseX < paletteWidth) {
    let index = floor(mouseY / boxHeight);
    if (index >= 0 && index < colors.length) {
      selectedColor = colors[index];
    }
  }
}

function mouseDragged() {
  if (mouseX > paletteWidth   && mouseY > 0 && mouseY < height) {
    stroke(selectedColor);
    strokeWeight(10);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}