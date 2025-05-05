import React, { useCallback } from 'react';

import { Pressable, xcss } from '@atlaskit/primitives';

const pressableStyles = xcss({
	color: 'color.text.subtle',
	fontWeight: 'font.weight.medium',
	backgroundColor: 'color.background.neutral.subtle',

	':hover': {
		textDecoration: 'underline',
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},
	':active': {
		color: 'color.text',
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},
});

export default function Basic() {
	const handleClick = useCallback(() => {
		console.log('Clicked');
	}, []);

	return (
		<Pressable onClick={handleClick} padding="space.0" xcss={pressableStyles}>
			Edit comment
		</Pressable>
	);
}
