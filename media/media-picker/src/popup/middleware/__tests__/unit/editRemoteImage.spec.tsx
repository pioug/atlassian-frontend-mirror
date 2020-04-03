import { couldNotLoadImage } from '../../../components/views/editor/phrases';
import {
  mockStore,
  asMock,
  asMockReturnValue,
} from '@atlaskit/media-test-helpers';

import { editRemoteImage } from '../../editRemoteImage';
import { editorShowImage } from '../../../actions/editorShowImage';
import { editorShowLoading } from '../../../actions/editorShowLoading';
import { editorShowError } from '../../../actions/editorShowError';
import {
  EDIT_REMOTE_IMAGE,
  EditRemoteImageAction,
} from '../../../actions/editRemoteImage';

describe('editRemoteImage', () => {
  const fileId = 'some-file-id';
  const file = {
    id: fileId,
    name: 'some-file-name',
  };
  const collectionName = 'some-collection';
  const auth = { clientId: 'some-client-id', token: 'some-token', baseUrl: '' };

  const setup = () => {
    const store = mockStore({
      editorData: {
        originalFile: file,
      },
    });
    const { userMediaClient } = store.getState();
    const getImageUrl = asMock(userMediaClient.getImageUrl);

    asMockReturnValue(
      userMediaClient.config.authProvider,
      Promise.resolve(auth),
    );

    return { store, getImageUrl };
  };

  it('should handle fetching failure', async () => {
    const { store, getImageUrl } = setup();
    const action: EditRemoteImageAction = {
      type: EDIT_REMOTE_IMAGE,
      item: file,
      collectionName,
    };
    getImageUrl.mockImplementation(() => Promise.reject('some-error'));

    await editRemoteImage(store, action);

    expect(getImageUrl).toHaveBeenCalledWith(file.id, {
      mode: 'full-fit',
      collection: collectionName,
    });
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch.mock.calls[0]).toEqual([editorShowLoading(file)]);
    expect(store.dispatch.mock.calls[1]).toEqual([
      editorShowError(couldNotLoadImage, expect.any(Function)),
    ]);
  });

  it('should handle fetching success', async () => {
    const { store, getImageUrl } = setup();
    const action: EditRemoteImageAction = {
      type: EDIT_REMOTE_IMAGE,
      item: file,
      collectionName,
    };

    getImageUrl.mockResolvedValue('some-url');

    await editRemoteImage(store, action);

    expect(store.getState().userMediaClient.getImageUrl).toHaveBeenCalledWith(
      file.id,
      {
        mode: 'full-fit',
        collection: collectionName,
      },
    );
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch.mock.calls[0]).toEqual([editorShowLoading(file)]);
    expect(store.dispatch.mock.calls[1]).toEqual([editorShowImage('some-url')]);
  });
});
