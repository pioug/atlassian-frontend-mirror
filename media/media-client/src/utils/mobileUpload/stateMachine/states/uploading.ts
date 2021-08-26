import { assign, StateNodeConfig } from 'xstate';

import { isUploadingFileState } from '../../../../models/file-state';
import {
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent,
} from '../types';

export const machineUploadingState: StateNodeConfig<
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent
> = {
  // Events
  on: {
    UPLOAD_PROGRESS: [
      {
        target: 'uploading',
        cond: (ctx, event) =>
          isUploadingFileState(ctx.currentFileState) &&
          event.progress > ctx.currentFileState.progress,
        actions: assign({
          currentFileState: (ctx, event) => ({
            ...ctx.currentFileState,
            progress: event.progress,
          }),
        }),
      },
      { target: 'error' },
    ],
    UPLOAD_END: {
      target: 'processing',
      actions: assign({
        currentFileState: (ctx) =>
          (isUploadingFileState(ctx.currentFileState) && {
            status: 'processing',
            id: ctx.currentFileState.id,
            occurrenceKey: ctx.currentFileState.occurrenceKey,
            name: ctx.currentFileState.name,
            size: ctx.currentFileState.size,
            mediaType: ctx.currentFileState.mediaType,
            mimeType: ctx.currentFileState.mimeType,
            preview: ctx.currentFileState.preview,
            createdAt: ctx.currentFileState.createdAt,
          }) ||
          ctx.currentFileState,
      }),
    },
    UPLOAD_ERROR: {
      target: 'error',
      actions: assign({
        currentFileState: (ctx, event) => ({
          status: 'error',
          id: ctx.currentFileState.id,
          message: event.message,
        }),
      }),
    },
  },
};
