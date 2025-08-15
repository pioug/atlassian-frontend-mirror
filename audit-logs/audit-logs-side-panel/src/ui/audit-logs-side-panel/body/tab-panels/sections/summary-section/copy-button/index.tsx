/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { defineMessages, useIntl } from 'react-intl-next';

import { TooltipCopyButton } from './tooltip-copy-button';

const messages = defineMessages({
	copy: {
		id: 'organization.audit.log.side-panel.tab-panels.details.sub-section.json-value.row-value.button',
		defaultMessage: 'Copy',
	},
	copied: {
		id: 'organization.audit.log.side-panel.tab-panels.details.sub-section.json-value.row-value',
		defaultMessage: 'Copied!',
	},
	copyTooltip: {
		id: 'organization.audit.log.side-panel.tab-panels.details.sub-section.copyReadyTooltip.row-value.button',
		defaultMessage: 'Copy to clipboard',
	},
	copySuccessTooltip: {
		id: 'organization.audit.log.side-panel.tab-panels.details.sub-section.copySuccessTooltip.row-value.button',
		defaultMessage: 'Copied!',
	},
	copyFailedTooltip: {
		id: 'organization.audit.log.side-panel.tab-panels.details.sub-section.copyFailedTooltip.row-value.button',
		defaultMessage: 'Copy event JSON failed',
	},
});

interface CopyJsonButtonProps {
	eventId: string;
	eventJSON: string;
}

export const CopyJsonButton = ({ eventId, eventJSON }: CopyJsonButtonProps) => {
	const { formatMessage } = useIntl();

	const tooltipMessages = {
		ready: formatMessage(messages.copyTooltip),
		success: formatMessage(messages.copySuccessTooltip),
		failed: formatMessage(messages.copyFailedTooltip),
	};

	const copyMessages = {
		copy: messages.copy,
		copied: messages.copied,
	};

	return (
		<TooltipCopyButton
			key={`audit-log-side-panel-copy-button-${eventId}`}
			textToCopy={eventJSON}
			tooltipMessages={tooltipMessages}
			copyMessages={copyMessages}
		/>
	);
};
