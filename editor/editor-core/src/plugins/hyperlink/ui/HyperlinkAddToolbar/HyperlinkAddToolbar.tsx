import React from 'react';
import { ActivityItem, ActivityProvider } from '@atlaskit/activity-provider';
import { SearchProvider, QuickSearchResult } from '@atlaskit/editor-common';
import { isSafeUrl } from '@atlaskit/adf-schema';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import EditorAlignLeftIcon from '@atlaskit/icon/glyph/editor/align-left';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { N80, N30 } from '@atlaskit/theme/colors';
import Page16Icon from '@atlaskit/icon-object/glyph/page/16';
import Tooltip from '@atlaskit/tooltip';
import { KeyboardEvent, PureComponent } from 'react';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

import { linkToolbarMessages as linkToolbarCommonMessages } from '../../../../messages';
import PanelTextInput from '../../../../ui/PanelTextInput';
import LinkSearchList from '../../../../ui/LinkSearch/LinkSearchList';
import {
  Container,
  InputWrapper,
  UrlInputWrapper,
} from '../../../../ui/LinkSearch/ToolbarComponents';
import {
  INPUT_METHOD,
  fireAnalyticsEvent,
  FireAnalyticsCallback,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  CreateLinkInlineDialogEventPayload,
} from '../../../analytics';
import { normalizeUrl } from '../../utils';
import { filterUniqueItems } from '../../../../utils/array';
import { LinkSearchListItemData } from '../../../../ui/LinkSearch/types';
import debounce from 'lodash/debounce';
import { mapContentTypeToIcon, sha1, wordCount } from './utils';
import { HyperlinkState } from '../../pm-plugins/main';
import { hideLinkToolbar } from '../../commands';
import { EditorView } from 'prosemirror-view';
import { LinkInputType } from '../../types';

export const RECENT_SEARCH_LIST_SIZE = 5;

const ClearText = styled.span`
  cursor: pointer;
  padding-right: 8px;
  color: ${N80};
`;

const TextInputWrapper = styled.div`
  ${InputWrapper};
  border-top: 1px solid ${N30};
  border-bottom: 1px solid ${N30};
`;

const IconWrapper = styled.span`
  color: ${N80};
  padding: 4px 8px;
  width: 18px;
`;

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
});

interface BaseProps {
  onBlur?: (
    type: string,
    url: string,
    title: string | undefined,
    displayText: string | undefined,
    isTabPressed?: boolean,
  ) => void;
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
}

interface DefaultProps {
  displayText: string;
}

export type Props = InjectedIntlProps &
  BaseProps &
  DefaultProps &
  WithAnalyticsEventsProps;
type HyperlinkLinkAddToolbarProps = InjectedIntlProps &
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
});

export class HyperlinkLinkAddToolbar extends PureComponent<Props, State> {
  /* To not fire on-blur on tab-press */
  private isTabPressed: boolean = false;

  /* To prevent firing blur callback on submit */
  private submitted: boolean = false;

  private urlInputContainer: PanelTextInput | null = null;
  private displayTextInputContainer: PanelTextInput | null = null;
  private urlBlur: () => void;
  private textBlur: () => void;
  private handleClearText: () => void;
  private handleClearDisplayText: () => void;
  private debouncedQuickSearch: (
    input: string,
    items: LinkSearchListItemData[],
    quickSearchLimit: number,
  ) => Promise<void>;
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
    this.urlBlur = this.handleBlur.bind(this, 'url');
    this.textBlur = this.handleBlur.bind(this, 'text');

    this.handleClearText = this.createClearHandler('displayUrl');
    this.handleClearDisplayText = this.createClearHandler('displayText');
    this.debouncedQuickSearch = debounce(this.quickSearch, 400);

