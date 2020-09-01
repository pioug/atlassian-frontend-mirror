import React from 'react';
import { ActivityItem, ActivityProvider } from '@atlaskit/activity-provider';
import { SearchProvider, QuickSearchResult } from '@atlaskit/editor-common';
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
import { startMeasure, stopMeasure } from '@atlaskit/editor-common';

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
  LinkToolBarEventPayload,
} from '../../../analytics';
import { normalizeUrl } from '../../utils';
import { LinkSearchListItemData } from '../../../../ui/LinkSearch/types';
import debounce from 'lodash/debounce';
import { mapContentTypeToIcon } from './utils';

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

export type LinkInputType = INPUT_METHOD.MANUAL | INPUT_METHOD.TYPEAHEAD;
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
    const [activityProvider, searchProvider] = await Promise.all([
      this.props.activityProvider,
      this.props.searchProvider,
    ]);
    this.setState({ activityProvider, searchProvider });
    await this.loadInitialLinkSearchResult();
  }

  private async getRecentItems(activityProvider: ActivityProvider) {
    try {
      startMeasure('recentActivity');
      const activityRecentItems = await activityProvider.getRecentItems();
      const items = activityRecentItems.map(
        mapActivityProviderResultToLinkSearchItemData,
      );
      stopMeasure('recentActivity', (duration, startTime) => {
        this.fireAnalytics({
          action: ACTION.INVOKED,
          actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
          actionSubjectId: ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
          attributes: {
            duration,
            startTime,
            count: items.length,
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      });
      return items;
    } catch (err) {
      stopMeasure('recentActivity', (duration, startTime) => {
        this.fireAnalytics({
          action: ACTION.INVOKED,
          actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
          actionSubjectId: ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
          attributes: {
            duration,
            startTime,
            count: -1,
            error: err.message,
            errorCode: err.status,
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      });
      return [];
    }
  }

  private fireAnalytics(payload: LinkToolBarEventPayload) {
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
          items: limit(items),
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
    if (!searchProvider) {
      return;
    }
    const searchProviderResultItems = await searchProvider.quickSearch(
      input,
      quickSearchLimit,
    );
    items = items.concat(
      searchProviderResultItems.map(
        mapSearchProviderResultToLinkSearchItemData,
      ),
    );
    if (displayUrl === input) {
      this.setState({
        items,
        isLoading: false,
      });
    }
  };

  private updateInput = async (input: string) => {
    const { activityProvider, searchProvider } = this.state;
    if (activityProvider) {
      if (input.length === 0) {
        this.setState({
          items: limit(await this.getRecentItems(activityProvider)),
          displayUrl: input,
          selectedIndex: -1,
        });
      } else {
        const activityProviderResultItems = limit(
          await activityProvider.searchRecent(input),
        );
        let items = activityProviderResultItems.map(
          mapActivityProviderResultToLinkSearchItemData,
        );

        const shouldQuerySearchProvider =
          activityProviderResultItems.length < RECENT_SEARCH_LIST_SIZE &&
          !!searchProvider;

        this.setState({
          items,
          displayUrl: input,
          isLoading: shouldQuerySearchProvider,
        });

        if (shouldQuerySearchProvider) {
          const searchProviderLimit =
            RECENT_SEARCH_LIST_SIZE - activityProviderResultItems.length;
          this.debouncedQuickSearch(input, items, searchProviderLimit);
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
              onCancel={this.urlBlur}
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
              onCancel={this.textBlur}
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
    if (this.props.onSubmit) {
      this.submitted = true;
      this.props.onSubmit(href, title, this.state.displayText, inputType);
    }
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
    this.submitted = false;
    this.isTabPressed = e.keyCode === 9;

    if (!items || !items.length) {
      return;
    }

    if (e.keyCode === 40) {
      // down
      e.preventDefault();
      this.setState({
        selectedIndex: (selectedIndex + 1) % items.length,
      });
    } else if (e.keyCode === 38) {
      // up
      e.preventDefault();
      this.setState({
        selectedIndex: selectedIndex > 0 ? selectedIndex - 1 : items.length - 1,
      });
    }
  };

  private handleTextKeyDown = (displayText: string) => {
    this.setState({
      displayText,
    });
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
