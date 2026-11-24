import type { ReactElement } from 'react';

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
	 * Kept for compatibility while the Jira smart link card passes this prop during its no-results
	 * experiment. Remove it with the experiment cleanup. Completion reporting uses `onRequestSettled`.
	 *
	 * @see {@link https://switcheroo.atlassian.com/ui/gates/4db9beb2-25fe-4bae-83ed-2969fa7c3e85/key/kd_sain_jira_card_no_results_rollout kd_sain_jira_card_no_results_rollout}
	 * @see {@link https://hello.jira.atlassian.cloud/jira/software/projects/JSAI/boards/16325 Jira Search team}
	 */
	enableRequestSettled?: boolean;
	/**
	 * Called each time a data request settles (including next-page loads and refreshes), so hosts can
	 * react to the outcome, e.g. replace the table with their own empty state when `itemCount` is 0.
	 */
	onRequestSettled?: (result: DatasourceTableRequestSettledResult) => void;

	/** Parameters for making the data requests necessary to render data within the table */
	parameters: DatasourceParameters;

	/** Replace the entire resolved empty table, including headers and footer, without stopping requests. */
	renderEmptyState?: () => ReactElement | null;

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
