import React from 'react';

import Code from '@atlaskit/code/code';
import { cssMap } from '@atlaskit/css';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import ExampleBox from '../shared/example-box';

const styles = cssMap({
	growingBox: { display: 'block', flexGrow: 1 },
});

export default function Example(): React.JSX.Element {
	return (
		<Stack alignInline="start" space="space.100">
			<Inline grow="hug">
				<ExampleBox xcss={styles.growingBox}>
					Wrapping <Code>Inline</Code> is set to <Code>grow="hug"</Code>
				</ExampleBox>
			</Inline>
			<Inline grow="fill">
				<ExampleBox xcss={styles.growingBox}>
					Wrapping <Code>Inline</Code> is set to <Code>grow="fill"</Code>
				</ExampleBox>
			</Inline>
		</Stack>
	);
}
