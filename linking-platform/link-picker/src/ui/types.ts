import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl-next';

export type LinkInputType = 'manual' | 'typeAhead';

export interface LinkSearchListItemData {
  /** Unique identifiable attribute for the item */
  objectId: string;
  /** Name / title / display text of the link */
  name: string;
  /** URL of the resource being linked to */
  url: string;
  /** Icon to display in link result */
  icon: string | React.ComponentType<{ alt: string }>;
  /** Alt text describing the icon */
  iconAlt: string | MessageDescriptor;
  /** Context to display in link result */
  container?: string;
  /** Optional last view date to display in link result */
  lastViewedDate?: Date;
  /** Optional last updated date to display in link result */
  lastUpdatedDate?: Date;
  /** Whether the result is pre-fetched from activity provider */
  prefetch?: boolean;
  /** Metadata about the result */
  meta?: {
    /** The data source that provided the result */
    source?: string;
  };
}

export interface LinkPickerState {
  /** Current query string / URL input field value */
  query: string;
}

export interface ResolveResult {
  data: LinkSearchListItemData[];
}

export interface LinkPickerPlugin {
  resolve: (
    state: LinkPickerState,
  ) => Promise<ResolveResult> | AsyncGenerator<ResolveResult, ResolveResult>;
  /** Uniquely identify the tab */
  tabKey?: string;
  /** Human-readable label for the plugin */
  tabTitle?: string;
  /** Render function to customise the UI that is displayed when an error occurs resolving results */
  errorFallback?: LinkPickerPluginErrorFallback;
  /** Render function to customise the UI that is displayed when there are no results, but an empty form (no search term) */
  emptyStateNoResults?: LinkPickerPluginEmptyStateNoResults;
  /** Metadata about the plugin */
  meta?: {
    /** The data source that provides all results provided by the plugin */
    source?: string;
  };
  /** Callback for plugin activation */
  UNSAFE_onActivation?: () => void;
  /** Register Plugin Actions */
  action?: LinkPickerPluginAction;
}

export interface LinkPickerPluginAction {
  label: MessageDescriptor | string;
  callback: () => void;
}

export type LinkPickerPluginErrorFallback = (
  error: unknown,
  retry: () => void,
) => ReactNode;

export type LinkPickerPluginEmptyStateNoResults = () => ReactNode;
