import React from 'react';

import { Anchor } from '@atlaskit/primitives/compiled';

export default function AnchorHTMLAttributes() {
	return (
		<Anchor href="https://www.atlassian.com/" target="_blank" rel="noopener noreferrer">
			Visit the Atlassian website
		</Anchor>
	);
}
