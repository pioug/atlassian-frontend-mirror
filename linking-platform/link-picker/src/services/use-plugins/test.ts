import { renderHook } from '@testing-library/react-hooks';
import {
  MockLinkPickerPlugin,
  mockedPluginData,
  MockLinkPickerPromisePlugin,
} from '@atlaskit/link-test-helpers/link-picker';
import { PickerState, RECENT_SEARCH_LIST_SIZE } from '../../ui/link-picker';
import { usePlugins } from './';
import { LinkPickerPlugin } from '../../ui/types';

describe('usePlugins', () => {
  const state: PickerState = {
    url: '',
    displayText: '',
    activeIndex: -1,
    selectedIndex: -1,
    invalidUrl: false,
    activeTab: 0,
  };

  it('should NOT return results if not given plugins', () => {
    const { result } = renderHook(() => usePlugins(state));

    expect(result.current).toMatchObject({
      items: [],
      isLoading: false,
      isSelectedItem: false,
      isActivePlugin: false,
    });
  });

  describe('with plugins', () => {
    const plugins = [new MockLinkPickerPlugin()];

    it('isActivePlugin should be `true`', async () => {
      const { result } = renderHook(() => usePlugins(state, plugins));

      expect(result.current.isActivePlugin).toBe(true);
    });

    it('should return results', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        usePlugins(state, plugins),
      );

      expect(result.current.items.length).toBe(0);

      await waitForNextUpdate();
      expect(result.current.items.length).toEqual(RECENT_SEARCH_LIST_SIZE);
    });

    it('should NOT return results if state contains a valid url', () => {
      const newState = { ...state, url: 'http://www.atlassian.com' };
      const { result } = renderHook(() => usePlugins(newState, plugins));

      expect(result.current.isActivePlugin).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.items.length).toBe(0);
    });

    it('should filter recent results when given a search term', async () => {
      const newState = { ...state, url: 'Atlassian Editor' };
      const { result, rerender, waitForNextUpdate } = renderHook(
        (props: { state: PickerState; plugins?: LinkPickerPlugin[] }) => {
          return usePlugins(props.state, props.plugins);
        },
        { initialProps: { state, plugins } },
      );

      await waitForNextUpdate();
      expect(result.current.items.length).toEqual(RECENT_SEARCH_LIST_SIZE);

      rerender({ state: newState, plugins });

      await waitForNextUpdate();
      expect(result.current.items.length).toBe(1);
    });

    it('should NOT filter or fetch new results if the state changes but the url does not', async () => {
      const { result, rerender, waitForNextUpdate } = renderHook(
        (props: { state: PickerState; plugins?: LinkPickerPlugin[] }) => {
          return usePlugins(props.state, props.plugins);
        },
        { initialProps: { state, plugins } },
      );

      await waitForNextUpdate();
      const initItems = result.current.items.sort();
      expect(result.current.items.length).toEqual(RECENT_SEARCH_LIST_SIZE);

      rerender({ state: { ...state, activeIndex: 4 }, plugins });
      expect(result.current.items.sort()).toEqual(initItems);
      expect(result.current.items.length).toEqual(RECENT_SEARCH_LIST_SIZE);

      rerender({ state: { ...state, activeIndex: 3 }, plugins });
      expect(result.current.items.sort()).toEqual(initItems);
      expect(result.current.items.length).toEqual(RECENT_SEARCH_LIST_SIZE);

      rerender({ state: { ...state, activeIndex: 2 }, plugins });
      expect(result.current.items.sort()).toEqual(initItems);
      expect(result.current.items.length).toEqual(RECENT_SEARCH_LIST_SIZE);
    });

    it('isSelectedItem should be `true` when url and selectedIndex match a result in the list', async () => {
      const newState = {
        ...state,
        url: mockedPluginData[0].url,
        selectedIndex: 0,
      };
      const { result, rerender, waitForNextUpdate } = renderHook(
        (props: { state: PickerState; plugins?: LinkPickerPlugin[] }) => {
          return usePlugins(props.state, props.plugins);
        },
        { initialProps: { state, plugins } },
      );

      await waitForNextUpdate();
      expect(result.current.items.length).toEqual(RECENT_SEARCH_LIST_SIZE);

      rerender({ state: newState, plugins });

      await waitForNextUpdate();
      expect(result.current.isSelectedItem).toBe(true);
      expect(result.current.items.length).toEqual(RECENT_SEARCH_LIST_SIZE);
      expect(result.current.items[0].url).toEqual(mockedPluginData[0].url);
    });

    it('isLoading should be `true` while plugin is fetching results', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        usePlugins(state, plugins),
      );

      expect(result.current.items.length).toBe(0);

      await waitForNextUpdate();
      expect(result.current.isLoading).toBe(true);

      await waitForNextUpdate();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.items.length).toEqual(RECENT_SEARCH_LIST_SIZE);
    });

    it('should return tabs and available tabTitle', async () => {
      const plugin1 = new MockLinkPickerPromisePlugin({
        tabKey: 'tab1',
        tabTitle: 'tab1',
      });
      const plugin2 = new MockLinkPickerPromisePlugin({
        tabKey: 'tab2',
        tabTitle: 'tab2',
      });

      const { result } = renderHook(() =>
        usePlugins(state, [plugin1, plugin2]),
      );

      expect(result.current.tabs).toHaveLength(2);
      expect(result.current.tabs[0].tabTitle).toBe('tab1');
      expect(result.current.tabs[1].tabTitle).toBe('tab2');
    });
  });
});
