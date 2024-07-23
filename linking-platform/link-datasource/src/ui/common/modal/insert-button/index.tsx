/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type PropsWithChildren, useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import type { InlineCardAdf } from '@atlaskit/linking-common';

import { EVENT_CHANNEL } from '../../../../analytics';
import { DatasourceDisplay, DatasourceSearchMethod } from '../../../../analytics/types';
import { buildDatasourceAdf } from '../../../../common/utils/adf';
import { useUserInteractions } from '../../../../contexts/user-interactions';
import { useDatasourceContext } from '../datasource-context';
import { useViewModeContext } from '../mode-switcher/useViewModeContext';

export type InsertButtonProps = PropsWithChildren<{
	testId: string;
	url: string | undefined;
	getAnalyticsPayload: () => Record<string, any>;
}>;

export const InsertButton = ({ testId, url, getAnalyticsPayload, children }: InsertButtonProps) => {
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
	} = useDatasourceContext();
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
					...getAnalyticsPayload(),
					totalItemCount: totalCount || 0,
					displayedColumnCount: visibleColumnCount.current,
					display:
						currentViewMode === 'inline'
							? DatasourceDisplay.DATASOURCE_INLINE
							: DatasourceDisplay.DATASOURCE_TABLE,
					searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
					actions: userInteractions.get(),
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
							parameters: parameters,
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
			isValidParameters,
			parameters,
			url,
			getAnalyticsPayload,
			totalCount,
			visibleColumnCount,
			currentViewMode,
			userInteractions,
			onInsert,
			datasourceId,
			visibleColumnKeys,
			columnCustomSizes,
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
