/** @jsx jsx */
import type { KeyboardEvent, RefObject } from 'react';
import React, { PureComponent } from 'react';

import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import { flushSync } from 'react-dom';
import type { WrappedComponentProps } from 'react-intl-next';
import { defineMessages, injectIntl } from 'react-intl-next';

import type {
  ActivityItem,
  ActivityProvider,
} from '@atlaskit/activity-provider';
import { isSafeUrl } from '@atlaskit/adf-schema';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import Page16Icon from '@atlaskit/icon-object/glyph/page/16';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { N200, N90 } from '@atlaskit/theme/colors';
import { fontSizeSmall } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type {
  CreateLinkInlineDialogEventPayload,
  FireAnalyticsCallback,
} from '../../../analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  fireAnalyticsEvent,
  INPUT_METHOD,
} from '../../../analytics';
import type { HyperlinkState } from '../../../link';
import type {
  QuickSearchResult,
  SearchProvider,
} from '../../../provider-factory';
import type { Command, LinkInputType } from '../../../types';
import { Announcer, PanelTextInput } from '../../../ui';
import { browser, normalizeUrl } from '../../../utils';
import LinkSearchList from '../../LinkSearch/LinkSearchList';
import {
  container,
  containerWithProvider,
  inputWrapper,
} from '../../LinkSearch/ToolbarComponents';
import { transformTimeStamp } from '../../LinkSearch/transformTimeStamp';
import type { LinkSearchListItemData } from '../../LinkSearch/types';

import {
  filterUniqueItems,
  mapContentTypeToIcon,
  sha1,
  wordCount,
} from './utils';

/**
 * Visible only to screenreaders. Use when there is a need
 * to provide more context to a non-sighted user.
 */
export const visuallyHiddenStyles = css({
  clip: 'rect(1px, 1px, 1px, 1px)',
  clipPath: 'inset(50%)',
  height: '1px',
  width: '1px',
  margin: token('space.negative.025', '-2px'),
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
});

export const RECENT_SEARCH_LIST_SIZE = 5;

const clearText = css({
  cursor: 'pointer',
  padding: 0,
  marginRight: token('space.100', '8px'),
  color: token('color.icon.subtle', N90),
  background: 'transparent',
  border: 'none',
});

const clearTextWrapper = css({
  position: 'absolute',
  right: 0,
});
const containerPadding = css({
  padding: `${token('space.150', '12px')} ${token('space.100', '8px')}`,
});

const textLabelMargin = css({
  marginTop: token('space.150', '12px'),
});

const inputLabel = css({
  fontSize: `${fontSizeSmall()}px`,
  color: token('color.text.subtlest', N200),
  fontWeight: 500,
  paddingBottom: token('space.050', '4px'),
});

const inputWrapperPosition = css({
  position: 'relative',
});

export const messages = defineMessages({
  displayText: {
    id: 'fabric.editor.displayText',
    defaultMessage: 'Text to display',
    description: 'Text to display',
  },
  clearText: {
    id: 'fabric.editor.clearLinkText',
    defaultMessage: 'Clear text',
    description: 'Clears text on the link toolbar',
  },
  clearLink: {
    id: 'fabric.editor.clearLink',
    defaultMessage: 'Clear link',
    description: 'Clears link in the link toolbar',
  },
  searchLinkAriaDescription: {
    id: 'fabric.editor.hyperlink.searchLinkAriaDescription',
    defaultMessage: 'Suggestions will appear below as you type into the field',
    description:
      'Describes what the search field does for screen reader users.',
  },
  searchLinkResults: {
    id: 'fabric.editor.hyperlink.searchLinkResults',
    defaultMessage:
      '{count, plural, =0 {no results} one {# result} other {# results}} found',
    description: 'Announce search results for screen-reader users.',
  },
  linkVisibleLabel: {
    id: 'fabric.editor.hyperlink.linkVisibleLabel',
    defaultMessage: 'Paste or search for link',
    description: 'Visible label for link input in hyperlink floating control',
  },
  textVisibleLabel: {
    id: 'fabric.editor.hyperlink.textVisibleLabel',
    defaultMessage: 'Display text (optional)',
    description: 'Visible label for text input in hyperlink floating control',
  },
});

