/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const headerStyles = cssMap({
	header: {
		width: '100%',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		backgroundClip: 'content-box',
		paddingInline: token('space.200'),
		zIndex: 1,
	},
	headerContent: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.050'),
		paddingBlockStart: token('space.200'),
	},
});

export const BoardHeader = (): JSX.Element => (
	<Box xcss={headerStyles.header}>
		<Box xcss={headerStyles.headerContent}>
			<Text size="small">Projects</Text>
			<Heading as="h1" size="large">
				Growth Discovery
			</Heading>
		</Box>
	</Box>
);
