/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MouseEvent, useCallback } from 'react';

import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import { mentionMessages } from '@atlaskit/editor-common/messages';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import { Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	retryRow: {
		alignItems: 'center',
		backgroundColor: 'transparent',
		borderWidth: 0,
		boxSizing: 'border-box',
		color: token('color.text.subtle'),
		cursor: 'pointer',
		display: 'flex',
		font: token('font.body'),
		minHeight: '40px',
		paddingBlock: token('space.100'),
		paddingInline: token('space.150'),
		textAlign: 'left',
		width: '100%',
	},
	retryText: {
		color: token('color.link'),
		font: token('font.body'),
	},
});

type AgentMentionLoadErrorItemProps = {
	onRetry: () => void;
};

export const AgentMentionLoadErrorItem = ({
	onRetry,
}: AgentMentionLoadErrorItemProps): JSX.Element => {
	const intl = useIntl();

	const handleMouseDown = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	}, []);

	const handleClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			onRetry();
		},
		[onRetry],
	);

	return (
		<button
			type="button"
			css={styles.retryRow}
			tabIndex={-1}
			onMouseDown={handleMouseDown}
			onClick={handleClick}
			data-testid="agent-mention-load-error-item"
		>
			<Inline alignBlock="center" space="space.100">
				<StatusErrorIcon label="" color={token('color.icon.danger')} />
				<Text as="span" color="color.text.subtle">
					{intl.formatMessage(mentionMessages.typeAheadSectionAgentsLoadError)}
				</Text>
				<span css={styles.retryText}>
					{intl.formatMessage(mentionMessages.typeAheadSectionAgentsRetry)}
				</span>
			</Inline>
		</button>
	);
};
