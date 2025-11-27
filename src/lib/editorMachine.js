import { createMachine, assign } from 'xstate';

export const editorMachine = createMachine({
  id: 'editor',
  initial: 'idle',
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
            content: (context, event) => event?.content || ''
          })
        }
      }
    },
    active: {
      on: {
        TYPE: {
          actions: assign({
            content: (context, event) => event?.content || ''
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
            errorType: (context, event) => event?.errorType || 'general'
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
