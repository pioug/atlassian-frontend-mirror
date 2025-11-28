import React from 'react';

import { cssMap } from '@atlaskit/css';
import RovoChatIcon from '@atlaskit/icon/core/rovo-chat';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	agentChatIcon: {
		width: '32px',
		height: '32px',
		borderRadius: token('radius.large'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
});

export const AgentChatIcon = () => {
	return (
		<Flex xcss={styles.agentChatIcon} alignItems="center" justifyContent="center">
			<RovoChatIcon label="" color={token('color.icon.subtlest')} />
		</Flex>
	);
};
