import React from 'react';

import {
  renderWithIntl as render,
  asyncAct,
  ManualPromise,
} from '@atlaskit/link-test-helpers';
import {
  MockLinkPickerGeneratorPlugin,
  MockLinkPickerPromisePlugin,
  mockedPluginData,
  UnstableMockLinkPickerPlugin,
} from '@atlaskit/link-test-helpers/link-picker';
import { act, fireEvent } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { LinkPickerProps } from '../../..';
import LinkPicker, { testIds } from '../../link-picker';

import { messages as resultsListMessages } from '../../link-picker/link-search-list';

jest.mock('date-fns/differenceInCalendarDays', () => {
  return jest.fn().mockImplementation(() => -5);
});

jest.mock('date-fns/formatDistanceToNow', () => ({
  __esModule: true,
  default: () => 'just a minute',
}));

describe('<LinkPicker />', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupLinkPicker = ({
    url = '',
    plugins,
    ...props
  }: Partial<LinkPickerProps> = {}) => {
    const onSubmitMock: LinkPickerProps['onSubmit'] = jest.fn();
    const onCancelMock: LinkPickerProps['onCancel'] = jest.fn();
    const onContentResize: LinkPickerProps['onContentResize'] = jest.fn();

    render(
      <LinkPicker
        url={url}
        onSubmit={onSubmitMock}
        plugins={plugins ?? []}
        onCancel={onCancelMock}
        onContentResize={onContentResize}
        {...props}
      />,
    );

    return {
      onSubmitMock,
      onCancelMock,
      onContentResize,
      testIds,
    };
  };

  describe('with no plugins', () => {
    it('should submit with valid url in the input field', async () => {
      const { onSubmitMock, testIds } = setupLinkPicker();

      await user.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );
      fireEvent.submit(screen.getByTestId(testIds.urlInputField));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: 'http://www.atlassian.com',
          title: null,
          displayText: null,
          rawUrl: 'www.atlassian.com',
          meta: {
            inputMethod: 'manual',
          },
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    it('should display a valid URL on load', async () => {
      const { testIds } = setupLinkPicker({ url: 'https://www.atlassian.com' });

      expect(screen.getByTestId(testIds.urlInputField)).toHaveValue(
        'https://www.atlassian.com',
      );
    });

    it('should submit with valid url and displayText in the input field', async () => {
      const { onSubmitMock, testIds } = setupLinkPicker();

      await user.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );
      await user.type(screen.getByTestId(testIds.textInputField), 'link');
      fireEvent.submit(screen.getByTestId(testIds.textInputField));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: 'http://www.atlassian.com',
          displayText: 'link',
          title: null,
          meta: {
            inputMethod: 'manual',
          },
          rawUrl: 'www.atlassian.com',
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    it('should NOT display search icon', async () => {
      const { testIds } = setupLinkPicker();

      expect(screen.queryByTestId(testIds.searchIcon)).toBeNull();
    });

    it('should render a Field (URL field) with correct aria-describedby prop', async () => {
      const screenReaderDescriptionId = 'search-recent-links-field-description';
      const { testIds } = setupLinkPicker();

      expect(screen.getByTestId(testIds.urlInputField)).toHaveAttribute(
        'aria-describedby',
        screenReaderDescriptionId,
      );
    });

    it('should NOT display an invalid URL on load', async () => {
      const { testIds } = setupLinkPicker({ url: 'javascript:alert(1)' });

      expect(screen.getByTestId(testIds.urlInputField)).toHaveValue('');
    });

    it('should NOT display a list subtitle', async () => {
      const { testIds } = setupLinkPicker({ url: 'javascript:alert(1)' });

      expect(screen.queryByTestId(testIds.resultListTitle)).toBeNull();
    });

    it('should submit when insert button is clicked', async () => {
      const { testIds, onSubmitMock } = setupLinkPicker();

      await asyncAct(() =>
        user.type(
          screen.getByTestId(testIds.urlInputField),
          'www.atlassian.com',
        ),
      );

      await user.click(screen.getByTestId(testIds.insertButton));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: 'http://www.atlassian.com',
          displayText: null,
          title: null,
          meta: {
            inputMethod: 'manual',
          },
          rawUrl: 'www.atlassian.com',
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    it('should handle event when cancel button is clicked', async () => {
      const { testIds, onCancelMock } = setupLinkPicker();

      await user.click(screen.getByTestId(testIds.cancelButton));

      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });

    it('should NOT display a no-results search message', async () => {
      const { testIds } = setupLinkPicker();

      await user.type(screen.getByTestId(testIds.urlInputField), 'xyz');

      expect(screen.queryByTestId(testIds.emptyResultPage)).toBeNull();
    });

    it('should submit valid edited url and title if provided a url', async () => {
      const { testIds, onSubmitMock } = setupLinkPicker({
        url: 'https://www.google.com',
      });

      await user.click(screen.getByTestId(testIds.clearUrlButton));
      await user.type(
        screen.getByTestId(testIds.urlInputField),
        'https://www.atlassian.com',
      );
      await user.type(screen.getByTestId(testIds.textInputField), 'link');
      fireEvent.submit(screen.getByTestId(testIds.textInputField));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: 'https://www.atlassian.com',
          displayText: 'link',
          title: null,
          meta: {
            inputMethod: 'manual',
          },
          rawUrl: 'https://www.atlassian.com',
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    it('should not submit if provided a valid url and changed to invalid', async () => {
      const { testIds, onSubmitMock } = setupLinkPicker({
        url: 'https://www.atlassian.com',
      });

      await user.click(screen.getByTestId(testIds.clearUrlButton));
      await user.type(screen.getByTestId(testIds.urlInputField), 'foo');

      expect(onSubmitMock).not.toHaveBeenCalled();
      expect(onSubmitMock).not.toHaveBeenCalledWith(
        {
          url: 'foo',
          displayText: null,
          title: null,
          meta: {
            inputMethod: 'manual',
          },
          rawUrl: 'foo',
        },
        expect.any(UIAnalyticsEvent),
      );
    });
  });

  describe('with generic plugin', () => {
    const setupWithGenericPlugin = ({
      ...props
    }: Partial<LinkPickerProps> = {}) => {
      const initialResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 3) },
        done: false,
      });
      const updatedResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(3) },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([
        initialResultPromise,
        updatedResultPromise,
      ]);
      const resolve = jest.spyOn(plugin, 'resolve');

      const { testIds, onSubmitMock, onContentResize } = setupLinkPicker({
        plugins: [plugin],
        ...props,
      });

      return {
        onSubmitMock,
        onContentResize,
        testIds,
        plugin,
        resolve,
      };
    };

    it('should submit with valid url in the input field', async () => {
      const { onSubmitMock, testIds } = setupWithGenericPlugin();

      await user.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );
      fireEvent.submit(screen.getByTestId(testIds.urlInputField));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: 'http://www.atlassian.com',
          displayText: null,
          title: null,
          meta: {
            inputMethod: 'manual',
          },
          rawUrl: 'www.atlassian.com',
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    it('should submit with valid url and title in the input field', async () => {
      const { onSubmitMock, testIds } = setupWithGenericPlugin();

      await user.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );
      await user.type(screen.getByTestId(testIds.textInputField), 'link');
      fireEvent.submit(screen.getByTestId(testIds.textInputField));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: 'http://www.atlassian.com',
          displayText: 'link',
          title: null,
          meta: {
            inputMethod: 'manual',
          },
          rawUrl: 'www.atlassian.com',
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    describe('onContentResize', () => {
      /**
       * Two calls to onContentResize are expected on setup,
       * one for the initial load and one for the isLoading state change
       */
      it('should call callback when picker is loaded', async () => {
        const { onContentResize } = setupWithGenericPlugin();
        expect(onContentResize).toHaveBeenCalledTimes(2);
      });

      // https://product-fabric.atlassian.net/browse/EDM-4550
      it.skip('should call callback when user inputs a url', async () => {
        const { onContentResize } = setupWithGenericPlugin();

        await user.type(
          screen.getByTestId(testIds.urlInputField),
          'www.atlassian.com',
        );
        expect(onContentResize).toHaveBeenCalledTimes(3);
      });

      it('should call callback when results are loaded', async () => {
        const { onContentResize, resolve, plugin } = setupWithGenericPlugin({
          url: 'xyz',
        });
        expect(onContentResize).toHaveBeenCalledTimes(2);

        expect(resolve).toHaveBeenCalledTimes(1);

        await asyncAct(() => plugin.promises[0]);
        await asyncAct(() => plugin.promises[1]);

        expect(onContentResize).toHaveBeenCalledTimes(4);
      });

      // https://product-fabric.atlassian.net/browse/EDM-4550
      it.skip('should call callback when tabs are changed', async () => {
        const promise1 = Promise.resolve(mockedPluginData.slice(0, 1));
        const plugin1 = new MockLinkPickerPromisePlugin({
          tabKey: 'tab1',
          tabTitle: 'tab1',
          promise: promise1,
        });

        const promise2 = Promise.resolve(mockedPluginData.slice(1, 2));
        const plugin2 = new MockLinkPickerPromisePlugin({
          tabKey: 'tab2',
          tabTitle: 'tab2',
          promise: promise2,
        });

        const { onContentResize, testIds } = setupWithGenericPlugin({
          plugins: [plugin1, plugin2],
        });

        expect(onContentResize).toHaveBeenCalledTimes(2);

        await user.click(screen.getAllByTestId(testIds.tabItem)[1]);

        await waitFor(() => {
          expect(onContentResize).toHaveBeenCalledTimes(3);
        });
      });
    });

    it('should not trigger plugin to resolve results and should not be in loading state if provided a `url`', async () => {
      const { testIds, resolve } = setupWithGenericPlugin({
        url: 'https://www.atlassian.com',
      });

      expect(resolve).toHaveBeenCalledTimes(0);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'https://www.atlassian.com',
      });

      expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
    });

    it('should show partial result and a loading spinner if the AsyncGenerator has not totally done', async () => {
      const initialResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 3) },
        done: false,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([
        initialResultPromise,
        new ManualPromise({
          value: { data: [] },
          done: true,
        }),
      ]);
      const resolve = jest.spyOn(plugin, 'resolve');
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });

      await asyncAct(() => initialResultPromise);

      expect(screen.getByTestId(testIds.searchResultList)).toBeInTheDocument();
      expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(3);
      expect(
        screen.getByTestId(testIds.searchResultLoadingIndicator),
      ).toBeInTheDocument();
    });

    it('should begin yielding plugin link results on mount if `url` is not a valid URL', async () => {
      const { resolve, testIds, plugin } = setupWithGenericPlugin({
        url: 'xyz',
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });

      await asyncAct(() => plugin.promises[0]);
      await asyncAct(() => plugin.promises[1]);

      expect(screen.getByTestId(testIds.searchResultList)).toBeInTheDocument();
      expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(5);
      expect(
        screen.queryByTestId(testIds.searchResultLoadingIndicator),
      ).toBeNull();
    });

    it('should support resolve via promise', async () => {
      const plugin = new MockLinkPickerPromisePlugin();
      const resolve = jest.spyOn(plugin, 'resolve');

      const { testIds } = setupWithGenericPlugin({
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(
        screen.getByTestId(testIds.searchResultLoadingIndicator),
      ).toBeInTheDocument();

      await user.type(screen.getByTestId(testIds.urlInputField), 'atlas'),
        // Each character typing would trigger a resolve
        expect(resolve).toHaveBeenCalledTimes(6);
      expect(
        await screen.findByTestId(testIds.searchResultList),
      ).toBeInTheDocument();
      expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(5);
      expect(
        screen.queryByTestId(testIds.searchResultLoadingIndicator),
      ).toBeNull();
    });

    it('should show loading spinner before plugin resolves first results', async () => {
      const { testIds } = setupWithGenericPlugin({
        url: '',
      });

      expect(
        screen.getByTestId(testIds.searchResultLoadingIndicator),
      ).toBeInTheDocument();
    });

    it('should render plugin results in `LinkSearchList` and then remove spinner if plugin is done', async () => {
      const { resolve, testIds, plugin } = setupWithGenericPlugin({
        url: 'xyz',
      });

      await asyncAct(() => plugin.promises[0]);
      await asyncAct(() => plugin.promises[1]);

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(screen.getAllByTestId(testIds.searchResultItem)).toHaveLength(5);
      expect(
        screen.queryByTestId(testIds.searchResultLoadingIndicator),
      ).toBeNull();
    });

    it('should still keep loading spinner until plugin yields all results, then remove spinner', async () => {
      const initialResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 3) },
        done: false,
      });
      const updatedResultPromise = new ManualPromise({
        value: { data: mockedPluginData.slice(0, 2) },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([
        initialResultPromise,
        updatedResultPromise,
      ]);
      const resolve = jest.spyOn(plugin, 'resolve');
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });

      await asyncAct(() => initialResultPromise);

      expect(screen.getByTestId(testIds.searchResultList)).toBeInTheDocument();
      expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(3);
      expect(
        screen.getByTestId(testIds.searchResultLoadingIndicator),
      ).toBeInTheDocument();

      await asyncAct(() => updatedResultPromise.resolve());

      expect(screen.getAllByTestId(testIds.searchResultItem)).toHaveLength(2);
      expect(
        screen.queryByTestId(testIds.searchResultLoadingIndicator),
      ).toBeNull();
    });

    it('should put `isLoading` to `false` when plugin resolve rejects', async () => {
      const initialResultPromise = new ManualPromise({
        value: { data: [] },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
      const resolve = jest.spyOn(plugin, 'resolve');
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => initialResultPromise.reject());

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(
        screen.queryByTestId(testIds.searchResultLoadingIndicator),
      ).toBeNull();
    });

    it('should trigger plugin to yield link results when input query changes', async () => {
      const { resolve, testIds } = setupWithGenericPlugin({
        url: '',
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });

      await user.type(screen.getByTestId(testIds.urlInputField), 'dogs');

      // Each character would trigger a resolve call
      expect(resolve).toHaveBeenCalledTimes(5);
      expect(resolve).toHaveBeenCalledWith({ query: 'dogs' });
    });

    it('should not trigger plugin to yield results and should not be in loading state if provided a `url`', async () => {
      const { resolve, testIds } = setupWithGenericPlugin({
        url: 'https://www.atlassian.com',
      });

      expect(resolve).toHaveBeenCalledTimes(0);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'https://www.atlassian.com',
      });
      expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
    });

    it('should not trigger plugin to yield link results if the input query starts with https://', async () => {
      const { resolve, testIds } = setupWithGenericPlugin({
        url: 'https://',
      });

      expect(resolve).toHaveBeenCalledTimes(0);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'https://',
      });
      expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
    });

    it('should not get plugin to yield link results if the input query starts with http://', async () => {
      const { resolve, testIds } = setupWithGenericPlugin({
        url: 'http://',
      });

      expect(resolve).toHaveBeenCalledTimes(0);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'http://',
      });
      expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
    });

    it('should still request update from plugin when query is emptied after initial state has valid `url`', async () => {
      const { resolve, testIds } = setupWithGenericPlugin({
        url: 'www.atlassian.com',
      });

      await user.click(screen.getByTestId(testIds.clearUrlButton));

      expect(screen.getByTestId(testIds.urlInputField)).toHaveValue('');
      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(1);
    });

    it('should stop yielding results from plugin resolve generator when the query/context changes', async () => {
      const firstResultPromise = new ManualPromise<any>({
        value: { data: [mockedPluginData[0]] },
        done: true,
      });
      const secondResultPromise = new ManualPromise<any>({
        value: { data: [mockedPluginData[1]] },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([
        firstResultPromise,
        secondResultPromise,
      ]);
      const resolve = jest.spyOn(plugin, 'resolve');
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(1);

      await user.type(screen.getByTestId(testIds.urlInputField), 'w'),
        expect(resolve).toHaveBeenCalledTimes(2);

      // We release the first result
      await asyncAct(() =>
        firstResultPromise.resolve({
          value: { data: [mockedPluginData[0]] },
          done: true,
        }),
      );

      // We should still be loading since now the query version is updated
      expect(
        screen.getByTestId(testIds.searchResultLoadingIndicator),
      ).toBeInTheDocument();

      // We release the second result
      await asyncAct(() =>
        secondResultPromise.resolve({
          value: { data: [mockedPluginData[1]] },
          done: true,
        }),
      );

      // The latest result should be displayed
      expect(screen.getByTestId(testIds.searchResultList)).toBeInTheDocument();
      expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(1);
      expect(screen.getByTestId(testIds.searchResultItem)).toHaveTextContent(
        mockedPluginData[1].name,
      );
      expect(
        screen.queryByTestId(testIds.searchResultLoadingIndicator),
      ).toBeNull();
    });

    it('should still request update from plugin when query is emptied', async () => {
      const { resolve, testIds } = setupWithGenericPlugin({
        url: '',
      });

      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(1);

      await user.type(screen.getByTestId(testIds.urlInputField), 'abc');

      expect(resolve).toHaveBeenCalledTimes(4);
      expect(resolve).toHaveBeenCalledWith({ query: 'abc' });

      await user.click(screen.getByTestId(testIds.clearUrlButton));

      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(5);
    });

    it('should submit with selected item when clicked', async () => {
      const initialResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 3) },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
      const { testIds, onSubmitMock } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => initialResultPromise);

      await user.click(screen.getAllByTestId(testIds.searchResultItem)[1]);

      const secondItem = mockedPluginData[1];
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: secondItem.url,
          title: secondItem.name,
          displayText: null,
          meta: {
            inputMethod: 'typeAhead',
          },
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    it('should display Error message when URL is invalid', async () => {
      const { testIds } = setupWithGenericPlugin({
        url: '',
      });

      await user.type(screen.getByTestId(testIds.urlInputField), 'ABC');
      fireEvent.submit(screen.getByTestId(testIds.urlInputField));

      expect(screen.getByTestId(testIds.urlError)).toBeInTheDocument();
    });

    it('should display Error message when URL is empty', async () => {
      const { testIds } = setupWithGenericPlugin({
        url: '',
      });

      act(() => {
        fireEvent.submit(screen.getByTestId(testIds.urlInputField));
      });

      expect(screen.getByTestId(testIds.urlError)).toBeInTheDocument();
    });

    it('should remove invalid URL Error when Input is edited', async () => {
      const { testIds } = setupWithGenericPlugin({
        url: '',
      });

      await user.type(screen.getByTestId(testIds.urlInputField), 'ABC');
      fireEvent.submit(screen.getByTestId(testIds.urlInputField));

      await user.type(screen.getByTestId(testIds.urlInputField), 'D');

      expect(screen.queryByTestId(testIds.urlError)).toBeNull();

      // If value is changed to previous trigger it still should not display error
      fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
        keyCode: 8,
      });
      expect(screen.queryByTestId(testIds.urlError)).toBeNull();
    });

    it('should submit with selected item when navigated to via keyboard and enter is pressed', async () => {
      const initialResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 3) },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
      const { testIds, onSubmitMock } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => initialResultPromise);
      act(() => {
        // Set first item to active
        fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
          keyCode: 40,
        });
      });
      act(() => {
        // Set second item to active
        fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
          keyCode: 40,
        });
      });
      act(() => {
        // Submit
        fireEvent.submit(screen.getByTestId(testIds.urlInputField));
      });

      const secondItem = mockedPluginData[1];
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: secondItem.url,
          displayText: null,
          title: secondItem.name,
          meta: {
            inputMethod: 'typeAhead',
          },
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    it('should populate url field with active item when navigated to via keyboard', async () => {
      const initialResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 3) },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => initialResultPromise);
      act(() => {
        // Set first item to active
        fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
          keyCode: 40,
        });
      });

      expect(screen.getByTestId(testIds.urlInputField)).toHaveValue(
        mockedPluginData[0].url,
      );
    });

    it('should insert the right item after a few interaction with both mouse and keyboard', async () => {
      const initialResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 5) },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => initialResultPromise);

      act(() => {
        // Hover over the first item on the list
        fireEvent.mouseOver(screen.getAllByTestId(testIds.searchResultItem)[0]);
      });
      act(() => {
        // This should move to the second item in the list
        fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
          keyCode: 40,
        });
      });

      const secondItem = mockedPluginData[1];
      expect(screen.getByTestId(testIds.urlInputField)).toHaveValue(
        secondItem.url,
      );
    });

    it('should not submit when URL is invalid and there is no result', async () => {
      const resultPromise = Promise.resolve({
        value: { data: [] },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([
        resultPromise,
        resultPromise,
        resultPromise,
        resultPromise,
      ]);
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      // Set url to invalid
      await user.type(screen.getByTestId(testIds.urlInputField), 'xyz');

      act(() => {
        // This should move to the second item in the list
        fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
          keyCode: 40,
        });
      });

      expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
      expect(screen.getByTestId(testIds.urlInputField)).toHaveValue('xyz');
    });

    it('should submit arbitrary link', async () => {
      const { testIds, onSubmitMock } = setupWithGenericPlugin({
        url: '',
      });

      await user.type(screen.getByTestId(testIds.urlInputField), 'example.com');
      act(() => {
        // Submit
        fireEvent.submit(screen.getByTestId(testIds.urlInputField));
      });

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: 'http://example.com',
          displayText: null,
          title: null,
          meta: {
            inputMethod: 'manual',
          },
          rawUrl: 'example.com',
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    it('should display search icon', async () => {
      const { testIds } = setupWithGenericPlugin({
        url: '',
      });

      expect(screen.getByTestId(testIds.searchIcon)).toBeInTheDocument();
    });

    it('should display a subtitle for recent items', async () => {
      const { testIds, plugin } = setupWithGenericPlugin({
        url: '',
      });

      await asyncAct(() => plugin.promises[0]);
      await asyncAct(() => plugin.promises[1]);

      expect(screen.getByTestId(testIds.resultListTitle)).toHaveTextContent(
        resultsListMessages.titleRecentlyViewed.defaultMessage,
      );
    });

    it('should display a subtitle for search results', async () => {
      const resultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 1) },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([
        resultPromise,
        resultPromise,
        resultPromise,
        resultPromise,
      ]);
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => resultPromise);

      await user.type(screen.getByTestId(testIds.urlInputField), 'do');

      expect(
        await screen.findByTestId(testIds.resultListTitle),
      ).toHaveTextContent(resultsListMessages.titleResults.defaultMessage);
    });

    it('should submit when insert button is clicked', async () => {
      const { testIds, onSubmitMock } = setupWithGenericPlugin({
        url: '',
      });

      await user.type(screen.getByTestId(testIds.urlInputField), 'example.com');

      await user.click(screen.getByTestId(testIds.insertButton));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          url: 'http://example.com',
          displayText: null,
          title: null,
          meta: {
            inputMethod: 'manual',
          },
          rawUrl: 'example.com',
        },
        expect.any(UIAnalyticsEvent),
      );
    });

    it('should display a message if search returns no results and state is not loading', async () => {
      const resultPromise = Promise.resolve({
        value: { data: [] },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([
        resultPromise,
        resultPromise,
        resultPromise,
        resultPromise,
      ]);
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => resultPromise);

      await user.type(screen.getByTestId(testIds.urlInputField), 'xyz');

      expect(
        await screen.findByTestId(testIds.emptyResultPage),
      ).toBeInTheDocument();
    });

    it('should not display a no-result search message when inserting a valid URL', async () => {
      const resultPromise = Promise.resolve({
        value: { data: [] },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin(
        Array(20).fill(resultPromise),
      );
      const { testIds } = setupWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await user.type(
        screen.getByTestId(testIds.urlInputField),
        'http://google.com',
      );

      expect(screen.queryByTestId(testIds.emptyResultPage)).toBeNull();
    });

    describe('Tab UI', () => {
      it('should render the Tab UI if there were multiple plugins with tabTitle available', async () => {
        const plugin1 = new MockLinkPickerPromisePlugin({
          tabKey: 'tab1',
          tabTitle: 'tab1',
        });
        const plugin2 = new MockLinkPickerPromisePlugin({
          tabKey: 'tab2',
          tabTitle: 'tab2',
        });

        const { testIds } = setupWithGenericPlugin({
          plugins: [plugin1, plugin2],
        });

        expect(screen.getByTestId(testIds.tabList)).toBeInTheDocument();
        const tabItems = screen.getAllByTestId(testIds.tabItem);
        expect(tabItems).toHaveLength(2);
        expect(tabItems[0]).toHaveTextContent('tab1');
        expect(tabItems[1]).toHaveTextContent('tab2');
      });

      it('should NOT render TAB UI if there was only one plugin', async () => {
        const plugin1 = new MockLinkPickerPromisePlugin({
          tabKey: 'tab1',
          tabTitle: 'tab1',
        });

        const { testIds } = setupWithGenericPlugin({
          plugins: [plugin1],
        });

        expect(screen.queryByTestId(testIds.tabList)).toBeNull();
      });

      it('should only show the items from the first plugin when loaded', async () => {
        const promise1 = Promise.resolve(mockedPluginData.slice(0, 1));
        const plugin1 = new MockLinkPickerPromisePlugin({
          tabKey: 'tab1',
          tabTitle: 'tab1',
          promise: promise1,
        });
        const promise2 = Promise.resolve(mockedPluginData.slice(1, 2));
        const plugin2 = new MockLinkPickerPromisePlugin({
          tabKey: 'tab2',
          tabTitle: 'tab2',
          promise: promise2,
        });

        const resolve1 = jest.spyOn(plugin1, 'resolve');
        const resolve2 = jest.spyOn(plugin2, 'resolve');

        const { testIds } = setupWithGenericPlugin({
          plugins: [plugin1, plugin2],
        });

        expect(resolve1).toBeCalledTimes(1);
        expect(resolve2).not.toHaveBeenCalled();

        await asyncAct(() => promise1);

        expect(
          await screen.findAllByTestId(testIds.searchResultItem),
        ).toHaveLength(1);
        expect(screen.getByTestId(testIds.searchResultItem)).toHaveTextContent(
          mockedPluginData[0].name,
        );
      });

      it('should load and show the items from the second plugin when second tab was clicked', async () => {
        const promise1 = Promise.resolve(mockedPluginData.slice(0, 1));
        const plugin1 = new MockLinkPickerPromisePlugin({
          tabKey: 'tab1',
          tabTitle: 'tab1',
          promise: promise1,
        });

        const promise2 = Promise.resolve(mockedPluginData.slice(1, 2));
        const plugin2 = new MockLinkPickerPromisePlugin({
          tabKey: 'tab2',
          tabTitle: 'tab2',
          promise: promise2,
        });

        const resolve1 = jest.spyOn(plugin1, 'resolve');
        const resolve2 = jest.spyOn(plugin2, 'resolve');

        const { testIds } = setupWithGenericPlugin({
          plugins: [plugin1, plugin2],
        });

        await user.click(screen.getAllByTestId(testIds.tabItem)[1]);

        expect(resolve1).toBeCalledTimes(1);
        expect(resolve2).toBeCalledTimes(1);

        await asyncAct(() => promise2);

        expect(
          await screen.findAllByTestId(testIds.searchResultItem),
        ).toHaveLength(1);
        expect(screen.getByTestId(testIds.searchResultItem)).toHaveTextContent(
          mockedPluginData[1].name,
        );
      });
    });

    describe('on Error', () => {
      it('should use errorFallback if provided with plugin', async () => {
        const FallbackUI = (props: { error: unknown; retry: () => void }) => {
          const { retry, error } = props;
          const message = error instanceof Error ? error.message : 'Try again';
          return (
            <button data-testid="mocked-fallback-action" onClick={retry}>
              {message}
            </button>
          );
        };

        const plugin1 = new UnstableMockLinkPickerPlugin({
          tabKey: 'tab1',
          tabTitle: 'Unstable',
          errorFallback: (error, retry) => (
            <FallbackUI error={error} retry={retry} />
          ),
        });
        const resolve1 = jest.spyOn(plugin1, 'resolve');

        const { testIds } = setupWithGenericPlugin({
          plugins: [plugin1],
        });

        await screen.findByTestId(testIds.linkPicker);
        const retryAction = await screen.findByTestId('mocked-fallback-action');
        expect(retryAction).toBeInTheDocument();
        expect(
          screen.queryByTestId(testIds.searchError),
        ).not.toBeInTheDocument();

        await user.click(retryAction);

        await screen.findByTestId(testIds.searchResultList);
        expect(resolve1).toBeCalledTimes(2);
        expect(screen.getAllByTestId(testIds.searchResultItem)).toHaveLength(5);
      });

      it('should use default error message if provided errorFallback returns null', async () => {
        const plugins = [
          new UnstableMockLinkPickerPlugin({
            tabKey: 'tab1',
            tabTitle: 'Unstable',
            errorFallback: (error, retry) => null,
          }),
        ];

        const { testIds } = setupWithGenericPlugin({
          plugins,
        });

        await screen.findByTestId(testIds.linkPicker);

        expect(
          await screen.findByTestId(testIds.searchError),
        ).toBeInTheDocument();
      });
    });
  });

  describe('with root component', () => {
    it('should render the default root component if nothing was specified', async () => {
      const { testIds } = setupLinkPicker();

      expect(screen.getByTestId(testIds.linkPickerRoot)).toBeInTheDocument();
    });

    it('should render a customized root component', async () => {
      const CustomRootComponent: React.ComponentType<Partial<
        LinkPickerProps
      >> = ({ children }) => {
        return <div data-testid="custom-test-id">{children}</div>;
      };
      setupLinkPicker({
        component: CustomRootComponent,
      });

      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('should allow the customized root component to overwrite the plugins prop', async () => {
      const plugin1 = new MockLinkPickerPromisePlugin({
        tabKey: 'tab1',
        tabTitle: 'tab1',
      });
      const plugin2 = new MockLinkPickerPromisePlugin({
        tabKey: 'tab2',
        tabTitle: 'tab2',
      });
      const CustomRootComponent: React.ComponentType<
        Partial<LinkPickerProps> & { children: React.ReactElement }
      > = ({ children }) => {
        return React.cloneElement(children, {
          plugins: [plugin1, plugin2],
        });
      };

      setupLinkPicker({
        component: CustomRootComponent,
        plugins: [plugin1],
      });

      expect(screen.getByTestId(testIds.tabList)).toBeInTheDocument();
      const tabItems = screen.getAllByTestId(testIds.tabItem);
      expect(tabItems).toHaveLength(2);
    });
  });
});
