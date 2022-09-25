import * as Tone from "tone";

export const DOT = 0.045;

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

export const sonify = (character, timeout) => {
  const now = Tone.now();
  if (character === ".") {
    synth.triggerAttackRelease("F5", DOT, now + timeout);
  } else if (character === "-") {
    synth.triggerAttackRelease("F5", 3 * DOT, now + timeout);
  }
};

export const addTimeouts = (morseCharacters) => {
  return morseCharacters.map((c, i) => {
    const timeout = morseCharacters.slice(0, i).reduce((acc, cur) => {
      if (cur === ".") {
        return acc + 2 * DOT;
      } else if (cur === "-") {
        return acc + 4 * DOT;
      } else {
        return acc + 7 * DOT;
      }
    }, 0);
    return { character: c, time: timeout };
  });
};

export const createPart = (timeouts, setCursor) => {
  const now = Tone.now();
  const part = new Tone.Part(
    (time, value) => {
      // the value is an object which contains both the note and the velocity
      // synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
      if (value.character === ".") {
        synth.triggerAttackRelease("F5", DOT, now + time);
      } else if (value.character === "-") {
        synth.triggerAttackRelease("F5", 3 * DOT, now + time);
      }
      setCursor(value.index);
    },
    timeouts.map((t, i) => ({ ...t, index: i }))
  ).start(0);
  return part;
};

export default synth;
