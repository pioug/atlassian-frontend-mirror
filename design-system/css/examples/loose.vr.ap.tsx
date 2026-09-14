/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { Button } from './components/button-loose';

const basicStyles = css({
	display: 'inline-block',
	color: 'green',
});

const overridesStyles = cssMap({
	discovery: {
		backgroundColor: token('color.background.discovery.bold'),
		color: token('color.text.inverse'),
		'&:hover': {
			backgroundColor: token('color.background.discovery.bold.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.discovery.bold.pressed'),
		},
	},
});

export default function Basic(): JSX.Element {
	return (
		<div css={basicStyles}>
			Host element
			<Button>Standard</Button>
			<Button xcss={overridesStyles.discovery}>Discovery</Button>
		</div>
	);
}
