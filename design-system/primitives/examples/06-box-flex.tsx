import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const flexContainerStyles = xcss({ display: 'flex' });
const flex1Styles = xcss({ borderStyle: 'solid', flex: '1' });
const flexGrow0Styles = xcss({ borderStyle: 'solid', flexGrow: '0' });
const flexGrow1Styles = xcss({ borderStyle: 'solid', flexGrow: '1' });

export default () => {
	return (
		<Stack space="space.400" alignInline="start">
			<Stack space="space.200" testId="box-with-flex">
				<Heading size="medium">flex</Heading>
				<Inline space="space.200" alignBlock="center">
					<Box padding="space.400" xcss={flexContainerStyles}>
						<Box xcss={flex1Styles}>flex=1</Box>
						<Box xcss={flex1Styles}>flex=1</Box>
					</Box>
				</Inline>
			</Stack>

			<Stack space="space.200" testId="box-with-flex">
				<Heading size="medium">flexGrow</Heading>
				<Inline space="space.200" alignBlock="center">
					<Box
						xcss={flexContainerStyles}
						padding="space.400"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ width: '300px' }}
					>
						<Box xcss={flexGrow0Styles}>flexGrow=0</Box>
						<Box xcss={flexGrow1Styles}>flexGrow=1</Box>
					</Box>
				</Inline>
			</Stack>
		</Stack>
	);
};
