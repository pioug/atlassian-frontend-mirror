/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/// <reference types="node" />
// for typing `process`
import { forwardRef, memo, type MemoExoticComponent, type Ref } from 'react';

import { css, jsx } from '@compiled/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import __noop from '@atlaskit/ds-lib/noop';
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

import { type RadioProps } from './types';
const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const noop = __noop;

const labelPaddingStyles = css({
	paddingBlockEnd: token('space.025', '2px'),
	paddingBlockStart: token('space.025', '2px'),
	paddingInlineEnd: token('space.050', '4px'),
	paddingInlineStart: token('space.050', '4px'),
});

const labelStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	position: 'relative',
	alignItems: 'flex-start',
	color: token('color.text', N900),
	font: token('font.body'),
});

// These styles should be removed when the platform-radio-atomic-styles feature gate is cleaned up.
const labelLegacyStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&[data-disabled]': {
		color: token('color.text.disabled', N80),
		cursor: 'not-allowed',
	},
});

const labelDisabledStyles = css({
	color: token('color.text.disabled', N80),
	cursor: 'not-allowed',
});

const radioBaseStyles = css({
	display: 'flex',
	// TODO https://product-fabric.atlassian.net/browse/DSP-10507 revisit and remove the scale of 14/24
	/*
    The circle should be 14px * 14px centred in a 24px * 24px box.
    This is inclusive of a 2px border and inner circle with 2px radius.
    There is a Chrome bug that makes the circle become an oval and the
    inner circle not be centred at various zoom levels. This bug is fixed
    in all browsers if a scale of 14/24 is applied.
  */
	width: '24px',
	height: '24px',
	// TODO (AFB-874): Disabling due to fixing for expand-spacing-property produces further ESLint errors
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	margin: token('space.0', '0px'),
	position: 'relative',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	backgroundColor: 'var(--radio-background-color)',
	/* Border should multiply by 24/14 to offset scale, a scale of 12 / 7 is to fix a Chrome bug that makes the circle become an oval and the
    inner circle not be centred at various zoom levels */
	border: `${token('border.width', '1px')} solid var(--radio-border-color)`,
	borderRadius: token('radius.full', '50%'),
	MozAppearance: 'none',
	outline: 'none',

	/*
    Change the variables --radio-background-color, --radio-border-color,
    -radio-dot-color and -radio-dot-opacity according to user interactions.
    All other variables are constant
  */
	'--radio-background-color': token('color.background.input', N10),
	'--radio-border-color': token('color.border.input', N100),
	'--radio-dot-color': token('color.icon.inverse', N10),
	'--radio-dot-opacity': 0,

	transform: 'scale(calc(7.5 / 12))', // 15px
	transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
	verticalAlign: 'top',
	WebkitAppearance: 'none',

	'&::after': {
		width: 'calc(5.6px * 12 / 7)', // 6px
		height: 'calc(5.6px * 12 / 7)', // 6px
		position: 'absolute',
		background: 'var(--radio-dot-color)',
		// TODO Delete this comment after verifying spacing token -> previous value `'50%'`
		borderRadius: token('radius.full', '50%'),
		content: "''",
		opacity: 'var(--radio-dot-opacity)',
		transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
	},
});

const radioInteractiveStyles = css({
	'&:hover': {
		'--radio-background-color': token('color.background.input.hovered', N30),
		'--radio-border-color': token('color.border.input', N100),
	},
	'&:active': {
		'--radio-background-color': token('color.background.input.pressed', N30),
	},
	'&:focus': {
		outline: `${token('border.width.focused', '3px')} solid ${token('color.border.focused', B200)}`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		outlineOffset: '3px',
	},
	'&:checked': {
		'--radio-background-color': token('color.background.selected.bold', B400),
		'--radio-border-color': token('color.background.selected.bold', B400),
		'--radio-dot-opacity': 1,
	},
	'&:checked:hover': {
		'--radio-background-color': token('color.background.selected.bold.hovered', B300),
		'--radio-border-color': token('color.background.selected.bold.hovered', B300),
	},
	'&:checked:active': {
		'--radio-background-color': token('color.background.selected.bold.pressed', B50),
		'--radio-border-color': token('color.border.input', N100),
		'--radio-dot-color': token('color.icon.inverse', B400),
	},
	'&:checked:focus': {
		outline: `${token('border.width.focused', '3px')} solid ${token('color.border.focused', B200)}`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		outlineOffset: '3px',
	},
});

