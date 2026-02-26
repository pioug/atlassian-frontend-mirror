/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

// This workaround prevents unwanted text truncation in LinkMenuItem caused by the current
// behavior in the ADS 'LinkMenuItem' component.
// More info: https://atlassian.slack.com/archives/C09FTFN0APN/p1770606423849489
const agentNameStyles = css({
	display: 'inline-grid',
	gridTemplateColumns: '1fr auto',
	gap: token('space.050'),
	alignItems: 'center',
});

export const AgentNameSideNav = ({
	children,
	name,
}: {
	children: React.ReactNode;
	name: string;
}) => (
	<div css={agentNameStyles}>
		<Text maxLines={1}>{name}</Text>
		{children}
	</div>
);
