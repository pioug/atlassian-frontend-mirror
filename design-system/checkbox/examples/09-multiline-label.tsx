/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Stack } from '@atlaskit/primitives';

import { Checkbox } from '../src';

const styles = cssMap({
	root: { alignItems: 'center' },
});

export default function MultilineLabelExample() {
	return (
		<Fragment>
			<Checkbox
				label={
					<Stack>
						<span>This is spread over</span>
						<span>multiple lines</span>
					</Stack>
				}
				value="Multiline Label Checkbox"
				name="multiline-label"
				testId="multiline-label"
			/>
			<Checkbox
				xcss={styles.root}
				label={
					<Stack>
						<span>This is spread over</span>
						<span>multiple lines</span>
						<span>and centered</span>
					</Stack>
				}
				value="Multiline Label Checkbox"
				name="multiline-label"
				testId="multiline-label"
			/>
		</Fragment>
	);
}
