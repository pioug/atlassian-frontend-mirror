import React, { useCallback, useState } from 'react';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { FormattedMessage } from 'react-intl-next';
import Action from '../action';
import { messages } from '../../../../../messages';
import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import type { AISummaryActionData } from '../../../../../state/flexible-ui-context/types';
import type { AISummaryActionProps } from './types';

export function CopySummaryAction({
	url,
	onClick: onClickCallback,
	testId,
	content,
	...props
}: AISummaryActionProps & AISummaryActionData & { content: string }) {
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
			// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19716
			icon={<CopyIcon label="Copy Summary" />}
			onClick={handleCopySummaryClick}
			testId={`${testId}-copy-summary-action`}
			tooltipMessage={<FormattedMessage {...tooltipMessage} />}
			tooltipOnHide={() => setTooltipMessage(messages.copy_summary_action_description)}
			{...props}
		/>
	);
}