interface BaseProps {
  onSubmit?: (
    href: string,
    title: string | undefined,
    displayText: string | undefined,
    inputMethod: LinkInputType,
  ) => void;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  autoFocus?: boolean;
  activityProvider?: Promise<ActivityProvider>;
  searchProvider?: Promise<SearchProvider>;
  displayUrl?: string;
  pluginState: HyperlinkState;
  view: EditorView;
  onEscapeCallback?: Command;
  onClickAwayCallback?: Command;
}

interface DefaultProps {
  displayText: string;
}

export type Props = WrappedComponentProps &
  BaseProps &
  DefaultProps &
  WithAnalyticsEventsProps;
type HyperlinkLinkAddToolbarProps = WrappedComponentProps &
  BaseProps &
  Partial<DefaultProps> &
  WithAnalyticsEventsProps;

export interface State {
  activityProvider?: ActivityProvider;
  searchProvider?: SearchProvider;
  items: LinkSearchListItemData[];
  selectedIndex: number;
  displayUrl: string;
  isLoading: boolean;
  displayText: string;
}

const defaultIcon = <Page16Icon label={'page'} />;

const mapActivityProviderResultToLinkSearchItemData = ({
  name,
  container,
  iconUrl,
  objectId,
  url,
  viewedTimestamp,
}: ActivityItem): LinkSearchListItemData => ({
  objectId,
  name,
  container,
  iconUrl,
  url,
  lastViewedDate: viewedTimestamp ? new Date(viewedTimestamp) : undefined,
  prefetch: true,
});

const mapSearchProviderResultToLinkSearchItemData = ({
  objectId,
  container,
  title,
  contentType,
  url,
  updatedTimestamp,
}: QuickSearchResult): LinkSearchListItemData => ({
  objectId,
  container,
  name: title,
  url,
  lastUpdatedDate: updatedTimestamp ? new Date(updatedTimestamp) : undefined,
  icon: (contentType && mapContentTypeToIcon[contentType]) || defaultIcon,
  prefetch: false,
});

export class HyperlinkLinkAddToolbar extends PureComponent<Props, State> {
  /* To prevent double submit */
  private submitted: boolean = false;

