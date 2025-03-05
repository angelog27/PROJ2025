let polySynth, distSlider;

let dist = new Tone.Distortion(0).toDestination();

let keyNotes = {
  'a': 'A4',
  's': 'B4',
  'd': 'C5',
  'f': 'D5',
  'g': 'E5',
  'h': 'F5',
  'j': 'G5',
  'k': 'A5',
};

function setup() {
  createCanvas(400, 400);
  
  polySynth = new Tone.PolySynth(Tone.Synth, {
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.5
    }
  }).connect(dist);

  distSlider = createSlider(0, 1, 0, 0.01);
  distSlider.position(10, 100);
  distSlider.input(() => { dist.distortion = distSlider.value(); });
}

function draw() {
  background(220);
  text("A = A4", 10, 10);
  text("S = B4", 10, 22);
  text("D = C5", 10, 34);
  text("F = D5", 10, 46);
  text("G = E5", 10, 58);
  text("H = F5", 10, 70);
  text("J = G5", 10, 82);
  text("K = A5", 10, 94);
  
  text("Distortion Amount: " + distSlider.value(), 150, 115);
}

function keyPressed() {
  if (key in keyNotes) {
    polySynth.triggerAttack(keyNotes[key]);
  }
}

function keyReleased() {
  if (key in keyNotes) {
    polySynth.triggerRelease(keyNotes[key]);
  }
}
