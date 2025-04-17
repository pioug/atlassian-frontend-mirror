/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, useCallback, useRef } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type TextfieldProps } from './types';

const containerMedia = cssMap({
	invalid: {
		'@media screen and (-ms-high-contrast: active)': {
			'&:focus-within': {
				borderColor: 'Highlight',
			},
		},
	},
	disabled: {
		'@media screen and (-ms-high-contrast: active)': {
			borderColor: 'GrayText',
		},
	},
});

const inputMediaDisabled = css({
	'@media screen and (-ms-high-contrast: active)': {
		color: 'GrayText',
	},
});

const analyticsParams = {
	componentName: 'textField',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const disabledStyle = cssMap({
	standard: {
		backgroundColor: token('color.background.disabled'),
		borderColor: token('color.background.disabled'),
		color: token('color.text.disabled'),
		cursor: 'not-allowed',
	},
	subtle: {
		backgroundColor: 'transparent',
		borderColor: 'transparent',
		color: token('color.text.disabled'),
		cursor: 'not-allowed',
	},
	none: {
		backgroundColor: 'transparent',
		borderColor: 'transparent',
		color: token('color.text.disabled'),
		cursor: 'not-allowed',
	},
});

const invalidStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&, &:hover': {
		borderColor: token('color.border.danger'),
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.danger')}`,
	},
	'&:focus-within': {
		backgroundColor: token('color.background.input.pressed'),
	},
});

const focusWithinStyle = cssMap({
	standard: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&:focus-within': {
			backgroundColor: token('color.background.input.pressed'),
			borderColor: token('color.border.focused'),
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.focused')}`,
		},
	},
	subtle: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&:focus-within': {
			backgroundColor: token('color.background.input.pressed'),
			borderColor: token('color.border.focused'),
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.focused')}`,
		},
	},
	none: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&:focus-within': {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} transparent`,
		},
	},
});

const hoverStyle = cssMap({
	standard: {
		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
			borderColor: token('color.border.input'),
		},
	},
	subtle: {
		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
			borderColor: token('color.border.input'),
		},
	},
	none: {
		'&:hover': {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
		},
	},
});

const getContainerTextBgAndBorderColor = cssMap({
	standard: {
		borderColor: token('color.border.input'),
		borderStyle: 'solid',
		color: token('color.text'),
		cursor: 'text',
		backgroundColor: token('color.background.input'),

		'@media screen and (-ms-high-contrast: active)': {
			'&:focus-within': {
				borderColor: 'Highlight',
			},
		},
	},
	subtle: {
		color: token('color.text'),
		cursor: 'text',
		borderColor: 'transparent',
		borderStyle: 'solid',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&&': {
			backgroundColor: 'transparent',
		},
		'@media screen and (-ms-high-contrast: active)': {
			'&:focus-within': {
				borderColor: 'Highlight',
			},
		},
	},
	none: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&&': {
			backgroundColor: 'transparent',
		},
		borderColor: 'transparent',
		borderStyle: 'none',
		color: token('color.text'),
		cursor: 'text',
		'@media screen and (-ms-high-contrast: active)': {
			'&:focus-within': {
				borderColor: 'Highlight',
			},
		},
	},
});

const widthMap: { [key: string]: number } = {
	xsmall: 80,
	small: 160,
	medium: 240,
	large: 320,
	xlarge: 480,
};

const getMaxWidth = (width: string | number | undefined): number | string =>
	!width ? `100%` : width in widthMap ? `${widthMap[width]}px` : `${+width}px`;

const containerStyleAppearance = cssMap({
	standard: {
		// add 1px padding on both top and bottom to keep the same overall height after border reduced from 2px to 1px under feature flag
		paddingBlockStart: token('border.width'),
		paddingBlockEnd: token('border.width'),
		paddingInlineStart: 0,
		paddingInlineEnd: 0,
		borderStyle: 'solid',
	},
	subtle: {
		// add 1px padding on both top and bottom to keep the same overall height after border reduced from 2px to 1px under feature flag
		paddingBlockStart: token('border.width'),
		paddingBlockEnd: token('border.width'),
		paddingInlineStart: 0,
		paddingInlineEnd: 0,
		borderStyle: 'solid',
	},
	none: {
		borderStyle: 'none',
	},
});

const containerStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	alignItems: 'center',
	justifyContent: 'space-between',
	flex: '1 1 100%',
	borderWidth: token('border.width', '1px'),
	font: token('font.body'),
	overflow: 'hidden',
	pointerEvents: 'auto',
	transition: `background-color 0.2s ease-in-out, border-color 0.2s ease-in-out`,
	verticalAlign: 'top',
	wordWrap: 'break-word',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/design-system/no-nested-styles
	'&&': {
		borderRadius: 3,
	},
});

const inputDisabledStyle = css({
	color: token('color.text.disabled'),
	'&::placeholder': {
		color: token('color.text.disabled'),
	},
});

const inputCompactStyleWithFg = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	'&[data-compact]': {
		paddingBlockEnd: token('space.025'),
		paddingBlockStart: token('space.025'),
		paddingInlineEnd: token('space.075'),
		paddingInlineStart: token('space.075'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
		'&[data-compact]': {
			paddingBlockEnd: token('space.050'),
			paddingBlockStart: token('space.050'),
			paddingInlineEnd: token('space.075'),
			paddingInlineStart: token('space.075'),
		},
	},
});
const inputCompactStyle = css({
	paddingBlockEnd: token('space.050'),
	paddingBlockStart: token('space.050'),
	paddingInlineEnd: token('space.075'),
	paddingInlineStart: token('space.075'),
});

const inputMonospacedStyle = css({
	// eslint-disable-next-line @compiled/shorthand-property-sorting
	fontFamily: token('font.family.code'),
});

const inputFontStyleWithFG = css({
	// eslint-disable-next-line @compiled/shorthand-property-sorting
	font: token('font.body.large'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		font: token('font.body'),
	},
});

const inputStyleMonospacedWithFg = css({
	fontFamily: token('font.family.code'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		fontFamily: token('font.family.code'),
	},
});

const inputStyleNotDataCompactWithFG = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:not([data-compact])': {
		paddingBlockEnd: token('space.075'),
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
		paddingInlineStart: token('space.075'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([data-compact])': {
			paddingBlockEnd: token('space.100'),
			paddingBlockStart: token('space.100'),
			paddingInlineEnd: token('space.075'),
			paddingInlineStart: token('space.075'),
		},
	},
});

const inputStyle = css({
	boxSizing: 'border-box',
	width: '100%',
	minWidth: '0',
	backgroundColor: 'transparent',
	border: 0,
	color: 'inherit',
	cursor: 'inherit',
	font: token('font.body'),
	outline: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:not([data-compact])': {
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.075'),
		paddingInlineStart: token('space.075'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-ms-clear': {
		display: 'none',
	},
	'&:invalid': {
		boxShadow: 'none',
	},
	'&:placeholder-shown': {
		textOverflow: 'ellipsis',
	},
	'&::placeholder': {
		color: token('color.text.subtlest'),
	},
});

/**
 * __Textfield__
 *
 * A text field is an input that allows a user to write or edit text.
 *
 * - [Examples](https://atlassian.design/components/textfield/examples)
 * - [Code](https://atlassian.design/components/textfield/code)
 * - [Usage](https://atlassian.design/components/textfield/usage)
 */
