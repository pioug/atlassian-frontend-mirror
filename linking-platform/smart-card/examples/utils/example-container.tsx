import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';

const boxStyles = cssMap({
	root: {
		margin: '0 auto',
	},
});

const DEFAULT_MAX_WIDTH = '700px';

const ExampleContainer = ({
	children,
	maxWidth = DEFAULT_MAX_WIDTH,
	title,
}: {
	children: React.ReactNode;
	maxWidth?: string;
	title: string;
}): React.JSX.Element => (
	<IntlProvider locale="en">
		<Box paddingBlock="space.400" style={{ maxWidth }} xcss={boxStyles.root}>
			<Stack space="space.200">
				<h1>{title}</h1>
				{children}
			</Stack>
		</Box>
	</IntlProvider>
);

export default ExampleContainer;
