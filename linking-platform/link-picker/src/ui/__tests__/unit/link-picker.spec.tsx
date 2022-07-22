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
} from '@atlaskit/link-test-helpers/link-picker';
import { act, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import { LinkPicker, LinkPickerPlugin, LinkPickerProps } from '../../../';

import { messages } from '../../link-picker/messages';

jest.mock('date-fns/differenceInCalendarDays', () => {
  return jest.fn().mockImplementation(() => -5);
});

jest.mock('date-fns/formatDistanceToNow', () => ({
  __esModule: true,
  default: () => 'just a minute',
}));

describe('<LinkPicker />', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  interface SetupArgumentObject {
    url?: string;
    waitForResolves?: boolean;
    plugins?: LinkPickerPlugin[];
  }

  const setupLinkPicker = ({ url = '', plugins }: SetupArgumentObject = {}) => {
    const onSubmitMock: LinkPickerProps['onSubmit'] = jest.fn();
    const onCancelMock: LinkPickerProps['onCancel'] = jest.fn();

    render(
      <LinkPicker
        url={url}
        onSubmit={onSubmitMock}
        plugins={plugins ?? []}
        onCancel={onCancelMock}
      />,
    );

    return {
      onSubmitMock,
      onCancelMock,
      testIds: {
        urlInputField: 'link-url',
        textInputField: 'link-text',
        searchIcon: 'link-picker-search-icon',
        insertButton: 'link-picker-insert-button',
        cancelButton: 'link-picker-cancel-button',
        clearUrlButton: 'clear-text',
        resultListTitle: 'link-picker-list-title',
        emptyResultPage: 'link-search-no-results',
        searchResultList: 'link-search-list',
        searchResultItem: 'link-search-list-item',
        searchResultLoadingIndicator: 'link-picker.results-loading-indicator',
        urlError: 'link-error',
        errorBoundary: 'link-picker-root-error-boundary-ui',
      },
    };
  };

  describe('with no plugins', () => {
    it('should submit with valid url in the input field', async () => {
      const { onSubmitMock, testIds } = setupLinkPicker();

      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );
      fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
        keyCode: 13,
      });

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: 'http://www.atlassian.com',
        title: null,
        displayText: null,
        rawUrl: 'www.atlassian.com',
        meta: {
          inputMethod: 'manual',
        },
      });
    });

    it('should display a valid URL on load', async () => {
      const { testIds } = setupLinkPicker({ url: 'https://www.atlassian.com' });

      expect(screen.getByTestId(testIds.urlInputField)).toHaveValue(
        'https://www.atlassian.com',
      );
    });

    it('should submit with valid url and displayText in the input field', async () => {
      const { onSubmitMock, testIds } = setupLinkPicker();

      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );
      await userEvent.type(screen.getByTestId(testIds.textInputField), 'link');
      fireEvent.keyDown(screen.getByTestId(testIds.textInputField), {
        keyCode: 13,
      });

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: 'http://www.atlassian.com',
        displayText: 'link',
        title: null,
        meta: {
          inputMethod: 'manual',
        },
        rawUrl: 'www.atlassian.com',
      });
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

      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );
      userEvent.click(screen.getByTestId(testIds.insertButton));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: 'http://www.atlassian.com',
        displayText: null,
        title: null,
        meta: {
          inputMethod: 'manual',
        },
        rawUrl: 'www.atlassian.com',
      });
    });

    it('should handle event when cancel button is clicked', async () => {
      const { testIds, onCancelMock } = setupLinkPicker();

      userEvent.click(screen.getByTestId(testIds.cancelButton));

      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });

    it('should NOT display a no-results search message', async () => {
      const { testIds } = setupLinkPicker();

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'xyz');

      expect(screen.queryByTestId(testIds.emptyResultPage)).toBeNull();
    });

    it('should submit valid edited url and title if provided a url', async () => {
      const { testIds, onSubmitMock } = setupLinkPicker({
        url: 'https://www.google.com',
      });

      userEvent.click(screen.getByTestId(testIds.clearUrlButton));
      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'https://www.atlassian.com',
      );
      await userEvent.type(screen.getByTestId(testIds.textInputField), 'link');
      fireEvent.keyDown(screen.getByTestId(testIds.textInputField), {
        keyCode: 13,
      });

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: 'https://www.atlassian.com',
        displayText: 'link',
        title: null,
        meta: {
          inputMethod: 'manual',
        },
        rawUrl: 'https://www.atlassian.com',
      });
    });

    it('should not submit if provided a valid url and changed to invalid', async () => {
      const { testIds, onSubmitMock } = setupLinkPicker({
        url: 'https://www.atlassian.com',
      });

      userEvent.click(screen.getByTestId(testIds.clearUrlButton));
      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'foo');

      expect(onSubmitMock).not.toHaveBeenCalled();
      expect(onSubmitMock).not.toHaveBeenCalledWith({
        url: 'foo',
        displayText: null,
        title: null,
        meta: {
          inputMethod: 'manual',
        },
        rawUrl: 'foo',
      });
    });
  });

  describe('with generic plugin', () => {
    const setupLinkPickerWithGenericPlugin = ({
      ...rest
    }: SetupArgumentObject = {}) => {
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

      const { testIds, onSubmitMock } = setupLinkPicker({
        plugins: [plugin],
        ...rest,
      });

      return {
        onSubmitMock,
        testIds,
        plugin,
        resolve,
      };
    };

    it('should submit with valid url in the input field', async () => {
      const { onSubmitMock, testIds } = setupLinkPickerWithGenericPlugin();

      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );
      fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
        keyCode: 13,
      });

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: 'http://www.atlassian.com',
        displayText: null,
        title: null,
        meta: {
          inputMethod: 'manual',
        },
        rawUrl: 'www.atlassian.com',
      });
    });

    it('should submit with valid url and title in the input field', async () => {
      const { onSubmitMock, testIds } = setupLinkPickerWithGenericPlugin();

      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );
      await userEvent.type(screen.getByTestId(testIds.textInputField), 'link');
      fireEvent.keyDown(screen.getByTestId(testIds.textInputField), {
        keyCode: 13,
      });

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: 'http://www.atlassian.com',
        displayText: 'link',
        title: null,
        meta: {
          inputMethod: 'manual',
        },
        rawUrl: 'www.atlassian.com',
      });
    });

    it('should not trigger plugin to resolve results and should not be in loading state if provided a `url`', async () => {
      const { testIds, resolve } = setupLinkPickerWithGenericPlugin({
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
      const { testIds } = setupLinkPickerWithGenericPlugin({
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
      const { resolve, testIds, plugin } = setupLinkPickerWithGenericPlugin({
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

      const { testIds } = setupLinkPickerWithGenericPlugin({
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(
        screen.getByTestId(testIds.searchResultLoadingIndicator),
      ).toBeInTheDocument();

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'atlas');

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
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      expect(
        screen.getByTestId(testIds.searchResultLoadingIndicator),
      ).toBeInTheDocument();
    });

    it('should render plugin results in `LinkSearchList` and then remove spinner if plugin is done', async () => {
      const { resolve, testIds, plugin } = setupLinkPickerWithGenericPlugin({
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
      const { testIds } = setupLinkPickerWithGenericPlugin({
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
      const { testIds } = setupLinkPickerWithGenericPlugin({
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
      const { resolve, testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'dogs');

      // Each character would trigger a resolve call
      expect(resolve).toHaveBeenCalledTimes(5);
      expect(resolve).toHaveBeenCalledWith({ query: 'dogs' });
    });

    it('should not trigger plugin to yield results and should not be in loading state if provided a `url`', async () => {
      const { resolve, testIds } = setupLinkPickerWithGenericPlugin({
        url: 'https://www.atlassian.com',
      });

      expect(resolve).toHaveBeenCalledTimes(0);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'https://www.atlassian.com',
      });
      expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
    });

    it('should not trigger plugin to yield link results if the input query starts with https://', async () => {
      const { resolve, testIds } = setupLinkPickerWithGenericPlugin({
        url: 'https://',
      });

      expect(resolve).toHaveBeenCalledTimes(0);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'https://',
      });
      expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
    });

    it('should not get plugin to yield link results if the input query starts with http://', async () => {
      const { resolve, testIds } = setupLinkPickerWithGenericPlugin({
        url: 'http://',
      });

      expect(resolve).toHaveBeenCalledTimes(0);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'http://',
      });
      expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
    });

    it('should still request update from plugin when query is emptied after initial state has valid `url`', async () => {
      const { resolve, testIds } = setupLinkPickerWithGenericPlugin({
        url: 'www.atlassian.com',
      });

      userEvent.click(screen.getByTestId(testIds.clearUrlButton));

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
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(1);

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'w');

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

      // We rlease the second result
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
      const { resolve, testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(1);

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'abc');

      expect(resolve).toHaveBeenCalledTimes(4);
      expect(resolve).toHaveBeenCalledWith({ query: 'abc' });

      userEvent.click(screen.getByTestId(testIds.clearUrlButton));

      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(5);
    });

    it('should submit with selected item when clicked', async () => {
      const initialResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 3) },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
      const { testIds, onSubmitMock } = setupLinkPickerWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => initialResultPromise);

      userEvent.click(screen.getAllByTestId(testIds.searchResultItem)[1]);

      const secondItem = mockedPluginData[1];
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: secondItem.url,
        title: secondItem.name,
        displayText: null,
        meta: {
          inputMethod: 'typeAhead',
        },
      });
    });

    it('should display Error message when URL is invalid', async () => {
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'ABC');
      fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
        keyCode: 13,
      });

      expect(screen.getByTestId(testIds.urlError)).toBeInTheDocument();
    });

    it('should display Error message when URL is empty', async () => {
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      act(() => {
        fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
          keyCode: 13,
        });
      });

      expect(screen.getByTestId(testIds.urlError)).toBeInTheDocument();
    });

    it('should remove invalid URL Error when Input is edited', async () => {
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'ABC');
      fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
        keyCode: 13,
      });

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'D');

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
      const { testIds, onSubmitMock } = setupLinkPickerWithGenericPlugin({
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
        fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
          keyCode: 13,
        });
      });

      const secondItem = mockedPluginData[1];
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: secondItem.url,
        displayText: null,
        title: secondItem.name,
        meta: {
          inputMethod: 'typeAhead',
        },
      });
    });

    it('should populate url field with active item when navigated to via keyboard', async () => {
      const initialResultPromise = Promise.resolve({
        value: { data: mockedPluginData.slice(0, 3) },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
      const { testIds } = setupLinkPickerWithGenericPlugin({
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
      const { testIds } = setupLinkPickerWithGenericPlugin({
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
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      // Set url to invalid
      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'xyz');

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
      const { testIds, onSubmitMock } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'example.com',
      );
      act(() => {
        // This should move to the second item in the list
        fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
          keyCode: 13,
        });
      });

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: 'http://example.com',
        displayText: null,
        title: null,
        meta: {
          inputMethod: 'manual',
        },
        rawUrl: 'example.com',
      });
    });

    it('should display search icon', async () => {
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      expect(screen.getByTestId(testIds.searchIcon)).toBeInTheDocument();
    });

    it('should display a subtitle for recent items', async () => {
      const { testIds, plugin } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      await asyncAct(() => plugin.promises[0]);
      await asyncAct(() => plugin.promises[1]);

      expect(screen.getByTestId(testIds.resultListTitle)).toHaveTextContent(
        messages.titleRecentlyViewed.defaultMessage,
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
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => resultPromise);

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'do');

      expect(screen.getByTestId(testIds.resultListTitle)).toHaveTextContent(
        messages.titleResults.defaultMessage,
      );
    });

    it('should submit when insert button is clicked', async () => {
      const { testIds, onSubmitMock } = setupLinkPickerWithGenericPlugin({
        url: '',
      });

      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'example.com',
      );

      userEvent.click(screen.getByTestId(testIds.insertButton));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        url: 'http://example.com',
        displayText: null,
        title: null,
        meta: {
          inputMethod: 'manual',
        },
        rawUrl: 'example.com',
      });
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
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await asyncAct(() => resultPromise);

      await userEvent.type(screen.getByTestId(testIds.urlInputField), 'xyz');

      expect(screen.getByTestId(testIds.emptyResultPage)).toBeInTheDocument();
    });

    it('should not display a no-result search message when inserting a valid URL', async () => {
      const resultPromise = Promise.resolve({
        value: { data: [] },
        done: true,
      });
      const plugin = new MockLinkPickerGeneratorPlugin(
        Array(20).fill(resultPromise),
      );
      const { testIds } = setupLinkPickerWithGenericPlugin({
        url: '',
        plugins: [plugin],
      });

      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'http://google.com',
      );

      expect(screen.queryByTestId(testIds.emptyResultPage)).toBeNull();
    });
  });

  describe('error boundary', () => {
    it('renders a fallback ui if the inner link picker component throws an error', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // Provide an invalid initial prop to throw an error
      const { testIds } = setupLinkPicker({
        url: new URL('https://atlassian.com') as any,
      });

      expect(screen.getByTestId(testIds.errorBoundary)).toBeInTheDocument();
    });
  });
});
