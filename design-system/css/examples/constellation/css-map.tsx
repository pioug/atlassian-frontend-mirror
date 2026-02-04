/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	primary: {
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
	},
	discovery: {
		backgroundColor: token('color.background.discovery.bold'),
		color: token('color.text.inverse'),
	},
	success: {
		backgroundColor: token('color.background.success.bold'),
		color: token('color.text.inverse'),
	},
	disabled: { opacity: 0, cursor: 'not-allowed' },
	button: { marginBlockStart: token('space.200') },
});

const appearances = ['primary', 'discovery', 'success'] as const;

export default function CssMapExample({ isDisabled }: { isDisabled?: boolean }): JSX.Element {
	const [appearanceIndex, setAppearanceIndex] = useState(0);

	const cycleAppearance = () => {
		setAppearanceIndex((prev) => (prev + 1) % appearances.length);
	};

	return (
		<Stack space="space.200" alignInline="start">
			<Button onClick={cycleAppearance}>Change appearance</Button>
			<div css={[styles.root, styles[appearances[appearanceIndex]], isDisabled && styles.disabled]}>
				{appearances[appearanceIndex]}
			</div>
		</Stack>
	);
}
