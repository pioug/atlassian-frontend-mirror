import { Box, Inline, xcss } from '@atlaskit/primitives';
import React from 'react';
import DocQuickLinks from './doc-quick-links';
import ExampleQuickLinks from './example-quick-links';

const quickLinkStyles = xcss({
	flexGrow: 2,
	marginBlock: 'space.negative.150',
	textAlign: 'right',
});

const QuickLinks = () => (
	<Box xcss={quickLinkStyles}>
		<Inline alignInline="end" space="space.100">
			<DocQuickLinks />
			<ExampleQuickLinks />
		</Inline>
	</Box>
);

export default QuickLinks;
