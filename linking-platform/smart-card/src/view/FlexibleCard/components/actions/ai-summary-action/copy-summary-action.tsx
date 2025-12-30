import React, { useCallback, useState } from 'react';

import { FormattedMessage } from 'react-intl-next';

import CopyIcon from '@atlaskit/icon/core/copy';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../../../messages';
import type { AISummaryActionData } from '../../../../../state/flexible-ui-context/types';
import Action from '../action';

import type { AISummaryActionProps } from './types';

export function CopySummaryAction({
	url,
	onClick: onClickCallback,
	testId,
	content,
	...props
}: AISummaryActionProps & AISummaryActionData & { content: string }): React.JSX.Element {
	const { fireEvent } = useAnalyticsEvents();

	const [tooltipMessage, setTooltipMessage] = useState(messages.copy_summary_action_description);

	const handleCopySummaryClick = useCallback(async () => {
		fireEvent('ui.button.clicked.copySummary', {});

		await navigator.clipboard.writeText(content ?? '');

		setTooltipMessage(messages.copied_summary_action_description);

		onClickCallback?.();
	}, [fireEvent, onClickCallback, content]);

	return (
		<Action
			content={<FormattedMessage {...messages.copy_summary_action} />}
			icon={<CopyIcon color="currentColor" spacing="spacious" label="Copy Summary" />}
			onClick={handleCopySummaryClick}
			testId={`${testId}-copy-summary-action`}
			tooltipMessage={<FormattedMessage {...tooltipMessage} />}
			tooltipOnHide={() => setTooltipMessage(messages.copy_summary_action_description)}
			{...props}
		/>
	);
}
