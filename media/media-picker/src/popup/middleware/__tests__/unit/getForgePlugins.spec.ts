import { mockStore } from '@atlaskit/media-test-helpers';
import {
  GET_FORGE_PLUGINS,
  GET_FORGE_PLUGINS_FULLFILLED,
  GET_FORGE_PLUGINS_FAILED,
} from '../../../actions/getForgePlugins';
import { getForgePlugins } from '../../getForgePlugins';
import { ForgeClient } from '../../../../plugins/forge';

jest.mock('../../../../plugins/forge', () => {
  return {
    __esModule: true,
    ForgeClient: jest.fn().mockImplementation(() => {
      return {
        getProviders: jest.fn(() => {
          return {
            providers: [
              {
                key: 'confluence-object-provider',
                metadata: {
                  name: 'Confluence',
                  avatarUrl: '',
                  supportedViews: [],
                },
              },
              {
                key: 'onedrive-search-provider',
                metadata: {
                  name: 'OneDrive',
                  avatarUrl:
                    'https://secure.gravatar.com/avatar/f1f07b3ad60c1904edb4fb4e7f58f0e2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FOP-5.png',
                  supportedViews: ['folder'],
                },
              },
            ],
          };
        }),
      };
    }),
  };
});

describe('getForgePlugins middleware', () => {
  describe('getForgePlugins()', () => {
    beforeEach(() => {
      (ForgeClient as jest.Mock).mockClear();
    });

    it('should ignore the action if the action is not a GetForgePluginsAction', async () => {
      const store = mockStore();
      const next = jest.fn();

      const unknownAction = { type: 'UNKNOWN' };
      await getForgePlugins()(store)(next)(unknownAction);

      expect(store.dispatch).toHaveBeenCalledTimes(0);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(unknownAction);
    });

    it('should fetch providers and transform it to plugin', async () => {
      const store = mockStore();
      const next = jest.fn();

      const getForgePluginsAction = { type: GET_FORGE_PLUGINS };
      await getForgePlugins()(store)(next)(getForgePluginsAction);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: GET_FORGE_PLUGINS_FULLFILLED,
          items: [
            expect.objectContaining({
              name: 'OneDrive',
              icon: expect.anything(),
              render: expect.any(Function),
            }),
          ],
        }),
      );
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(getForgePluginsAction);
    });

    it('should dispatch error action if something goes wrong', async () => {
      const store = mockStore();
      const next = jest.fn();

      (ForgeClient as jest.Mock).mockImplementation(() => {
        return {
          getProviders: () => {
            throw new Error();
          },
        };
      });
      const getForgePluginsAction = { type: GET_FORGE_PLUGINS };
      await getForgePlugins()(store)(next)(getForgePluginsAction);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: GET_FORGE_PLUGINS_FAILED,
      });
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(getForgePluginsAction);
    });
  });
});
