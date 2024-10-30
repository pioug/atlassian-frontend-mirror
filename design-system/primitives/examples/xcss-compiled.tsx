/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

// NOTE: While this is using Compiled, this is backwards compatability with the old Emotion API.
import { Box, Inline } from '../src';

const styles = cssMap({
	root: {
		color: 'var(--ds-text-accent-lime)',
	},
	bg: {
		backgroundColor: 'var(--ds-background-accent-lime-subtle)',
	},
	bgAlt: {
		backgroundColor: 'var(--ds-background-neutral-subtle)',
	},
	interactive: {
		cursor: 'pointer',
		border: `${token('border.width')} solid ${token('color.border')}`,
	},
	focused: {
		color: 'var(--ds-text-selected)',
		backgroundColor: 'var(--ds-background-selected)',
		border: `${token('border.width')} solid ${token('color.border.selected')}`,
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
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<Box xcss={cx(styles.root, styles.bg)}>Composed</Box>
				<Box
					onClick={() => setIsFocused((prev) => !prev)}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					xcss={cx(styles.root, styles.bg, styles.interactive, isFocused && styles.focused)}
				>
					Conditionally composed
				</Box>
			</Inline>
		</Fragment>
	);
}
