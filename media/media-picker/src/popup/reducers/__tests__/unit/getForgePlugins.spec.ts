import { GetForgePluginsAction } from '../../../actions/getForgePlugins';
import {
  getForgePluginsStarted,
  getForgePluginsFullfilled,
  getForgePluginsFailed,
} from '../../getForgePlugins';

describe('getForgePlugins', () => {
  describe('getForgePluginsStarted', () => {
    it('should preserve existing state', () => {
      const state: any = {
        plugins: [],
      };

      const action: GetForgePluginsAction = {
        type: 'GET_FORGE_PLUGINS',
      };

      const newState = getForgePluginsStarted(state, action);
      expect(newState).toEqual(state);
    });
  });

  describe('getForgePluginsFullfilled', () => {
    it('should return existing state if the action is not getForgePluginsFullFilledAction', () => {
      const state: any = {
        plugins: [],
      };

      const action: GetForgePluginsAction = {
        type: 'GET_FORGE_PLUGINS',
      };

      const newState = getForgePluginsStarted(state, action);
      expect(newState).toEqual(state);
    });

    it('should merge new plugins into current ones', () => {
      const state: any = {
        plugins: [
          {
            name: 'plugin 1',
          },
        ],
      };

      const action: any = {
        type: 'GET_FORGE_PLUGINS_FULLFILLED',
        items: [
          {
            name: 'plugin 1',
          },
          {
            name: 'plugin 2',
          },
        ],
      };

      const newState = getForgePluginsFullfilled(state, action);
      expect(newState.plugins).toContainEqual({
        name: 'plugin 1',
      });
      expect(newState.plugins).toContainEqual({
        name: 'plugin 2',
      });
    });
  });

  describe('getForgePluginsFailed', () => {
    it('should return existing state if the action is not isGetForgePluginsFailedAction', () => {
      const state: any = {
        plugins: [],
      };

      const action: GetForgePluginsAction = {
        type: 'GET_FORGE_PLUGINS',
      };

      const newState = getForgePluginsFailed(state, action);
      expect(newState).toEqual(state);
    });

    it('should return the failed state', () => {
      const state: any = {
        plugins: [],
        view: {},
      };

      const action: any = {
        type: 'GET_FORGE_PLUGINS_FAILED',
      };

      const newState = getForgePluginsFailed(state, action);
      expect(newState).toEqual({
        plugins: [],
        view: {
          hasError: true,
          isLoading: false,
        },
      });
    });
  });
});
