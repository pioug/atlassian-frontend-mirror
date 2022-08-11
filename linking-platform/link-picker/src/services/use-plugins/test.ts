import { act, renderHook } from '@testing-library/react-hooks';
import {
  MockLinkPickerPlugin,
  MockLinkPickerPromisePlugin,
  UnstableMockLinkPickerPlugin,
} from '@atlaskit/link-test-helpers/link-picker';
import { usePlugins } from './';
import { LinkPickerPlugin, LinkPickerState } from '../../ui/types';
import { RECENT_SEARCH_LIST_SIZE } from '../../ui/link-picker';

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

    it('isLoading should be `true` while the plugin is fetching new Items', async () => {
      const { result, waitForNextUpdate } = setUpHook({
        state,
        activeTab,
        plugins,
      });

      await waitForNextUpdate();
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
  });
});
