import { createMachine, assign } from 'xstate';

interface EditorContext {
  content: string;
  errorType: string | null;
}

type EditorEvent =
  | { type: 'TYPE'; content: string }
  | { type: 'CLEAR' }
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; errorType?: string }
  | { type: 'DISMISS' };

export const editorMachine = createMachine({
  id: 'editor',
  initial: 'idle',
  types: {} as {
    context: EditorContext;
    events: EditorEvent;
  },
  context: {
    content: '',
    errorType: null,
  },
  states: {
    idle: {
      on: {
        TYPE: {
          target: 'active',
          actions: assign({
            content: ({ event }) => event.content || ''
          })
        }
      }
    },
    active: {
      on: {
        TYPE: {
          actions: assign({
            content: ({ event }) => event.content || ''
          })
        },
        CLEAR: {
          target: 'idle',
          actions: assign({
            content: '',
            errorType: null
          })
        },
        SUBMIT: 'loading'
      }
    },
    loading: {
      on: {
        SUCCESS: {
          target: 'active',
          actions: assign({
            errorType: null
          })
        },
        ERROR: {
          target: 'error',
          actions: assign({
            errorType: ({ event }) => event.errorType || 'general'
          })
        }
      }
    },
    error: {
      on: {
        DISMISS: 'active',
        CLEAR: {
          target: 'idle',
          actions: assign({
            content: '',
            errorType: null
          })
        }
      }
    }
  }
});
