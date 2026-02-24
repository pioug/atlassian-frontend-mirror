/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { cssMap, jsx } from '@atlaskit/css';

const wrapper = cssMap({
	root: {
		marginBlockEnd: token('space.100'),
		marginBlockStart: token('space.100'),
	},
});

export function Paragraph({ children }: { children: React.ReactNode }) {
	return (
		<div css={wrapper.root}>
			<Text as="p">{children}</Text>
		</div>
	);
}
