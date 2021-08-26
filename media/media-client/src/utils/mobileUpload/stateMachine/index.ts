import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import DataLoader from 'dataloader';
import { map } from 'rxjs/operators/map';
import { createMachine, interpret, Interpreter, StateMachine } from 'xstate';

import {
  isProcessingFileState,
  UploadingFileState,
} from '../../../models/file-state';
import { DataloaderKey, DataloaderResult } from '../../createFileDataLoader';
import { shouldFetchRemoteFileStates } from '../../shouldFetchRemoteFileStates';
import { createMobileDownloadFileStream } from '../helpers';
import { machineUploadingState } from './states/uploading';
import { machineProcessingState } from './states/processing';
import { machineProcessedState } from './states/processed';
import { machineProcessingFailedState } from './states/processingFailed';
import { machineErrorState } from './states/error';
import {
  StateMachineContext,
  StateMachineEvent,
  StateMachineSchema,
  StateMachineTypestate,
} from './types';

export const createMobileUploadStateMachine = (
  dataloader: DataLoader<DataloaderKey, DataloaderResult>,
  initialState: UploadingFileState,
  collectionName?: string,
  featureFlags?: MediaFeatureFlags,
) =>
  createMachine<StateMachineContext, StateMachineEvent, StateMachineTypestate>(
    {
      // Initial state
      initial: initialState.status,

      // Context
      context: {
        currentFileState: initialState,
      },

      // State definitions
      states: {
        uploading: machineUploadingState,
        processing: machineProcessingState,
        processed: machineProcessedState,
        processingFailed: machineProcessingFailedState,
        error: machineErrorState,
      },
    },
    {
      services: {
        shouldFetchRemoteFileStates: async (ctx: StateMachineContext) => {
          const { currentFileState } = ctx;

          if (isProcessingFileState(currentFileState)) {
            const { mediaType, mimeType, preview } = currentFileState;
            return shouldFetchRemoteFileStates(mediaType, mimeType, preview);
          }

          return false;
        },
        fetchRemoteFileStates: (ctx: StateMachineContext) =>
          createMobileDownloadFileStream(
            dataloader,
            ctx.currentFileState.id,
            collectionName,
            ctx.currentFileState.occurrenceKey,
            featureFlags,
          ).pipe(
            map((fileState) => ({
              type: 'REMOTE_FILESTATE_RESULT',
              fileState,
            })),
          ),
      },
    },
  );

export function createMobileUploadService(
  machine: StateMachine<
    StateMachineContext,
    StateMachineSchema,
    StateMachineEvent,
    StateMachineTypestate
  >,
): Interpreter<
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent,
  StateMachineTypestate
> {
  return interpret(machine);
}
