let filt, LFOfilt, panner, fmSynth, noise1, noiseEnv, reverb, osc;
let beachImage;
let showImage = false;

function preload() {
  beachImage = loadImage('media/beach.jpg'); 
}

function setup() {
  createCanvas(400, 400);
  Tone.start();
  
  panner = new Tone.AutoPanner({
    frequency: 0.05, 
    depth: 0.8
  }).toDestination().start();
  
  filt = new Tone.Filter(400, "lowpass", -12).connect(panner);
  
  LFOfilt = new Tone.LFO(0.2, 50, 1200).start(); 
  LFOfilt.connect(filt.frequency);
  
  noise1 = new Tone.Noise("pink").connect(filt).start();
  noise1.volume.value = -15; 
  
  noiseEnv = new Tone.AmplitudeEnvelope({
    attack: 3,    
    decay: 1.5,
    sustain: 0.7, 
    release: 4   
  }).connect(filt);
  
  reverb = new Tone.Reverb({
    decay: 5,    
    wet: 0.6     
  }).toDestination();
  
  filt.connect(reverb);
  
  osc = new Tone.Oscillator({
    type: "sine",       
    frequency: 50,      
    volume: -25         
  }).connect(filt);
  
  fmSynth = new Tone.FMSynth({
    harmonicity: 3,      
    modulationIndex: 2,   
    envelope: {
      attack: 2,         
      decay: 1,
      sustain: 0.3,      
      release: 3         
    },
    volume: -20          
  }).toDestination();
}

function draw() {
  background(220);
  if (showImage) {
    image(beachImage, 0, 0, width, height);
  } else {
    textAlign(CENTER);
    textSize(20);
    text('CLICK TO HEAR BEACH WIND', width / 2, height / 2);
  }
}

function mouseClicked() {
  if (Tone.context.state !== 'running') {
    Tone.start();
  }
  
  showImage = true;
  noiseEnv.triggerAttackRelease(6);      
  fmSynth.triggerAttackRelease("C3", 4);  
  osc.start();                            
  setTimeout(() => osc.stop(), 5000); 
}    