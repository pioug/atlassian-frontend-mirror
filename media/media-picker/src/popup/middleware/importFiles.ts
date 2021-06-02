import uuid from 'uuid/v4';
import { Store, Dispatch, Middleware } from 'redux';
import {
  TouchFileDescriptor,
  FileState,
  getFileStreamsCache,
  createFileStateSubject,
  getMediaTypeFromMimeType,
  isImageRepresentationReady,
  FilePreview,
  isPreviewableType,
  isPreviewableFileState,
  MediaType,
  observableToPromise,
  isErrorFileState,
  isProcessedFileState,
  ErrorFileState,
  NonErrorFileState,
  isUploadingFileState,
} from '@atlaskit/media-client';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import { Subscriber } from 'rxjs/Subscriber';

import { State, SelectedItem, LocalUpload, ServiceName } from '../domain';
import { isStartImportAction } from '../actions/startImport';
import { finalizeUpload } from '../actions/finalizeUpload';
import { remoteUploadStart } from '../actions/remoteUploadStart';
import { getPreview } from '../actions/getPreview';
import { handleCloudFetchingEvent } from '../actions/handleCloudFetchingEvent';
import { hidePopup } from '../actions/hidePopup';
import { resetView } from '../actions/resetView';
import { WsProvider } from '../tools/websocket/wsProvider';
import { WsConnectionHolder } from '../tools/websocket/wsConnectionHolder';
import { RemoteUploadActivity } from '../tools/websocket/upload/remoteUploadActivity';
import { copyMediaFileForUpload } from '../../domain/file';
import { MediaFile, Preview } from '../../types';
import { PopupUploadEventEmitter } from '../../components/types';
import { sendUploadEvent } from '../actions/sendUploadEvent';
import { getPreviewFromMetadata } from '../../domain/preview';
import { NotifyMetadataPayload } from '../tools/websocket/upload/wsUploadEvents';
import { UploadEvent } from '../../domain/uploadEvent';
import { getPreviewFromBlob } from '../../util/getPreviewFromBlob';

export interface RemoteFileItem extends SelectedItem {
  accountId: string;
  publicId: string;
}

export const isRemoteFileItem = (
  item: SelectedItem,
): item is RemoteFileItem => {
  return ['dropbox', 'google', 'giphy'].indexOf(item.serviceName) !== -1;
};

export const isRemoteService = (serviceName: ServiceName) => {
  return ['dropbox', 'google', 'giphy'].indexOf(serviceName) !== -1;
};

export type SelectedUploadFile = {
  readonly file: MediaFile;
  readonly serviceName: ServiceName;
  readonly touchFileDescriptor: TouchFileDescriptor;
  readonly accountId?: string;
};

const mapSelectedItemToSelectedUploadFile = (
  {
    id,
    name,
    mimeType,
    size,
    date,
    serviceName,
    accountId,
    occurrenceKey = uuid(),
  }: SelectedItem,
  tenantFileId: string,
  collection?: string,
): SelectedUploadFile => ({
  file: {
    id,
    name,
    size,
    creationDate: date || Date.now(),
    type: mimeType,
    occurrenceKey,
  },
  serviceName,
  accountId,
  touchFileDescriptor: {
    fileId: tenantFileId,
    occurrenceKey,
    collection,
  },
});

export function importFilesMiddleware(
  eventEmitter: PopupUploadEventEmitter,
  wsProvider: WsProvider,
): Middleware {
  return (store) => (next: Dispatch<State>) => (action: any) => {
    if (isStartImportAction(action)) {
      importFiles(eventEmitter, store as any, wsProvider);
    }
    return next(action);
  };
}

const getHighResRemotePreview = async (
  store: Store<State>,
  fileId: string,
): Promise<FilePreview> => {
  const { userMediaClient } = store.getState();

  const blob = await userMediaClient.getImage(
    fileId,
    {
      collection: RECENTS_COLLECTION,
      mode: 'fit',
    },
    undefined,
    true,
  );

  return { value: blob, origin: 'remote' };
};

const getPreviewByService = (
  store: Store<State>,
  serviceName: ServiceName,
  mediaType: MediaType,
  fileId: string,
  userFileState?: FileState,
): FilePreview | Promise<FilePreview> | undefined => {
  const {
    config: { featureFlags },
  } = store.getState();

  if (serviceName === 'giphy') {
    const { giphy } = store.getState();
    const selectedGiphy = giphy.imageCardModels.find(
      (cardModel) => cardModel.metadata.id === fileId,
    );
    if (selectedGiphy) {
      return Promise.resolve<FilePreview>({
        value: selectedGiphy.dataURI,
        origin: 'remote',
      });
    }
  } else if (
    (serviceName === 'upload' || serviceName === 'recent_files') &&
    isPreviewableType(mediaType, featureFlags)
  ) {
    if (userFileState && !isErrorFileState(userFileState)) {
      if (isPreviewableFileState(userFileState)) {
        return userFileState.preview;
      } else if (isImageRepresentationReady(userFileState)) {
        return getHighResRemotePreview(store, fileId);
      }
    }
  }

  return undefined;
};

