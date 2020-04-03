import { Store, Dispatch, Middleware } from 'redux';
import {
  MediaStore,
  MediaStoreCopyFileWithTokenBody,
  MediaStoreCopyFileWithTokenParams,
  MediaFile as MediaClientFile,
  getFileStreamsCache,
  ErrorFileState,
  createFileStateSubject,
  observableToPromise,
} from '@atlaskit/media-client';
import {
  FinalizeUploadAction,
  isFinalizeUploadAction,
} from '../actions/finalizeUpload';
import { State, SourceFile } from '../domain';
import { mapAuthToSourceFileOwner } from '../domain/source-file';
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
  { file, replaceFileId, source }: FinalizeUploadAction,
) {
  const { userMediaClient } = store.getState();
  return userMediaClient.config
    .authProvider()
    .then(mapAuthToSourceFileOwner)
    .then(owner => {
      const sourceFile = {
        ...source,
        owner,
      };
      const copyFileParams: CopyFileParams = {
        store,
        file,
        replaceFileId,
        sourceFile,
      };

      return copyFile(copyFileParams);
    });
}

type CopyFileParams = {
  store: Store<State>;
  file: MediaFile;
  // the versioned file ID that this file will overwrite. Destination fileId.
  replaceFileId: string;
  sourceFile: SourceFile;
};

// Trigers a fetch to the recently copied file, and populates the existing state with the remote one
const emitProcessedState = (
  destinationFile: MediaClientFile,
  store: Store<State>,
) => {
  return new Promise(async resolve => {
    const { tenantMediaClient, config } = store.getState();
    const collection = config.uploadParams && config.uploadParams.collection;
    const tenantSubject = tenantMediaClient.file.getFileState(
      destinationFile.id,
    );
    const response = (
      await tenantMediaClient.mediaStore.getItems(
        [destinationFile.id],
        collection,
      )
    ).data;
    const firstItem = response.items[0];

    if (firstItem && firstItem.details.processingStatus === 'succeeded') {
      const currentState = await observableToPromise(tenantSubject);
      setTimeout(() => {
        const {
          artifacts,
          mediaType,
          mimeType,
          name,
          size,
          representations,
        } = firstItem.details;
        // we emit a new state which extends the existing one + the remote fields
        // fields like "artifacts" will be later on required on MV and we don't have it locally beforehand
        tenantSubject.next({
          ...currentState,
          status: 'processed',
          artifacts,
          mediaType,
          mimeType,
          name,
          size,
          representations,
        });
        resolve();
      }, 0);
    }
  });
};

async function copyFile({
  store,
  file,
  replaceFileId,
  sourceFile,
}: CopyFileParams) {
  const { tenantMediaClient, config } = store.getState();
  const collection = config.uploadParams && config.uploadParams.collection;
  const mediaStore = new MediaStore({
    authProvider: tenantMediaClient.config.authProvider,
  });
  const body: MediaStoreCopyFileWithTokenBody = {
    sourceFile, // Original file that being copied
  };
  const params: MediaStoreCopyFileWithTokenParams = {
    collection, // Destination collection
    replaceFileId, // Destination fileId
    // > The file will be added to the specified collection with this occurrence key. For Target collection.
    // The reason we reusing occurrenceKey from user's collection into tenant one is it remains the same value
    // if the operation needs to be retried. And for that purpose, using the same occurrence key from the source collection works fine.
    occurrenceKey: file.occurrenceKey,
  };

  try {
    const destinationFile = await mediaStore.copyFileWithToken(body, params);
    emitProcessedState(destinationFile.data, store);
    const tenantSubject = tenantMediaClient.file.getFileState(
      destinationFile.data.id,
    );
    const fileState = await observableToPromise(tenantSubject);
    if (fileState.status === 'processing' || fileState.status === 'processed') {
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
    } else if (
      fileState.status === 'failed-processing' ||
      fileState.status === 'error'
    ) {
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
    const errorState: ErrorFileState = {
      id: replaceFileId,
      status: 'error',
      message: `error copying file to ${collection}`,
    };
    const cache = getFileStreamsCache();
    const fileCache = cache.get(replaceFileId);

    // We need this check since the return type of getFileStreamsCache().get might not be a ReplaySubject and won't have "next"
    if (fileCache && fileCache.next) {
      // This will cause media card to rerender with an error state on existent subscriptions
      fileCache.next(errorState);
    }

    // Create a new subject with the error state for new subscriptions
    cache.set(replaceFileId, createFileStateSubject(errorState));

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
