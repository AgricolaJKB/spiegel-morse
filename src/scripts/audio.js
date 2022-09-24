import * as Tone from "tone";

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth({
  envelope: {
    attack: 0,
    decay: 0.01,
    sustain: 1,
    release: 0.01,
  },
  oscillator: {
    type: "sine",
  },
}).toDestination();

export const sonify = (character) => {
  if (character === ".") {
    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease("F5", "32n");
  } else if (character === "-") {
    synth.triggerAttackRelease("F5", "10n");
  }
};
