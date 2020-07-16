import React from 'react';
import { createAndFireMediaEvent } from '../../../utils/analytics';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { Retry, NewExpRetry } from './styled';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';

type RetryProps = React.HTMLAttributes<HTMLDivElement> &
  WithAnalyticsEventsProps;

const RetryWithProps = (props: RetryProps) => (
  <Retry data-testid="media-card-retry-button" {...props} />
);

type NewExpRetryProps = React.HTMLAttributes<HTMLAnchorElement> &
  WithAnalyticsEventsProps;

const NewExpRetryWithProps = (props: NewExpRetryProps) => (
  <NewExpRetry data-testid="media-card-retry-button" {...props} />
);

const createRetryWithAnalytics = withAnalyticsEvents({
  onClick: createAndFireMediaEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'mediaCardRetry',
  }),
});

const RetryWithAnalytics = createRetryWithAnalytics(RetryWithProps);

export const RetryButton = ({ onClick }: { onClick: () => void }) => (
  <RetryWithAnalytics onClick={onClick}>
    <FormattedMessage {...messages.retry} />
  </RetryWithAnalytics>
);

const NewExpRetryWithAnalytics = createRetryWithAnalytics(NewExpRetryWithProps);

export const NewExpRetryButton = ({ onClick }: { onClick: () => void }) => (
  <NewExpRetryWithAnalytics onClick={onClick}>
    <FormattedMessage {...messages.retry} />
  </NewExpRetryWithAnalytics>
);
