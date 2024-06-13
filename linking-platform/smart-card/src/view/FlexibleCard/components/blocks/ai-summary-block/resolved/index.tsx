import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { FormattedMessage } from 'react-intl-next';

import { Box, Inline } from '@atlaskit/primitives';

import {
	ActionName,
	SmartLinkDirection,
	SmartLinkSize,
	SmartLinkWidth,
} from '../../../../../../constants';
import ActionGroup from '../../action-group';
import Block from '../../block';
import ElementGroup from '../../element-group';
import MotionWrapper from '../../../common/motion-wrapper';
import AIStateIndicator from '../ai-state-indicator';
import { renderElementItems } from '../../utils';
import type { ActionItem } from '../../types';
import type { AISummaryBlockProps } from '../types';
import { messages } from '../../../../../../messages';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';
import AIIcon from '../../../../../common/ai-icon';
import AISummary from '../../../../../common/ai-summary';
import { useAnalyticsEvents } from '../../../../../../common/analytics/generated/use-analytics-events';
import AIEventSummaryViewed from '../ai-event-summary-viewed';
import AIEventErrorViewed from '../../../common/ai-summary/ai-event-error-viewed';
import { di } from 'react-magnetic-di';
import type {
	AISummaryStatus,
	ErrorMessage,
} from '../../../../../../state/hooks/use-ai-summary/ai-summary-service/types';
import { css } from '@emotion/react';
import FeatureDiscovery from '../feature-discovery';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import type { EnvironmentsKeys } from '@atlaskit/linking-common';

export const AISummaryBlockErrorIndicator = ({
	showErrorIndicator,
	error,
	showTransition,
	testId,
}: {
	showErrorIndicator: boolean;
	error?: ErrorMessage;
	showTransition: boolean;
} & Pick<AISummaryBlockProps, 'testId'>) => (
	<MotionWrapper isFadeIn={true} show={showErrorIndicator} showTransition={showTransition}>
		<AIEventErrorViewed reason={error} />
		<AIStateIndicator error={error} state="error" testId={testId} />
	</MotionWrapper>
);

export const AISummaryBlockStatusIndicator = ({
	showStatusIndicator,
	metadata,
	status,
	testId,
}: {
	showStatusIndicator: boolean;
	status: AISummaryStatus;
} & Pick<AISummaryBlockProps, 'metadata' | 'testId'>) => {
	const metadataElements = renderElementItems(metadata);

	return showStatusIndicator ? (
		<AIStateIndicator state={status} testId={`${testId}-state-indicator`} />
	) : (
		<ElementGroup width={SmartLinkWidth.FitToContent} testId={`${testId}-metadata-group`}>
			{metadataElements}
		</ElementGroup>
	);
};