/**
 * Take selected file (that can be local uploads, recents or remote file (giphy, google, dropbox))
 * and convert it to FileState that will become tenant file state.
 * If selected file already in the cache (for local uploads and recents) we take everything it has, change it's id
 * to new tenant id (generated on client side) and add a preview.
 * If selected file is not in the cache (for remote selected files) we generate new file state
 * with details found in selected file.
 */
export const getTenantFileState = async (
  store: Store<State>,
  selectedUploadFile: SelectedUploadFile,
): Promise<FileState> => {
  const {
    file: selectedUserFile,
    serviceName,
    touchFileDescriptor,
  } = selectedUploadFile;

  const {
    fileId: tenantFileId,
    occurrenceKey: tenantOccurrenceKey,
  } = touchFileDescriptor;

  const selectedUserFileId = selectedUserFile.id;

  const mediaType = getMediaTypeFromMimeType(selectedUserFile.type);

  const userFileObservable = getFileStreamsCache().get(selectedUserFileId);
  if (userFileObservable) {
    // Even though there is await here we will wait mostly for 1 tick, since
    // observable.next inside observableToPromise will eval synchronously.
    const userFileState = await observableToPromise(userFileObservable);
    const preview = getPreviewByService(
      store,
      serviceName,
      mediaType,
      selectedUserFileId,
      userFileState,
    );
    if (isErrorFileState(userFileState)) {
      return {
        ...userFileState,
        id: tenantFileId,
      };
    }

    // don't copy artifacts from user's file state to tenant's file state as they contain user-specific uris
    const userFileStateWithNoArtifacts = {
      ...userFileState,
    };

    if (!isUploadingFileState(userFileStateWithNoArtifacts)) {
      delete userFileStateWithNoArtifacts.artifacts;
    }

    return {
      ...userFileStateWithNoArtifacts,
      id: tenantFileId,
      mediaType,
      preview,
    };
  }

  const preview = getPreviewByService(
    store,
    serviceName,
    mediaType,
    selectedUserFileId,
  );

  return {
    id: tenantFileId,
    occurrenceKey: tenantOccurrenceKey,
    status: 'processing',
    mediaType,
    mimeType: selectedUserFile.type,
    name: selectedUserFile.name,
    size: selectedUserFile.size,
    preview,
    representations: {},
  };
};

const distributeTenantFileState = (
  eventEmitter: PopupUploadEventEmitter,
  tenantFileState: FileState,
  userSelectedFileId: string,
) => {
  const tenantFileSubject = createFileStateSubject();
  const userFileObservable = getFileStreamsCache().get(userSelectedFileId);

  getFileStreamsCache().set(tenantFileState.id, tenantFileSubject);
  tenantFileSubject.next(tenantFileState);
  if (userFileObservable) {
    userFileObservable.subscribe({
      next: (latestUserFileState) => {
        // let's not inherit a "processed" user fileState
        // to not inherit the user artfifacts that we couldn't access later on
        if (isProcessedFileState(latestUserFileState)) {
          return;
        }

        const overrides = !isErrorFileState(tenantFileState)
          ? {
              mediaType: tenantFileState.mediaType,
              preview: tenantFileState.preview,
            }
          : {};

        tenantFileSubject.next({
          ...latestUserFileState,
          ...overrides,
          id: tenantFileState.id,
        });
      },
      error: (error) =>
        eventEmitter.emitUploadError(userSelectedFileId, {
          fileId: userSelectedFileId,
          name: 'metadata_fetch_fail',
          description: error instanceof Error ? error.message : error,
          rawError: error instanceof Error ? error : undefined,
        }),
    });
  }
};

/**
 * We call `/upload/createWithFiles` (touch) endpoint to create an empty file with client side
 * generated file ID that we use here as tenant file id.
 */
export const touchSelectedFile = (
  touchFileDescriptor: TouchFileDescriptor,
  store: Store<State>,
) => {
  const { tenantMediaClient, config } = store.getState();
  const tenantCollection =
    config.uploadParams && config.uploadParams.collection;

  return tenantMediaClient.file.touchFiles(
    [touchFileDescriptor],
    tenantCollection,
  );
};

