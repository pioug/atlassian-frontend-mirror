/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { type LabelProps } from '../types';

/**
 * Base state styles with CSS custom properties.
 * Pseudo-selectors (:hover, :focus-within, :active) on the label element
 * update CSS variables that cascade to the CheckboxIcon.
 * This avoids nested sibling selectors.
 *
 * Uses `css` over `cssMap` to work around a bug in Compiled types when
 * using CSS variables in pseudo-selectors.
 */
const baseStyles = css({
	display: 'grid',
	gridAutoColumns: '1fr',
	gridAutoRows: 'min-content',
	'--checkbox-background-color': token('color.background.input'),
	'--checkbox-border-color': token('color.border.input'),
	'--checkbox-outline': 'none',
	'--checkbox-tick-color': 'transparent',
	color: token('color.text'),
	cursor: 'default',
	font: token('font.body'),
	'&:hover': {
		'--checkbox-background-color': token('color.background.input.hovered'),
	},
	'&:focus-within': {
		'--checkbox-outline': `${token('border.width.focused')} solid ${token('color.border.focused')}`,
	},
	'&:active': {
		'--checkbox-background-color': token('color.background.input.pressed'),
		'--checkbox-border-color': token('color.border'),
	},
	'@media screen and (forced-colors: active)': {
		'--checkbox-background-color': 'Canvas',
		'--checkbox-border-color': 'CanvasText',
		'--checkbox-tick-color': 'CanvasText',
	},
});

const textLabelLayoutStyles = css({
	gap: `${token('space.0')} ${token('space.050')}`,
	gridTemplateColumns: 'min-content auto',
});

// Checked/Indeterminate state
const checkedStyles = css({
	'--checkbox-background-color': token('color.background.selected.bold'),
	'--checkbox-border-color': token('color.background.selected.bold'),
	'--checkbox-tick-color': token('color.icon.inverse'),
	'&:hover': {
		'--checkbox-background-color': token('color.background.selected.bold.hovered'),
		'--checkbox-border-color': token('color.background.selected.bold.hovered'),
	},
	'&:active': {
		'--checkbox-background-color': token('color.background.input.pressed'),
		'--checkbox-border-color': token('color.border'),
		'--checkbox-tick-color': token('color.icon.inverse'),
	},
	'@media screen and (forced-colors: active)': {
		'--checkbox-background-color': 'Canvas',
		'--checkbox-border-color': 'CanvasText',
		'--checkbox-tick-color': 'CanvasText',
	},
});

// Invalid state - must override hover/active to maintain red border
const invalidStyles = css({
	'--checkbox-border-color': token('color.border.danger'),
	'&:hover': {
		'--checkbox-border-color': token('color.border.danger'),
	},
	'&:active': {
		'--checkbox-border-color': token('color.border.danger'),
	},
	'@media screen and (forced-colors: active)': {
		'--checkbox-border-color': 'Highlight',
	},
});

// Disabled state - must override hover/active to maintain disabled appearance
const disabledStyles = css({
	'--checkbox-background-color': token('color.background.disabled'),
	'--checkbox-border-color': token('color.background.disabled'),
	color: token('color.text.disabled'),
	cursor: 'not-allowed',
	'&:hover': {
		'--checkbox-background-color': token('color.background.disabled'),
		'--checkbox-border-color': token('color.background.disabled'),
	},
	'&:active': {
		'--checkbox-background-color': token('color.background.disabled'),
		'--checkbox-border-color': token('color.background.disabled'),
	},
	'@media screen and (forced-colors: active)': {
		'--checkbox-background-color': 'Canvas',
		'--checkbox-border-color': 'GrayText',
		'--checkbox-tick-color': 'GrayText',
	},
});

// Disabled + Checked/Indeterminate
const disabledCheckedStyles = css({
	'--checkbox-tick-color': token('color.icon.disabled'),
	'&:hover': {
		'--checkbox-tick-color': token('color.icon.disabled'),
	},
	'&:active': {
		'--checkbox-tick-color': token('color.icon.disabled'),
	},
});

export default function Label({
	children,
	isDisabled,
	isChecked,
	isIndeterminate,
	isInvalid,
	testId,
	label,
	id,
	xcss,
}: LabelProps): JSX.Element {
	return (
		<label
			className={xcss}
			css={[
				baseStyles,
				label && textLabelLayoutStyles,
				(isChecked || isIndeterminate) && checkedStyles,
				isInvalid && invalidStyles,
				isDisabled && disabledStyles,
				isDisabled && (isChecked || isIndeterminate) && disabledCheckedStyles,
			]}
			data-testid={testId}
			data-disabled={isDisabled || undefined}
			id={id}
		>
			{children}
		</label>
	);
}
