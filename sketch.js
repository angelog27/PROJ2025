function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  //middle top
  
  fill(255, 0, 0, 90);
  circle(270, 200, 250);
  noStroke();
  


  //bottom right
  fill(0, 255, 0, 90);
  circle(350, 315, 250);


  //bottom left
  fill(0, 0, 255, 90);
  circle(200, 315, 250);
}
