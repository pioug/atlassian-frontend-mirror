import { StateSchema } from 'xstate';

import {
  FileState,
  UploadingFileState,
  ProcessingFileState,
  ProcessedFileState,
  ErrorFileState,
  ProcessingFailedState,
} from '../../../models/file-state';

export type StateMachineContext = { currentFileState: FileState };

export type StateMachineEvent =
  | { type: 'UPLOAD_PROGRESS'; progress: number }
  | { type: 'UPLOAD_END' }
  | { type: 'UPLOAD_ERROR'; message: string }
  | { type: 'REMOTE_FILESTATE_FETCH' }
  | { type: 'REMOTE_FILESTATE_BYPASS' }
  | { type: 'REMOTE_FILESTATE_RESULT'; fileState: FileState }
  | { type: 'REMOTE_FILESTATE_PROCESSED' }
  | { type: 'REMOTE_FILESTATE_PROCESSING_FAILED' }
  | { type: 'REMOTE_FILESTATE_ERROR' };

export type ProcessingStateMachineSchema = StateSchema<StateMachineContext> & {
  states: {
    // calls shouldFetchRemoteFileStates()
    loading: StateSchema<StateMachineContext>;
    // calls fetchRemoteFileStates()
    fetchingRemoteFileStates: StateSchema<StateMachineContext>;
    // do nothing
    idle: StateSchema<StateMachineContext>;
  };
};

export type StateMachineSchema = StateSchema<StateMachineContext> & {
  states: {
    uploading: StateSchema<StateMachineContext>;
    processing: ProcessingStateMachineSchema;
    processed: StateSchema<StateMachineContext>;
    processingFailed: StateSchema<StateMachineContext>;
    error: StateSchema<StateMachineContext>;
  };
};

export type StateMachineTypestate =
  | {
      value: 'uploading';
      context: { currentFileState: UploadingFileState };
    }
  | {
      value: 'processing';
      context: { currentFileState: ProcessingFileState };
    }
  | {
      value: 'processed';
      context: { currentFileState: ProcessedFileState };
    }
  | {
      value: 'processingFailed';
      context: { currentFileState: ProcessingFailedState };
    }
  | {
      value: 'error';
      context: { currentFileState: ErrorFileState };
    };
