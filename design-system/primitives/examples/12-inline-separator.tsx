import React from 'react';

import Link from '@atlaskit/link';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline } from "@atlaskit/primitives/compiled";

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
