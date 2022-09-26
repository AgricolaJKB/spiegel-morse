import * as Tone from "tone";

export const DOT = 0.04;

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

export const addTimeouts = (morseCharacters) => {
  return morseCharacters.map((c, i) => {
    const timeout = morseCharacters.slice(0, i).reduce((acc, cur) => {
      if (cur === ".") {
        return acc + 2 * DOT;
      } else if (cur === "-") {
        return acc + 4 * DOT;
      } else if (cur === "/") {
        return acc + 7 * DOT;
      } else {
        return acc + 3 * DOT;
      }
    }, 0);
    return { character: c, time: timeout, index: i };
  });
};

export const sonify = (character, timeout, now = Tone.now()) => {
  if (character === ".") {
    synth.triggerAttackRelease("F5", DOT, now + timeout);
  } else if (character === "-") {
    synth.triggerAttackRelease("F5", 3 * DOT, now + timeout);
  }
};

export const createPart = (timeouts, setCursor) => {
  const now = Tone.now();
  const part = new Tone.Part((time, value) => {
    sonify(value.character, time, now);
    setCursor(value.index);
  }, timeouts).start(0);
  return part;
};

export default synth;
