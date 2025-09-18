import React from 'react';

import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';

export default function FontStyleInheritance() {
	return (
		<Heading size="xxlarge">
			The <Link href="/components/link/code">link component</Link> inherits font styles
		</Heading>
	);
}