const radioDisabledStyles = css({
	cursor: 'not-allowed',
	'--radio-background-color': token('color.background.disabled', N20),
	'--radio-border-color': token('color.border.disabled', N20),
	'--radio-dot-color': token('color.icon.disabled', N70),
});

const radioDisabledCheckedStyles = css({
	'--radio-dot-opacity': 1,
});

// These styles are applied when the platform-radio-atomic-styles feature gate is disabled.
// When the feature gate is cleaned up, this style block can be removed.
const radioLegacyStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&[data-invalid], &:checked[data-invalid]': {
		'--radio-border-color': token('color.icon.danger', R300),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:disabled, &:disabled:hover, &:disabled:focus, &:disabled:active, &:disabled[data-invalid], &:disabled:checked, &:disabled:checked:hover, &:disabled:checked:focus, &:disabled:checked:active':
		{
			cursor: 'not-allowed',
			'--radio-background-color': token('color.background.disabled', N20),
			'--radio-border-color': token('color.border.disabled', N20),
			'--radio-dot-color': token('color.icon.disabled', N70),
		},
});

const radioInvalidStyles = css({
	'--radio-border-color': token('color.icon.danger', R300),
	'&:checked': {
		'--radio-border-color': token('color.icon.danger', R300),
	},
});

const InnerRadio: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<RadioProps> & React.RefAttributes<HTMLInputElement>
> = forwardRef(function Radio(props: RadioProps, ref: Ref<HTMLInputElement>) {
	const {
		ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		isDisabled = false,
		isRequired,
		isInvalid = false,
		isChecked = false,
		label,
		labelId,
		name,
		onChange = noop,
		value,
		testId,
		analyticsContext,
		// events and all other input props
		...rest
	} = props;

	const onChangeAnalytics = usePlatformLeafEventHandler({
		fn: onChange,
		action: 'changed',
		analyticsData: analyticsContext,
		componentName: 'radio',
		packageName,
		packageVersion,
	});

	return (
		<label
			data-testid={testId && `${testId}--radio-label`}
			data-disabled={isDisabled ? 'true' : undefined}
			css={[
				labelStyles,
				!fg('platform-radio-atomic-styles') && labelLegacyStyles,
				isDisabled && fg('platform-radio-atomic-styles') && labelDisabledStyles,
			]}
		>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-radio */}
			<input
				{...rest}
				// It is necessary only for Safari. It allows to render focus styles.
				tabIndex={0}
				aria-label={ariaLabel}
				// TODO: Make `aria-labelledby` a `never` in TS. See https://product-fabric.atlassian.net/browse/DSP-23009
				aria-labelledby={labelId || ariaLabelledBy}
				checked={isChecked}
				disabled={isDisabled}
				name={name}
				onChange={onChangeAnalytics}
				required={isRequired}
				type="radio"
				value={value}
				data-testid={testId && `${testId}--radio-input`}
				// isInvalid is used in a nonstandard way so cannot
				// use :invalid selector
				data-invalid={isInvalid ? 'true' : undefined}
				css={[
					radioBaseStyles,
					// Legacy path: always apply interactive styles + compound disabled/invalid selectors
					!fg('platform-radio-atomic-styles') && radioInteractiveStyles,
					!fg('platform-radio-atomic-styles') && radioLegacyStyles,
					// New path: conditionally apply styles based on props
					!isDisabled && fg('platform-radio-atomic-styles') && radioInteractiveStyles,
					isDisabled && fg('platform-radio-atomic-styles') && radioDisabledStyles,
					isDisabled &&
						isChecked &&
						fg('platform-radio-atomic-styles') &&
						radioDisabledCheckedStyles,
					isInvalid && !isDisabled && fg('platform-radio-atomic-styles') && radioInvalidStyles,
				]}
				ref={ref}
			/>
			{label ? <span css={labelPaddingStyles}>{label}</span> : null}
		</label>
	);
});

/**
 * __Radio__
 *
 * A radio input allows users to select only one option from a number of choices. Radio is generally displayed in a radio group.
 *
 * - [Examples](https://atlassian.design/components/radio/examples)
 * - [Code](https://atlassian.design/components/radio/code)
 * - [Usage](https://atlassian.design/components/radio/usage)
 */
const Radio: MemoExoticComponent<
	React.ForwardRefExoticComponent<
		React.PropsWithoutRef<RadioProps> & React.RefAttributes<HTMLInputElement>
	>
> = memo(
	forwardRef(function Radio(props: RadioProps, ref: Ref<HTMLInputElement>) {
		return <InnerRadio {...props} ref={ref} />;
	}),
);

export default Radio;
