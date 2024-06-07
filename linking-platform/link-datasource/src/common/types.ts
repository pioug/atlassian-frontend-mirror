import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { type IssueLikeDataTableViewProps } from '../ui/issue-like-table/types';

export type JiraSearchMethod = 'basic' | 'jql';

export interface Site {
	cloudId: string;
	displayName: string;
	url: string;
}

export type DisplayViewModes = 'table' | 'inline';

export type ConfigModalProps<ADF, Parameters> = {
	/** Unique identifier for which type of datasource is being rendered and for making its requests */
	datasourceId: string;
	/** The url that was used to insert a List of Links */
	url?: string;
	/** Parameters for making the data requests necessary to render data within the table */
	parameters?: Parameters;
	/** Callback function to be invoked when the modal is closed either via cancel button click, esc keydown, or modal blanket click */
	onCancel: () => void;
	/** Callback function to be invoked when the insert issues button is clicked */
	onInsert: (adf: ADF, analyticsEvent?: UIAnalyticsEvent) => void;
	/**
	 * The view mode that the modal will show on open:
	 * - Table = Displays a list of links in table format
	 * - Inline = Presents a smart link that shows the count of query results. However, if there's only one result, it converts to an inline smart link of that issue.
	 */
	viewMode?: DisplayViewModes;
} & Partial<
	Pick<IssueLikeDataTableViewProps, 'visibleColumnKeys' | 'wrappedColumnKeys' | 'columnCustomSizes'>
>;
