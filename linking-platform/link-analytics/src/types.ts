import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type LinkAnalyticsAttributes = Record<string, any>;

export interface LinkDetails {
  url: string;
  smartLinkId?: string;
}

/**
 * Fires an event for when a smart link is created.
 * @param details The link data including the url
 * @param sourceEvent A source analytic event that represents the trigger for creating the event
 * @param attributes Custom attributes to decorate the event with
 */
interface LinkCreated {
  (
    details: LinkDetails,
    sourceEvent?: UIAnalyticsEvent | null,
    attributes?: LinkAnalyticsAttributes,
  ): void;
}

export interface SmartLinkLifecycleMethods {
  linkCreated: LinkCreated;
}
