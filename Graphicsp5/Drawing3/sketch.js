function setup() {
  createCanvas(windowWidth, 400);
  angleMode(DEGREES);
}

function draw() {
  background(0);

  fill(255, 260, 0);
  translate(width/2, height/2);
  rotate(160);
  arc(170, 10, 210, 210, 70, 330, PIE);

  drawGhost();
  
}
function drawGhost(){
  resetMatrix();
  noStroke();
  fill('red')
  
  rect(width / 2 + 10, height / 2 + 50, 190, 110);
  
  ellipse(width / 2 + 105, height / 2 + 50, 190, 190);

  fill("white"); 
  ellipse(width / 2 + 60, height / 2 + 40, 60, 60); 
  ellipse(width / 2 + 150, height / 2 + 40, 60, 60); 
  
  fill("blue"); 
  ellipse(width / 2 + 60, height / 2 + 40, 40, 40);
  ellipse(width / 2 + 150, height / 2 + 40, 40, 40);
}




