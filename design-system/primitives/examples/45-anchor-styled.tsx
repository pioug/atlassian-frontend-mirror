import React from 'react';

import { xcss } from '../src';
import UNSAFE_ANCHOR from '../src/components/anchor';

const anchorStyles = xcss({
	borderRadius: 'border.radius.100',
	color: 'color.text.inverse',
	display: 'inline-block',

	':hover': {
		color: 'color.text.inverse',
	},
});

export default function Default() {
	return (
		<UNSAFE_ANCHOR
			testId="anchor-styled"
			href="/home"
			backgroundColor="color.background.brand.bold"
			padding="space.100"
			xcss={anchorStyles}
		>
			I am an anchor
		</UNSAFE_ANCHOR>
	);
}
