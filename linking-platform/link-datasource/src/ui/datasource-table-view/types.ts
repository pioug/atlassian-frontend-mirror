import type { DatasourceParameters } from '@atlaskit/linking-types/datasource';

import { type IssueLikeDataTableViewProps } from '../issue-like-table/types';

/** Outcome of a datasource data request, reported to hosts via `onRequestSettled`. */
export type DatasourceTableRequestSettledResult = {
	/** Number of items loaded so far (0 when the request resolved with no results). */
	itemCount: number;
	status: 'resolved' | 'rejected' | 'unauthorized' | 'forbidden';
	/** Total number of items matching the parameters, when the provider reports it. */
	totalCount?: number;
};

export type DatasourceTableViewProps = {
	/** Unique identifier for which type of datasource is being rendered and for making its requests */
	datasourceId: string;

	/**
	 * Called each time a data request settles (including next-page loads and refreshes), so hosts can
	 * react to the outcome, e.g. replace the table with their own empty state when `itemCount` is 0.
	 */
	onRequestSettled?: (result: DatasourceTableRequestSettledResult) => void;

	/** Parameters for making the data requests necessary to render data within the table */
	parameters: DatasourceParameters;

	/** Url for an existing datasource, initially used for displaying to a user unauthorized to query that site  */
	url?: string;
} & Partial<
	Pick<
		IssueLikeDataTableViewProps,
		| 'visibleColumnKeys'
		| 'onVisibleColumnKeysChange'
		| 'wrappedColumnKeys'
		| 'onWrappedColumnChange'
		| 'onWrappedColumnsChange'
		| 'onColumnResize'
		| 'onColumnSort'
		| 'sortState'
		| 'columnCustomSizes'
		| 'scrollableContainerHeight'
	>
>;
