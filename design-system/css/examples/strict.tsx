/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { jsx } from '@compiled/react';

import { css, cssMap } from '@atlaskit/css';

import { Button } from './components/button-strict';

const basicStyles = css({
	color: 'var(--ds-link)',
	display: 'inline-block',
});

const overridesStyles = cssMap({
	success: {
		color: 'var(--ds-text-inverse)',
		backgroundColor: 'var(--ds-background-success-bold)',
		'&:hover': {
			backgroundColor: 'var(--ds-background-success-bold-hovered)',
		},
		'&:active': {
			backgroundColor: 'var(--ds-background-success-bold-pressed)',
		},
		'@media (min-width: 48rem)': {
			backgroundColor: 'var(--ds-background-accent-magenta-bolder)',
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
