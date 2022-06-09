import { MessageDescriptor } from 'react-intl-next';

export type LinkInputType = 'manual' | 'typeAhead';

export interface LinkSearchListItemData {
  /** Unique identifiable attribute for the item */
  objectId: string;
  /** Name / title / display text of the link */
  name: string;
  /** URL of the resource being linked to */
  url: string;
  /** Context to display in link result */
  container: string;
  /** Icon to display in link result */
  icon: string | React.ComponentType<{ alt: string }>;
  /** Alt text describing the icon */
  iconAlt: string | MessageDescriptor;
  /** Optional last view date to display in link result */
  lastViewedDate?: Date;
  /** Optional last updated date to display in link result */
  lastUpdatedDate?: Date;
  /** Whether the result is pre-fetched from activity provider */
  prefetch?: boolean;
}

export type ListItemTimeStamp = {
  pageAction: string;
  dateString: string;
  timeSince?: string | undefined;
};

export interface LinkPickerState {
  /** Current query string / URL input field value */
  query: string;
}

export interface LinkPickerPlugin {
  resolve: (
    state: LinkPickerState,
  ) => AsyncGenerator<LinkSearchListItemData[], LinkSearchListItemData[]>;
}
