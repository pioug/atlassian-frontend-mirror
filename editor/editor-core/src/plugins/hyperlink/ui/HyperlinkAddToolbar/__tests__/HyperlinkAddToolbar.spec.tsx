import React from 'react';
import {
  HyperlinkLinkAddToolbarWithIntl,
  Props as HyperlinkAddToolbarProps,
} from '../HyperlinkAddToolbar';
import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import Page16Icon from '@atlaskit/icon-object/glyph/page/16';
import Blog16Icon from '@atlaskit/icon-object/glyph/blog/16';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import LinkSearchListItem from '../../../../../ui/LinkSearch/LinkSearchListItem';
import LinkSearchList from '../../../../../ui/LinkSearch/LinkSearchList';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  activityProviderMockResults,
  generateActivityProviderMockResults,
  searchProviderMockResults,
  generateSearchproviderMockResults,
} from './__helpers';
import { ActivityProvider, ActivityError } from '@atlaskit/activity-provider';
import {
  expectToEqual,
  expectFunctionToHaveBeenCalledWith,
  flushPromises,
} from '@atlaskit/media-test-helpers';
import { SearchProvider } from '@atlaskit/editor-common';
import { INPUT_METHOD } from '../../../../analytics';
import { shallow } from 'enzyme';
import { LinkSearchListItemData } from '../../../../../ui/LinkSearch/types';
import {
  HyperlinkState,
  stateKey as hyperlinkStateKey,
} from '../../../pm-plugins/main';
import { sha1 } from '../utils';
import sinon from 'sinon';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import hyperlinkPlugin from '../../../index';
import {
  a,
  doc,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { hideLinkToolbar as cardHideLinkToolbar } from '../../../../card/pm-plugins/actions';
import * as Commands from '../../../commands';
import PanelTextInput from '../../../../../ui/PanelTextInput';
interface SetupArgumentObject {
  recentItemsPromise?: ReturnType<ActivityProvider['getRecentItems']>;
  searchRecentPromise?: ReturnType<ActivityProvider['searchRecent']>;
  quickSearchPromises?: ReturnType<SearchProvider['quickSearch']>[];
  displayUrl?: string;
  waitForResolves?: boolean;
  provideActivityProvider?: boolean;
  provideSearchProvider?: boolean;
  pluginState?: HyperlinkState;
}

interface Props {
  child: React.ReactChild;
}

/**
 * The version of sinon we using is mocking setImmediate
 * which is unneccessary and will make flushPromise fail
 * to work
 * Can replace this with Jest timer when Jest is upgrade to 26
 */
const clock = sinon.useFakeTimers(
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'Date',
);
jest.unmock('lodash/debounce');

jest.mock('date-fns/differenceInCalendarDays', () => {
  return jest.fn().mockImplementation(() => -5);
});

jest.mock('date-fns/formatDistanceToNow', () => ({
  __esModule: true,
  default: () => 'just a minute',
}));

class TestingWrapper extends React.Component<Props, {}> {
  render() {
    return <>{this.props.child}</>;
  }
}

const assertIcon = (item: LinkSearchListItemData, iconComponent: any) => {
  const icon = item.icon;
  if (!icon) {
    throw expect(icon).toBeDefined();
  }
  const mountedIcon = shallow(<TestingWrapper child={icon} />);
  expect(mountedIcon.find(iconComponent)).toHaveLength(1);
};

describe('HyperlinkLinkAddToolbar', () => {
  afterAll(() => {
    jest.restoreAllMocks();
    clock.restore();
  });
  afterEach(() => {
    jest.clearAllMocks();
    clock.reset();
  });

  const setup = async (options: SetupArgumentObject = {}) => {
    const {
      waitForResolves = true,
      provideActivityProvider = true,
      provideSearchProvider = true,
      displayUrl,
      recentItemsPromise = Promise.resolve(activityProviderMockResults),
      searchRecentPromise = Promise.resolve(activityProviderMockResults),
      quickSearchPromises = [Promise.resolve(searchProviderMockResults)],
      pluginState = {
        timesViewed: 0,
        canInsertLink: true,
        searchSessionId: 'a-unique-id',
        inputMethod: INPUT_METHOD.SHORTCUT,
      },
    } = options;

    const eventListenerMap: {
      [prop: string]: EventListenerOrEventListenerObject;
    } = {};

    document.addEventListener = jest.fn((event, cb) => {
      eventListenerMap[event] = cb;
    });

    const createEditor = createProsemirrorEditorFactory();
    const editor = (doc: DocBuilder) => {
      return createEditor({
        doc,
        preset: new Preset<LightEditorPlugin>().add(hyperlinkPlugin),
      });
    };

    const { editorView } = editor(
      doc(p(a({ href: 'https://google.com' })('Li{<>}nk'))),
    );

    const createAnalyticsEvent: CreateUIAnalyticsEvent = jest
      .fn()
      .mockReturnValue({
        update: () => {},
        fire() {},
        attributes: { foo: 'bar' },
      });
    const activityProvider: ActivityProvider = {
      getRecentItems: jest.fn<
        ReturnType<ActivityProvider['getRecentItems']>,
        Parameters<ActivityProvider['getRecentItems']>
      >(() => recentItemsPromise),
      searchRecent: jest.fn<
        ReturnType<ActivityProvider['searchRecent']>,
        Parameters<ActivityProvider['searchRecent']>
      >(() => searchRecentPromise),
    };

    const searchProvider: SearchProvider = {
      quickSearch: jest
        .fn<
          ReturnType<SearchProvider['quickSearch']>,
          Parameters<SearchProvider['quickSearch']>
        >()
        .mockReturnValueOnce(quickSearchPromises[0]),
    };
    for (let i = 1; i < quickSearchPromises.length; i++) {
      (searchProvider.quickSearch as jest.Mock).mockReturnValueOnce(
        quickSearchPromises[i],
      );
    }

    let activityProviderPromise: HyperlinkAddToolbarProps['activityProvider'] = Promise.resolve(
      activityProvider,
    );
    let searchProviderPromise: HyperlinkAddToolbarProps['searchProvider'] = Promise.resolve(
      searchProvider,
    );

    const onSubmit = jest.fn<
      ReturnType<Required<HyperlinkAddToolbarProps>['onSubmit']>,
      Parameters<Required<HyperlinkAddToolbarProps>['onSubmit']>
    >();

    if (!provideActivityProvider) {
      activityProviderPromise = undefined;
    }
    if (!provideSearchProvider) {
      searchProviderPromise = undefined;
    }

    const component = mountWithIntl(
      <HyperlinkLinkAddToolbarWithIntl
        displayUrl={displayUrl}
        onSubmit={onSubmit}
        activityProvider={activityProviderPromise}
        searchProvider={searchProviderPromise}
        createAnalyticsEvent={createAnalyticsEvent}
        pluginState={pluginState}
        view={editorView}
      />,
    );

    if (waitForResolves) {
      await activityProviderPromise;
      await searchProviderPromise;
      await recentItemsPromise;
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

    const pressEscapeKeyInputField = (testId: string) => {
      const linkUrlInput = component.find(`input[data-testid="${testId}"]`);
      linkUrlInput.simulate('keydown', {
        keyCode: 27,
      });
    };

    return {
      component,
      onSubmit,
      editorView,
      activityProviderPromise,
      searchProviderPromise,
      recentItemsPromise,
      searchRecentPromise,
      quickSearchPromises,
      eventListenerMap,
      updateInputField,
      updateInputFieldWithStateUpdated,
      pressReturnInputField,
      pressDownArrowInputField,
      pressEscapeKeyInputField,
      createAnalyticsEvent,
    };
  };

  describe('when there is no activity provider and search provider given', () => {
    const setup2 = async (config: SetupArgumentObject = {}) => {
      return setup({
        ...config,
        provideActivityProvider: false,
        provideSearchProvider: false,
      });
    };

    it('should submit with valid url in the input field', async () => {
      const {
        component,
        onSubmit,
        pressReturnInputField,
        updateInputFieldWithStateUpdated,
      } = await setup2();

      await updateInputFieldWithStateUpdated('link-url', 'www.atlassian.com');
      pressReturnInputField('link-url');
      component.update();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        'http://www.atlassian.com',
        'www.atlassian.com',
        undefined,
        'manual',
      );
    });

    it('should submit with valid url and title in the input field', async () => {
      const {
        component,
        onSubmit,
        pressReturnInputField,
        updateInputFieldWithStateUpdated,
      } = await setup2();

      await updateInputFieldWithStateUpdated('link-url', 'www.atlassian.com');
      await updateInputFieldWithStateUpdated('link-label', 'link');
      pressReturnInputField('link-label');
      component.update();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        'http://www.atlassian.com',
        'www.atlassian.com',
        'link',
        'manual',
      );
    });
  });

  describe('when activity provider returns 5 or more results initially', () => {
    it('should have isLoading before recent activity results are resolved', async () => {
      const {
        component,
        activityProviderPromise,
        searchProviderPromise,
      } = await setup({ waitForResolves: false });
      await activityProviderPromise;
      await searchProviderPromise;
      component.update();
      expectToEqual(component.find(LinkSearchList).props().isLoading, true);
    });

    it("should still keep isLoading when activityProvider is resolved but not it's results", async () => {
      const { component, activityProviderPromise } = await setup({
        recentItemsPromise: new Promise(() => {}),
        waitForResolves: false,
      });
      await activityProviderPromise;
      component.update();
      expectToEqual(component.find(LinkSearchList).props().isLoading, true);
    });

    it("should put isLoading to false when activity provider's results are recieved", async () => {
      const { component } = await setup();

      expectToEqual(component.find(LinkSearchList).props().isLoading, false);
    });

    it('should put isLoading to false when activity provider rejects', async () => {
      const recentItemsPromise = Promise.reject('some-error');
      const {
        component,
        activityProviderPromise,
        searchProviderPromise,
      } = await setup({
        waitForResolves: false,
        recentItemsPromise,
      });
      await activityProviderPromise;
      await searchProviderPromise;
      try {
        await recentItemsPromise;
      } catch (e) {}
      component.update();
      expectToEqual(component.find(LinkSearchList).props().isLoading, false);
    });

    it('should not load items nor show isLoading when displayUrl provided', async () => {
      const { component } = await setup({
        displayUrl: 'http://some-url.com',
      });
      expect(component.find(LinkSearchList).props().items).toHaveLength(0);
      expectToEqual(component.find(LinkSearchList).props().isLoading, false);
    });

    it('should render a list of recent activity items', async () => {
      const { component } = await setup({ waitForResolves: true });
      const items = component.find(LinkSearchList).props().items;
      if (!items) {
        return expect(items).toBeDefined();
      }
      expect(items).toHaveLength(5);
      expectToEqual(items[0], {
        objectId: 'object-id-1',
        name: 'some-activity-name-1',
        url: 'some-activity-url-1.com',
        container: 'some-activity-container-1',
        iconUrl: 'some-activity-icon-url-1.com',
        lastViewedDate: new Date('2020-04-16T00:00:00+00:00'),
      });

      expectToEqual(component.find(LinkSearchList).props().isLoading, false);
    });

    it('should filter recent activity items by input text', async () => {
      const {
        component,
        activityProviderPromise,
        updateInputField,
        searchRecentPromise,
      } = await setup({
        searchRecentPromise: Promise.resolve(
          generateActivityProviderMockResults(7),
        ),
      });

      if (!activityProviderPromise) {
        return expect(activityProviderPromise).toBeDefined();
      }

      const activityProvider = await activityProviderPromise;

      updateInputField('link-url', 'some-value');
      clock.tick(500);
      await searchRecentPromise;
      component.update();
      const items = component.find(LinkSearchList).props().items;
      if (!items) {
        return expect(items).toBeDefined();
      }
      expect(items).toHaveLength(5);
      expectToEqual(items[0], {
        objectId: 'object-id-1',
        name: 'some-activity-name-1',
        url: 'some-activity-url-1.com',
        container: 'some-activity-container-1',
        iconUrl: 'some-activity-icon-url-1.com',
        lastViewedDate: new Date('2020-04-16T00:00:00+00:00'),
      });

      expect(activityProvider.searchRecent).toHaveBeenCalledTimes(1);
      expectFunctionToHaveBeenCalledWith(activityProvider.searchRecent, [
        'some-value',
      ]);
    });

    it('should make default activity items call when input is cleared', async () => {
      const {
        component,
        activityProviderPromise,
        updateInputField,
        searchRecentPromise,
        recentItemsPromise,
      } = await setup({
        recentItemsPromise: Promise.resolve(
          generateActivityProviderMockResults(7),
        ),
        searchRecentPromise: Promise.resolve(
          generateActivityProviderMockResults(1),
        ),
      });

      if (!activityProviderPromise) {
        return expect(activityProviderPromise).toBeDefined();
      }

      await activityProviderPromise;

      updateInputField('link-url', 'some-value');
      await recentItemsPromise;
      await searchRecentPromise;
      clock.tick(500);
      component.update();

      updateInputField('link-url', '');
      await searchRecentPromise;
      await recentItemsPromise;
      component.update();

      let listComponentProps = component.find(LinkSearchList).props();

      const items = listComponentProps.items;
      if (!items) {
        return expect(items).toBeDefined();
      }
      expect(items).toHaveLength(5);
      expect(items).toMatchSnapshot();
      expect(listComponentProps.selectedIndex).toEqual(-1);
    });

    it('should submit with selected activity item when clicked', async () => {
      const { searchRecentPromise, component, onSubmit } = await setup();

      await searchRecentPromise;
      component.update();

      component.find(LinkSearchListItem).at(1).simulate('mouseenter');
      component.find(LinkSearchListItem).at(1).simulate('click');

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        'some-activity-url-2.com',
        'some-activity-name-2',
        undefined,
        'typeAhead',
      );
    });

    it('should submit with selected activity item when enter is pressed', async () => {
      const {
        component,
        onSubmit,
        searchRecentPromise,
        updateInputField,
        pressReturnInputField,
        pressDownArrowInputField,
      } = await setup();

      updateInputField('link-url', 'some-value');

      await searchRecentPromise;
      component.update();
      pressDownArrowInputField('link-url');
      pressDownArrowInputField('link-url');
      pressReturnInputField('link-url');

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        'http://some-activity-url-2.com',
        'some-activity-name-2',
        undefined,
        'typeAhead',
      );
    });

    it('should submit with selected activity item when navigated to via keyboard and enter pressed', async () => {
      const {
        onSubmit,
        pressDownArrowInputField,
        pressReturnInputField,
      } = await setup();

      pressDownArrowInputField('link-url');
      pressDownArrowInputField('link-url');
      pressReturnInputField('link-url');

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        'http://some-activity-url-2.com',
        'some-activity-name-2',
        undefined,
        'typeAhead',
      );
    });

    it('should populate Url field with selected activity item when navigated to via keyboard', async () => {
      const {
        component,
        pressDownArrowInputField,
        recentItemsPromise,
      } = await setup();

      await recentItemsPromise;

      pressDownArrowInputField('link-url');

      const listComponentProps = component.find(LinkSearchList).props();

      const items = listComponentProps.items!;

      expectToEqual(
        (component
          .find('input[data-testid="link-url"]')
          .getDOMNode() as HTMLInputElement).value,
        items[0].url,
      );
    });

    it('should insert the right item after a few interaction with both mouse and keyboard', async () => {
      const {
        component,
        pressDownArrowInputField,
        recentItemsPromise,
        searchRecentPromise,
        updateInputField,
      } = await setup();

      await recentItemsPromise;

      updateInputField('link-url', 'some-value');

      await searchRecentPromise;
      component.update();

      // Hover over the first item on the list
      const firstSearchItem = component.find(LinkSearchListItem).first();
      firstSearchItem.simulate('mouseenter');

      // This should move to the second item in the list
      pressDownArrowInputField('link-url');

      const listComponentProps = component.find(LinkSearchList).props();

      const items = listComponentProps.items!;

      expectToEqual(
        (component
          .find('input[data-testid="link-url"]')
          .getDOMNode() as HTMLInputElement).value,
        items[1].url,
      );
    });

    it('should not submit when URL is invalid and there is no result', async () => {
      const {
        component,
        onSubmit,
        searchRecentPromise,
        updateInputField,
        pressReturnInputField,
      } = await setup({
        searchRecentPromise: Promise.resolve([]),
      });

      updateInputField('link-url', 'javascript:alert(1)');

      await searchRecentPromise;
      component.update();

      pressReturnInputField('link-url');

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should submit arbitrary link', async () => {
      const {
        component,
        onSubmit,
        searchRecentPromise,
        updateInputFieldWithStateUpdated,
        pressReturnInputField,
      } = await setup({
        searchRecentPromise: Promise.resolve([]),
      });

      await updateInputFieldWithStateUpdated('link-url', 'example.com');
      await searchRecentPromise;

      pressReturnInputField('link-url');
      component.update();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        'http://example.com',
        'example.com',
        undefined,
        'manual',
      );
    });

    it('should display a valid URL on load', async () => {
      const { component } = await setup({
        displayUrl: 'https://www.atlassian.com',
      });

      expectToEqual(
        (component
          .find('input[data-testid="link-url"]')
          .getDOMNode() as HTMLInputElement).value,
        'https://www.atlassian.com',
      );
    });

    it('should NOT display an invalid URL on load', async () => {
      const { component } = await setup({
        displayUrl: 'javascript:alert(1)',
      });

      expectToEqual(
        (component
          .find('input[data-testid="link-url"]')
          .getDOMNode() as HTMLInputElement).value,
        '',
      );
    });

    it('should NOT render a list of recent activity items', async () => {
      const { component } = await setup({
        provideActivityProvider: false,
      });

      expect(component.find(LinkSearchListItem)).toHaveLength(0);
      expect(component.find(LinkSearchList).props().isLoading).toBe(false);
    });

    it('should call hideLinkToolbar when escape is pressed', async () => {
      const { pressEscapeKeyInputField, editorView } = await setup();
      const internalHideLinkToolbar = jest
        .fn<ReturnType<any>, Parameters<any>>()
        .mockReturnValueOnce(true);
      const hideLinkToolbar = jest
        .fn<ReturnType<any>, Parameters<any>>()
        .mockReturnValue(internalHideLinkToolbar);

      pressEscapeKeyInputField('link-url');

      expect(hideLinkToolbar()(editorView.state, editorView.dispatch)).toBe(
        true,
      );
      expect(internalHideLinkToolbar).toHaveBeenCalledWith(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should call card hideLinkToolbar when escape is pressed', async () => {
      const { pressEscapeKeyInputField, editorView } = await setup();
      const dispatchSpy = jest.spyOn(editorView, 'dispatch');

      pressEscapeKeyInputField('link-url');
      expect(dispatchSpy).toBeCalledWith(
        cardHideLinkToolbar(editorView.state.tr),
      );
    });

    it('should close toolbar when escape is pressed', async () => {
      const { pressEscapeKeyInputField, editorView } = await setup();

      let pluginState = hyperlinkStateKey.getState(editorView.state);
      expect(pluginState.activeLinkMark).toBeDefined();

      pressEscapeKeyInputField('link-url');

      pluginState = hyperlinkStateKey.getState(editorView.state);
      expect(pluginState.activeLinkMark).toBeUndefined();
    });

    describe('when activity provider returns less then 5 results initially', () => {
      const setup2 = async (config: SetupArgumentObject = {}) => {
        const { component } = await setup({
          ...config,
          recentItemsPromise: Promise.resolve(
            activityProviderMockResults.slice(0, 2),
          ),
        });

        return { component };
      };

      it('should not show loading for the search part of the list', async () => {
        const { component } = await setup2();

        expectToEqual(component.find(LinkSearchList).props().isLoading, false);
        expect(component.find(LinkSearchList).props().items).toHaveLength(2);
      });
    });
  });

  describe('when activity provider returns less then 5 results after user input', () => {
    const setup2 = async (config: SetupArgumentObject = {}) => {
      const results = await setup({
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          Promise.resolve(searchProviderMockResults.slice(2, 5)),
        ],
        ...config,
      });
      const {
        component,
        searchRecentPromise,
        updateInputFieldWithStateUpdated,
      } = results;

      await updateInputFieldWithStateUpdated('link-url', 'some-value');

      await searchRecentPromise;
      component.update();

      return results;
    };

    it('should show loading for the search part of the list', async () => {
      const { component } = await setup2({
        quickSearchPromises: [
          new Promise(() => {
            // We don't want quick search promise to resolve
            // so that we can stop at the screen where the result
            // is returned from remote.
          }),
        ],
      });

      expectToEqual(component.find(LinkSearchList).props().isLoading, true);
      expect(component.find(LinkSearchList).props().items).toHaveLength(2);
    });

    it('should not show loading for the search part of the list when searchProvider is not defined', async () => {
      const { component } = await setup2({
        provideSearchProvider: false,
      });

      expectToEqual(component.find(LinkSearchList).props().isLoading, false);
      expect(component.find(LinkSearchList).props().items).toHaveLength(2);
    });

    it('should call searchProvider', async () => {
      const {
        component,
        quickSearchPromises,
        searchProviderPromise,
      } = await setup2();

      if (!searchProviderPromise) {
        return expect(searchProviderPromise).toBeDefined();
      }
      const searchProvider = await searchProviderPromise;

      await quickSearchPromises[0];

      component.update();
      clock.tick(500);
      expectFunctionToHaveBeenCalledWith(searchProvider.quickSearch, [
        'some-value',
        5,
      ]);
    });

    it('should populate link search list with quick search results', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
      } = await setup2();

      const searchRecentItems = await searchRecentPromise;
      clock.tick(500);
      const quickSearchItems = await quickSearchPromises[0];

      component.update();

      const items = component.find(LinkSearchList).props().items;
      if (!items) {
        return expect(items).toBeDefined();
      }
      expect(items).toHaveLength(
        searchRecentItems.length + quickSearchItems.length,
      );

      // Double check that activity results goes first.
      // Assert First item is a first item from activity provider result
      expectToEqual(items[0].name, activityProviderMockResults[0].name);
      expectToEqual(
        items[0].container,
        activityProviderMockResults[0].container,
      );

      // Then assert that next result item after all activity providers is the one from
      // quick search results.
      expectToEqual(items[searchRecentItems.length], {
        objectId: 'object-id-3',
        name: 'some-quick-search-title-3',
        container: 'some-quick-search-container-3',
        url: 'some-quick-search-url-3.com',
        lastUpdatedDate: new Date('2020-04-15T02:00:00+00:00'),
        icon: expect.anything(),
      });
    });

    it('should still take the result of latest query if two quick search are triggered', async () => {
      const {
        component,
        searchRecentPromise,
        updateInputFieldWithStateUpdated,
        quickSearchPromises,
      } = await setup2({
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          Promise.resolve(searchProviderMockResults.slice(0, 2)),
          Promise.resolve(searchProviderMockResults.slice(2, 5)),
        ],
      });

      await searchRecentPromise;
      component.update();
      await updateInputFieldWithStateUpdated('link-url', 'first query');
      clock.tick(500);
      component.update();

      // Trigger the search second time should increase
      // the query version from 0 to 1
      await updateInputFieldWithStateUpdated('link-url', 'second query');
      clock.tick(500);
      await quickSearchPromises[0];
      await quickSearchPromises[1];
      component.update();

      const items = component.find(LinkSearchList).props().items;
      if (!items) {
        return expect(items).toBeDefined();
      }
      expect(items).toMatchSnapshot();
    });

    it('should deduplicate search results', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
      } = await setup2({
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          Promise.resolve(searchProviderMockResults.slice(0, 5)),
        ],
      });

      await searchRecentPromise;
      clock.tick(500);
      await quickSearchPromises[0];

      component.update();

      const items = component.find(LinkSearchList).props().items;
      if (!items) {
        return expect(items).toBeDefined();
      }
      expect(items).toMatchSnapshot();
    });

    it('should not show loading when quick search results are in', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
      } = await setup2();

      await searchRecentPromise;
      clock.tick(500);
      await quickSearchPromises[0];

      component.update();

      expectToEqual(component.find(LinkSearchList).props().isLoading, false);
      expect(component.find(LinkSearchList).props().items).toHaveLength(5);
    });

    it('show appropriate issue icon in quick search results based on contentType', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
      } = await setup2({
        searchRecentPromise: Promise.resolve([]),
        quickSearchPromises: [
          Promise.resolve(generateSearchproviderMockResults(1, 'jira.issue')),
        ],
      });

      await searchRecentPromise;
      clock.tick(500);
      await quickSearchPromises[0];

      component.update();
      const { items } = component.find(LinkSearchList).props();
      if (!items) {
        return expect(items).toBeDefined();
      }
      assertIcon(items[0], Issue16Icon);
    });

    it('show appropriate bug icon in quick search results based on contentType', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
      } = await setup2({
        searchRecentPromise: Promise.resolve([]),
        quickSearchPromises: [
          Promise.resolve(
            generateSearchproviderMockResults(1, 'jira.issue.bug'),
          ),
        ],
      });

      await searchRecentPromise;
      clock.tick(500);
      await quickSearchPromises[0];

      component.update();
      const { items } = component.find(LinkSearchList).props();
      if (!items) {
        return expect(items).toBeDefined();
      }
      assertIcon(items[0], Bug16Icon);
    });

    it('show appropriate story icon in quick search results based on contentType', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
      } = await setup2({
        searchRecentPromise: Promise.resolve([]),
        quickSearchPromises: [
          Promise.resolve(
            generateSearchproviderMockResults(1, 'jira.issue.story'),
          ),
        ],
      });

      await searchRecentPromise;
      clock.tick(500);
      await quickSearchPromises[0];

      component.update();
      const { items } = component.find(LinkSearchList).props();
      if (!items) {
        return expect(items).toBeDefined();
      }
      assertIcon(items[0], Story16Icon);
    });

    it('show appropriate task icon in quick search results based on contentType', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
      } = await setup2({
        searchRecentPromise: Promise.resolve([]),
        quickSearchPromises: [
          Promise.resolve(
            generateSearchproviderMockResults(1, 'jira.issue.task'),
          ),
        ],
      });

      await searchRecentPromise;
      clock.tick(500);
      await quickSearchPromises[0];

      component.update();
      const { items } = component.find(LinkSearchList).props();
      if (!items) {
        return expect(items).toBeDefined();
      }
      assertIcon(items[0], Task16Icon);
    });

    it('show appropriate page icon in quick search results based on contentType', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
      } = await setup2({
        searchRecentPromise: Promise.resolve([]),
        quickSearchPromises: [
          Promise.resolve(
            generateSearchproviderMockResults(1, 'confluence.page'),
          ),
        ],
      });

      await searchRecentPromise;
      clock.tick(500);
      await quickSearchPromises[0];

      component.update();
      const { items } = component.find(LinkSearchList).props();
      if (!items) {
        return expect(items).toBeDefined();
      }
      assertIcon(items[0], Page16Icon);
    });

    it('show appropriate blogpost icon in quick search results based on contentType', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
      } = await setup2({
        searchRecentPromise: Promise.resolve([]),
        quickSearchPromises: [
          Promise.resolve(
            generateSearchproviderMockResults(1, 'confluence.blogpost'),
          ),
        ],
      });

      await searchRecentPromise;
      clock.tick(500);
      await quickSearchPromises[0];

      component.update();
      const { items } = component.find(LinkSearchList).props();
      if (!items) {
        return expect(items).toBeDefined();
      }
      assertIcon(items[0], Blog16Icon);
    });

    it('debounces calls to the quick search provider', async () => {
      const {
        component,
        updateInputField,
        searchProviderPromise,
        quickSearchPromises,
      } = await setup2();
      const searchProvider = await searchProviderPromise;
      const quickSearchSpy = jest.spyOn(
        searchProvider as SearchProvider,
        'quickSearch',
      );
      updateInputField('link-url', 'a');
      updateInputField('link-url', 'b');
      updateInputField('link-url', 'c');
      component.update();
      await quickSearchPromises[0];
      clock.tick(500);
      expect(quickSearchSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onSelect with right url when quick search item is clicked', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
        onSubmit,
      } = await setup2();

      const searchRecentItems = await searchRecentPromise;
      clock.tick(500);
      const quickSearchItems = await quickSearchPromises[0];

      component.update();

      const linkSearchListItems = component.find(LinkSearchListItem);
      const firstQuickSearchItem = linkSearchListItems.at(
        searchRecentItems.length,
      );

      firstQuickSearchItem.simulate('mouseenter');
      firstQuickSearchItem.simulate('click');

      expectFunctionToHaveBeenCalledWith(onSubmit, [
        quickSearchItems[0].url,
        quickSearchItems[0].title,
        undefined,
        INPUT_METHOD.TYPEAHEAD,
      ]);
    });
  });

  describe('analytics', () => {
    it('should trigger the Screen Event of "viewed CreateLinkInlineDialog" when HyperLinkToolBar is shown', async () => {
      const { component, createAnalyticsEvent } = await setup({
        waitForResolves: false,
        pluginState: {
          timesViewed: 5,
          searchSessionId: 'an-unique-id',
          canInsertLink: true,
          inputMethod: INPUT_METHOD.SHORTCUT,
        },
      });
      component.update();
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'viewed',
        actionSubject: 'createLinkInlineDialog',
        attributes: {
          timesViewed: 5,
          searchSessionId: 'an-unique-id',
          trigger: 'shortcut',
        },
        eventType: 'screen',
      });
    });

    it('sould trigger the UI Event of "entered text" when user types in the search bar', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
        updateInputFieldWithStateUpdated,
        createAnalyticsEvent,
      } = await setup({
        waitForResolves: true,
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          Promise.resolve(searchProviderMockResults.slice(0, 3)),
        ],
      });
      const query = 'some value';
      await searchRecentPromise;
      component.update();

      await updateInputFieldWithStateUpdated('link-url', query);
      clock.tick(500);

      await quickSearchPromises[0];
      component.update();

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'entered',
        actionSubject: 'text',
        actionSubjectId: 'linkSearchInput',
        attributes: {
          source: 'createLinkInlineDialog',
          queryLength: query.length,
          queryVersion: 1,
          queryHash: sha1(query),
          searchSessionId: 'a-unique-id',
          wordCount: 2,
        },
        nonPrivacySafeAttributes: {
          query,
        },
        eventType: 'ui',
      });
    });

    it('sould trigger the UI Event of "entered text" with incremental query version', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
        updateInputFieldWithStateUpdated,
        createAnalyticsEvent,
      } = await setup({
        waitForResolves: true,
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          Promise.resolve(searchProviderMockResults.slice(0, 3)),
        ],
      });
      const query = 'some value';
      await searchRecentPromise;
      component.update();

      await updateInputFieldWithStateUpdated('link-url', 'first query');
      clock.tick(500);
      await quickSearchPromises[0];
      component.update();

      // Trigger the search second time should increase
      // the query version from 0 to 1
      await updateInputFieldWithStateUpdated('link-url', query);
      clock.tick(500);
      await quickSearchPromises[0];
      component.update();

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'entered',
        actionSubject: 'text',
        actionSubjectId: 'linkSearchInput',
        attributes: {
          source: 'createLinkInlineDialog',
          queryLength: query.length,
          queryVersion: 2,
          queryHash: sha1(query),
          searchSessionId: 'a-unique-id',
          wordCount: 2,
        },
        nonPrivacySafeAttributes: {
          query,
        },
        eventType: 'ui',
      });
    });

    it('should trigger the UI Event of "show searchResult" (pre-query) when recent activity items are returned', async () => {
      const {
        component,
        createAnalyticsEvent,
        recentItemsPromise,
      } = await setup({
        waitForResolves: true,
        recentItemsPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
      });
      await recentItemsPromise;
      component.update();

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'shown',
        actionSubject: 'searchResult',
        actionSubjectId: 'preQuerySearchResults',
        attributes: {
          source: 'createLinkInlineDialog',
          preQueryRequestDurationMs: expect.any(Number),
          searchSessionId: 'a-unique-id',
          resultCount: 2,
          results: [
            {
              resultContentId: 'object-id-1',
              resultType: 'ISSUE',
            },
            {
              resultContentId: 'object-id-2',
              resultType: 'ISSUE',
            },
          ],
        },
        eventType: 'ui',
      });
    });

    it('should trigger the UI Event of "show searchResult" (post-query) when quick search items are returned', async () => {
      const {
        component,
        createAnalyticsEvent,
        searchRecentPromise,
        quickSearchPromises,
        updateInputFieldWithStateUpdated,
      } = await setup({
        waitForResolves: true,
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          Promise.resolve(searchProviderMockResults.slice(0, 3)),
        ],
      });
      const query = 'some value';
      await searchRecentPromise;
      component.update();

      await updateInputFieldWithStateUpdated('link-url', query);
      clock.tick(500);

      await quickSearchPromises[0];
      component.update();

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'shown',
        actionSubject: 'searchResult',
        actionSubjectId: 'postQuerySearchResults',
        attributes: {
          source: 'createLinkInlineDialog',
          postQueryRequestDurationMs: expect.any(Number),
          searchSessionId: 'a-unique-id',
          resultCount: 3,
          results: [
            {
              resultContentId: 'object-id-1',
              resultType: 'jira.issue',
            },
            {
              resultContentId: 'object-id-2',
              resultType: 'confluence.page',
            },
            {
              resultContentId: 'object-id-3',
              resultType: 'confluence.blogpost',
            },
          ],
        },
        eventType: 'ui',
      });
    });

    it('should trigger the UI Event of "highlighted searchResult" when items are highlighted using arrow key', async () => {
      const {
        component,
        createAnalyticsEvent,
        recentItemsPromise,
        pressDownArrowInputField,
      } = await setup({
        waitForResolves: true,
        recentItemsPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
      });
      await recentItemsPromise;
      component.update();

      pressDownArrowInputField('link-url');
      await flushPromises();

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'highlighted',
        actionSubject: 'searchResult',
        attributes: {
          source: 'createLinkInlineDialog',
          searchSessionId: 'a-unique-id',
          selectedResultId: 'object-id-1',
          selectedRelativePosition: 0,
        },
        eventType: 'ui',
      });
    });

    it('should trigger the UI Event of "selected searchResult" when an item is selected to insert', async () => {
      const {
        component,
        searchRecentPromise,
        pressDownArrowInputField,
        pressReturnInputField,
        createAnalyticsEvent,
      } = await setup({
        waitForResolves: true,
      });

      await searchRecentPromise;
      component.update();
      pressDownArrowInputField('link-url');
      pressReturnInputField('link-url');

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'selected',
        actionSubject: 'searchResult',
        attributes: {
          source: 'createLinkInlineDialog',
          searchSessionId: 'a-unique-id',
          trigger: 'keyboard',
          resultCount: 5,
          selectedResultId: 'object-id-1',
          selectedRelativePosition: 0,
        },
        eventType: 'ui',
      });
    });

    it('should trigger the UI Event of "selected searchResult" when an item is selected through mouse click to insert', async () => {
      const {
        component,
        searchRecentPromise,
        createAnalyticsEvent,
      } = await setup({
        waitForResolves: true,
      });

      await searchRecentPromise;
      component.update();

      component.find(LinkSearchListItem).at(0).simulate('mouseenter');
      component.find(LinkSearchListItem).at(0).simulate('click');

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'selected',
        actionSubject: 'searchResult',
        attributes: {
          source: 'createLinkInlineDialog',
          searchSessionId: 'a-unique-id',
          trigger: 'click',
          resultCount: 5,
          selectedResultId: 'object-id-1',
          selectedRelativePosition: 0,
        },
        eventType: 'ui',
      });
    });

    it('should trigger the UI Event of "dismissed searchResult" when it unmounts', async () => {
      const {
        component,
        searchRecentPromise,
        createAnalyticsEvent,
      } = await setup({
        waitForResolves: true,
      });

      await searchRecentPromise;
      component.update();
      component.unmount();

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'dismissed',
        actionSubject: 'createLinkInlineDialog',
        attributes: {
          source: 'createLinkInlineDialog',
          searchSessionId: 'a-unique-id',
          trigger: 'blur',
        },
        eventType: 'ui',
      });
    });

    it('should NOT trigger the UI Event of "dismissed searchResult" when have item selected', async () => {
      const {
        component,
        searchRecentPromise,
        pressDownArrowInputField,
        pressReturnInputField,
        createAnalyticsEvent,
      } = await setup({
        waitForResolves: true,
      });

      await searchRecentPromise;
      component.update();

      pressDownArrowInputField('link-url');
      pressReturnInputField('link-url');
      component.unmount();

      expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
        action: 'dismissed',
        actionSubject: 'createLinkInlineDialog',
        attributes: {
          source: 'createLinkInlineDialog',
          searchSessionId: 'a-unique-id',
          trigger: 'blur',
        },
        eventType: 'ui',
      });
    });

    it('should trigger the Operational Event of "invoked searchResult" when activityProvider is called', async () => {
      const { component, createAnalyticsEvent } = await setup();
      component.update();
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'invoked',
        actionSubject: 'searchResult',
        actionSubjectId: 'recentActivities',
        attributes: {
          count: 5,
          duration: expect.any(Number),
        },
        eventType: 'operational',
      });
    });

    it('should trigger the Operational Event with error message if activity request fails', async () => {
      const recentItemsPromise = Promise.reject(
        new ActivityError('Internal Server Error', 500),
      );
      const {
        component,
        activityProviderPromise,
        createAnalyticsEvent,
      } = await setup({
        waitForResolves: false,
        recentItemsPromise,
      });
      await activityProviderPromise;
      try {
        await recentItemsPromise;
      } catch (e) {}
      component.update();

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'invoked',
        actionSubject: 'searchResult',
        actionSubjectId: 'recentActivities',
        attributes: {
          count: -1,
          duration: expect.any(Number),
          errorCode: 500,
        },
        nonPrivacySafeAttributes: {
          error: 'Internal Server Error',
        },
        eventType: 'operational',
      });
    });

    it('should trigger the Operational Event of "invoked searchResult" when quickSearch is called', async () => {
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
        updateInputFieldWithStateUpdated,
        createAnalyticsEvent,
      } = await setup({
        waitForResolves: true,
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          Promise.resolve(searchProviderMockResults.slice(2, 5)),
        ],
      });

      const query = 'some value';
      await searchRecentPromise;
      component.update();

      await updateInputFieldWithStateUpdated('link-url', query);
      clock.tick(500);
      await quickSearchPromises[0];
      component.update();

      component.update();
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'invoked',
        actionSubject: 'searchResult',
        actionSubjectId: 'quickSearch',
        attributes: {
          count: 3,
          duration: expect.any(Number),
        },
        eventType: 'operational',
      });
    });

    it('should trigger the Operational Event with error message if quick search request fails', async () => {
      let rejectQuickSearch: any = () => {
        throw new Error('rejectQuickSearch is not assigned with a value');
      };
      const {
        component,
        searchRecentPromise,
        quickSearchPromises,
        updateInputFieldWithStateUpdated,
        createAnalyticsEvent,
      } = await setup({
        waitForResolves: true,
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          new Promise((_, reject) => {
            rejectQuickSearch = () => {
              reject(new Error('Internal Server Error'));
            };
          }),
        ],
      });

      const query = 'some value';
      await searchRecentPromise;
      component.update();

      await updateInputFieldWithStateUpdated('link-url', query);
      clock.tick(500);
      rejectQuickSearch();
      try {
        await quickSearchPromises[0];
        component.update();
      } catch (e) {}

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'invoked',
        actionSubject: 'searchResult',
        actionSubjectId: 'quickSearch',
        attributes: {
          count: -1,
          duration: expect.any(Number),
        },
        nonPrivacySafeAttributes: {
          error: 'Internal Server Error',
        },
        eventType: 'operational',
      });
    });
  });

  describe('others', () => {
    it('should call card hideLinkToolbar when mousedown outside element', async () => {
      const spyHideLinkToolbar = jest.spyOn(Commands, 'hideLinkToolbar');

      const { eventListenerMap } = await setup();

      const mousedown = eventListenerMap.mousedown as EventListener;

      mousedown({
        target: document.body as EventTarget,
      } as Event);

      expect(spyHideLinkToolbar).toBeCalled();
    });

    it('should not call card hideLinkToolbar when mousedown inside element', async () => {
      const spyHideLinkToolbar = jest.spyOn(Commands, 'hideLinkToolbar');

      const { eventListenerMap, component } = await setup();

      const mousedown = eventListenerMap.mousedown as EventListener;

      mousedown({
        target: component.instance(),
      } as Event);

      expect(spyHideLinkToolbar).not.toBeCalled();
    });

    it('should not trigger search if the input query starts with https://', async () => {
      const {
        component,
        activityProviderPromise,
        searchProviderPromise,
        updateInputFieldWithStateUpdated,
      } = await setup({
        waitForResolves: true,
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          Promise.resolve(searchProviderMockResults.slice(0, 3)),
        ],
      });

      if (!activityProviderPromise) {
        return expect(activityProviderPromise).toBeDefined();
      }
      if (!searchProviderPromise) {
        return expect(searchProviderPromise).toBeDefined();
      }

      const query = 'https://www.atlassian.com';
      const activityProvider = await activityProviderPromise;
      const searchProvider = await searchProviderPromise;

      await updateInputFieldWithStateUpdated('link-url', query);
      clock.tick(500);
      component.update();

      const items = component.find(LinkSearchList).props().items;
      if (!items) {
        return expect(items).toBeDefined();
      }
      expect(items).toHaveLength(0);

      expect(activityProvider.searchRecent).toHaveBeenCalledTimes(0);
      expect(searchProvider.quickSearch).toHaveBeenCalledTimes(0);
    });

    it('should not trigger search if the input query starts with http://', async () => {
      const {
        component,
        activityProviderPromise,
        searchProviderPromise,
        updateInputFieldWithStateUpdated,
      } = await setup({
        waitForResolves: true,
        searchRecentPromise: Promise.resolve(
          activityProviderMockResults.slice(0, 2),
        ),
        quickSearchPromises: [
          Promise.resolve(searchProviderMockResults.slice(0, 3)),
        ],
      });

      if (!activityProviderPromise) {
        return expect(activityProviderPromise).toBeDefined();
      }
      if (!searchProviderPromise) {
        return expect(searchProviderPromise).toBeDefined();
      }

      const query = 'http://www.atlassian.com';
      const activityProvider = await activityProviderPromise;
      const searchProvider = await searchProviderPromise;

      await updateInputFieldWithStateUpdated('link-url', query);
      clock.tick(500);
      component.update();

      const items = component.find(LinkSearchList).props().items;
      if (!items) {
        return expect(items).toBeDefined();
      }
      expect(items).toHaveLength(0);

      expect(activityProvider.searchRecent).toHaveBeenCalledTimes(0);
      expect(searchProvider.quickSearch).toHaveBeenCalledTimes(0);
    });

    it('should render PanelTextInput (URL field) with correct describedById prop', async () => {
      const screenReaderDescriptionId = 'search-recent-links-field-description';
      const { component } = await setup();
      expect(
        component.find(PanelTextInput).first().prop('describedById'),
      ).toEqual(screenReaderDescriptionId);
    });
    it('should render LinkSearchList component with correct ariaControls prop', async () => {
      const ariaControlValue = 'fabric.editor.hyperlink.suggested.results';
      const { component } = await setup();
      expect(component.find(LinkSearchList).prop('ariaControls')).toEqual(
        ariaControlValue,
      );
    });
  });
});
