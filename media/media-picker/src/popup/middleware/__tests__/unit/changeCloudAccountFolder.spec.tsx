import {
  expectFunctionToHaveBeenCalledWith,
  mockFetcher,
  mockStore,
  nextTick,
} from '@atlaskit/media-test-helpers';
import { requestUnlinkCloudAccount } from '../../../actions/unlinkCloudAccount';
import { fileListUpdate } from '../../../actions/fileListUpdate';
import { changeCloudAccountFolderMiddleware } from '../../changeCloudAccountFolder';
import { changeCloudAccountFolder } from '../../../actions';
import { ServiceFolder } from '../../../domain';

describe('changePath', () => {
  const clientId = 'some-client-id';
  const token = 'some-token';
  const serviceName = 'google';
  const accountId = 'some-account-id';
  const folderId = 'some-folder-id';
  const auth = { clientId, token };

  const setup = () => {
    const fetcher = mockFetcher();
    const store = mockStore();
    const next = jest.fn();

    const { userMediaClient } = store.getState();
    (userMediaClient.config.authProvider as jest.Mock<any>).mockReturnValue(
      Promise.resolve(auth),
    );

    return { fetcher, store, next };
  };

  it('should skip fetching for different action type', () => {
    const { fetcher, store, next } = setup();
    const action = { type: 'SOME_ANOTHER_REQUEST' };

    changeCloudAccountFolderMiddleware(fetcher)(store)(next)(action as any);

    expect(next).toBeCalledWith(action);
    expect(fetcher.fetchCloudAccountFolder).not.toBeCalled();
  });

  it('should dispatch path change when fetching successful', async () => {
    const { fetcher, store, next } = setup();
    const path = [{ id: folderId, name: 'some-folder' }];
    const action = changeCloudAccountFolder(serviceName, accountId, path);

    const serviceFolder: ServiceFolder = {
      id: 'some-parent-id',
      items: [
        {
          id: 'some-child-id',
          name: 'some-folder-item',
          date: 1,
          items: [],
          mimeType: 'application/vnd.atlassian.mediapicker.folder',
          occurrenceKey: '',
          parentId: 'some-parent-id',
        },
      ],
      cursor: 'some-cursor',
      name: 'some-folder',
      parentId: '',
      mimeType: 'application/vnd.atlassian.mediapicker.folder',
    };

    const dataPromise = Promise.resolve(serviceFolder);
    fetcher.fetchCloudAccountFolder.mockReturnValueOnce(dataPromise);

    changeCloudAccountFolderMiddleware(fetcher)(store)(next)(action);

    await nextTick(); // Await authProvider()
    await nextTick();
    await nextTick();
    await nextTick();

    expect(fetcher.fetchCloudAccountFolder).toBeCalledWith(
      auth,
      action.serviceName,
      action.accountId,
      action.path[0].id,
    );

    await dataPromise;

    expectFunctionToHaveBeenCalledWith(store.dispatch, [
      fileListUpdate(
        accountId,
        path,
        serviceFolder.items,
        serviceName,
        undefined,
        serviceFolder.cursor,
      ),
    ]);
  });

  it('should dispatch account unlink if fetching ended with 401 error', async () => {
    const { fetcher, store, next } = setup();
    const path = [{ id: folderId, name: 'some-folder' }];
    const action = changeCloudAccountFolder(serviceName, accountId, path);

    const fetchCloudAccountFolderResult = Promise.reject({
      response: { status: 401 },
    });
    fetcher.fetchCloudAccountFolder.mockReturnValueOnce(
      fetchCloudAccountFolderResult,
    );

    changeCloudAccountFolderMiddleware(fetcher)(store)(next)(action);

    await nextTick(); // Await authProvider()
    await nextTick();
    await nextTick();
    await nextTick();

    try {
      await fetchCloudAccountFolderResult;
    } catch (e) {}

    expect(fetcher.fetchCloudAccountFolder).toBeCalledWith(
      auth,
      action.serviceName,
      action.accountId,
      action.path[0].id,
    );

    expectFunctionToHaveBeenCalledWith(store.dispatch, [
      requestUnlinkCloudAccount({ id: accountId, name: action.serviceName }),
    ]);
  });
});
