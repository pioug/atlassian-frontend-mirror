/** @jsx jsx */
import {
  FormEvent,
  Fragment,
  KeyboardEvent,
  useCallback,
  useLayoutEffect,
  useReducer,
  ChangeEvent,
  memo,
} from 'react';
import { jsx } from '@emotion/react';
import { useIntl, FormattedMessage } from 'react-intl-next';
import { useAnalyticsEvents, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import Tabs, { Tab, TabList } from '@atlaskit/tabs';
import VisuallyHidden from '@atlaskit/visually-hidden';

import {
  LinkSearchListItemData,
  LinkInputType,
  LinkPickerPlugin,
} from '../types';

import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { ANALYTICS_CHANNEL } from '../../common/constants';
import {
  useLinkPickerAnalytics,
  withInputFieldTracking,
  withLinkPickerAnalyticsContext,
} from '../../common/analytics';
import { normalizeUrl, isSafeUrl } from '@atlaskit/linking-common/url';
import { browser } from '@atlaskit/linking-common/user-agent';

import { usePlugins } from '../../services/use-plugins';
import { useSearchQuery } from '../../services/use-search-query';
import useFixHeight from '../../controllers/use-fix-height';

import {
  searchMessages,
  linkMessages,
  formMessages,
  linkTextMessages,
} from './messages';
import TextInput, { testIds as textFieldTestIds } from './text-input';
import {
  rootContainerStyles,
  searchIconStyles,
  tabsWrapperStyles,
  flexColumnStyles,
  formFooterMargin,
} from './styled';
import Announcer from './announcer';
import ScrollingTabList from '../scrolling-tabs';

import LinkSearchList, { testIds as listTestIds } from './link-search-list';
import LinkSearchError, {
  testIds as searchErrorTestIds,
} from './link-search-error';
import FormFooter, { testIds as formFooterTestIds } from './form-footer';
import { getDataSource, getScreenReaderText, handleNavKeyDown } from './utils';

import TrackTabViewed from './track-tab-viewed';
import TrackMount from './track-mount';

export const RECENT_SEARCH_LIST_SIZE = 5;

export const testIds = {
  linkPickerRoot: 'link-picker-root',
  linkPicker: 'link-picker',
  urlInputField: 'link-url',
  textInputField: 'link-text',
  searchIcon: 'link-picker-search-icon',
  ...formFooterTestIds,
  ...searchErrorTestIds,
  ...listTestIds,
  ...textFieldTestIds,
  tabList: 'link-picker-tabs',
  tabItem: 'link-picker-tab',
} as const;

interface Meta {
  /** Indicates how the link was picked. */
  inputMethod: LinkInputType;
}

interface OnSubmitParameter {
  /** The `url` of the linked resource. */
  url: string;
  /** The desired text to be displayed alternatively to the title of the linked resource. */
  displayText: string | null;
  /** The resolved `title` of the resource at the time of link picking (if applicable, null if not known). */
  title: string | null;
  /** Meta data about the link picking submission. */
  meta: Meta;
  /**
   * The input value of the `url` field at time of submission if inserted "manually".
   * This can useful if the `url` was manually inserted with a value that is different from the normalised value returned as `url`.
   * @example
   * { url: 'https://google.com', rawUrl: 'google.com' }
   */
  rawUrl?: string;
}

export interface LinkPickerProps {
  /**
   * Callback to fire on form submission.
   */
  onSubmit: (
    arg: OnSubmitParameter,
    analytic?: UIAnalyticsEvent | null,
  ) => void;
  /** Callback to fire when the cancel button is clicked. */
  onCancel: () => void;
  /** Callback to fire when content is changed inside the link picker e.g. items, when loading, tabs */
  onContentResize?: () => void;
  /** The url of the linked resource for editing. */
  url?: string;
  /** The desired text to be displayed alternatively to the title of the linked resource for editing. */
  displayText?: string | null;
  /** Plugins that provide link suggestions / search capabilities. */
  plugins?: LinkPickerPlugin[];
  /** Customise the link picker root component */
  component?: React.ComponentType<
    Partial<LinkPickerProps> & { children: React.ReactElement }
  >;
  /** Hides the link picker display text field if set to true. */
  hideDisplayText?: boolean;
  featureFlags?: Record<string, unknown>;
}

export interface PickerState {
  selectedIndex: number;
  activeIndex: number;
  url: string;
  displayText: string;
  invalidUrl: boolean;
  activeTab: number;
  /** When true, even if the selected index is -1, don't hide the recents. */
  preventHidingRecents: boolean;
}

const initState: PickerState = {
  url: '',
  displayText: '',
  activeIndex: -1,
  selectedIndex: -1,
  invalidUrl: false,
  activeTab: 0,
  preventHidingRecents: false,
};

function reducer(state: PickerState, payload: Partial<PickerState>) {
  if (payload.url && state.url !== payload.url) {
    return {
      ...state,
      invalidUrl: false,
      selectedIndex:
        isSafeUrl(payload.url) && payload.url.length ? -1 : state.selectedIndex,
      ...payload,
    };
  }

  return { ...state, ...payload };
}

/**
 * Bind input fields to analytics tracking
 */

const getLinkFieldContent = (value: string) => {
  if (!Boolean(value)) {
    return null;
  }
  return isSafeUrl(value) ? 'url' : 'text_string';
};

const LinkInputField = withInputFieldTracking(
  TextInput,
  'link',
  (event, attributes) => ({
    ...attributes,
    linkFieldContent: getLinkFieldContent(event.currentTarget.value),
  }),
);

const DisplayTextInputField = withInputFieldTracking(TextInput, 'displayText');

function LinkPicker({
  onSubmit,
  onCancel,
  onContentResize,
  plugins,
  url: initUrl,
  displayText: initDisplayText,
  hideDisplayText,
  featureFlags,
}: LinkPickerProps) {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const [state, dispatch] = useReducer(reducer, {
    ...initState,
    url: normalizeUrl(initUrl) || '',
    displayText: initDisplayText || '',
  });

  const {
    activeIndex,
    selectedIndex,
    url,
    displayText,
    invalidUrl,
    activeTab,
  } = state;

  const intl = useIntl();
  const queryState = useSearchQuery(state);

  const {
    items,
    isLoading,
    isActivePlugin,
    activePlugin,
    tabs,
    error,
    retry,
    errorFallback,
    pluginAction,
  } = usePlugins(queryState, activeTab, plugins);

  const fixListHeightProps = useFixHeight(isLoading);

  const isEditing = !!initUrl;
  const selectedItem: LinkSearchListItemData | undefined =
    items?.[selectedIndex];
  const isSelectedItem = selectedItem?.url === url;

  const { trackAttribute, getAttributes } = useLinkPickerAnalytics();

  useLayoutEffect(() => {
    if (onContentResize) {
      onContentResize();
    }
  }, [onContentResize, items, isLoading, isActivePlugin, tabs]);

  const handleChangeUrl = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      /** Any on change event is triggered by manual input or paste, so source is null */
      trackAttribute('linkFieldContentInputSource', null);
      dispatch({
        url: e.currentTarget.value,
        // If the last action was changing tabs, make sure we're now allowing recents to be hidden
        preventHidingRecents: false,
      });
    },
    [dispatch, trackAttribute],
  );

  const handleChangeText = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch({
        displayText: e.currentTarget.value,
      });
    },
    [dispatch],
  );

  const handleClear = useCallback(
    (field: string) => {
      dispatch({
        activeIndex: -1,
        selectedIndex: -1,
        [field]: '',
      });
    },
    [dispatch],
  );

  const handleUrlClear = useCallback(() => {
    trackAttribute('linkFieldContentInputSource', null);
    handleClear('url');
  }, [trackAttribute, handleClear]);

  const handleInsert = useCallback(
    (url: string, title: string | null, inputType: LinkInputType) => {
      const event = createAnalyticsEvent(
        createEventPayload('ui.form.submitted.linkPicker', {}),
      );

      // Clone the event so that it can be emitted for consumer usage
      // This must happen BEFORE the original event is fired!
      const consumerEvent = event.clone();
      // Cloned event doesnt have the attributes that are added by
      // the analytics listener in the LinkPickerAnalyticsContext, add them here
      consumerEvent?.update({ attributes: getAttributes() });
      // Dispatch the original event to our channel
      event.fire(ANALYTICS_CHANNEL);

      onSubmit(
        {
          url,
          displayText: displayText || null,
          title: title || null,
          meta: { inputMethod: inputType },
          ...(inputType === 'manual' ? { rawUrl: state.url } : {}),
        },
        consumerEvent,
      );
    },
    [displayText, onSubmit, state.url, createAnalyticsEvent, getAttributes],
  );

  const handleSelected = useCallback(
    (objectId: string) => {
      const selectedItem = items?.find(item => item.objectId === objectId);

      if (selectedItem) {
        const { url, name } = selectedItem;
        /**
         * Manually track that the url has been updated using searchResult method
         */
        dispatchEvent(new Event('submit'));
        trackAttribute('linkFieldContent', getLinkFieldContent(url));
        trackAttribute('linkFieldContentInputMethod', 'searchResult');
        trackAttribute(
          'linkFieldContentInputSource',
          getDataSource(selectedItem, activePlugin),
        );
        handleInsert(url, name, 'typeAhead');
      }
    },
    [handleInsert, trackAttribute, items, activePlugin],
  );

  const handleSubmit = useCallback(
    (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (isSelectedItem && selectedItem) {
        return handleInsert(selectedItem.url, selectedItem.name, 'typeAhead');
      }

      const normalized = normalizeUrl(url);
      if (normalized) {
        return handleInsert(normalized, null, 'manual');
      }

      return dispatch({
        invalidUrl: true,
      });
    },
    [dispatch, handleInsert, isSelectedItem, selectedItem, url],
  );

  const handleTabChange = useCallback(
    (activeTab: number) => {
      dispatch({
        // We don't want any selection to exist after changing tab, as the selection
        // wouldn't mean anything.
        activeIndex: -1,
        selectedIndex: -1,

        // We don't want recents to be hidden, even though we don't have a selection
        preventHidingRecents: true,
        invalidUrl: false,
        activeTab,
      });
      trackAttribute('tab', plugins?.[activeTab]?.tabKey ?? null);
    },
    [dispatch, plugins, trackAttribute],
  );

  const handleSearchListOnChange = (id: string) => {
    const index = items?.findIndex(item => item.objectId === id);
    if (typeof index === 'number') {
      const item = items?.[index];
      if (item) {
        /**
         * Manually track that the url has been updated using searchResult method
         */
        trackAttribute('linkFieldContent', getLinkFieldContent(item.url));
        trackAttribute('linkFieldContentInputMethod', 'searchResult');
        trackAttribute(
          'linkFieldContentInputSource',
          getDataSource(item, activePlugin),
        );
        dispatch({
          activeIndex: index,
          selectedIndex: index,
          url: item.url,
          invalidUrl: false,
        });
      }
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!items?.length) {
        return;
      }

      let updatedIndex = activeIndex;
      if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedItem) {
          handleSelected(selectedItem.objectId);
        } else {
          // triggers validation error message
          handleSubmit();
        }
      } else {
        updatedIndex = handleNavKeyDown(event, items.length, activeIndex);
      }

      const item = items[updatedIndex];

      if (
        ['Enter', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) &&
        item
      ) {
        /**
         * Manually track that the url has been updated using searchResult method
         */
        trackAttribute('linkFieldContent', getLinkFieldContent(item.url));
        trackAttribute('linkFieldContentInputMethod', 'searchResult');
        trackAttribute(
          'linkFieldContentInputSource',
          getDataSource(item, activePlugin),
        );
        dispatch({
          activeIndex: updatedIndex,
          selectedIndex: updatedIndex,
          url: item.url,
          invalidUrl: false,
        });
      }
    },
    [
      items,
      activeIndex,
      selectedItem,
      handleSelected,
      handleSubmit,
      trackAttribute,
      activePlugin,
    ],
  );

  const messages = isActivePlugin ? searchMessages : linkMessages;

  const screenReaderDescriptionId = 'search-recent-links-field-description';
  const linkSearchListId = 'link-picker-search-list';
  const ariaActiveDescendant =
    selectedIndex > -1 ? `link-search-list-item-${selectedIndex}` : '';

  // Added workaround with a screen reader Announcer specifically for VoiceOver + Safari
  // as the Aria design pattern for combobox does not work in this case
  // for details: https://a11y-internal.atlassian.net/browse/AK-740
  const screenReaderText =
    browser().safari && getScreenReaderText(items ?? [], selectedIndex, intl);

  const searchIcon = isActivePlugin && (
    <span css={searchIconStyles} data-testid={testIds.searchIcon}>
      <EditorSearchIcon size="medium" label={''} />
    </span>
  );

  const tabList = (
    <TabList>
      {tabs.map(tab => (
        <Tab key={tab.tabTitle} testId={testIds.tabItem}>
          {tab.tabTitle}
        </Tab>
      ))}
    </TabList>
  );

  return (
    <form
      data-testid={testIds.linkPicker}
      css={rootContainerStyles}
      onSubmit={handleSubmit}
    >
      <TrackMount />
      {screenReaderText && (
        <Announcer
          ariaLive="assertive"
          text={screenReaderText}
          ariaRelevant="additions"
          delay={250}
        />
      )}
      <VisuallyHidden id={screenReaderDescriptionId}>
        <FormattedMessage {...messages.linkAriaLabel} />
      </VisuallyHidden>
      <LinkInputField
        role="combobox"
        autoComplete="off"
        name="url"
        testId={testIds.urlInputField}
        label={intl.formatMessage(messages.linkLabel)}
        placeholder={intl.formatMessage(messages.linkPlaceholder)}
        value={url}
        autoFocus
        elemBeforeInput={searchIcon}
        clearLabel={intl.formatMessage(formMessages.clearLink)}
        aria-expanded
        aria-autocomplete="list"
        aria-controls={linkSearchListId}
        aria-activedescendant={ariaActiveDescendant}
        aria-describedby={screenReaderDescriptionId}
        error={invalidUrl ? intl.formatMessage(formMessages.linkInvalid) : null}
        spotlightTargetName="link-picker-search-field-spotlight-target"
        onClear={handleUrlClear}
        onKeyDown={handleKeyDown}
        onChange={handleChangeUrl}
      />
      {!hideDisplayText && (
        <DisplayTextInputField
          autoComplete="off"
          name="displayText"
          testId={testIds.textInputField}
          value={displayText}
          label={intl.formatMessage(linkTextMessages.linkTextLabel)}
          placeholder={intl.formatMessage(linkTextMessages.linkTextPlaceholder)}
          clearLabel={intl.formatMessage(linkTextMessages.clearLinkText)}
          aria-label={intl.formatMessage(linkTextMessages.linkTextAriaLabel)}
          onClear={handleClear}
          onChange={handleChangeText}
        />
      )}
      {isActivePlugin && !!queryState && (
        <Fragment>
          {tabs.length > 0 && (
            <div css={tabsWrapperStyles}>
              <Tabs
                id={testIds.tabList}
                testId={testIds.tabList}
                selected={activeTab}
                onChange={handleTabChange}
              >
                {featureFlags?.scrollingTabs ? (
                  <ScrollingTabList>{tabList}</ScrollingTabList>
                ) : (
                  tabList
                )}
              </Tabs>
              <TrackTabViewed activePlugin={activePlugin} />
            </div>
          )}
          <div css={flexColumnStyles} {...fixListHeightProps}>
            {!error && (
              <LinkSearchList
                id={linkSearchListId}
                role="listbox"
                items={items}
                isLoading={isLoading}
                selectedIndex={selectedIndex}
                activeIndex={activeIndex}
                onSelect={handleSelected}
                onChange={handleSearchListOnChange}
                onKeyDown={handleKeyDown}
                hasSearchTerm={!!queryState?.query.length}
              />
            )}
            {error && (errorFallback?.(error, retry) ?? <LinkSearchError />)}
          </div>
        </Fragment>
      )}
      <FormFooter
        error={error}
        items={items}
        state={queryState}
        isLoading={isLoading}
        isEditing={isEditing}
        onCancel={onCancel}
        action={pluginAction}
        css={!queryState || !plugins?.length ? formFooterMargin : undefined}
      />
    </form>
  );
}

export default withLinkPickerAnalyticsContext(memo(LinkPicker));
