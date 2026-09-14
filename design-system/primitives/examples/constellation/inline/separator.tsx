import React from 'react';

import Code from '@atlaskit/code/code';
import Heading from '@atlaskit/heading/heading';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

export default function Example(): React.JSX.Element {
	return (
		<Stack space="space.100">
			<Heading size="xsmall">Common folders</Heading>
			<Inline space="space.100" separator="|">
				{['bin', 'etc', 'home', 'tmp', 'usr'].map((folder) => (
					<Code key="folder">{folder}</Code>
				))}
			</Inline>
		</Stack>
	);
}
