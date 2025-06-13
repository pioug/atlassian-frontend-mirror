/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	pressable: {
		color: token('color.text.subtle'),
		fontWeight: token('font.weight.medium'),
		backgroundColor: token('color.background.neutral.subtle'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),

		'&:hover': {
			textDecoration: 'underline',
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			color: token('color.link.pressed'),
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
});

export default function Basic() {
	const handleClick = useCallback(() => {
		console.log('Clicked');
	}, []);

	return (
		<Pressable onClick={handleClick} xcss={styles.pressable}>
			Edit comment
		</Pressable>
	);
}
