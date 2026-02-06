/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import {
	B200,
	B300,
	B400,
	B50,
	N10,
	N100,
	N20,
	N30,
	N70,
	N80,
	N900,
	R300,
} from '@atlaskit/theme/colors';
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
	gap: `${token('space.0', '0px')} ${token('space.050', '4px')}`,
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
	color: token('color.text.disabled', '#97A0AF'),
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

/**
 * Legacy label styles with --local-* CSS custom properties.
 * These are consumed by the nested sibling selectors in checkbox.tsx.
 */
const legacyBaseStyles = css({
	display: 'grid',
	gridAutoColumns: '1fr',
	gridAutoRows: 'min-content',
	color: token('color.text', N900),
	cursor: 'default',
	font: token('font.body'),
});

const legacyTextLabelLayoutStyles = css({
	gap: `${token('space.0', '0px')} ${token('space.050', '4px')}`,
	gridTemplateColumns: 'min-content auto',
});

const legacyDisabledStyles = css({
	color: token('color.text.disabled', N80),
	cursor: 'not-allowed',
});

const legacyLabelStyles = css({
	/**
	 * Background
	 */
	'--local-background': token('color.background.input', N10),
	'--local-background-active': token('color.background.input.pressed', B50),
	'--local-background-checked': token('color.background.selected.bold', B400),
	'--local-background-checked-hover': token('color.background.selected.bold.hovered', B300),
	'--local-background-disabled': token('color.background.disabled', N20),
	'--local-background-hover': token('color.background.input.hovered', N30),
	/**
	 * Border
	 */
	'--local-border': token('color.border.input', N100),
	'--local-border-active': token('color.border', B50),
	'--local-border-checked': token('color.background.selected.bold', B400),
	'--local-border-checked-hover': token('color.background.selected.bold.hovered', B300),
	'--local-border-checked-invalid': token('color.border.danger', R300),
	'--local-border-disabled': token('color.background.disabled', N20),
	'--local-border-focus': token('color.border.focused', B200),
	'--local-border-hover': token('color.border.input', N100),
	'--local-border-invalid': token('color.border.danger', R300),
	/**
	 * Tick
	 */
	'--local-tick-active': token('color.icon.inverse', B400),
	'--local-tick-checked': token('color.icon.inverse', N10),
	'--local-tick-disabled': token('color.icon.disabled', N70),
	'--local-tick-rest': 'transparent',
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
	if (fg('platform-checkbox-atomic-styles')) {
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

	return (
		<label
			className={xcss}
			css={[
				legacyBaseStyles,
				label && legacyTextLabelLayoutStyles,
				isDisabled && legacyDisabledStyles,
				legacyLabelStyles,
			]}
			data-testid={testId}
			data-disabled={isDisabled || undefined}
			id={id}
		>
			{children}
		</label>
	);
}
