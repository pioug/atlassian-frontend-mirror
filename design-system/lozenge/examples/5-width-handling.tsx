import React from 'react';

import Lozenge from '@atlaskit/lozenge';
import { Box, Stack, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const fixedWidthStyles = xcss({
	width: '400px',
	border: `solid 1px ${token('color.border')}`,
});

const fixedContainerStyles = xcss({
	overflow: 'hidden',
	width: '125px',
});

const percentageWidthStyles = xcss({
	width: '20%',
	overflow: 'hidden',
});

export default () => (
	<Stack space="space.100" testId="test-container">
		<Text>
			<Lozenge appearance="success" testId="lozenge-truncated-default-short">
				short text
			</Lozenge>
		</Text>
		<Text>
			<Lozenge appearance="success" testId="lozenge-truncated-default-long">
				very very wide text which truncates by default
			</Lozenge>
		</Text>
		<Text>
			<Lozenge appearance="success" maxWidth={100} testId="lozenge-truncated-override-100">
				100px maxwidth truncates
			</Lozenge>
		</Text>
		<Box xcss={fixedWidthStyles}>
			<Stack space="space.100" testId="test-container">
				<Text>
					<Text weight="medium" as="p">
						In a 400px wide container
					</Text>
					<Lozenge appearance="new" maxWidth={'none'} testId="lozenge-truncated-override-none">
						"none" max-width does not truncate text
					</Lozenge>
				</Text>
				<Text>
					<Lozenge appearance="new" maxWidth={'100%'} testId="lozenge-truncated-override-100%">
						"100%" max-width does not truncate text
					</Lozenge>
				</Text>
				<Text>
					<Lozenge appearance="new" maxWidth={'90%'} testId="lozenge-truncated-override-90%">
						"90%" max-width does not truncate text
					</Lozenge>
				</Text>
				<Text>
					<Lozenge appearance="new" maxWidth={'50%'} testId="lozenge-truncated-override-50%">
						"50%" max-width does truncate text
					</Lozenge>
				</Text>
			</Stack>
		</Box>

		<Text as="p">
			<Text weight="medium" as="p">
				Constrained by maxWidth
			</Text>
			<Lozenge appearance="success" maxWidth={150} testId="lozenge-truncated-by-maxWidth">
				very very very wide text which truncates
			</Lozenge>
		</Text>

		<Text weight="medium">Constrained by container size</Text>
		<Box xcss={fixedContainerStyles}>
			<Lozenge appearance="success" testId="lozenge-truncated-by-container-size">
				very very very wide text which truncates
			</Lozenge>
		</Box>

		<Text weight="medium">In a % width context truncates at lowest of % and maxWidth</Text>
		<Box xcss={percentageWidthStyles}>
			<Lozenge appearance="success" testId="lozenge-truncated-by-container-pc">
				very very very wide text which truncates
			</Lozenge>
		</Box>
	</Stack>
);
