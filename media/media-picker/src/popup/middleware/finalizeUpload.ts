import { Store, Dispatch, Middleware } from 'redux';
import {
  CopySourceFile,
  CopyDestination,
  CopyFileOptions,
  FilePreview,
  globalMediaEventEmitter,
} from '@atlaskit/media-client';
import {
  FinalizeUploadAction,
  isFinalizeUploadAction,
  FinalizeUploadSource,
} from '../actions/finalizeUpload';
import { State } from '../domain';
import { MediaFile } from '../../types';
import { sendUploadEvent } from '../actions/sendUploadEvent';
import { resetView } from '../actions';

export default function(): Middleware {
  return store => (next: Dispatch<State>) => (action: any) => {
    if (isFinalizeUploadAction(action)) {
      finalizeUpload(store as any, action);
    }
    return next(action);
  };
}

export function finalizeUpload(
  store: Store<State>,
  { file, replaceFileId, source, preview }: FinalizeUploadAction,
) {
  return copyFile({
    store,
    file,
    replaceFileId,
    source,
    preview,
  });
}

type CopyFileParams = {
  store: Store<State>;
  file: MediaFile;
  // the versioned file ID that this file will overwrite. Destination fileId.
  replaceFileId: string;
  source: FinalizeUploadSource;
  preview?: FilePreview | Promise<FilePreview>;
};

async function copyFile({
  store,
  file,
  replaceFileId,
  source,
  preview,
}: CopyFileParams) {
  const {
    tenantMediaClient,
    userMediaClient: {
      config: { authProvider: userAuthProvider },
    },
    config,
  } = store.getState();
  const { id, collection: sourceCollection } = source;
  const destinationCollection =
    config.uploadParams && config.uploadParams.collection;

  try {
    // Original file that being copied
    const copySourceFile: CopySourceFile = {
      id,
      collection: sourceCollection,
      authProvider: userAuthProvider,
    };

    const copyDestination: CopyDestination = {
      collection: destinationCollection,
      replaceFileId, // Destination fileId
      // > The file will be added to the specified collection with this occurrence key. For Target collection.
      // The reason we reusing occurrenceKey from user's collection into tenant one is it remains the same value
      // if the operation needs to be retried. And for that purpose, using the same occurrence key from the source collection works fine.
      occurrenceKey: file.occurrenceKey,
      authProvider: tenantMediaClient.config.authProvider,
    };

    const copyOptions: CopyFileOptions = { preview };

    const destinationFile = await tenantMediaClient.file.copyFile(
      copySourceFile,
      copyDestination,
      copyOptions,
    );

    const destinationFileState = await tenantMediaClient.file.getCurrentState(
      destinationFile.id,
    );

    tenantMediaClient.emit('file-added', destinationFileState);
    globalMediaEventEmitter.emit('file-added', destinationFileState);

    if (
      ['processing', 'processed', 'failed-processing'].includes(
        destinationFileState.status,
      )
    ) {
      store.dispatch(
        sendUploadEvent({
          event: {
            name: 'upload-end',
            data: {
              file,
            },
          },
          fileId: replaceFileId,
        }),
      );
    } else if (destinationFileState.status === 'error') {
      store.dispatch(
        sendUploadEvent({
          event: {
            name: 'upload-error',
            data: {
              fileId: replaceFileId,
              error: {
                name: 'object_create_fail',
                description: 'There was an error while uploading a file',
              },
            },
          },
          fileId: replaceFileId,
        }),
      );
    }
  } catch (error) {
    store.dispatch(
      sendUploadEvent({
        event: {
          name: 'upload-error',
          data: {
            fileId: replaceFileId,
            error: {
              name: 'object_create_fail',
              description: error.message,
            },
          },
        },
        fileId: replaceFileId,
      }),
    );
  } finally {
    store.dispatch(resetView());
  }
}
