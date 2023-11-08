import React from 'react';
import {
  AnalyticsEventPayload,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import { JsonLd } from 'json-ld-types';
import { getResolvedAttributes } from '@atlaskit/link-analytics/resolved-attributes';

import { UiRelatedLinksViewedEventProps } from './types';
import { AnalyticsPayload } from '../../../../../../../../utils/types';
import { ANALYTICS_CHANNEL } from '../../../../../../../../utils/analytics';

const createUiRelatedLinksViewedEventPayload = ({
  relatedLinksCount,
}: UiRelatedLinksViewedEventProps): AnalyticsPayload => ({
  action: 'viewed',
  actionSubject: 'relatedLinks',
  eventType: 'ui',
  attributes: {
    relatedLinksCount,
  },
});

export const fireRelatedLinksViewedEvent =
  (
    createAnalyticsEvent: (payload: AnalyticsEventPayload) => UIAnalyticsEvent,
  ): ((attributes: UiRelatedLinksViewedEventProps) => void) =>
  (attributes) => {
    const payload = createUiRelatedLinksViewedEventPayload(attributes);

    if (payload) {
      createAnalyticsEvent({
        ...payload,
      }).fire(ANALYTICS_CHANNEL);
    }
  };

type RelatedUrlItemAnalyticsContextProps = {
  details: JsonLd.Response;
  children?: React.ReactNode;
};

export const RelatedUrlItemAnalyticsContext = (
  props: RelatedUrlItemAnalyticsContextProps,
) => {
  const { children, details } = props;

  /**
   * We don't really need the `url` to get the attributes here so set
   * it to an empty string to just make typescript happy
   */
  const attributes = getResolvedAttributes({ url: '' }, details);

  return (
    <AnalyticsContext
      data={{
        attributes,
        component: 'relatedLink',
      }}
    >
      {children}
    </AnalyticsContext>
  );
};