const Textfield = forwardRef((props: TextfieldProps, ref) => {
	const {
		appearance = 'standard',
		className,
		elemAfterInput,
		elemBeforeInput,
		isCompact = false,
		isDisabled = false,
		isInvalid = false,
		isMonospaced = false,
		isReadOnly = false,
		isRequired = false,
		name,
		onBlur,
		onChange,
		onFocus,
		onMouseDown,
		placeholder,
		testId,
		width,
		...spreadProps
	} = props;

	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleOnFocus = usePlatformLeafEventHandler({
		fn: (event: React.FocusEvent<HTMLInputElement>) => {
			onFocus && onFocus(event);
		},
		action: 'focused',
		...analyticsParams,
	});

	const handleOnBlur = usePlatformLeafEventHandler({
		fn: (event: React.FocusEvent<HTMLInputElement>) => {
			onBlur && onBlur(event);
		},
		action: 'blurred',
		...analyticsParams,
	});

	const handleOnMouseDown = useCallback(
		(event: React.MouseEvent<HTMLInputElement>) => {
			// Running e.preventDefault() on the INPUT prevents double click behaviour
			// Sadly we needed this cast as the target type is being correctly set
			const target: HTMLInputElement = event.target as HTMLInputElement;
			if (target.tagName !== 'INPUT') {
				event.preventDefault();
			}

			if (
				inputRef &&
				inputRef.current &&
				!isDisabled &&
				document.activeElement !== inputRef.current
			) {
				inputRef.current.focus();
			}

			onMouseDown && onMouseDown(event);
		},
		[onMouseDown, isDisabled],
	);

	const setInputRef = useCallback(
		(inputElement: HTMLInputElement | null) => {
			inputRef.current = inputElement;

			if (!ref) {
				return;
			}

			if (typeof ref === 'object') {
				ref.current = inputElement;
			}

			if (typeof ref === 'function') {
				ref(inputElement);
			}
		},
		[ref],
	);

	return (
		/**
		 * It is not normally acceptable to add click and key handlers to
		 * non-interactive elements as this is an accessibility anti-pattern.
		 * However, because this instance is to handle events on all children that
		 * should be associated with the input, we can add role="presentation" so
		 * that there are no negative impacts to assistive technologies.
		 */
		<div
			role="presentation"
			data-disabled={isDisabled ? isDisabled : undefined}
			data-invalid={isInvalid ? isInvalid : undefined}
			data-ds--text-field--container
			data-testid={testId && `${testId}-container`}
			onMouseDown={handleOnMouseDown}
			style={{
				maxWidth: `${getMaxWidth(width)}`,
			}}
			css={[
				containerStyles,
				getContainerTextBgAndBorderColor[appearance],
				containerStyleAppearance[appearance],
				!isDisabled && focusWithinStyle[appearance],
				!isDisabled && hoverStyle[appearance],
				isDisabled && containerMedia.disabled,
				isDisabled && disabledStyle[appearance],
				isInvalid && containerMedia.invalid,
				isInvalid && invalidStyle,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{elemBeforeInput}
			<input
				{...spreadProps}
				aria-invalid={isInvalid ? isInvalid : undefined}
				// TODO: When removing legacy theming fix this.
				css={[
					inputStyle,
					isMonospaced && inputMonospacedStyle,
					isCompact && inputCompactStyle,
					isDisabled && inputDisabledStyle,
					isDisabled && inputMediaDisabled,
					!isCompact &&
						fg('platform_design_system_team_safari_input_fix') &&
						inputStyleNotDataCompactWithFG,
					fg('platform_design_system_team_safari_input_fix') && inputFontStyleWithFG,
					isCompact &&
						fg('platform_design_system_team_safari_input_fix') &&
						inputCompactStyleWithFg,
					isMonospaced &&
						fg('platform_design_system_team_safari_input_fix') &&
						inputStyleMonospacedWithFg,
				]}
				data-compact={isCompact ? isCompact : undefined}
				data-ds--text-field--input
				data-monospaced={isMonospaced ? isMonospaced : undefined}
				data-testid={testId}
				disabled={isDisabled}
				name={name}
				onBlur={handleOnBlur}
				onChange={onChange}
				onFocus={handleOnFocus}
				placeholder={placeholder}
				readOnly={isReadOnly}
				ref={setInputRef}
				required={isRequired}
			/>
			{elemAfterInput}
		</div>
	);
});

export default Textfield;
