/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useIntl } from 'react-intl';

import Button, { type ButtonProps } from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ChatPillIcon } from '../../common/ui/chat-icon';
import messages from './messages';

const styles = cssMap({
	chatToAgentButtonContainer: {
		width: '100%',
	},

	chatToAgentButtonWrapper: {
		display: 'flex',
		justifyContent: 'center',
		fontWeight: token('font.weight.medium'),
	},

	chatPillButtonInline: { paddingInline: token('space.025') },

	chatPillText: {
		wordBreak: 'break-word',
		textAlign: 'left',
		whiteSpace: 'pre-wrap',
	},

	chatPillIconWrapper: {
		minWidth: '20px',
		height: '20px',
	},
});

type ChatToAgentButtonProps = {
	onClick: ButtonProps['onClick'];
};

export const ChatToAgentButton = ({ onClick }: ChatToAgentButtonProps): JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<Box xcss={styles.chatToAgentButtonContainer}>
			<Button testId="view-agent-modal-chat-to-agent-button" shouldFitContainer onClick={onClick}>
				<Box xcss={styles.chatToAgentButtonWrapper}>
					<Inline space="space.050" xcss={styles.chatPillButtonInline}>
						<Box xcss={styles.chatPillIconWrapper}>
							<ChatPillIcon />
						</Box>
						<Box xcss={styles.chatPillText}>{formatMessage(messages.chatToAgentButton)}</Box>
					</Inline>
				</Box>
			</Button>
		</Box>
	);
};
