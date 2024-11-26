import React from 'react';

import Link from '@atlaskit/link';
import { Box, Inline } from '@atlaskit/primitives';

export default () => (
	<Box testId="inline-example" padding="space.100">
		<Inline space="space.150" separator="/">
			<Link href="/">breadcrumbs</Link>
			<Link href="/">for</Link>
			<Link href="/">some</Link>
			<Link href="/">sub</Link>
			<Link href="/">page</Link>
		</Inline>
	</Box>
);
