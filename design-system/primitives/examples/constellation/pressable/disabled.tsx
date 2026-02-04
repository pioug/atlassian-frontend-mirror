/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Inline, Pressable, Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	pressable: {
		fontWeight: token('font.weight.medium'),
		backgroundColor: token('color.background.neutral.subtle'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
	},

	enabled: {
		color: token('color.text.subtle'),

		'&:hover': {
			textDecoration: 'underline',
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			color: token('color.link.pressed'),
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},

	disabled: {
		color: token('color.text.disabled'),
	},
});

export default function Disabled(): JSX.Element {
	const handleClick = useCallback(() => {
		console.log('Clicked');
	}, []);

	const [isDisabled, setIsDisabled] = useState(true);
	const toggleDisabled = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setIsDisabled(event.currentTarget.checked);
	}, []);
	return (
		<Stack space="space.200" alignInline="start">
			<Inline alignBlock="center" space="space.100">
				<Toggle isChecked={isDisabled} id="is-disabled" onChange={toggleDisabled} />
				<label htmlFor="is-disabled">Disabled</label>
			</Inline>
			<Pressable
				isDisabled={isDisabled}
				onClick={handleClick}
				xcss={cx(styles.pressable, isDisabled ? styles.disabled : styles.enabled)}
			>
				Edit comment
			</Pressable>
		</Stack>
	);
}
