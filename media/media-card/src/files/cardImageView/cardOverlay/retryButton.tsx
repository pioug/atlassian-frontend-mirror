import React from 'react';
import { createAndFireMediaEvent } from '../../../utils/analytics';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { Retry, NewExpRetry } from './styled';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import { createPreventClickThrough } from '../../../utils/preventClickThrough';
import RetryIcon from '@atlaskit/icon/glyph/retry';

type RetryProps = React.HTMLAttributes<HTMLDivElement> &
  WithAnalyticsEventsProps;

const RetryWithProps = (props: RetryProps) => (
  <Retry data-testid="media-card-retry-button" {...props} />
);

type NewExpRetryProps = React.HTMLAttributes<HTMLAnchorElement> &
  WithAnalyticsEventsProps;

const NewExpRetryWithProps = (props: NewExpRetryProps) => (
  <NewExpRetry data-testid="media-card-retry-button" {...props}>
    <RetryIcon label={'Retry'} size={'small'} />
  </NewExpRetry>
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
  <RetryWithAnalytics onClick={createPreventClickThrough(onClick)}>
    <FormattedMessage {...messages.retry} />
  </RetryWithAnalytics>
);

const NewExpRetryWithAnalytics = createRetryWithAnalytics(NewExpRetryWithProps);

export const NewExpRetryButton = ({ onClick }: { onClick: () => void }) => (
  <NewExpRetryWithAnalytics onClick={createPreventClickThrough(onClick)}>
    <FormattedMessage {...messages.retry} />
  </NewExpRetryWithAnalytics>
);
