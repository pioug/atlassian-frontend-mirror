import React from 'react';

import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives/compiled';

export default function Example() {
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
