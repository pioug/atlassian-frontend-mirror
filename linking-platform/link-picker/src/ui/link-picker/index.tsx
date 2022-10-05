/** @jsx jsx */
import {
  FormEvent,
  Fragment,
  KeyboardEvent,
  useCallback,
  useEffect,
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

import createEventPayload from '../../analytics.codegen';

import { ANALYTICS_CHANNEL } from '../../common/constants';
import {
  useLinkPickerAnalytics,
  withInputFieldTracking,
  withLinkPickerAnalyticsContext,
} from '../../common/analytics';
import { normalizeUrl, isSafeUrl } from '../../common/utils/url';
import { usePlugins } from '../../services/use-plugins';
import { useSearchQuery } from '../../services/use-search-query';
import useFixHeight from '../../controllers/use-fix-height';

import {
  searchMessages,
  linkMessages,
  formMessages,
  linkTextMessages,
} from './messages';
import TextInput from './text-input';
import {
  rootContainerStyles,
  searchIconStyles,
  tabsWrapperStyles,
  flexColumnStyles,
  formFooterMargin,
} from './styled';
import { browser } from './browser';
import Announcer from './announcer';

import LinkSearchList, { testIds as listTestIds } from './link-search-list';
import LinkSearchError, {
  testIds as searchErrorTestIds,
} from './link-search-error';
import FormFooter, { testIds as formFooterTestIds } from './form-footer';
import { getDataSource, getScreenReaderText } from './utils';
import {
  succeedUfoExperience,
  ufoExperience,
} from '../../common/analytics/experiences';
import { useLinkPickerSessionId } from '../../controllers/session-provider';

export const RECENT_SEARCH_LIST_SIZE = 5;

export const testIds = {
  linkPicker: 'link-picker',
  urlInputField: 'link-url',
  textInputField: 'link-text',
  searchIcon: 'link-picker-search-icon',
  ...formFooterTestIds,
  ...searchErrorTestIds,
  ...listTestIds,
  clearUrlButton: 'clear-text',
  urlError: 'link-error',
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
}

export interface PickerState {
  selectedIndex: number;
  activeIndex: number;
  url: string;
  displayText: string;
  invalidUrl: boolean;
  activeTab: number;
}

const initState = {
  url: '',
  displayText: '',
  activeIndex: -1,
  selectedIndex: -1,
  invalidUrl: false,
  activeTab: 0,
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
  } = usePlugins(queryState, activeTab, plugins);

  const fixListHeightProps = useFixHeight(isLoading);

  const isEditing = !!initUrl;
  const selectedItem: LinkSearchListItemData | undefined =
    items?.[selectedIndex];
  const isSelectedItem = selectedItem?.url === url;

  const { trackAttribute, getAttributes } = useLinkPickerAnalytics();

  const linkPickerSessionId = useLinkPickerSessionId();

  useLayoutEffect(() => {
    succeedUfoExperience(ufoExperience.mounted, linkPickerSessionId);
  }, [linkPickerSessionId]);

  useEffect(() => {
    // Anything in here is fired on component mount.
    const event = createAnalyticsEvent(
      createEventPayload('ui.inlineDialog.viewed.linkPicker', {}),
    );

    event.fire(ANALYTICS_CHANNEL);

    return () => {
      // Anything in here is fired on component unmount.
      const event = createAnalyticsEvent(
        createEventPayload('ui.inlineDialog.closed.linkPicker', {}),
      );

      event.fire(ANALYTICS_CHANNEL);
    };
  }, [createAnalyticsEvent]);

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
      });
    },
    [trackAttribute],
  );

  const handleChangeText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      displayText: e.currentTarget.value,
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;
      const KEY_ARROW_DOWN = 'ArrowDown';
      const KEY_ARROW_UP = 'ArrowUp';

      if (!items || !items.length) {
        return;
      }

      let updatedIndex = activeIndex;
      switch (key) {
        case KEY_ARROW_DOWN: // down
          event.preventDefault();
          updatedIndex = (activeIndex + 1) % items.length;
          break;

        case KEY_ARROW_UP: // up
          event.preventDefault();
          updatedIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
          break;
      }

      const item = items[updatedIndex];

      if ([KEY_ARROW_DOWN, KEY_ARROW_UP].includes(key) && item) {
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
    [activeIndex, items, trackAttribute, activePlugin],
  );

  const handleClear = useCallback((field: string) => {
    dispatch({
      [field]: '',
    });
  }, []);

  const handleUrlClear = useCallback(() => {
    trackAttribute('linkFieldContentInputSource', null);
    handleClear('url');
  }, [trackAttribute, handleClear]);

  const handleMouseEnterResultItem = useCallback(
    (objectId: string) => {
      const index = items?.findIndex(item => item.objectId === objectId);
      dispatch({
        activeIndex: index ?? -1,
      });
    },
    [items],
  );

  const handleMouseLeaveResultItem = useCallback(
    (objectId: string) => {
      const index = items?.findIndex(item => item.objectId === objectId);
      // This is to avoid updating index that was set by other mouseenter event
      if (activeIndex === index) {
        dispatch({
          activeIndex: -1,
        });
      }
    },
    [activeIndex, items],
  );

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
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
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
    [handleInsert, isSelectedItem, selectedItem, url],
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
    browser.safari && getScreenReaderText(items ?? [], selectedIndex, intl);

  const searchIcon = isActivePlugin && (
    <span css={searchIconStyles} data-testid={testIds.searchIcon}>
      <EditorSearchIcon size="medium" label={''} />
    </span>
  );

  return (
    <form
      data-testid={testIds.linkPicker}
      css={rootContainerStyles}
      onSubmit={handleSubmit}
    >
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
        onClear={handleUrlClear}
        onKeyDown={handleKeyDown}
        onChange={handleChangeUrl}
      />
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
        onKeyDown={handleKeyDown}
        onChange={handleChangeText}
      />
      {isActivePlugin && !!queryState && (
        <Fragment>
          {tabs.length > 0 && (
            <div css={tabsWrapperStyles}>
              <Tabs
                id={testIds.tabList}
                testId={testIds.tabList}
                onChange={activeTab =>
                  dispatch({
                    selectedIndex: -1,
                    activeIndex: -1,
                    invalidUrl: false,
                    activeTab,
                  })
                }
              >
                <TabList>
                  {tabs.map(tab => (
                    <Tab key={tab.tabTitle} testId={testIds.tabItem}>
                      {tab.tabTitle}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
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
                onMouseEnter={handleMouseEnterResultItem}
                onMouseLeave={handleMouseLeaveResultItem}
                error={error}
                hasSearchTerm={!!queryState?.query.length}
              />
            )}
            {error && (errorFallback?.(error, retry) ?? <LinkSearchError />)}
          </div>
        </Fragment>
      )}
      <FormFooter
        css={!queryState || !plugins?.length ? formFooterMargin : undefined}
        isEditing={isEditing}
        onCancel={onCancel}
      />
    </form>
  );
}

export default withLinkPickerAnalyticsContext(memo(LinkPicker));
