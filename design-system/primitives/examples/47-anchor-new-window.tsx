import React from 'react';

import Anchor from '../src/components/anchor';

export default function AnchorNewWindow() {
	return (
		<Anchor testId="anchor-new-window" href="https://www.atlassian.com" target="_blank">
			I am an anchor
		</Anchor>
	);
}
