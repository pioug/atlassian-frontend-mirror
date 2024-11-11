import React from 'react';

import { xcss } from '@atlaskit/primitives';

import Pressable from '../src/components/pressable';

const pressableStyles = xcss({
	borderRadius: 'border.radius.100',
	color: 'color.text.inverse',
});

export default function Styled() {
	return (
		<Pressable
			testId="pressable-styled"
			backgroundColor="color.background.brand.bold"
			padding="space.100"
			xcss={pressableStyles}
		>
			Press me
		</Pressable>
	);
}
