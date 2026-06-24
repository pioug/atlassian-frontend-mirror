import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import RovoIcon from '@atlaskit/icon-lab/core/rovo';
import { fg } from '@atlaskit/platform-feature-flags';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../../../messages';
import type { AISummaryActionData } from '../../../../../state/flexible-ui-context/types';
import type {
	AISummaryState,
	AISummaryStatus,
} from '../../../../../state/hooks/use-ai-summary/ai-summary-service/types';
import { useBlockCardRovoActionExperimentNoExposure } from '../../../../../state/hooks/use-block-card-rovo-action-experiment';
import Action from '../action';

import type { AISummaryActionProps } from './types';
import { getErrorMessage } from './utils';

export function AISummariseAction({
	onClick: onClickCallback,
	onError: onErrorCallback,
	testId,
	status,
	summariseUrl,
	...props
}: AISummaryActionProps &
	AISummaryActionData & {
		status: AISummaryStatus;
		summariseUrl: () => Promise<AISummaryState> | undefined;
	}): React.JSX.Element {
	const { fireEvent } = useAnalyticsEvents();
	const isRovoBlockCardExperimentEnabled = useBlockCardRovoActionExperimentNoExposure();

	const onCompleted = useCallback(
		(state: AISummaryState) => {
			if (state?.status === 'error') {
				onErrorCallback?.(getErrorMessage(state.error));
			}
		},
		[onErrorCallback],
	);

	const handleActionClick = useCallback(() => {
		fireEvent('ui.button.clicked.aiSummary', {});

		fireEvent('track.aiInteraction.initiated', {
			aiFeatureName: 'Smart Links Summary',
			proactiveAIGenerated: 0,
			userGeneratedAI: 1,
		});

		summariseUrl()?.then(onCompleted, onCompleted);

		onClickCallback?.();
	}, [fireEvent, onClickCallback, onCompleted, summariseUrl]);

	return (
		<Action
			content={<FormattedMessage {...messages.ai_summary_action_rebrand} />}
			icon={
				<RovoIcon
					spacing="spacious"
					color="currentColor"
					label="Summarise with AI"
					{...(fg('platform_sl_3p_auth_rovo_action_kill_switch') || isRovoBlockCardExperimentEnabled
						? { size: props.iconSize }
						: {})}
				/>
			}
			onClick={handleActionClick}
			testId={`${testId}-summarise-action`}
			isLoading={status === 'loading'}
			tooltipMessage={<FormattedMessage {...messages.ai_summary_action_description_rebrand} />}
			{...props}
		/>
	);
}