    this.fireCustomAnalytics = fireAnalyticsEvent(props.createAnalyticsEvent);
  }

  async componentDidMount() {
    const { pluginState } = this.props;
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
    this.setState({ activityProvider, searchProvider });
    await this.loadInitialLinkSearchResult();
  }

  componentWillUnmount() {
    const { pluginState } = this.props;
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
          results: activityRecentItems.map(item => ({
            resultContentId: item.objectId,
            resultType: item.type ?? '',
          })),
        },
        eventType: EVENT_TYPE.UI,
      });
      return items;
    } catch (err) {
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
        nonPrivacySafeAttributes: {
          error: err.message,
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
          results: searchProviderResultItems.map(item => ({
            resultContentId: item.objectId,
            resultType: item.contentType,
          })),
        },
        eventType: EVENT_TYPE.UI,
      });
    } catch (err) {
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
        nonPrivacySafeAttributes: {
          error: err.message,
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
      if (!activityProvider) {
        return;
      }
      switch (field) {
        case 'displayUrl': {
          this.setState({
            [field]: '',
            items: limit(await activityProvider.getRecentItems()),
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

  render() {
    const {
      items,
      isLoading,
      selectedIndex,
      displayUrl,
      displayText,
    } = this.state;
    const {
      intl: { formatMessage },
      activityProvider,
    } = this.props;
    const placeholder = formatMessage(
      activityProvider
        ? linkToolbarCommonMessages.placeholder
        : linkToolbarCommonMessages.linkPlaceholder,
    );

    const formatLinkAddressText = formatMessage(
      linkToolbarCommonMessages.linkAddress,
    );
    const formatClearLinkText = formatMessage(messages.clearLink);
    const formatDisplayText = formatMessage(messages.displayText);

    return (
      <div className="recent-list">
        <Container provider={!!activityProvider}>
          <UrlInputWrapper>
            <IconWrapper>
              <Tooltip content={formatLinkAddressText}>
                <LinkIcon label={formatLinkAddressText} />
              </Tooltip>
            </IconWrapper>
            <PanelTextInput
              ref={ele => (this.urlInputContainer = ele)}
              placeholder={placeholder}
              testId={'link-url'}
              onSubmit={this.handleSubmit}
              onChange={this.updateInput}
              autoFocus={{ preventScroll: true }}
              onCancel={this.handleCancel}
              onBlur={this.urlBlur}
              defaultValue={displayUrl}
              onKeyDown={this.handleKeyDown}
            />
            {displayUrl && (
              <Tooltip content={formatClearLinkText}>
                <ClearText onClick={this.handleClearText}>
                  <CrossCircleIcon label={formatClearLinkText} />
                </ClearText>
              </Tooltip>
            )}
          </UrlInputWrapper>
          <TextInputWrapper>
            <IconWrapper>
              <Tooltip content={formatDisplayText}>
                <EditorAlignLeftIcon label={formatDisplayText} />
              </Tooltip>
            </IconWrapper>
            <PanelTextInput
              ref={ele => (this.displayTextInputContainer = ele)}
              placeholder={formatDisplayText}
              ariaLabel={'Link label'}
              testId={'link-label'}
              onChange={this.handleTextKeyDown}
              onCancel={this.handleCancel}
              onBlur={this.textBlur}
              defaultValue={displayText}
              onSubmit={this.handleSubmit}
              onKeyDown={this.handleKeyDown}
            />
            {displayText && (
              <Tooltip content={formatMessage(messages.clearText)}>
                <ClearText onClick={this.handleClearDisplayText}>
                  <CrossCircleIcon label={formatMessage(messages.clearText)} />
                </ClearText>
              </Tooltip>
            )}
          </TextInputWrapper>
          <LinkSearchList
            items={items}
            isLoading={isLoading}
            selectedIndex={selectedIndex}
            onSelect={this.handleSelected}
            onMouseMove={this.handleMouseMove}
          />
        </Container>
      </div>
    );
  }

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

    const selectedItem = items[selectedIndex];
    if (typeof selectedItem === 'undefined') {
      /**
       * No item has been selected. This could happen when user
       * types in the URL by themselves or when editing the URL.
       */
      return;
    }

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
      },
      eventType: EVENT_TYPE.UI,
    });
  };

  private handleMouseMove = (objectId: string) => {
    const { items } = this.state;

    if (items) {
      const index = findIndex(items, item => item.objectId === objectId);
      this.setState({
        selectedIndex: index,
      });
    }
  };

  private handleSubmit = () => {
    const { items, displayUrl, selectedIndex } = this.state;
    // add the link selected in the dropdown if there is one, otherwise submit the value of the input field
    if (items && items.length > 0 && selectedIndex > -1) {
      const item = items[selectedIndex];
      const url = normalizeUrl(item.url);
      this.handleInsert(url, item.name, INPUT_METHOD.TYPEAHEAD, 'keyboard');
    } else if (displayUrl && displayUrl.length > 0) {
      const url = normalizeUrl(displayUrl);
      if (url) {
        this.handleInsert(url, displayUrl, INPUT_METHOD.MANUAL, 'notselected');
      }
    }
  };

  private handleKeyDown = (e: KeyboardEvent<any>) => {
    const { items, selectedIndex } = this.state;
    const { pluginState, view } = this.props;
    this.isTabPressed = e.keyCode === 9;

    if (!items || !items.length) {
      return;
    }

    let updatedIndex = selectedIndex;

    if (e.keyCode === 40) {
      // down
      e.preventDefault();
      updatedIndex = (selectedIndex + 1) % items.length;
    } else if (e.keyCode === 38) {
      // up
      e.preventDefault();
      updatedIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
    } else if (e.keyCode === 27) {
      // escape
      e.preventDefault();
      hideLinkToolbar()(view.state, view.dispatch);
    }
    this.setState({
      selectedIndex: updatedIndex,
    });

    if (items[updatedIndex]) {
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

  private handleTextKeyDown = (displayText: string) => {
    this.setState({
      displayText,
    });
  };

  private handleCancel = (e: KeyboardEvent<any>) => {
    const { view } = this.props;
    e.preventDefault();
    hideLinkToolbar()(view.state, view.dispatch);
  };

  private handleBlur = (type: string) => {
    const url = normalizeUrl(this.state.displayUrl);
    if (this.props.onBlur && !this.submitted && url) {
      this.props.onBlur(
        type,
        url,
        this.state.displayText || this.state.displayUrl,
        this.state.displayText,
        this.isTabPressed,
      );
    }
  };
}

const findIndex = (array: any[], predicate: (item: any) => boolean): number => {
  let index = -1;
  array.some((item, i) => {
    if (predicate(item)) {
      index = i;
      return true;
    }
    return false;
  });

  return index;
};

function limit<T>(items: Array<T>) {
  return items.slice(0, RECENT_SEARCH_LIST_SIZE);
}

export const HyperlinkLinkAddToolbarWithIntl = injectIntl(
  HyperlinkLinkAddToolbar as React.ComponentClass<HyperlinkLinkAddToolbarProps>,
);
export default withAnalyticsEvents()(HyperlinkLinkAddToolbarWithIntl);
