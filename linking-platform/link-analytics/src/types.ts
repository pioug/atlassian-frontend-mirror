import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type CardState } from '@atlaskit/linking-common';

export type LinkAnalyticsAttributes = Record<string, any>;

export type LifecycleAction = 'created' | 'updated' | 'deleted';

export type CardStore = {
  getState: () => Record<string, CardState | undefined>;
};

export interface LinkDetails {
  /**
   * The URL of the link.
   * If the link has been updated and the URL has changed, this is the new URL.
   */
  url: string;
  /**
   * The display category of the link.
   * This is optional and should be set to `link` if the link in question is not
   * being displayed as a smart link, but instead as some other type of "link" (eg. a blue link in editor).
   */
  displayCategory?: 'smartLink' | 'link';
  /**
   * We aren't using this yet.
   */
  smartLinkId?: string;
}

export interface DatasourceDetails {
  url?: string;
  datasourceId: string;
  parameters: object;
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

export interface DatasourceLifecycleEventCallback {
  (
    /** The link data including the url */
    details: DatasourceDetails,
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

export interface DatasourceLifecycleMethods {
  datasourceCreated: DatasourceLifecycleEventCallback;
  datasourceUpdated: DatasourceLifecycleEventCallback;
  datasourceDeleted: DatasourceLifecycleEventCallback;
}
