import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled/inline';

import ExampleBox from '../shared/example-box';

export default function Example(): React.JSX.Element {
	return (
		<Inline>
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Inline>
	);
}
