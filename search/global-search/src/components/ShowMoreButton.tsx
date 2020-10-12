import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import { CancelableEvent } from '@atlaskit/quick-search';
import {
  withAnalyticsEvents,
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { FormattedMessage } from 'react-intl';
import { messages } from '../messages';
import { getConfluenceAdvancedSearchLink } from './SearchResultsUtil';
import {
  CONF_OBJECTS_ITEMS_PER_PAGE,
  CONF_MAX_DISPLAYED_RESULTS,
} from '../util/experiment-utils';
import { fireShowMoreButtonClickEvent } from '../util/analytics-event-helper';

export interface ShowMoreButtonProps extends WithAnalyticsEventsProps {
  resultLength: number;
  totalSize: number;
  onShowMoreClicked: () => void;
  onSearchMoreAdvancedSearch: undefined | ((e: CancelableEvent) => void);
  query: string;
}

export class ShowMoreButton extends React.PureComponent<ShowMoreButtonProps> {
  triggerEnrichedEvent(
    analyticsEvent: UIAnalyticsEvent,
    actionSubjectId: string,
  ) {
    const { resultLength, totalSize, createAnalyticsEvent } = this.props;
    const searchSessionId = ((analyticsEvent || {}).context || []).reduce(
      (acc: object, v: object = {}) => Object.assign({}, acc, v),
      {},
    ).searchSessionId;

    fireShowMoreButtonClickEvent(
      searchSessionId,
      resultLength,
      totalSize,
      actionSubjectId,
      CONF_OBJECTS_ITEMS_PER_PAGE,
      createAnalyticsEvent,
    );
  }

  render() {
    const {
      resultLength,
      totalSize,
      onShowMoreClicked,
      onSearchMoreAdvancedSearch,
      query,
    } = this.props;
    if (resultLength < totalSize) {
      if (resultLength < CONF_MAX_DISPLAYED_RESULTS) {
        return (
          <Button
            appearance="link"
            onClick={(e, analyticsEvent) => {
              this.triggerEnrichedEvent(analyticsEvent, 'showMoreButton');
              onShowMoreClicked();
            }}
          >
            <FormattedMessage
              {...messages.show_more_button_text}
              values={{
                itemsPerPage: Math.min(
                  CONF_OBJECTS_ITEMS_PER_PAGE,
                  totalSize - resultLength,
                ),
              }}
            />
          </Button>
        );
      } else if (onSearchMoreAdvancedSearch) {
        return (
          <Button
            appearance="link"
            onClick={(e, analyticsEvent) => {
              this.triggerEnrichedEvent(
                analyticsEvent,
                'showMoreAdvancedSearchButton',
              );
              onSearchMoreAdvancedSearch(e);
            }}
            href={getConfluenceAdvancedSearchLink(query)}
          >
            <FormattedMessage {...messages.show_more_button_advanced_search} />
          </Button>
        );
      }
    }
    return null;
  }
}

export default withAnalyticsEvents()(ShowMoreButton);
