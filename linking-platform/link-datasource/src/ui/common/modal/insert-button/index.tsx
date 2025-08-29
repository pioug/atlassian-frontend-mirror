import React, { type PropsWithChildren, useCallback } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import type { InlineCardAdf } from '@atlaskit/linking-common';
import { type DatasourceParameters } from '@atlaskit/linking-types';

import { EVENT_CHANNEL } from '../../../../analytics';
import { DatasourceDisplay, DatasourceSearchMethod } from '../../../../analytics/types';
import { buildDatasourceAdf } from '../../../../common/utils/schema-utils';
import { useUserInteractions } from '../../../../contexts/user-interactions';
import { useDatasourceContext } from '../datasource-context';
import { useViewModeContext } from '../mode-switcher/useViewModeContext';

export type InsertButtonProps<Parameters extends DatasourceParameters> = PropsWithChildren<{
	getAnalyticsPayload: () => Record<string, any>;
	testId?: string;
	url: string | undefined;
}>;

export const InsertButton = <Parameters extends DatasourceParameters>({
	testId,
	url,
	getAnalyticsPayload,
	children,
}: InsertButtonProps<Parameters>) => {
	const {
		datasourceId,
		parameters,
		tableState: { status, totalCount },
		isValidParameters,
		visibleColumnCount,
		visibleColumnKeys,
		columnCustomSizes,
		wrappedColumnKeys,
		onInsert,
	} = useDatasourceContext<Parameters>();
	const userInteractions = useUserInteractions();
	const { currentViewMode } = useViewModeContext();

	const isInsertDisabled =
		!isValidParameters(parameters) ||
		status === 'rejected' ||
		status === 'unauthorized' ||
		status === 'loading';

	const onInsertPressed = useCallback(
		(e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			if (!parameters || !isValidParameters(parameters) || !url) {
				return;
			}

			const insertButtonClickedEvent = analyticsEvent.update({
				actionSubjectId: 'insert',
				attributes: {
					totalItemCount: totalCount || 0,
					displayedColumnCount: visibleColumnCount.current,
					display:
						currentViewMode === 'inline'
							? DatasourceDisplay.DATASOURCE_INLINE
							: DatasourceDisplay.DATASOURCE_TABLE,
					searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
					actions: userInteractions.get(),
					...getAnalyticsPayload(),
				},
				eventType: 'ui',
			});

			const consumerEvent = insertButtonClickedEvent.clone() ?? undefined;
			insertButtonClickedEvent.fire(EVENT_CHANNEL);

			if (currentViewMode === 'inline') {
				onInsert(
					{
						type: 'inlineCard',
						attrs: {
							url,
						},
					} as InlineCardAdf,
					consumerEvent,
				);
			} else {
				onInsert(
					buildDatasourceAdf(
						{
							id: datasourceId,
							parameters,
							views: [
								{
									type: 'table',
									properties: {
										columns: (visibleColumnKeys || []).map((key) => {
											const width = columnCustomSizes?.[key];
											const isWrapped = wrappedColumnKeys?.includes(key);
											return {
												key,
												...(width ? { width } : {}),
												...(isWrapped ? { isWrapped } : {}),
											};
										}),
									},
								},
							],
						},
						url,
					),
					consumerEvent,
				);
			}
		},
		[
			columnCustomSizes,
			currentViewMode,
			datasourceId,
			getAnalyticsPayload,
			isValidParameters,
			onInsert,
			parameters,
			totalCount,
			url,
			userInteractions,
			visibleColumnCount,
			visibleColumnKeys,
			wrappedColumnKeys,
		],
	);

	return (
		<Button
			appearance="primary"
			onClick={onInsertPressed}
			isDisabled={isInsertDisabled}
			testId={testId}
		>
			{children}
		</Button>
	);
};
