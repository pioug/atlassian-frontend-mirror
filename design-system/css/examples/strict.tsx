/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { css, cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Button } from './components/button-strict';

const basicStyles = css({
	display: 'inline-block',
	color: token('color.link'),
});

const overridesStyles = cssMap({
	success: {
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.success.bold'),
		'&:hover': {
			backgroundColor: token('color.background.success.bold.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.success.bold.pressed'),
		},
		'@media (min-width: 48rem)': {
			backgroundColor: token('color.background.accent.magenta.bolder'),
		},
	},
});

export default function Basic() {
	return (
		<div css={basicStyles}>
			Host element
			<Button>Standard</Button>
			<Button xcss={overridesStyles.success}>Override</Button>
		</div>
	);
}
