import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';

import AiIcon from '@atlaskit/icon/core/atlassian-intelligence';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../../../messages';
import type { AISummaryActionData } from '../../../../../state/flexible-ui-context/types';
import type {
	AISummaryState,
	AISummaryStatus,
} from '../../../../../state/hooks/use-ai-summary/ai-summary-service/types';
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
			content={<FormattedMessage {...messages.ai_summary_action} />}
			icon={<AiIcon spacing="spacious" color="currentColor" label="Summarise with AI" />}
			onClick={handleActionClick}
			testId={`${testId}-summarise-action`}
			isLoading={status === 'loading'}
			tooltipMessage={<FormattedMessage {...messages.ai_summary_action_description} />}
			{...props}
		/>
	);
}
