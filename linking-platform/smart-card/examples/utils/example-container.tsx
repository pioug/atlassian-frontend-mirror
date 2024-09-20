import { Box, Stack, xcss } from '@atlaskit/primitives';
import React from 'react';
import { IntlProvider } from 'react-intl-next';

const boxStyles = xcss({ margin: '0 auto' });

const DEFAULT_MAX_WIDTH = '700px';

const ExampleContainer = ({
	children,
	maxWidth = DEFAULT_MAX_WIDTH,
	title,
}: {
	children: React.ReactNode;
	maxWidth?: string;
	title: string;
}) => (
	<IntlProvider locale="en">
		<Box paddingBlock="space.400" style={{ maxWidth }} xcss={boxStyles}>
			<Stack space="space.200">
				<h1>{title}</h1>
				{children}
			</Stack>
		</Box>
	</IntlProvider>
);

export default ExampleContainer;
