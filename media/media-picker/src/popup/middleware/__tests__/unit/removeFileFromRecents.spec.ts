import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import { mockStore } from '@atlaskit/media-test-helpers';
import { removeFileFromRecents } from '../../removeFileFromRecents';
import { RemoveFileFromRecentsAction } from '../../../actions/removeFileFromRecents';

describe('removeFileFromRecents middleware', () => {
  const setup = () => {
    const store = mockStore();
    const collectionRemoveFileMock = jest.fn();
    store.getState().userMediaClient.collection.removeFile = collectionRemoveFileMock;

    return { collectionRemoveFileMock, store, next: jest.fn() };
  };

  it("should remove file with it's userId", () => {
    const { collectionRemoveFileMock, store, next } = setup();
    const action: RemoveFileFromRecentsAction = {
      id: 'some-id',
      userFileId: 'some-user-id',
      occurrenceKey: 'some-occurrence-key',
      type: 'REMOVE_FILES_FROM_RECENTS',
    };
    removeFileFromRecents(store)(next)(action);
    expect(collectionRemoveFileMock).toHaveBeenCalledWith(
      'some-user-id',
      RECENTS_COLLECTION,
      'some-occurrence-key',
    );
  });

  it("should remove file with it's id", () => {
    const { collectionRemoveFileMock, store, next } = setup();
    const action: RemoveFileFromRecentsAction = {
      id: 'some-id',
      occurrenceKey: 'some-occurrence-key',
      type: 'REMOVE_FILES_FROM_RECENTS',
    };
    removeFileFromRecents(store)(next)(action);
    expect(collectionRemoveFileMock).toHaveBeenCalledWith(
      'some-id',
      RECENTS_COLLECTION,
      'some-occurrence-key',
    );
  });
});