const AISummaryBlockResolvedView = (props: AISummaryBlockProps) => {
	di(useAISummary, AISummaryBlockErrorIndicator, AISummaryBlockStatusIndicator, AISummary);

	const {
		actions = [],
		onActionMenuOpenChange,
		size = SmartLinkSize.Medium,
		testId,
		aiSummaryMinHeight = 0,
		metadata,
		placeholder,
	} = props;

	const { fireEvent } = useAnalyticsEvents();

	const context = useFlexibleUiContext();
	const url = context?.url || '';
	const ari = context?.ari || '';
	const { product, connections } = useSmartLinkContext();

	const {
		summariseUrl,
		state: { content, status, error },
	} = useAISummary({
		url,
		ari,
		product,
		envKey: connections.client.envKey as EnvironmentsKeys,
		baseUrl: connections.client.baseUrlOverride,
	});

	const showAISummary =
		status === 'done' ||
		// We want to display the AI Summary component only when there is content available during the loading process.
		(status === 'loading' && !!content);

	const isSummarisedOnMountRef = useRef(status === 'done');
	const isErroredOnMountRef = useRef(status === 'error');

	const minHeight =
		getBooleanFF('platform.linking-platform.smart-card.hover-card-action-redesign') &&
		isSummarisedOnMountRef.current
			? 0
			: aiSummaryMinHeight;

	useEffect(() => {
		// if the error was apparent on mount and the status is changed to loading we can
		// clear the initial error on mount state
		if (isErroredOnMountRef.current && status === 'loading') {
			isErroredOnMountRef.current = false;
		}
	}, [status]);

	const combinedActions = useMemo(() => {
		if (status === 'ready' || status === 'error') {
			const aiAction = {
				content: <FormattedMessage {...messages.ai_summarize} />,
				name: ActionName.CustomAction,
				onClick: () => {
					fireEvent('ui.button.clicked.aiSummary', {});
					fireEvent('track.aiInteraction.initiated', {
						aiFeatureName: 'Smart Links Summary',
						proactiveAIGenerated: 0,
						userGeneratedAI: 1,
					});
					summariseUrl();
				},
				testId: `${testId}-ai-summary-action`,
				icon: <AIIcon label="AIIcon" />,
				/**
				 * Enabling feature discovery pulse
				 * Cleanup: https://product-fabric.atlassian.net/browse/EDM-9693
				 */
				wrapper: FeatureDiscovery,
			} as ActionItem;

			return [aiAction, ...actions];
		}
		return actions;
	}, [actions, status, testId, summariseUrl, fireEvent]);

	const onDropdownOpenChange = useCallback(
		(isOpen: boolean) => {
			if (onActionMenuOpenChange) {
				onActionMenuOpenChange({ isOpen });
			}
		},
		[onActionMenuOpenChange],
	);

	if (
		!showAISummary &&
		getBooleanFF('platform.linking-platform.smart-card.hover-card-action-redesign')
	) {
		return <>{placeholder}</>;
	}

	return (
		<Block
			{...props}
			direction={SmartLinkDirection.Vertical}
			testId={`${testId}-resolved-view`}
			/**
			 * Enabled for feature discovery to allow box shadow to overflow
			 * Cleanup: https://product-fabric.atlassian.net/browse/EDM-8681
			 */
			overrideCss={css(
				{
					overflow: 'visible',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				props.overrideCss,
			)}
		>
			{status === 'done' && <AIEventSummaryViewed fromCache={isSummarisedOnMountRef.current} />}
			<MotionWrapper
				minHeight={minHeight}
				show={showAISummary}
				showTransition={!isSummarisedOnMountRef.current}
			>
				<AISummary
					testId={`${testId}-ai-summary`}
					minHeight={minHeight}
					content={content}
					showIcon={
						!getBooleanFF('platform.linking-platform.smart-card.hover-card-action-redesign') &&
						isSummarisedOnMountRef.current
					}
				/>
			</MotionWrapper>

			{!getBooleanFF('platform.linking-platform.smart-card.hover-card-action-redesign') && (
				<>
					<Inline
						alignBlock="center"
						alignInline="end"
						grow="fill"
						spread="space-between"
						testId={`${testId}-footer-metadata`}
					>
						<Box>
							<AISummaryBlockStatusIndicator
								metadata={metadata}
								showStatusIndicator={
									!isSummarisedOnMountRef.current && (status === 'loading' || status === 'done')
								}
								status={status}
								testId={testId}
							/>
						</Box>
						<Box>
							<ActionGroup
								onDropdownOpenChange={onDropdownOpenChange}
								items={combinedActions}
								appearance="default"
								size={size}
							/>
						</Box>
					</Inline>

					<AISummaryBlockErrorIndicator
						showErrorIndicator={!isErroredOnMountRef.current && status === 'error'}
						showTransition={!isErroredOnMountRef.current}
						error={error}
						testId={`${testId}-error-indicator`}
					/>
				</>
			)}
		</Block>
	);
};

export default AISummaryBlockResolvedView;
