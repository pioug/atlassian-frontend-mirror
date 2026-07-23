/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type JSX, useCallback } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	pressable: {
		color: token('color.text.subtle'),
		fontWeight: token('font.weight.medium'),
		backgroundColor: token('color.background.neutral.subtle'),
		transition: token('motion.button.hovered'),
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),

		'&:hover': {
			textDecoration: 'underline',
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			color: token('color.link.pressed'),
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			transition: token('motion.button.pressed'),
		},
	},
});

export default function Basic(): JSX.Element {
	const handleClick = useCallback(() => {
		console.log('Clicked');
	}, []);

	return (
		<Pressable onClick={handleClick} xcss={styles.pressable}>
			Edit comment
		</Pressable>
	);
}
