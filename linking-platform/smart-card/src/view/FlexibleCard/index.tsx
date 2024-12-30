import React, { useEffect, useMemo } from 'react';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { SmartLinkStatus } from '../../constants';
import { FlexibleUiContext, FlexibleUiOptionContext } from '../../state/flexible-ui-context';
import { useAISummaryConfig } from '../../state/hooks/use-ai-summary-config';
import useResolve from '../../state/hooks/use-resolve';

import Container from './components/container';
import { type FlexibleCardProps } from './types';
import { getContextByStatus, getRetryOptions } from './utils';

/**
 * This represents a Flexible Card: a link represented by a card with metadata.
 * This is the container in which all Flexible UI Blocks and Elements exist.
 * Note: TitleBlock is mandatory for a Flexible Card to render.
 * @see Container
 */
const FlexibleCard = ({
	appearance = 'flexible',
	cardState,
	children,
	id,
	onAuthorize,
	onClick,
	onError,
	onResolve,
	origin,
	renderers,
	showHoverPreview,
	hoverPreviewOptions,
	actionOptions,
	testId,
	ui,
	url,
}: FlexibleCardProps) => {
	const aiSummaryConfig = useAISummaryConfig();
	const resolve = useResolve();

	const { fireEvent } = useAnalyticsEvents();

	const { status: cardType, details } = cardState;
	const status = cardType as SmartLinkStatus;

	const context = useMemo(
		() =>
			getContextByStatus({
				aiSummaryConfig,
				appearance,
				fireEvent,
				response: details,
				id,
				origin,
				renderers,
				resolve,
				actionOptions,
				status,
				url,
			}),
		[
			aiSummaryConfig,
			appearance,
			details,
			fireEvent,
			id,
			origin,
			renderers,
			actionOptions,
			resolve,
			status,
			url,
		],
	);
	const retry = getRetryOptions(url, status, details, onAuthorize);
	const { title } = context || {};

	useEffect(() => {
		switch (status) {
			case SmartLinkStatus.Resolved:
				if (onResolve) {
					onResolve({ title, url });
				}
				break;
			case SmartLinkStatus.Errored:
			case SmartLinkStatus.Fallback:
			case SmartLinkStatus.Forbidden:
			case SmartLinkStatus.NotFound:
			case SmartLinkStatus.Unauthorized:
				if (onError) {
					onError({ status, url });
				}
				break;
		}
	}, [onError, onResolve, status, title, url]);

	return (
		<FlexibleUiOptionContext.Provider value={ui}>
			<FlexibleUiContext.Provider value={context}>
				<Container
					testId={testId}
					{...ui}
					onClick={onClick}
					retry={retry}
					showHoverPreview={showHoverPreview}
					hoverPreviewOptions={hoverPreviewOptions}
					actionOptions={actionOptions}
					status={status}
				>
					{children}
				</Container>
			</FlexibleUiContext.Provider>
		</FlexibleUiOptionContext.Provider>
	);
};

export default FlexibleCard;
