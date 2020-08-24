import { mockStore, mockFetcher } from '@atlaskit/media-test-helpers';
import { nextTick } from '@atlaskit/media-test-helpers';
import { getConnectedRemoteAccounts } from '../../getConnectedRemoteAccounts';
import { connectedRemoteAccountsFailed } from '../../../actions/getConnectedRemoteAccounts';

describe('getConnectedRemoteAccounts middleware', () => {
  describe('getConnectedRemoteAccounts()', () => {
    it('connectedRemoteAccountsFailed should dispatch if getServiceList fails', async () => {
      const fetcher = mockFetcher();
      const store = mockStore();
      const next = jest.fn();
      fetcher.getServiceList.mockReturnValue(Promise.reject());

      const getConnectedRemoteAccountsAction = {
        type: 'GET_CONNECTED_REMOTE_ACCOUNTS',
      };
      getConnectedRemoteAccounts(fetcher)(store)(next)(
        getConnectedRemoteAccountsAction,
      );

      await nextTick();
      await nextTick();
      await nextTick();
      await nextTick();

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenLastCalledWith(
        connectedRemoteAccountsFailed(),
      );
    });
  });
});
