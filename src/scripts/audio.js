import * as Tone from "tone";

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth({
  envelope: new Tone.AmplitudeEnvelope({
    attack: 1,
    decay: 1,
    sustain: 1,
    release: 1,
  }),
}).toDestination();

export const sonify = (character) => {
  if (character === ".") {
    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease("C5", "16n");
  } else if (character === "-") {
    synth.triggerAttackRelease("C5", "8n");
  }
};
