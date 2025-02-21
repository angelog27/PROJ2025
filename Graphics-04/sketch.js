

let button1, button2, button3, button4, samples, samples2, distSlider;

let dist = new Tone.Distortion(0).toDestination();



function preload() {
  console.log(samples, samples2);
  samples = new Tone.Players({
    dog: "media/dog.mp3",
    dino : "media/dino.mp3"
  }).connect(dist);
  samples2 = new Tone.Players({
    walk: "media/walk.mp3",
    run : "media/run.mp3"
  }).connect(dist);
}
function setup() {
  createCanvas(400, 400);
  button1 = createButton("Play Dog Sample");
  button1.position(10, 10);
  button2 = createButton("Play Dino Sample");
  button2.position(200, 10);
  button3 = createButton("Play Walk Sample");
  button3.position(10, 70);
  button4 = createButton("Play Run Sample");
  button4.position(200, 70);

  button1.mousePressed(() => { 
    startAudioContext();
    samples.player("dog").start(); 
  });
  button2.mousePressed(() => { 
    startAudioContext();
    samples.player("dino").start(); 
  });
  button3.mousePressed(() => { 
    startAudioContext();
    samples2.player("walk").start(); 
  });
  button4.mousePressed(() => { 
    startAudioContext();
    samples2.player("run").start(); 
  });
  
  distSlider = createSlider (0, 10,0,0.01 )
  distSlider.position(10, 220);
  distSlider.input(() => {dist.distortion = distSlider.value()});
}


function startAudioContext(){
  if (Tone.context.state !== 'running') {
    Tone.start();
    console.log("Audio Context Started");
      }
      else {
        console.log("Audio Context Already Started");
      }
}

function draw() {
  background(220);
  text("Distortion Amount: " + distSlider.value(), 150, 230);
}