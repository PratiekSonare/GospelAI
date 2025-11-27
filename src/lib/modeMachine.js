import { createMachine } from 'xstate';

export const modeMachine = createMachine({
  id: 'mode',
  initial: 'none',
  states: {
    none: {
      on: {
        SELECT_STORY: 'story',
        SELECT_DIALOGUE: 'dialogue',
        SELECT_RANDOM: 'random',
      }
    },
    story: {
      on: {
        SELECT_DIALOGUE: 'dialogue',
        SELECT_RANDOM: 'random',
      }
    },
    dialogue: {
      on: {
        SELECT_STORY: 'story',
        SELECT_RANDOM: 'random',
      }
    },
    random: {
      on: {
        SELECT_STORY: 'story',
        SELECT_DIALOGUE: 'dialogue',
      }
    }
  }
});
