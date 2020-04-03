import { Store, Dispatch, Middleware } from 'redux';
import { GetPreviewAction, isGetPreviewAction } from '../actions/getPreview';
import { State } from '../domain';
import { sendUploadEvent } from '../actions/sendUploadEvent';
import { getPreviewFromMetadata } from '../../domain/preview';
import { NonImagePreview, Preview } from '../../types';
import { safeUnsubscribe } from '@atlaskit/media-client';

export default function(): Middleware {
  return store => (next: Dispatch<State>) => (action: any) => {
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
  const { userMediaClient } = store.getState();
  const subscription = userMediaClient.file
    .getFileState(file.id, { collectionName: collection })
    .subscribe({
      async next(state) {
        if (state.status === 'error') {
          return;
        }

        const { mediaType } = state;
        safeUnsubscribe(subscription);
        if (mediaType === 'image' || mediaType === 'video') {
          const metadata = await userMediaClient.getImageMetadata(file.id, {
            collection,
          });
          const preview = getPreviewFromMetadata(metadata);
          dispatchPreviewUpdate(store, action, preview);
        } else {
          const blob = state.preview && (await state.preview);
          const preview: NonImagePreview = {
            file: state.preview && blob instanceof Blob ? blob : undefined,
          };
          dispatchPreviewUpdate(store, action, preview);
        }
      },
    });
}