  private urlInputContainer: PanelTextInput | null = null;
  private displayTextInputContainer: PanelTextInput | null = null;
  private wrapperRef: RefObject<HTMLDivElement> = React.createRef();
  private handleClearText: () => void;
  private handleClearDisplayText: () => void;
  private debouncedQuickSearch: (
    input: string,
    items: LinkSearchListItemData[],
    quickSearchLimit: number,
  ) => Promise<void> | undefined;
  private fireCustomAnalytics?: FireAnalyticsCallback;
  private quickSearchQueryVersion: number = 0;
  private analyticSource: string = 'createLinkInlineDialog';

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIndex: -1,
      isLoading: false,
      displayUrl: normalizeUrl(props.displayUrl),
      displayText: props.displayText,
      items: [],
    } as State;

    /* Cache functions */
    this.handleClearText = this.createClearHandler('displayUrl');
    this.handleClearDisplayText = this.createClearHandler('displayText');

    this.debouncedQuickSearch = debounce(this.quickSearch, 400);

    this.fireCustomAnalytics = fireAnalyticsEvent(props.createAnalyticsEvent);
  }

  async componentDidMount() {
    const { pluginState } = this.props;

    document.addEventListener('mousedown', this.handleClickOutside);

    this.fireAnalytics({
      action: ACTION.VIEWED,
      actionSubject: ACTION_SUBJECT.CREATE_LINK_INLINE_DIALOG,
      attributes: {
        timesViewed: pluginState.timesViewed,
        searchSessionId: pluginState.searchSessionId ?? '',
        trigger: pluginState.inputMethod ?? '',
      },
      eventType: EVENT_TYPE.SCREEN,
    });

    const [activityProvider, searchProvider] = await Promise.all([
      this.props.activityProvider,
      this.props.searchProvider,
    ]);

    // loadInitialLinkSearchResult and updateInput rely on activityProvider being set in state
    flushSync(() => this.setState({ activityProvider, searchProvider }));

    await this.loadInitialLinkSearchResult();
  }

  componentWillUnmount() {
    const { pluginState } = this.props;

    document.removeEventListener('mousedown', this.handleClickOutside);

    if (!this.submitted) {
      this.fireAnalytics({
        action: ACTION.DISMISSED,
        actionSubject: ACTION_SUBJECT.CREATE_LINK_INLINE_DIALOG,
        attributes: {
          source: this.analyticSource,
          searchSessionId: pluginState.searchSessionId ?? '',
          trigger: 'blur',
        },
        eventType: EVENT_TYPE.UI,
      });
    }
  }

  private async getRecentItems(
    activityProvider: ActivityProvider,
    query?: string,
  ) {
    const { pluginState } = this.props;
    const perfStart = performance.now();
    try {
      const activityRecentItems = limit(
        query
          ? await activityProvider.searchRecent(query)
          : await activityProvider.getRecentItems(),
      );
      const items = activityRecentItems.map(
        mapActivityProviderResultToLinkSearchItemData,
      );
      const perfStop = performance.now();
      const duration = perfStop - perfStart;

      this.fireAnalytics({
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        actionSubjectId: ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
        attributes: {
          duration,
          count: items.length,
        },
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      this.fireAnalytics({
        action: ACTION.SHOWN,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        actionSubjectId: ACTION_SUBJECT_ID.PRE_QUERY_SEARCH_RESULTS,
        attributes: {
          source: this.analyticSource,
          preQueryRequestDurationMs: duration,
          searchSessionId: pluginState.searchSessionId ?? '',
          resultCount: items.length,
          results: activityRecentItems.map((item) => ({
            resultContentId: item.objectId,
            resultType: item.type ?? '',
          })),
        },
        eventType: EVENT_TYPE.UI,
      });
      return items;
    } catch (err: any) {
      const perfStop = performance.now();
      const duration = perfStop - perfStart;
      this.fireAnalytics({
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        actionSubjectId: ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
        attributes: {
          duration,
          count: -1,
          errorCode: err.status,
        },
        eventType: EVENT_TYPE.OPERATIONAL,
      });
      return [];
    }
  }

  private fireAnalytics(payload: CreateLinkInlineDialogEventPayload) {
    if (this.props.createAnalyticsEvent && this.fireCustomAnalytics) {
      this.fireCustomAnalytics({ payload });
    }
  }

  private async loadInitialLinkSearchResult() {
    const { displayUrl, activityProvider } = this.state;
    try {
      if (!displayUrl && activityProvider) {
        this.setState({
          isLoading: true,
        });
        const items = await this.getRecentItems(activityProvider);
        this.setState({
          items,
        });
      }
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private quickSearch = async (
    input: string,
    items: LinkSearchListItemData[],
    quickSearchLimit: number,
  ) => {
    const { searchProvider, displayUrl } = this.state;
    const { pluginState } = this.props;
    if (!searchProvider) {
      return;
    }

    const queryVersion = ++this.quickSearchQueryVersion;
    this.fireAnalytics({
      action: ACTION.ENTERED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.LINK_SEARCH_INPUT,
      attributes: {
        queryLength: input.length,
        queryVersion,
        queryHash: sha1(input),
        searchSessionId: pluginState.searchSessionId ?? '',
        wordCount: wordCount(input),
        source: this.analyticSource,
      },
      nonPrivacySafeAttributes: {
        query: input,
      },
      eventType: EVENT_TYPE.UI,
    });

    const perfStart = performance.now();
    try {
      const searchProviderResultItems = await searchProvider.quickSearch(
        input,
        quickSearchLimit,
      );
      const searchItems = limit(
        filterUniqueItems<LinkSearchListItemData>(
          [
            ...items,
            ...searchProviderResultItems.map(
              mapSearchProviderResultToLinkSearchItemData,
            ),
          ],
          (firstItem, secondItem) => firstItem.objectId === secondItem.objectId,
        ),
      );
      if (
        displayUrl === input &&
        queryVersion === this.quickSearchQueryVersion
      ) {
        this.setState({
          items: searchItems,
          isLoading: false,
        });
      }

      const perfStop = performance.now();
      const duration = perfStop - perfStart;

      this.fireAnalytics({
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        actionSubjectId: ACTION_SUBJECT_ID.QUICK_SEARCH,
        attributes: {
          duration,
          count: searchProviderResultItems.length,
        },
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      this.fireAnalytics({
        action: ACTION.SHOWN,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        actionSubjectId: ACTION_SUBJECT_ID.POST_QUERY_SEARCH_RESULTS,
        attributes: {
          source: this.analyticSource,
          postQueryRequestDurationMs: duration,
          searchSessionId: pluginState.searchSessionId ?? '',
          resultCount: searchProviderResultItems.length,
          results: searchProviderResultItems.map((item) => ({
            resultContentId: item.objectId,
            resultType: item.contentType,
          })),
        },
        eventType: EVENT_TYPE.UI,
      });
    } catch (err: any) {
      const perfStop = performance.now();
      const duration = perfStop - perfStart;
      this.fireAnalytics({
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        actionSubjectId: ACTION_SUBJECT_ID.QUICK_SEARCH,
        attributes: {
          duration,
          count: -1,
          errorCode: err.status,
        },
        eventType: EVENT_TYPE.OPERATIONAL,
      });
    }
  };

  private updateInput = async (input: string) => {
    const { activityProvider, searchProvider } = this.state;
    this.setState({
      displayUrl: input,
    });
    if (activityProvider) {
      if (input.length === 0) {
        this.setState({
          items: await this.getRecentItems(activityProvider),
          selectedIndex: -1,
        });
      } else if (isSafeUrl(input)) {
        this.setState({
          items: [],
          selectedIndex: -1,
          isLoading: false,
        });
      } else {
        const items = await this.getRecentItems(activityProvider, input);

        const shouldQuerySearchProvider =
          items.length < RECENT_SEARCH_LIST_SIZE && !!searchProvider;

        this.setState({
          items,
          isLoading: shouldQuerySearchProvider,
        });

        if (shouldQuerySearchProvider) {
          this.debouncedQuickSearch(input, items, RECENT_SEARCH_LIST_SIZE);
        }
      }
    }
  };

  private createClearHandler = (field: 'displayUrl' | 'displayText') => {
    return async () => {
      const { activityProvider } = this.state;

      switch (field) {
        case 'displayUrl': {
          this.setState({
            [field]: '',
            items: !!activityProvider
              ? limit(await activityProvider.getRecentItems())
              : [],
          });
          if (this.urlInputContainer) {
            this.urlInputContainer.focus();
          }
          break;
        }
        case 'displayText': {
          this.setState({
            [field]: '',
          });
          if (this.displayTextInputContainer) {
            this.displayTextInputContainer.focus();
          }
        }
      }
    };
  };

  private handleClickOutside = (event: Event) => {
    if (
      event.target instanceof Element &&
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      const {
        view: { state, dispatch },
        onClickAwayCallback,
      } = this.props;
      onClickAwayCallback?.(state, dispatch);
    }
  };

  private getScreenReaderText = () => {
    const { intl } = this.props;
    const { items, selectedIndex } = this.state;

    if (items.length && selectedIndex > -1) {
      const { name, container, lastUpdatedDate, lastViewedDate } =
        items[selectedIndex];

      const date = transformTimeStamp(intl, lastViewedDate, lastUpdatedDate);
      return `${name}, ${container}, ${date?.pageAction} ${date?.dateString} ${
        date?.timeSince || ''
      }`;
    }
  };

  render() {
    const { items, isLoading, selectedIndex, displayUrl, displayText } =
      this.state;
    const {
      intl: { formatMessage },
      activityProvider,
    } = this.props;

    const formatClearLinkText = formatMessage(messages.clearLink);
    const screenReaderDescriptionId = 'search-recent-links-field-description';
    const linkSearchListId = 'hyperlink-search-list';
    const ariaActiveDescendant =
      selectedIndex > -1 ? `link-search-list-item-${selectedIndex}` : '';
    const linkSearchInputId = 'search-recent-links-field-id';
    const displayTextInputId = 'display-text-filed-id';
    // Added workaround with a screen reader Announcer specifically for VoiceOver + Safari
    // as the Aria design pattern for combobox does not work in this case
    // for details: https://a11y-internal.atlassian.net/browse/AK-740
    const screenReaderText = browser.safari && this.getScreenReaderText();

    return (
      <div
        aria-label="Hyperlink Edit"
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className="recent-list"
        data-testid="hyperlink-add-toolbar"
      >
        <div
          css={[
            container,
            !!activityProvider && containerWithProvider,
            containerPadding,
          ]}
          ref={this.wrapperRef}
        >
          <label htmlFor={linkSearchInputId} css={inputLabel}>
            {formatMessage(messages.linkVisibleLabel)}
          </label>
          <div css={[inputWrapper, inputWrapperPosition]}>
            {screenReaderText && (
              <Announcer
                ariaLive="assertive"
                text={screenReaderText}
                ariaRelevant="additions"
                delay={250}
              />
            )}
            <div
              css={visuallyHiddenStyles}
              aria-hidden="true"
              id={screenReaderDescriptionId}
            >
              {formatMessage(messages.searchLinkAriaDescription)}
            </div>
            <PanelTextInput
              role="combobox"
              ariaExpanded
              ariaActiveDescendant={ariaActiveDescendant}
              ariaControls={linkSearchListId}
              ariaAutoComplete
              describedById={screenReaderDescriptionId}
              ref={(ele) => (this.urlInputContainer = ele)}
              testId={'link-url'}
              onSubmit={this.handleSubmit}
              onChange={this.updateInput}
              autoFocus={{ preventScroll: true }}
              onCancel={this.handleCancel}
              defaultValue={displayUrl}
              onKeyDown={this.handleKeyDown}
              inputId={linkSearchInputId}
            />
            {displayUrl && (
              <div css={clearTextWrapper}>
                <Tooltip content={formatClearLinkText}>
                  <button
                    type="button"
                    css={clearText}
                    onClick={this.handleClearText}
                    tabIndex={0}
                  >
                    <CrossCircleIcon label={formatClearLinkText} />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
          <label
            htmlFor={displayTextInputId}
            css={[inputLabel, textLabelMargin]}
          >
            {formatMessage(messages.textVisibleLabel)}
          </label>
          <div css={[inputWrapper, inputWrapperPosition]}>
            <PanelTextInput
              ref={(ele) => (this.displayTextInputContainer = ele)}
              testId={'link-text'}
              onChange={this.updateTextInput}
              onCancel={this.handleCancel}
              defaultValue={displayText}
              onSubmit={this.handleSubmit}
              onKeyDown={this.handleKeyDown}
              inputId={displayTextInputId}
            />
            {displayText && (
              <div css={clearTextWrapper}>
                <Tooltip content={formatMessage(messages.clearText)}>
                  <button
                    type="button"
                    css={clearText}
                    onClick={this.handleClearDisplayText}
                    onKeyDown={this.handleClearTextKeyDown}
                  >
                    <CrossCircleIcon
                      label={formatMessage(messages.clearText)}
                    />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
          <div
            css={visuallyHiddenStyles}
            aria-live="polite"
            aria-atomic="true"
            id="fabric.editor.hyperlink.suggested.results"
          >
            {displayUrl &&
              formatMessage(messages.searchLinkResults, {
                count: items.length,
              })}
          </div>
          <LinkSearchList
            ariaControls="fabric.editor.hyperlink.suggested.results"
            id={linkSearchListId}
            role="listbox"
            items={items}
            isLoading={isLoading}
            selectedIndex={selectedIndex}
            onSelect={this.handleSelected}
            onMouseEnter={this.handleMouseEnterResultItem}
            onMouseLeave={this.handleMouseLeaveResultItem}
          />
        </div>
      </div>
    );
  }

  private isUrlPopulatedWithSelectedItem = () => {
    /**
     * When we use ArrowKey to navigate through result items,
     * the URL field will be populated with the content of
     * selected item.
     * This function will check if the URL field is populated
     * with selected item.
     * It can be useful to detect whether we want to insert a
     * smartlink or a hyperlink with customized title
     */
    const { items, selectedIndex, displayUrl } = this.state;

    const selectedItem: LinkSearchListItemData | undefined =
      items[selectedIndex];

    if (selectedItem && selectedItem.url === displayUrl) {
      return true;
    }

    return false;
  };

  private handleSelected = (href: string, text: string) => {
    this.handleInsert(href, text, INPUT_METHOD.TYPEAHEAD, 'click');
  };

  private handleInsert = (
    href: string,
    title: string | undefined,
    inputType: LinkInputType,
    interaction: 'click' | 'keyboard' | 'notselected',
  ) => {
    const { pluginState, onSubmit } = this.props;
    const { items, selectedIndex, displayText } = this.state;
    if (onSubmit) {
      this.submitted = true;
      onSubmit(href, title, displayText, inputType);
    }

    if (interaction === 'click' || this.isUrlPopulatedWithSelectedItem()) {
      /**
       * When it's a mouse click even or the selectedItem.url matches displayUrl, we think
       * it's selected from the result list and fire the
       * analytic
       */
      const selectedItem = items[selectedIndex];
      this.fireAnalytics({
        action: ACTION.SELECTED,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        attributes: {
          source: this.analyticSource,
          searchSessionId: pluginState.searchSessionId ?? '',
          trigger: interaction,
          resultCount: items.length,
          selectedResultId: selectedItem.objectId,
          selectedRelativePosition: selectedIndex,
          prefetch: selectedItem.prefetch ?? false,
        },
        eventType: EVENT_TYPE.UI,
      });
    }
  };

  private handleMouseEnterResultItem = (objectId: string) => {
    const { items } = this.state;

    const index = findIndex(items, (item) => item.objectId === objectId);
    this.setState({
      selectedIndex: index,
    });
  };

  private handleMouseLeaveResultItem = (objectId: string) => {
    const { items, selectedIndex } = this.state;

    const index = findIndex(items, (item) => item.objectId === objectId);
    // This is to avoid updating index that was set by other mouseenter event
    if (selectedIndex === index) {
      this.setState({
        selectedIndex: -1,
      });
    }
  };

  private handleSubmit = () => {
    const { displayUrl, selectedIndex, items } = this.state;

    const selectedItem: LinkSearchListItemData | undefined =
      items[selectedIndex];
    if (this.isUrlPopulatedWithSelectedItem()) {
      this.handleInsert(
        normalizeUrl(selectedItem.url),
        selectedItem.name,
        INPUT_METHOD.TYPEAHEAD,
        'keyboard',
      );
    } else if (displayUrl && displayUrl.length > 0) {
      const url = normalizeUrl(displayUrl);
      if (url) {
        this.handleInsert(url, displayUrl, INPUT_METHOD.MANUAL, 'notselected');
      }
    }
  };

  private handleClearTextKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const KEY_CODE_TAB = 9;
    const { keyCode } = event;
    if (keyCode === KEY_CODE_TAB) {
      if (!this.submitted) {
        const { displayUrl, displayText } = this.state;
        const url = normalizeUrl(displayUrl);
        this.handleInsert(
          url,
          displayText || displayUrl,
          INPUT_METHOD.MANUAL,
          'notselected',
        );
      }
      event.preventDefault();
      return;
    }
  };

  private handleKeyDown = (event: KeyboardEvent<any>) => {
    const { items, selectedIndex } = this.state;
    const { pluginState, view, onEscapeCallback } = this.props;
    const { keyCode } = event;
    const KEY_CODE_ESCAPE = 27;
    const KEY_CODE_ARROW_DOWN = 40;
    const KEY_CODE_ARROW_UP = 38;

    if (keyCode === KEY_CODE_ESCAPE) {
      // escape
      event.preventDefault();

      const { state, dispatch } = view;
      onEscapeCallback?.(state, dispatch);

      return;
    }

    if (!items || !items.length) {
      return;
    }

    let updatedIndex = selectedIndex;

    if (keyCode === KEY_CODE_ARROW_DOWN) {
      // down
      event.preventDefault();
      updatedIndex = (selectedIndex + 1) % items.length;
    } else if (keyCode === KEY_CODE_ARROW_UP) {
      // up
      event.preventDefault();
      updatedIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
    }

    if (
      [KEY_CODE_ARROW_DOWN, KEY_CODE_ARROW_UP].includes(keyCode) &&
      items[updatedIndex]
    ) {
      this.setState({
        selectedIndex: updatedIndex,
        displayUrl: items[updatedIndex].url,
      });
      this.fireAnalytics({
        action: ACTION.HIGHLIGHTED,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        attributes: {
          source: this.analyticSource,
          searchSessionId: pluginState.searchSessionId ?? '',
          selectedResultId: items[updatedIndex].objectId,
          selectedRelativePosition: updatedIndex,
        },
        eventType: EVENT_TYPE.UI,
      });
    }
  };

  private updateTextInput = (displayText: string) => {
    this.setState({
      displayText,
    });
  };

  private handleCancel = (e: KeyboardEvent<any>) => {
    const {
      view: { state, dispatch },
      onClickAwayCallback,
    } = this.props;
    e.preventDefault();

    onClickAwayCallback?.(state, dispatch);
  };
}

function findIndex<T>(array: T[], predicate: (item: T) => boolean): number {
  let index = -1;
  array.some((item, i) => {
    if (predicate(item)) {
      index = i;
      return true;
    }
    return false;
  });

  return index;
}

function limit<T>(items: Array<T>) {
  return items.slice(0, RECENT_SEARCH_LIST_SIZE);
}

export const HyperlinkLinkAddToolbarWithIntl = injectIntl(
  HyperlinkLinkAddToolbar as React.ComponentClass<HyperlinkLinkAddToolbarProps>,
);
export default withAnalyticsEvents()(HyperlinkLinkAddToolbarWithIntl);
