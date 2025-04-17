/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

// NOTE: While this is using Compiled, this is backwards compatability with the old Emotion API.

const styles = cssMap({
	root: {
		color: 'var(--ds-text)',
	},
	bg: {
		backgroundColor: 'var(--ds-background-accent-lime-subtle)',
	},
	bgAlt: {
		backgroundColor: 'var(--ds-background-neutral-subtle)',
	},
	interactive: {
		cursor: 'pointer',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	focused: {
		color: 'var(--ds-text-selected)',
		backgroundColor: 'var(--ds-background-selected)',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.selected'),
	},
	dashedBorder: {
		borderStyle: 'dashed',
		borderColor: 'var(--ds-border)',
		borderWidth: 'var(--ds-border-width)',
	},
});

export default function Example() {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<Fragment>
			<Inline grow="hug" space="space.100" xcss={styles.dashedBorder} alignInline="center">
				<Box xcss={styles.root}>Static</Box>
				<Box xcss={cx(styles.root, styles.bg)}>Composed</Box>
				<Box
					onClick={() => setIsFocused((prev) => !prev)}
					xcss={cx(styles.root, styles.bg, styles.interactive, isFocused && styles.focused)}
				>
					Conditionally composed
				</Box>
			</Inline>
		</Fragment>
	);
}
