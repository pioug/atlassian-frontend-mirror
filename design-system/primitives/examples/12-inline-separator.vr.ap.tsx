import React from 'react';

import Link from '@atlaskit/link/link';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';

export default (): React.JSX.Element => (
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
