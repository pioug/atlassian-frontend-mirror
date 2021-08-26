import { assign, send, StateNodeConfig } from 'xstate';

import {
  ProcessingStateMachineSchema,
  StateMachineContext,
  StateMachineEvent,
} from '../types';

export const machineProcessingState: StateNodeConfig<
  StateMachineContext,
  ProcessingStateMachineSchema,
  StateMachineEvent
> = {
  // Events
  on: {
    REMOTE_FILESTATE_PROCESSED: 'processed',
    REMOTE_FILESTATE_PROCESSING_FAILED: 'processingFailed',
    REMOTE_FILESTATE_ERROR: 'error',
  },

  // Initial sub state
  initial: 'loading',

  // Sub states definitions
  states: {
    loading: {
      invoke: {
        src: 'shouldFetchRemoteFileStates',
        onDone: {
          actions: send((_, event) => ({
            // shouldFetchRemoteFileStates resolves a boolean
            type: event.data
              ? 'REMOTE_FILESTATE_FETCH'
              : 'REMOTE_FILESTATE_BYPASS',
          })),
        },
        onError: 'idle',
      },
      on: {
        REMOTE_FILESTATE_FETCH: 'fetchingRemoteFileStates',
        REMOTE_FILESTATE_BYPASS: 'idle',
      },
    },
    fetchingRemoteFileStates: {
      invoke: {
        src: 'fetchRemoteFileStates',
        onDone: {
          actions: send((ctx) => ({
            type:
              ctx.currentFileState.status === 'processed'
                ? 'REMOTE_FILESTATE_PROCESSED'
                : 'REMOTE_FILESTATE_PROCESSING_FAILED',
          })),
        },
        onError: {
          actions: [
            assign({
              currentFileState: (ctx, event) => ({
                status: 'error',
                id: ctx.currentFileState.id,
                occurrenceKey: ctx.currentFileState.occurrenceKey,
                message: event.data.message,
              }),
            }),
            send({ type: 'REMOTE_FILESTATE_ERROR' }),
          ],
        },
      },
      on: {
        REMOTE_FILESTATE_RESULT: {
          actions: assign({
            currentFileState: (_, event) => event.fileState,
          }),
        },
      },
    },
    idle: {},
  },
};