const isKnowServiceName = ({ serviceName }: SelectedItem) =>
  ['recent_files', 'google', 'dropbox', 'upload', 'giphy'].indexOf(
    serviceName,
  ) > -1;

export async function importFiles(
  eventEmitter: PopupUploadEventEmitter,
  store: Store<State>,
  wsProvider: WsProvider,
): Promise<void> {
  const { uploads, selectedItems, userMediaClient, config } = store.getState();
  const tenantCollection =
    config.uploadParams && config.uploadParams.collection;
  store.dispatch(hidePopup());

  const selectedPluginItems = selectedItems.filter(
    (item) => !isKnowServiceName(item),
  );
  const userAuth = await userMediaClient.config.authProvider();

  const selectedUploadFiles = selectedItems
    .filter(isKnowServiceName)
    .map((item) => {
      const tenantFileId = uuid();
      return mapSelectedItemToSelectedUploadFile(
        item,
        tenantFileId,
        tenantCollection,
      );
    });

  eventEmitter.emitPluginItemsInserted(selectedPluginItems);

  await Promise.all(
    selectedUploadFiles.map(async (selectedUploadFile) => {
      // 1. We convert selectedUploadItems into tenant's fileState
      const tenantFileState = await getTenantFileState(
        store,
        selectedUploadFile,
      );

      const userSelectedFileId = selectedUploadFile.file.id;

      // 2. We store them to the cache and notify all listeners of global event emitter
      distributeTenantFileState(
        eventEmitter,
        tenantFileState,
        userSelectedFileId,
      );
    }),
  );

  // 3. We notify all listeners of mediaPicker event emitter about 'uploads-start' event
  eventEmitter.emitUploadsStart(
    selectedUploadFiles.map(({ file, touchFileDescriptor }) =>
      copyMediaFileForUpload(file, touchFileDescriptor.fileId),
    ),
  );

  // 4. Now, when empty file was created we can do all the necessary uploading/copy operations
  // TODO here we don't have actually guarantee that empty file was created.
  // https://product-fabric.atlassian.net/browse/MS-2165
  selectedUploadFiles.forEach(async (selectedUploadFile) => {
    const { file, serviceName } = selectedUploadFile;
    const selectedItemId = file.id;
    try {
      if (serviceName === 'upload') {
        const localUpload: LocalUpload = uploads[selectedItemId];
        await importFilesFromLocalUpload(
          selectedUploadFile,
          store,
          localUpload,
        );
      } else if (serviceName === 'recent_files') {
        await importFilesFromRecentFiles(selectedUploadFile, store);
      } else if (isRemoteService(serviceName)) {
        const wsConnectionHolder = wsProvider.getWsConnectionHolder(userAuth);

        await importFilesFromRemoteService(
          selectedUploadFile,
          store,
          wsConnectionHolder,
        );
      }
    } catch (error) {
      eventEmitter.emitUploadError(
        selectedUploadFile.touchFileDescriptor.fileId,
        error,
      );
    }
  });

  store.dispatch(resetView());
}

const fileStateToMediaFile = (
  fileState: Exclude<FileState, ErrorFileState>,
): MediaFile => {
  const { id, name, size, mimeType, occurrenceKey } = fileState;
  return {
    id,
    creationDate: -1, // We dont have this information
    name,
    size,
    type: mimeType,
    occurrenceKey,
  };
};

