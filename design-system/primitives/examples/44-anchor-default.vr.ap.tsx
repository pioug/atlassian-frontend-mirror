import React from 'react';

import { Anchor } from '@atlaskit/primitives/compiled/anchor';

export default function Default(): React.JSX.Element {
	return (
		<Anchor testId="anchor-default" href="/home">
			I am an anchor
		</Anchor>
	);
}
