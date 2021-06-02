import { Store, Dispatch, Middleware } from 'redux';
import { Subscriber } from 'rxjs/Subscriber';
import {
  FileState,
  isErrorFileState,
  getMediaTypeFromMimeType,
  isPreviewableType,
  isImageRepresentationReady,
} from '@atlaskit/media-client';
import { GetPreviewAction, isGetPreviewAction } from '../actions/getPreview';
import { State } from '../domain';
import { sendUploadEvent } from '../actions/sendUploadEvent';
import { getPreviewFromMetadata } from '../../domain/preview';
import { NonImagePreview, Preview } from '../../types';

export default function (): Middleware {
  return (store) => (next: Dispatch<State>) => (action: any) => {
    if (isGetPreviewAction(action)) {
      getPreview(store as any, action);
    }
    return next(action);
  };
}

const dispatchPreviewUpdate = (
  store: Store<State>,
  { fileId, file }: GetPreviewAction,
  preview: Preview,
) => {
  store.dispatch(
    sendUploadEvent({
      event: {
        name: 'upload-preview-update',
        data: {
          file,
          preview,
        },
      },
      fileId,
    }),
  );
};

export function getPreview(store: Store<State>, action: GetPreviewAction) {
  const { file, collection } = action;
  const {
    config: { featureFlags },
    userMediaClient,
  } = store.getState();

  userMediaClient.file
    .getFileState(file.id, { collectionName: collection })
    .subscribe({
      async next(this: Subscriber<FileState>, state) {
        if (isErrorFileState(state)) {
          this.unsubscribe();
          return;
        }

        const { mimeType } = state;
        const mediaType = mimeType
          ? getMediaTypeFromMimeType(mimeType)
          : 'unknown';

        this.unsubscribe();

        if (
          isPreviewableType(mediaType, featureFlags) &&
          isImageRepresentationReady(state)
        ) {
          const metadata = await userMediaClient.getImageMetadata(file.id, {
            collection,
          });
          const preview = getPreviewFromMetadata(metadata);
          dispatchPreviewUpdate(store, action, preview);
        } else {
          const { value } = (state.preview && (await state.preview)) || {};
          const preview: NonImagePreview = {
            file: value instanceof Blob ? value : undefined,
          };
          dispatchPreviewUpdate(store, action, preview);
        }
      },
    });
}
