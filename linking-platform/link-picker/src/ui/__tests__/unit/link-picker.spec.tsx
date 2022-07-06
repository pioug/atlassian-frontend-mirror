import React from 'react';

import { flushPromises, mountWithIntl } from '@atlaskit/link-test-helpers';

import { LinkPickerPlugin, ResolveResult } from '../../../types';
import { LinkPickerWithIntl, LinkPickerProps } from '../../link-picker';
import LinkSearchList from '../../link-search-list';
import PanelTextInput from '../../text-input';
import {
  getDefaultItems,
  MockLinkPickerPlugin,
  ManualPromise,
} from '../__helpers';
import { messages } from '../../../messages';

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
    plugins?: [LinkPickerPlugin];
  }

  const setup = async ({
    plugins,
    waitForResolves = true,
    url = '',
  }: SetupArgumentObject = {}) => {
    const eventListenerMap: {
      [prop: string]: EventListenerOrEventListenerObject;
    } = {};

    document.addEventListener = jest.fn((event, cb) => {
      eventListenerMap[event] = cb;
    });

    const onSubmit: LinkPickerProps['onSubmit'] = jest.fn();
    const onCancel: LinkPickerProps['onCancel'] = jest.fn();

    const component = mountWithIntl(
      <LinkPickerWithIntl
        url={url}
        onSubmit={onSubmit}
        plugins={plugins}
        onCancel={onCancel}
      />,
    );

    const waitFor = async (...promises: Promise<unknown>[]) => {
      await Promise.all(promises);
      await flushPromises();
      component.update();
    };

    if (waitForResolves) {
      await flushPromises();
      component.update();
    }

    const updateInputField = (testId: string, value: string) => {
      const linkUrlInput = component.find(`input[data-testid="${testId}"]`);
      (linkUrlInput.getDOMNode() as HTMLInputElement).value = value;
      linkUrlInput.simulate('change', {
        target: { name: undefined, value },
      });
    };

    const updateInputFieldWithStateUpdated = async (
      testId: string,
      value: string,
    ) => {
      updateInputField(testId, value);
      await flushPromises();
    };

    const pressReturnInputField = (testId: string) => {
      const linkUrlInput = component.find(`input[data-testid="${testId}"]`);
      linkUrlInput.simulate('keydown', {
        keyCode: 13,
      });
    };

    const pressDownArrowInputField = (testId: string) => {
      const linkUrlInput = component.find(`input[data-testid="${testId}"]`);
      linkUrlInput.simulate('keydown', {
        keyCode: 40,
      });
    };

    return {
      component,
      onSubmit,
      onCancel,
      waitFor,
      eventListenerMap,
      updateInputField,
      updateInputFieldWithStateUpdated,
      pressReturnInputField,
      pressDownArrowInputField,
    };
  };

  describe('with no plugins', () => {
    it('should submit with valid url in the input field', async () => {
      const {
        component,
        onSubmit,
        pressReturnInputField,
        updateInputFieldWithStateUpdated,
      } = await setup();

      await updateInputFieldWithStateUpdated('link-url', 'www.atlassian.com');
      pressReturnInputField('link-url');
      component.update();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
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
      const { component } = await setup({
        url: 'https://www.atlassian.com',
      });

      expect(
        (component
          .find('input[data-testid="link-url"]')
          .getDOMNode() as HTMLInputElement).value,
      ).toBe('https://www.atlassian.com');
    });

    it('should submit with valid url and title in the input field', async () => {
      const {
        component,
        onSubmit,
        pressReturnInputField,
        updateInputFieldWithStateUpdated,
      } = await setup();

      await updateInputFieldWithStateUpdated('link-url', 'www.atlassian.com');
      await updateInputFieldWithStateUpdated('link-text', 'link');
      pressReturnInputField('link-text');
      component.update();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
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
      const { component } = await setup();
      const searchIcon = component.find(
        '[data-testid="link-url-container"] [data-testid="link-picker-search-icon"]',
      );

      expect(searchIcon.exists()).toBe(false);
    });

    it('should render a Field (URL field) with correct aria-describedby prop', async () => {
      const screenReaderDescriptionId = 'search-recent-links-field-description';
      const { component } = await setup();

      expect(
        component.find(PanelTextInput).first().prop('aria-describedby'),
      ).toEqual(screenReaderDescriptionId);
    });

    it('should render LinkSearchList component with correct ariaControls prop', async () => {
      const ariaControlValue = 'fabric.smartcard.linkpicker.suggested.results';
      const { component } = await setup();

      expect(component.find(LinkSearchList).prop('ariaControls')).toEqual(
        ariaControlValue,
      );
    });

    it('should NOT display an invalid URL on load', async () => {
      const { component } = await setup({
        url: 'javascript:alert(1)',
      });

      expect(
        (component
          .find('input[data-testid="link-url"]')
          .getDOMNode() as HTMLInputElement).value,
      ).toBe('');
    });

    it('should NOT display a list subtitle', async () => {
      const { component } = await setup({
        url: 'javascript:alert(1)',
      });
      const subtitle = component.find(
        '[data-testid="link-picker-list-subtitle"]',
      );

      expect(subtitle.exists()).toBe(false);
    });

    it('should submit when insert button is clicked', async () => {
      const {
        component,
        onSubmit,
        updateInputFieldWithStateUpdated,
      } = await setup();

      await updateInputFieldWithStateUpdated('link-url', 'www.atlassian.com');
      component
        .find('[data-testid="link-picker-insert-button"]')
        .at(1)
        .simulate('click');
      component.update();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
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
      const { component, onCancel } = await setup();

      component
        .find('[data-testid="link-picker-cancel-button"]')
        .at(1)
        .simulate('click');

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('with generic plugin', () => {
    const setupWithGenericPlugin = async ({
      plugins,
      ...rest
    }: SetupArgumentObject = {}) => {
      const plugin: LinkPickerPlugin = plugins
        ? plugins[0]
        : new MockLinkPickerPlugin();
      const resolve = jest.spyOn(plugin, 'resolve');

      return {
        ...(await setup({
          plugins: plugins ?? [plugin],
          ...rest,
        })),
        resolve,
      };
    };

    it('should submit with valid url in the input field', async () => {
      const {
        component,
        onSubmit,
        pressReturnInputField,
        updateInputFieldWithStateUpdated,
      } = await setupWithGenericPlugin();

      await updateInputFieldWithStateUpdated('link-url', 'www.atlassian.com');
      pressReturnInputField('link-url');
      component.update();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
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
      const {
        component,
        onSubmit,
        pressReturnInputField,
        updateInputFieldWithStateUpdated,
      } = await setupWithGenericPlugin();

      await updateInputFieldWithStateUpdated('link-url', 'www.atlassian.com');
      await updateInputFieldWithStateUpdated('link-text', 'link');
      pressReturnInputField('link-text');
      component.update();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
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
      const plugin = new MockLinkPickerPlugin();
      const resolve = jest.spyOn(plugin, 'resolve');

      const { component } = await setup({
        url: 'https://www.atlassian.com',
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(0);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'https://www.atlassian.com',
      });

      const { items, isLoading } = component.find(LinkSearchList).props();
      expect(isLoading).toBe(false);
      expect(items).toHaveLength(0);
    });

    it('should begin yielding plugin link results on mount if `url` is not a valid URL', async () => {
      const { resolve } = await setupWithGenericPlugin({
        url: 'xyz',
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });
    });

    it('should support resolve via promise', async () => {
      const promise = new ManualPromise();
      const results: ResolveResult = { data: [] };
      const resolve = jest.fn();
      resolve.mockImplementationOnce(() => promise);

      const {
        component,
        updateInputFieldWithStateUpdated,
        waitFor,
      } = await setup({
        plugins: [{ resolve }],
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(component.find(LinkSearchList).props().isLoading).toBe(true);
      await updateInputFieldWithStateUpdated('link-url', 'atlas');
      expect(resolve).toHaveBeenCalledTimes(2);

      await waitFor(promise.resolve(results));
      const list = () => component.find(LinkSearchList);
      expect(list().prop('isLoading')).toBe(false);
      expect(list().prop('items')).toEqual(results.data);
    });

    it('should have `isLoading` before plugin resolves first results', async () => {
      const { component } = await setupWithGenericPlugin({
        waitForResolves: false,
      });

      expect(component.find(LinkSearchList).props().isLoading).toBe(true);
    });

    it('should render plugin results in `LinkSearchList` and then put `isLoading` to false if plugin is done', async () => {
      const itemsPromise = new ManualPromise<ResolveResult['data']>();
      const plugin = new MockLinkPickerPlugin();
      const getResults = jest
        .spyOn(plugin, 'fetchUpdatedResults')
        .mockReturnValue(itemsPromise);

      const { component, waitFor } = await setup({
        waitForResolves: false,
        url: '',
        plugins: [plugin],
      });

      expect(getResults).toHaveBeenCalledTimes(0);
      expect(component.find(LinkSearchList).props().isLoading).toBe(true);

      const results = getDefaultItems(5);
      await waitFor(itemsPromise.resolve(results));

      expect(getResults).toHaveBeenCalledTimes(1);
      expect(component.find(LinkSearchList).props().isLoading).toBe(false);
      expect(component.find(LinkSearchList).props().items).toStrictEqual(
        results,
      );
    });

    it('should still keep `isLoading` as `true` until plugin yields all results, then put `isLoading` to `false`', async () => {
      const initialResultsPromise = new ManualPromise<[]>();
      const updatedResultsPromise = new ManualPromise<[]>();
      const plugin = new MockLinkPickerPlugin();

      const getInitialResults = jest
        .spyOn(plugin, 'getInitialResults')
        .mockReturnValue(initialResultsPromise);

      const fetchUpdatedResults = jest
        .spyOn(plugin, 'fetchUpdatedResults')
        .mockReturnValue(updatedResultsPromise);

      const { component, waitFor } = await setup({
        waitForResolves: false,
        url: '',
        plugins: [plugin],
      });

      expect(getInitialResults).toHaveBeenCalledTimes(1);
      expect(fetchUpdatedResults).toHaveBeenCalledTimes(0);
      expect(component.find(LinkSearchList).props().isLoading).toBe(true);

      await waitFor(initialResultsPromise.resolve([]));

      expect(getInitialResults).toHaveBeenCalledTimes(1);
      expect(fetchUpdatedResults).toHaveBeenCalledTimes(1);
      expect(component.find(LinkSearchList).props().isLoading).toBe(true);

      await waitFor(updatedResultsPromise.resolve([]));

      expect(getInitialResults).toHaveBeenCalledTimes(1);
      expect(fetchUpdatedResults).toHaveBeenCalledTimes(1);
      expect(component.find(LinkSearchList).props().isLoading).toBe(false);
    });

    it('should put `isLoading` to `false` when plugin resolve rejects', async () => {
      const initialResultsPromise = new ManualPromise<[]>();
      const updatedResultsPromise = new ManualPromise<[]>();
      const plugin = new MockLinkPickerPlugin();

      const getInitialResults = jest
        .spyOn(plugin, 'getInitialResults')
        .mockReturnValue(initialResultsPromise);

      const fetchUpdatedResults = jest
        .spyOn(plugin, 'fetchUpdatedResults')
        .mockReturnValue(updatedResultsPromise);

      const { component, waitFor } = await setup({
        waitForResolves: false,
        plugins: [plugin],
      });

      expect(getInitialResults).toHaveBeenCalledTimes(1);
      expect(fetchUpdatedResults).toHaveBeenCalledTimes(0);
      expect(component.find(LinkSearchList).props().isLoading).toBe(true);

      await waitFor(initialResultsPromise.resolve([]));

      expect(getInitialResults).toHaveBeenCalledTimes(1);
      expect(fetchUpdatedResults).toHaveBeenCalledTimes(1);
      expect(component.find(LinkSearchList).props().isLoading).toBe(true);

      await expect(
        waitFor(updatedResultsPromise.reject()),
      ).rejects.toBeInstanceOf(Error);
      component.update();

      expect(getInitialResults).toHaveBeenCalledTimes(1);
      expect(fetchUpdatedResults).toHaveBeenCalledTimes(1);
      expect(component.find(LinkSearchList).props().isLoading).toBe(false);
    });

    it('should trigger plugin to yield link results when input query changes', async () => {
      const plugin = new MockLinkPickerPlugin();
      const resolve = jest
        .spyOn(plugin, 'resolve')
        .mockImplementation(async function* () {
          yield { data: [] };
          return { data: [] };
        });

      const { component, updateInputFieldWithStateUpdated } = await setup({
        url: '',
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });

      await updateInputFieldWithStateUpdated('link-url', 'dogs');
      component.update();

      expect(resolve).toHaveBeenCalledTimes(2);
      expect(resolve).toHaveBeenCalledWith({ query: 'dogs' });
    });

    it('should not trigger plugin to yield results and should not be in loading state if provided a `url`', async () => {
      const plugin = new MockLinkPickerPlugin();
      const resolve = jest
        .spyOn(plugin, 'resolve')
        .mockImplementation(async function* () {
          yield { data: [] };
          return { data: [] };
        });

      const { component } = await setup({
        url: 'https://www.atlassian.com',
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(0);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'https://www.atlassian.com',
      });

      const items = component.find(LinkSearchList).props().items;
      if (!items) {
        return expect(items).toBeDefined();
      }
      expect(items).toHaveLength(0);
    });

    it('should not trigger plugin to yield link results if the input query starts with https://', async () => {
      const plugin = new MockLinkPickerPlugin();
      const resolve = jest
        .spyOn(plugin, 'resolve')
        .mockImplementation(async function* () {
          yield { data: [] };
          return { data: [] };
        });

      const { component, updateInputFieldWithStateUpdated } = await setup({
        url: '',
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });

      await updateInputFieldWithStateUpdated(
        'link-url',
        'https://www.atlassian.com',
      );

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'https://www.atlassian.com',
      });

      const items = component.find(LinkSearchList).prop('items')!;
      expect(items).toHaveLength(0);
    });

    it('should not get plugin to yield link results if the input query starts with http://', async () => {
      const plugin = new MockLinkPickerPlugin();
      const resolve = jest
        .spyOn(plugin, 'resolve')
        .mockImplementation(async function* () {
          yield { data: [] };
          return { data: [] };
        });

      const { component, updateInputFieldWithStateUpdated } = await setup({
        url: '',
        plugins: [plugin],
      });

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({ query: '' });

      await updateInputFieldWithStateUpdated(
        'link-url',
        'http://www.atlassian.com',
      );

      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).not.toHaveBeenCalledWith({
        query: 'http://www.atlassian.com',
      });

      const items = component.find(LinkSearchList).prop('items');
      expect(items).toBeDefined();
      expect(items).toHaveLength(0);
    });

    it('should still request update from plugin when query is emptied', async () => {
      const plugin = new MockLinkPickerPlugin();
      const resolve = jest.spyOn(plugin, 'resolve');

      const { updateInputFieldWithStateUpdated } = await setup({
        plugins: [plugin],
        url: '',
      });

      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(1);

      await updateInputFieldWithStateUpdated('link-url', 'abc');

      expect(resolve).toHaveBeenCalledWith({ query: 'abc' });
      expect(resolve).toHaveBeenCalledTimes(2);

      await updateInputFieldWithStateUpdated('link-url', '');

      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(3);
    });

    it('should still request update from plugin when query is emptied after initial state has valid `url`', async () => {
      const plugin = new MockLinkPickerPlugin();
      const resolve = jest.spyOn(plugin, 'resolve');

      const { updateInputFieldWithStateUpdated } = await setup({
        plugins: [plugin],
        url: 'www.atlassian.com',
      });

      await updateInputFieldWithStateUpdated('link-url', '');
      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(1);
    });

    it('should stop yielding results from plugin resolve generator when the query/context changes', async () => {
      const plugin = new MockLinkPickerPlugin();
      const initialResults = jest.spyOn(plugin, 'getInitialResults');
      const updatedResults = jest.spyOn(plugin, 'fetchUpdatedResults');

      initialResults
        .mockReturnValueOnce(Promise.resolve([]))
        .mockReturnValueOnce(new ManualPromise<never>())
        .mockReturnValueOnce(Promise.resolve([]));

      const { updateInputFieldWithStateUpdated } = await setup({
        plugins: [plugin],
      });

      expect(initialResults).toHaveBeenCalledTimes(1);
      expect(updatedResults).toHaveBeenCalledTimes(1);

      await updateInputFieldWithStateUpdated('link-url', 'atlas');

      expect(initialResults).toHaveBeenCalledTimes(2);
      // Does not step through to the final yield/return as previous initialResults yield has not resolved
      expect(updatedResults).toHaveBeenCalledTimes(1);

      await updateInputFieldWithStateUpdated('link-url', 'atlass');

      expect(initialResults).toHaveBeenCalledTimes(3);
      expect(updatedResults).toHaveBeenCalledTimes(2);
    });

    it('should still request update from plugin when query is emptied', async () => {
      const plugin = new MockLinkPickerPlugin();
      const resolve = jest.spyOn(plugin, 'resolve');

      const { updateInputFieldWithStateUpdated } = await setup({
        plugins: [plugin],
        url: '',
      });

      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(1);

      await updateInputFieldWithStateUpdated('link-url', 'abc');

      expect(resolve).toHaveBeenCalledWith({ query: 'abc' });
      expect(resolve).toHaveBeenCalledTimes(2);

      await updateInputFieldWithStateUpdated('link-url', '');

      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(3);
    });

    it('should still request update from plugin when query is emptied after initial state has valid `url`', async () => {
      const plugin = new MockLinkPickerPlugin();
      const resolve = jest.spyOn(plugin, 'resolve');

      const { updateInputFieldWithStateUpdated } = await setup({
        plugins: [plugin],
        url: 'www.atlassian.com',
      });

      await updateInputFieldWithStateUpdated('link-url', '');

      expect(resolve).toHaveBeenCalledWith({ query: '' });
      expect(resolve).toHaveBeenCalledTimes(1);
    });

    it('should not set picker items to plugin resolves if previous plugin yield resolves after the query has changed', async () => {
      const plugin = new MockLinkPickerPlugin();
      const initialResults = jest.spyOn(plugin, 'getInitialResults');
      const updatedResults = jest.spyOn(plugin, 'fetchUpdatedResults');

      initialResults
        .mockReturnValueOnce(Promise.resolve([]))
        .mockReturnValueOnce(new ManualPromise<never>())
        .mockReturnValueOnce(Promise.resolve([]));

      const { updateInputFieldWithStateUpdated } = await setup({
        plugins: [plugin],
      });

      expect(initialResults).toHaveBeenCalledTimes(1);
      expect(updatedResults).toHaveBeenCalledTimes(1);

      await updateInputFieldWithStateUpdated('link-url', 'atlas');

      expect(initialResults).toHaveBeenCalledTimes(2);
      // Does not step through to the final yield/return as previous initialResults yield has not resolved
      expect(updatedResults).toHaveBeenCalledTimes(1);

      await updateInputFieldWithStateUpdated('link-url', 'atlass');

      expect(initialResults).toHaveBeenCalledTimes(3);
      expect(updatedResults).toHaveBeenCalledTimes(2);
    });

    it('should submit with selected item when clicked', async () => {
      const plugin = new MockLinkPickerPlugin();
      const results = getDefaultItems(5);

      jest.spyOn(plugin, 'fetchUpdatedResults').mockResolvedValue(results);

      const { component, onSubmit } = await setupWithGenericPlugin({
        plugins: [plugin],
      });

      // Hover second item
      component
        .find('div[data-testid="link-search-list-item"]')
        .at(1)
        .simulate('mouseenter');
      // Click second item
      component
        .find('div[data-testid="link-search-list-item"]')
        .at(1)
        .simulate('click');

      const [, secondItem] = results;
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        url: secondItem.url,
        title: secondItem.name,
        displayText: null,
        meta: {
          inputMethod: 'typeAhead',
        },
      });
    });

    it('should display Error message when URL is invalid', async () => {
      const {
        component,
        updateInputField,
        pressReturnInputField,
      } = await setupWithGenericPlugin();

      updateInputField('link-url', 'ABC');
      pressReturnInputField('link-url');

      const errorMessage = component.find('[testId="link-error"]');
      expect(errorMessage.at(0)).toHaveLength(1);
    });

    it('should remove invalid URL Error when Input is edited', async () => {
      const {
        component,
        updateInputField,
        pressReturnInputField,
      } = await setupWithGenericPlugin();

      // This will trigger the Error message
      updateInputField('link-url', 'ABC');
      pressReturnInputField('link-url');

      updateInputField('link-url', 'ABCD');
      const errorMessage = component.find('[testId="link-error"]');
      expect(errorMessage.at(0)).toHaveLength(0);

      // If value is changed to previous trigger it still should not display error
      updateInputField('link-url', 'ABC');
      expect(errorMessage.at(0)).toHaveLength(0);
    });

    it('should submit with selected item when navigated to via keyboard and enter is pressed', async () => {
      const plugin = new MockLinkPickerPlugin();
      const results = getDefaultItems(5);
      jest.spyOn(plugin, 'fetchUpdatedResults').mockResolvedValue(results);

      const {
        onSubmit,
        pressDownArrowInputField,
        pressReturnInputField,
      } = await setup({
        plugins: [plugin],
      });

      // Set first item to active
      pressDownArrowInputField('link-url');
      // Set second item to active
      pressDownArrowInputField('link-url');
      // Submit
      pressReturnInputField('link-url');

      const [, secondItem] = results;
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        url: secondItem.url,
        displayText: null,
        title: secondItem.name,
        meta: {
          inputMethod: 'typeAhead',
        },
      });
    });

    it('should populate url field with active item when navigated to via keyboard', async () => {
      const plugin = new MockLinkPickerPlugin();
      const results = getDefaultItems(5);
      jest.spyOn(plugin, 'fetchUpdatedResults').mockResolvedValue(results);

      const {
        component,
        pressDownArrowInputField,
      } = await setupWithGenericPlugin({
        plugins: [plugin],
      });

      // Set first item to active
      pressDownArrowInputField('link-url');
      await flushPromises();
      component.update();

      const [first] = component.find(LinkSearchList).prop('items')!;

      expect(
        (component
          .find('input[data-testid="link-url"]')
          .getDOMNode() as HTMLInputElement).value,
      ).toBe(first.url);
    });

    it('should insert the right item after a few interaction with both mouse and keyboard', async () => {
      const plugin = new MockLinkPickerPlugin();
      const results = getDefaultItems(5);
      jest.spyOn(plugin, 'fetchUpdatedResults').mockResolvedValue(results);

      const { component, pressDownArrowInputField } = await setup({
        plugins: [plugin],
      });

      // Hover over the first item on the list
      const firstSearchItem = component
        .find('div[data-testid="link-search-list-item"]')
        .first();
      firstSearchItem.simulate('mouseenter');

      // This should move to the second item in the list
      pressDownArrowInputField('link-url');

      const [, second] = component.find('LinkSearchList').prop('items');

      expect(
        (component
          .find('input[data-testid="link-url"]')
          .getDOMNode() as HTMLInputElement).value,
      ).toBe(second.url);
    });

    it('should not submit when URL is invalid and there is no result', async () => {
      const {
        component,
        pressDownArrowInputField,
        updateInputFieldWithStateUpdated,
        onSubmit,
      } = await setupWithGenericPlugin();

      // Set url to invalid
      await updateInputFieldWithStateUpdated('link-url', 'xyz');

      // Set first item to active
      pressDownArrowInputField('link-url');

      await flushPromises();
      component.update();

      const items = component.find(LinkSearchList).prop('items');
      expect(items).toHaveLength(0);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should submit arbitrary link', async () => {
      const {
        component,
        onSubmit,
        updateInputFieldWithStateUpdated,
        pressReturnInputField,
      } = await setupWithGenericPlugin();

      await updateInputFieldWithStateUpdated('link-url', 'example.com');
      pressReturnInputField('link-url');

      await flushPromises();
      component.update();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
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
      const { component } = await setupWithGenericPlugin();
      const searchIcon = component.find(
        '[data-testid="link-url-container"] [data-testid="link-picker-search-icon"]',
      );

      expect(searchIcon.exists()).toBeTruthy();
    });

    it('should display a subtitle for recent items', async () => {
      const plugin = new MockLinkPickerPlugin();
      const results = getDefaultItems(5);

      jest.spyOn(plugin, 'fetchUpdatedResults').mockResolvedValue(results);

      const { component } = await setupWithGenericPlugin({
        plugins: [plugin],
      });

      const subtitle = component.find('[data-testid="link-picker-list-title"]');
      expect(subtitle.at(0)).toHaveLength(1);
      expect(subtitle.at(0).render().text()).toMatch(
        messages.titleRecentlyViewed.defaultMessage,
      );
    });

    it('should display a subtitle for search results', async () => {
      const plugin = new MockLinkPickerPlugin();
      const results = getDefaultItems(5);

      jest.spyOn(plugin, 'fetchUpdatedResults').mockResolvedValue(results);

      const {
        component,
        updateInputFieldWithStateUpdated,
      } = await setupWithGenericPlugin({
        plugins: [plugin],
      });

      await updateInputFieldWithStateUpdated('link-url', 'dogs');
      component.update();
      const subtitle = component.find('[data-testid="link-picker-list-title"]');
      expect(subtitle.at(0).render().text()).toMatch(
        messages.titleResults.defaultMessage,
      );
    });

    it('should submit when insert button is clicked', async () => {
      const {
        component,
        onSubmit,
        updateInputFieldWithStateUpdated,
      } = await setupWithGenericPlugin();

      await updateInputFieldWithStateUpdated('link-url', 'example.com');
      await flushPromises();
      component.update();

      component
        .find('[data-testid="link-picker-insert-button"]')
        .at(1)
        .simulate('click');

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        url: 'http://example.com',
        displayText: null,
        title: null,
        meta: {
          inputMethod: 'manual',
        },
        rawUrl: 'example.com',
      });
    });
  });
});
