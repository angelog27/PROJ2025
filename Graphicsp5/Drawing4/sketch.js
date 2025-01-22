function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background('blue');


  fill('green');
  circle(300, 275, 400);
  stroke('white')
  strokeWeight(10);
 
  

  beginShape();
  
  vertex(300,75);
  vertex(240,220);
  vertex(112,220);
  vertex(210,310);
  vertex(160,420);
  vertex(300,370);
  vertex(440,420);
  vertex(390,310);
  vertex(488,220);
  vertex(360,220);  
  vertex(300,75);
  fill('red');
  endShape();

}