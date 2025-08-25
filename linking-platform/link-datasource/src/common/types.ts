import type { RefObject } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { type IssueLikeDataTableViewProps } from '../ui/issue-like-table/types';

export type JiraSearchMethod = 'basic' | 'jql';

export interface Site {
	cloudId: string;
	displayName: string;
	url: string;
}

export type DisplayViewModes = 'table' | 'inline';
type ShouldReturnFocus = boolean | RefObject<HTMLElement>;

export type OnInsertFunction<ADF> = (adf: ADF, analyticsEvent?: UIAnalyticsEvent) => void;
export type ConfigModalProps<ADF, Parameters> = {
	/** Unique identifier for which type of datasource is being rendered and for making its requests */
	datasourceId: string;
	/** Disable the view mode display dropdown */
	disableDisplayDropdown?: boolean;
	/** Callback function to be invoked when the modal is closed either via cancel button click, esc keydown, or modal blanket click */
	onCancel: () => void;
	/** Callback function to be invoked when the insert issues button is clicked */
	onInsert: OnInsertFunction<ADF>;
	/** Parameters for making the data requests necessary to render data within the table */
	parameters?: Parameters;
	/**
	 * Set the focus to return to the element that had focus before focus lock was activated or pass through a specific ref element
	 * Defaults to false, meaning focus remains where it was when the FocusLock was deactivated
	 */
	shouldReturnFocus?: ShouldReturnFocus;
	/** The url that was used to insert a List of Links */
	url?: string;
	/**
	 * The view mode that the modal will show on open:
	 * - Table = Displays a list of links in table format
	 * - Inline = Presents a smart link that shows the count of query results. However, if there's only one result, it converts to an inline smart link of that issue.
	 */
	viewMode?: DisplayViewModes;
} & Partial<
	Pick<IssueLikeDataTableViewProps, 'visibleColumnKeys' | 'wrappedColumnKeys' | 'columnCustomSizes'>
>;
