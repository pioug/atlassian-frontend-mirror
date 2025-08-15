/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type FC, useCallback, useState } from 'react';

import { jsx } from '@compiled/react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import EditorDoneIcon from '@atlaskit/icon/core/migration/check-mark--editor-done';
import CopyIcon from '@atlaskit/icon/core/migration/copy';
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status';
import Tooltip from '@atlaskit/tooltip';

const UI_CHANGE_DELAY = 125;

export interface TooltipProps {
	ready: string;
	success: string;
	failed: string;
}

export interface CopyMessagesProps {
	copy: MessageDescriptor;
	copied: MessageDescriptor;
}

export interface TooltipCopyButtonProps {
	textToCopy: string;
	tooltipMessages: TooltipProps;
	copyMessages: CopyMessagesProps;
	onCopyClick?(): void;
}

export type CopyState = 'ready' | 'success' | 'failed';

const getCopyIcon = (state: CopyState) => {
	switch (state) {
		case 'ready':
			return CopyIcon;
		case 'success':
			return EditorDoneIcon;
		case 'failed':
			// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
			return JiraFailedBuildStatusIcon;
		default:
			return CopyIcon;
	}
};

const getCopyTooltip = (state: CopyState, tooltipMessages: TooltipProps) => {
	switch (state) {
		case 'ready':
			return tooltipMessages.ready;
		case 'success':
			return tooltipMessages.success;
		case 'failed':
			return tooltipMessages.failed;
		default:
			return tooltipMessages.ready;
	}
};

const getCopyMessage = (state: CopyState, copyMessages: CopyMessagesProps): MessageDescriptor => {
	switch (state) {
		case 'ready':
			return copyMessages.copy;
		case 'success':
			return copyMessages.copied;
		default:
			return copyMessages.copy;
	}
};

export const TooltipCopyButton: FC<TooltipCopyButtonProps> = ({
	onCopyClick,
	textToCopy,
	tooltipMessages,
	copyMessages,
}) => {
	const [state, setIconState] = useState<CopyState>('ready');

	const handleCopy = useCallback(async () => {
		try {
			if (onCopyClick) {
				onCopyClick();
			}
			await navigator.clipboard.writeText(textToCopy);
			setTimeout(() => setIconState('success'), UI_CHANGE_DELAY);
		} catch {
			setTimeout(() => setIconState('failed'), UI_CHANGE_DELAY);
		}

		setTimeout(() => setIconState('ready'), 2000);
	}, [onCopyClick, textToCopy]);

	return (
		<Tooltip content={getCopyTooltip(state, tooltipMessages)}>
			<Button
				testId={`copy-button-${state.toString()}`}
				iconAfter={getCopyIcon(state)}
				onClick={handleCopy}
				spacing="compact"
			>
				<FormattedMessage {...getCopyMessage(state, copyMessages)} />
			</Button>
		</Tooltip>
	);
};
