import { act, renderHook } from '@testing-library/react-hooks';

import { ManualPromise } from '@atlaskit/link-test-helpers';
import { MockLinkPickerPlugin } from '@atlaskit/link-test-helpers/link-picker';

import {
  MockLinkPickerGeneratorPlugin,
  MockLinkPickerPromisePlugin,
  UnstableMockLinkPickerPlugin,
} from '../../__tests__/__helpers/mock-plugins';
import { RECENT_SEARCH_LIST_SIZE } from '../../common/constants';
import { LinkPickerPlugin, LinkPickerState } from '../../common/types';

import * as reducer from './reducer';
import { CancellationError, resolvePluginUpdates } from './utils';

import { usePlugins } from './index';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('usePlugins', () => {
  const state = { query: '' };
  const activeTab = 0;
  const plugins = [new MockLinkPickerPlugin()];

  describe('Without Plugins', () => {
    it('Should NOT return values', () => {
      const { result } = renderHook(() => usePlugins(state, activeTab));

      expect(result.current.items).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isActivePlugin).toBe(false);
    });
  });

  describe('With Plugins', () => {
    const setUpHook = (props: {
      state: LinkPickerState;
      activeTab: number;
      plugins?: LinkPickerPlugin[];
    }) => {
      return renderHook(
        props => {
          return usePlugins(props.state, props.activeTab, props.plugins);
        },
        { initialProps: props },
      );
    };

    it('isActivePlugin should be `true`', async () => {
      const { result } = setUpHook({
        state,
        activeTab,
        plugins,
      });

      expect(result.current.isActivePlugin).toBe(true);
    });

    it('Should return Items', async () => {
      const { result, waitForNextUpdate } = setUpHook({
        state,
        activeTab,
        plugins,
      });

      await waitForNextUpdate();
      expect(result.current.items).not.toBeNull();
      expect(result.current.items?.length).toEqual(RECENT_SEARCH_LIST_SIZE);
    });

    it('Should filter recent Items when given a new query', async () => {
      const { result, rerender, waitForNextUpdate } = setUpHook({
        state,
        activeTab,
        plugins,
      });

      await waitForNextUpdate();
      expect(result.current.items?.length).toEqual(RECENT_SEARCH_LIST_SIZE);

      rerender({ state: { query: 'Editor' }, activeTab, plugins });

      await waitForNextUpdate();
      expect(result.current.items?.length).toBe(1);
    });

    // https://product-fabric.atlassian.net/browse/EDM-4550
    it.skip('isLoading should be `true` while the plugin is fetching new Items', async () => {
      const { result, waitForNextUpdate } = setUpHook({
        state,
        activeTab,
        plugins,
      });

      expect(result.current.isLoading).toBe(true);
      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.items).not.toBeNull();
      expect(result.current.items?.length).toEqual(RECENT_SEARCH_LIST_SIZE);
    });

    it('Should return available tabs and tabTitle', async () => {
      const plugin1 = new MockLinkPickerPromisePlugin({
        tabKey: 'tab1',
        tabTitle: 'tab1',
      });
      const plugin2 = new MockLinkPickerPromisePlugin({
        tabKey: 'tab2',
        tabTitle: 'tab2',
      });

      const { result } = setUpHook({
        state,
        activeTab,
        plugins: [plugin1, plugin2],
      });

      expect(result.current.tabs).toHaveLength(2);
      expect(result.current.tabs[0].tabTitle).toBe('tab1');
      expect(result.current.tabs[1].tabTitle).toBe('tab2');
    });

    it('Should clear items set isLoading to `false` and return error when plugin throws', async () => {
      const plugins = [
        new UnstableMockLinkPickerPlugin({
          tabKey: 'tab1',
          tabTitle: 'Unstable',
        }),
      ];

      const { result, waitForNextUpdate } = setUpHook({
        state,
        activeTab,
        plugins,
      });

      await waitForNextUpdate();

      expect(result.current.items).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).not.toBeNull();
    });

    it('retry function should trigger a new search when plugin throws an error', async () => {
      const plugins = [
        new UnstableMockLinkPickerPlugin({
          tabKey: 'tab1',
          tabTitle: 'Unstable',
        }),
      ];

      const { result, waitForNextUpdate } = setUpHook({
        state,
        activeTab,
        plugins,
      });

      await waitForNextUpdate();

      const { retry } = result.current;
      expect(retry).toBeDefined();
      act(() => retry());

      await waitForNextUpdate();

      expect(result.current.error).toBeNull();
      expect(result.current.items).not.toBe(null);
      expect(result.current.items?.length).not.toBe(0);
    });

    it('errorFallback should be defined when provided with Plugin', async () => {
      const plugins = [
        new UnstableMockLinkPickerPlugin({
          tabKey: 'tab1',
          tabTitle: 'Unstable',
          errorFallback: (error, retry) => null,
        }),
      ];

      const { result, waitForNextUpdate } = setUpHook({
        state,
        activeTab,
        plugins,
      });

      await waitForNextUpdate();

      const { errorFallback } = result.current;
      expect(errorFallback).toBeDefined();
    });

    it('should not dispatch state updates after unmount', async () => {
      const dispatch = jest.fn();
      jest
        .spyOn(reducer, 'usePluginReducer')
        .mockReturnValue([reducer.INITIAL_STATE, dispatch]);

      const promise = new ManualPromise({ data: [] });
      const plugin = {
        resolve: () => promise,
      };
      const plugins = [plugin];
      const resolve = jest.spyOn(plugin, 'resolve');
      const { unmount } = setUpHook({
        state,
        activeTab,
        plugins,
      });

      unmount();
      await promise.resolve();
      act(() => {});

      expect(resolve).toBeCalledTimes(1);
      expect(dispatch).toBeCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: reducer.ACTION_LOADING,
      });
    });

    it('should return plugin actions from config', async () => {
      const message = {
        id: 'test',
        description: 'Action',
        defaultMessage: 'test',
      };
      const promise = new ManualPromise({ data: [] });
      const plugins = [
        {
          resolve: () => promise,
          action: {
            label: message,
            callback: () => jest.fn(),
          },
        },
      ];
      const { result } = renderHook(() =>
        usePlugins(state, activeTab, plugins),
      );
      const { pluginAction } = result.current;
      expect(pluginAction).toBeDefined();
      expect(pluginAction?.label).toEqual(message);
    });
  });
});

