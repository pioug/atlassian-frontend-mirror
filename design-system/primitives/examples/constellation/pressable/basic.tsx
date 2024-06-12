import React, { useCallback } from 'react';

import { Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const pressableStyles = xcss({
	color: 'color.text.subtle',
	fontWeight: token('font.weight.medium'),

	':hover': {
		textDecoration: 'underline',
	},
	':active': {
		color: 'color.text',
	},
});

export default function Basic() {
	const handleClick = useCallback(() => {
		console.log('Clicked');
	}, []);

	return (
		<Pressable
			onClick={handleClick}
			padding="space.0"
			backgroundColor="color.background.neutral.subtle"
			xcss={pressableStyles}
		>
			Edit comment
		</Pressable>
	);
}
