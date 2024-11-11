import React from 'react';

import { xcss } from '@atlaskit/primitives';

import Anchor from '../src/components/anchor';

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
		<Anchor
			testId="anchor-styled"
			href="/home"
			backgroundColor="color.background.brand.bold"
			padding="space.100"
			xcss={anchorStyles}
		>
			I am an anchor
		</Anchor>
	);
}
