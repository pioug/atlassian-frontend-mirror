/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { css, cssMap, jsx } from '@compiled/react';

import { Button } from './components/button-loose';

const basicStyles = css({
	color: 'green',
	display: 'inline-block',
});

const overridesStyles = cssMap({
	discovery: {
		backgroundColor: 'var(--ds-background-discovery-bold)',
		'&:hover': {
			backgroundColor: 'var(--ds-background-discovery-bold-hovered)',
		},
		'&:active': {
			backgroundColor: 'var(--ds-background-discovery-bold-pressed)',
		},
	},
});

export default function Basic() {
	return (
		<div css={basicStyles}>
			Host element
			<Button>Standard</Button>
			<Button xcss={overridesStyles.discovery}>Discovery</Button>
		</div>
	);
}