const emitPublicEvents = async (
  selectedUploadFile: SelectedUploadFile,
  store: Store<State>,
  localUpload: LocalUpload,
) => {
  const {
    touchFileDescriptor: { fileId },
  } = selectedUploadFile;
  const { tenantMediaClient } = store.getState();

  const dispatchUploadError = (fileId: string, error: Error | string) => {
    const description = error instanceof Error ? error.message : error;
    const rawError = error instanceof Error ? error : undefined;
    const event: UploadEvent = {
      name: 'upload-error',
      data: {
        fileId,
        error: {
          fileId,
          description,
          name: 'upload_fail',
          rawError,
        },
      },
    };

    store.dispatch(sendUploadEvent({ event, fileId }));
  };

  const dispatchUploadPreviewUpdate = async (
    fileState: Exclude<FileState, ErrorFileState>,
  ) => {
    const { mediaType } = fileState;
    const file = fileStateToMediaFile(fileState);
    try {
      const value = isPreviewableFileState(fileState)
        ? (await fileState.preview).value
        : undefined;
      const preview: Preview =
        value instanceof Blob ? await getPreviewFromBlob(mediaType, value) : {};

      const event: UploadEvent = {
        name: 'upload-preview-update',
        data: {
          file,
          preview,
        },
      };
      store.dispatch(sendUploadEvent({ event, fileId }));
    } catch (error) {
      const event: UploadEvent = {
        name: 'upload-preview-update',
        data: {
          file,
          preview: {},
        },
      };
      store.dispatch(sendUploadEvent({ event, fileId }));
    }
  };

  const dispatchFinalizeUpload = (fileState: NonErrorFileState) => {
    const file = fileStateToMediaFile(fileState);
    // File to copy from
    const source = {
      id: localUpload.file.metadata.id,
      collection: RECENTS_COLLECTION,
    };
    const preview = isPreviewableFileState(fileState)
      ? fileState.preview
      : undefined;

    store.dispatch(finalizeUpload(file, fileId, source, { preview }));
  };

  const currentTenantFileState = await tenantMediaClient.file.getCurrentState(
    fileId,
  );

  if (!isErrorFileState(currentTenantFileState)) {
    await dispatchUploadPreviewUpdate(currentTenantFileState);
  }

  tenantMediaClient.file.getFileState(fileId).subscribe({
    next(this: Subscriber<FileState>, fileState: FileState) {
      if (isErrorFileState(fileState)) {
        const { message = '' } = fileState;
        dispatchUploadError(fileId, message);
        this.unsubscribe();
      } else if (!isUploadingFileState(fileState)) {
        dispatchFinalizeUpload(fileState);
        this.unsubscribe();
      }
    },
    error: (error) => dispatchUploadError(fileId, error),
  });
};

const importFilesFromLocalUpload = async (
  selectedUploadFile: SelectedUploadFile,
  store: Store<State>,
  localUpload: LocalUpload,
): Promise<void> => {
  const { touchFileDescriptor } = selectedUploadFile;

  await touchSelectedFile(touchFileDescriptor, store);

  await emitPublicEvents(selectedUploadFile, store, localUpload);
};

const importFilesFromRecentFiles = async (
  selectedUploadFile: SelectedUploadFile,
  store: Store<State>,
): Promise<void> => {
  const { file, touchFileDescriptor } = selectedUploadFile;
  const { fileId } = touchFileDescriptor;
  const source = {
    id: file.id,
    collection: RECENTS_COLLECTION,
  };

  // we want to dispatch preview to provide card size to editor before we wait for http calls
  store.dispatch(getPreview(fileId, file, RECENTS_COLLECTION));
  await touchSelectedFile(touchFileDescriptor, store);
  store.dispatch(finalizeUpload(file, fileId, source));
};

const importFilesFromRemoteService = async (
  selectedUploadFile: SelectedUploadFile,
  store: Store<State>,
  wsConnectionHolder: WsConnectionHolder,
): Promise<void> => {
  const {
    touchFileDescriptor,
    serviceName,
    accountId,
    file,
  } = selectedUploadFile;
  const { fileId: tenantFileId } = touchFileDescriptor;

  const uploadActivity = new RemoteUploadActivity(
    tenantFileId,
    serviceName,
    (event, payload) => {
      if (event === 'NotifyMetadata') {
        const preview = getPreviewFromMetadata(
          (payload as NotifyMetadataPayload).metadata,
        );

        store.dispatch(
          sendUploadEvent({
            event: {
              name: 'upload-preview-update',
              data: {
                file,
                preview,
              },
            },
            fileId: tenantFileId,
          }),
        );
      } else {
        const { tenantFileId } = payload;
        const newFile: MediaFile = {
          ...file,
          id: tenantFileId,
          creationDate: Date.now(),
        };

        store.dispatch(handleCloudFetchingEvent(newFile, event, payload));
      }
    },
  );

  uploadActivity.on('Started', () => {
    store.dispatch(remoteUploadStart(tenantFileId));
  });

  wsConnectionHolder.openConnection(uploadActivity);

  wsConnectionHolder.send({
    type: 'fetchFile',
    params: {
      serviceName,
      accountId,
      // This fileId is identifier of a file in the cloud provider. For Dropbox for ex. it will be
      // a filename path
      fileId: file.id,
      fileName: file.name,
      collection: RECENTS_COLLECTION,
      // This seems to be a hack, where we hijack `jobId` to
      // push through associated tenant fileId to use it in the future as a replaceFileId.
      // Actual file will be created in parallel by next `touchSelectedFile()` call.
      // IMPORTANT! This ID will magically becomes `uploadId` in most of the consequent messages coming back from WS
      // (see RemoteUploadBasePayload.uploadId)
      jobId: tenantFileId,
    },
  });

  // that still may cause async issues if file is fetched before this has happened
  // but the chances of that are extremely slim as cloud fetching is a very lengthy procedure
  await touchSelectedFile(touchFileDescriptor, store);
};
