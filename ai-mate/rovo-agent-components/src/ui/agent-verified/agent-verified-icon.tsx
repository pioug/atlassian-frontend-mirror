import React from 'react';

import { useIntl } from 'react-intl';

import { cssMap, cx } from '@atlaskit/css';
import VerifiedIcon from '@atlaskit/icon/core/status-verified';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import type { AgentVerifiedIconProps } from './agent-verified';
import messages from './messages';

const styles = cssMap({
	body: { height: '20px' },
	textLarge: { height: '24px' },
	headingMedium: { height: '24px' },
	headingLarge: { height: '28px' },
});

export const AgentVerifiedIcon = ({
	adjacentTextSize = 'body',
}: AgentVerifiedIconProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<Tooltip content={formatMessage(messages.verifiedAgentTooltip)}>
			<Flex
				justifyContent="center"
				alignItems="center"
				xcss={cx(
					adjacentTextSize === 'body' && styles['body'],
					adjacentTextSize === 'headingMedium' && styles['headingMedium'],
					adjacentTextSize === 'headingLarge' && styles['headingLarge'],
					adjacentTextSize === 'textLarge' && styles['textLarge'],
				)}
			>
				<VerifiedIcon
					color={token('color.icon.accent.blue')}
					label={formatMessage(messages.verifiedIconLabel)}
					size="small"
				/>
			</Flex>
		</Tooltip>
	);
};