describe('resolvePluginUpdates', () => {
  describe('with promise plugin', () => {
    const setup = () => {
      const data: never[] = [];
      const promise = new ManualPromise(data);
      const plugin = new MockLinkPickerPromisePlugin({ promise });
      const resolve = jest.spyOn(plugin, 'resolve');
      const state = { query: '' };
      const { next, cancel } = resolvePluginUpdates(plugin, state);

      return {
        data,
        promise,
        resolve,
        state,
        next,
        cancel,
      };
    };

    it('should successfully resolve if cancel is not called', async () => {
      const { data, promise, resolve, state, next } = setup();

      // Resolve, no cancel
      promise.resolve();

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith(state);
      await expect(next()).resolves.toEqual({
        done: true,
        value: { data },
      });
    });

    it('should reject with cancellation error if cancel is called before the promise fulfills', async () => {
      const { promise, resolve, state, next, cancel } = setup();

      // Cancel before resolve
      cancel();
      promise.resolve();

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith(state);
      await expect(next()).rejects.toBeInstanceOf(CancellationError);
    });
  });

  describe('with generator plugin', () => {
    const setup = () => {
      const data: never[] = [];
      const promises = [
        new ManualPromise({ value: { data }, done: false }),
        new ManualPromise({ value: { data }, done: true }),
      ];
      const plugin = new MockLinkPickerGeneratorPlugin(promises);
      const resolve = jest.spyOn(plugin, 'resolve');
      const state = { query: '' };
      const { next, cancel } = resolvePluginUpdates(plugin, state);

      return {
        data,
        promises,
        resolve,
        state,
        next,
        cancel,
      };
    };

    it('should successfully resolve if cancel is not called', async () => {
      const { data, promises, resolve, state, next } = setup();

      // Resolve, no cancel
      promises[0].resolve();
      promises[1].resolve();

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith(state);
      await expect(next()).resolves.toEqual({
        done: false,
        value: { data },
      });
      await expect(next()).resolves.toEqual({
        done: true,
        value: { data },
      });
    });

    it('should reject with cancellation error if cancel is called before the promise fulfills', async () => {
      const { data, promises, next, cancel } = setup();

      promises[0].resolve();
      await expect(next()).resolves.toEqual({
        done: false,
        value: { data },
      });

      // Cancel after first yield, but before second yield
      cancel();
      promises[1].resolve();

      await expect(next()).rejects.toBeInstanceOf(CancellationError);
    });

    it('should reject with cancellation error if cancel is called before before results are yielded by next()', async () => {
      const { promises, next, cancel } = setup();

      promises[0].resolve();
      promises[1].resolve();

      // Cancel before yield using next()
      cancel();

      await expect(next()).rejects.toBeInstanceOf(CancellationError);
      await expect(next()).rejects.toBeInstanceOf(CancellationError);
    });

    it('should reject with cancellation error if cancel is called before the promise fulfills', async () => {
      const { promises, next, cancel } = setup();

      // Cancel before resolves
      const result0 = next();
      const result1 = next();
      cancel();
      promises[0].resolve();
      promises[1].resolve();

      await expect(result0).rejects.toBeInstanceOf(CancellationError);
      await expect(result1).rejects.toBeInstanceOf(CancellationError);
    });
  });
});
