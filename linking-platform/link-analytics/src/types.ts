import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type LinkAnalyticsAttributes = Record<string, any>;

export type LifecycleAction = 'created' | 'updated' | 'deleted';

export interface LinkDetails {
  url: string;
  smartLinkId?: string;
}

export interface LinkLifecycleEventCallback {
  (
    /** The link data including the url */
    details: LinkDetails,
    /** A source analytic event that represents the trigger for creating the link */
    sourceEvent?: UIAnalyticsEvent | null,
    /** Custom attributes to decorate the event with */
    attributes?: LinkAnalyticsAttributes,
  ): void;
}

export interface SmartLinkLifecycleMethods {
  /**
   * Fires an event to track the creation of a link.
   * @param details The link data including the url
   * @param sourceEvent (RECOMMENDED) A source analytic event that represents the trigger for creating the link
   * @param attributes (OPTIONAL) Custom attributes to decorate the event with
   */
  linkCreated: LinkLifecycleEventCallback;
  /**
   * Fires an event to track the update of a link.
   * @param details The link data including the url
   * @param sourceEvent (RECOMMENDED) A source analytic event that represents the trigger for creating the link
   * @param attributes (OPTIONAL) Custom attributes to decorate the event with
   */
  linkUpdated: LinkLifecycleEventCallback;
  /**
   * Fires an event to track the deletion of a link.
   * @param details The link data including the url
   * @param sourceEvent (RECOMMENDED) A source analytic event that represents the trigger for deleting the link
   * @param attributes(OPTIONAL)  Custom attributes to decorate the event with
   */
  linkDeleted: LinkLifecycleEventCallback;
}
