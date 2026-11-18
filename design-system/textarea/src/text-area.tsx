/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useRef } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { type TextAreaProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const analyticsParams = {
	componentName: 'textArea',
	packageName,
	packageVersion,
};

const lineHeightBase = 20;
const lineHeightCompact = 16;
const compactVerticalPadding = 2;
const verticalPadding = 6;
const borderWidth = 2;

// Keep additive overrides in the existing Compiled styling path.
const semanticAtomicInlinePaddingStyles = cssMap({
	borderless: {
		paddingInlineStart: token('space.inset.small'),
		paddingInlineEnd: token('space.inset.small'),
	},
});
const semanticAtomicDensityStyles = cssMap({
	compact: {
		paddingBlockStart: token('space.inset.xxsmall'),
		paddingBlockEnd: token('space.inset.xxsmall'),
	},
	default: {
		paddingBlockStart: token('space.inset.small'),
		paddingBlockEnd: token('space.inset.small'),
	},
});

const inputMotionStyles = cssMap({
	legacy: {
		transition: `background-color 0.2s ease-in-out, border-color 0.2s ease-in-out`,
	},
	base: {
		transition: token('motion.input'),
	},
});

const finessePlaceholderStyles = css({
	'&::placeholder': { color: token('color.text.subtle') },
});

const atomicBaseStyles = css({
	display: 'block',
	boxSizing: 'border-box',
	width: '100%',
	minWidth: '0px',
	maxWidth: '100%',
	margin: 0,
	position: 'relative',
	flex: '1 1 100%',

	borderRadius: token('radius.medium'),
	borderWidth: token('border.width'),
	boxShadow: 'none',
	color: token('color.text'),
	font: token('font.body'),
	outline: 'none',
	overflow: 'auto',
	wordWrap: 'break-word',
	'&:disabled': {
		color: token('color.text.disabled'),
		cursor: 'not-allowed',
		// Safari puts on some difficult to remove styles, mainly for disabled inputs
		// but we want full control so need to override them in all cases
		WebkitOpacity: '1',
		WebkitTextFillColor: 'unset',
	},

	// placeholder styles
	'&::placeholder': {
		color: token('color.text.subtlest'),
	},
	'&:disabled::placeholder': {
		color: token('color.text.disabled'),
	},
});

const atomicAppearanceStyles = cssMap({
	standard: {
		borderStyle: 'solid',
		backgroundColor: token('color.background.input'),
		borderColor: token('color.border.input'),
		'&:focus': {
			backgroundColor: token('color.background.input.pressed'),
			borderColor: token('color.border.focused'),
			boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.focused')}`,
		},
		// Only standard appearance gets disabled background and border colors.
		'&:disabled': {
			backgroundColor: token('color.background.disabled'),
			borderColor: token('color.border.disabled'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:hover:not(:read-only):not(:focus)': {
			backgroundColor: token('color.background.input.hovered'),
			borderColor: token('color.border.input'),
		},
	},
	subtle: {
		borderStyle: 'solid',
		backgroundColor: 'transparent',
		borderColor: 'transparent',
		'&:focus': {
			backgroundColor: token('color.background.input.pressed'),
			borderColor: token('color.border.focused'),
			boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.focused')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:hover:not(:read-only):not(:focus)': {
			backgroundColor: token('color.background.input.hovered'),
			borderColor: token('color.border.input'),
		},
	},
	none: {
		borderStyle: 'none',
		backgroundColor: 'transparent',
		borderColor: 'transparent',
		'&:focus': {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
			boxShadow: `inset 0 0 0 ${token('border.width')} transparent`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:hover:not(:read-only):not(:focus)': {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
		},
	},
});

const atomicInlinePaddingStyles = cssMap({
	bordered: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- Preserve padding inside the existing 1px border.
		paddingInlineStart: '7px',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- Preserve padding inside the existing 1px border.
		paddingInlineEnd: '7px',
	},
	borderless: {
		paddingInlineStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
	},
});

const atomicInvalidStyles = css({
	backgroundColor: token('color.background.input'),
	borderColor: token('color.border.danger'),
	boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.danger')}`,
	'&:focus': {
		backgroundColor: token('color.background.input.pressed'),
		borderColor: token('color.border.focused'),
		boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.focused')}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Only interactive, unfocused inputs respond to hover.
	'&:hover:not(:read-only):not(:focus)': {
		backgroundColor: token('color.background.input.hovered'),
		borderColor: token('color.border.danger'),
		boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.danger')}`,
	},
});

// iOS Safari automatically zooms into form inputs on focus when the font size is less than 16px.
// To prevent this zoom behaviour on touch devices with small viewports, the textarea uses font.body (default),
// and font.body.large (16px) for touch devices (pointer: coarse) with screens narrower than 30rem.
// @see: https://medium.com/@rares.popescu/2-ways-to-avoid-the-automatic-zoom-in-on-input-fields-8a71479e542e

const fontStyles = cssMap({
	default: {
		font: token('font.body'),
		'@media (pointer: coarse) and (max-width: 30rem)': {
			font: token('font.body.large'),
		},
	},
	monospace: {
		font: token('font.body'),
		fontFamily: token('font.family.code'),
		'@media (pointer: coarse) and (max-width: 30rem)': {
			font: token('font.body.large'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			fontFamily: `${token('font.family.code')} !important`,
		},
	},
});

// Density padding is selected directly from React props.
const atomicDensityStyles = cssMap({
	compact: {
		paddingBlockStart: token('space.025'),
		paddingBlockEnd: token('space.025'),
	},
	default: {
		paddingBlockStart: token('space.075'),
		paddingBlockEnd: token('space.075'),
	},
});

const resizeStyles = cssMap({
	horizontal: {
		resize: 'horizontal',
	},
	vertical: {
		resize: 'vertical',
	},
	auto: {
		resize: 'both',
	},
	smart: {
		resize: 'none',
	},
	none: {
		resize: 'none',
	},
});

const setSmartHeight = (el: HTMLTextAreaElement) => {
	// Always reset height to auto before calculating new height
	el.style.height = 'auto';
	const borderHeight = borderWidth;
	const paddingBoxHeight: number = el.scrollHeight;
	const borderBoxHeight: number = paddingBoxHeight + borderHeight * 2;
	el.style.height = `${borderBoxHeight}px`;
};

const InnerTextArea: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TextAreaProps> & React.RefAttributes<HTMLElement>
> = forwardRef((props: TextAreaProps, ref) => {
	const ourRef = useRef<HTMLTextAreaElement | null>(null);

	const {
		resize = 'smart',
		appearance = 'standard',
		isCompact = false,
		isRequired = false,
		isReadOnly = false,
		isDisabled = false,
		isInvalid = false,
		isMonospaced = false,
		minimumRows = 2,
		testId,
		maxHeight = '50vh',
		onBlur,
		onFocus,
		onChange,
		value,
		style,
		...rest
	} = props;
	const isInputMotionEnabled = fg('platform-dst-motion-uplift-input');
	const isInteractive = !isDisabled && !isReadOnly;

	const borderHeight = useMemo(() => (appearance === 'none' ? 2 : 1), [appearance]);

	useEffect(() => {
		const el: HTMLTextAreaElement | null = ourRef.current;
		if (resize === 'smart' && el) {
			setSmartHeight(el);
		}
	}, [resize, value]);

	const onBlurWithAnalytics = usePlatformLeafEventHandler({
		fn: (event: React.FocusEvent<HTMLTextAreaElement>) => {
			onBlur && onBlur(event);
		},
		action: 'blurred',
		...analyticsParams,
	});

	const onFocusWithAnalytics = usePlatformLeafEventHandler({
		fn: (event: React.FocusEvent<HTMLTextAreaElement>) => {
			onFocus && onFocus(event);
		},
		action: 'focused',
		...analyticsParams,
	});

	const getTextAreaRef = (elementRef: HTMLTextAreaElement | null) => {
		ourRef.current = elementRef;
		if (ref && typeof ref === 'object') {
			ref.current = elementRef;
		}
		if (ref && typeof ref === 'function') {
			ref(elementRef);
		}
	};

	const handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
		(e) => {
			const el: HTMLTextAreaElement | null = ourRef.current;
			if (resize === 'smart' && el) {
				setSmartHeight(el);
			}
			onChange && onChange(e);
		},
		[onChange, resize],
	);

	return (
		<textarea
			data-testid={testId ? testId : undefined}
			value={value}
			disabled={isDisabled}
			readOnly={isReadOnly}
			required={isRequired}
			ref={getTextAreaRef}
			onChange={handleOnChange}
			onBlur={onBlurWithAnalytics}
			onFocus={onFocusWithAnalytics}
			rows={minimumRows}
			css={[
				atomicBaseStyles,
				!isInputMotionEnabled && inputMotionStyles.legacy,
				isInputMotionEnabled && isInteractive && inputMotionStyles.base,
				fg('platform-dst-tokens-finesse') && finessePlaceholderStyles,
				atomicAppearanceStyles[appearance],
				atomicInlinePaddingStyles[appearance === 'none' ? 'borderless' : 'bordered'],
				isInvalid && atomicInvalidStyles,
				fontStyles[isMonospaced ? 'monospace' : 'default'],
				atomicDensityStyles[isCompact ? 'compact' : 'default'],
				resizeStyles[resize],
				fg('platform-semantic-spacing') &&
					appearance === 'none' &&
					semanticAtomicInlinePaddingStyles.borderless,
				fg('platform-semantic-spacing') &&
					semanticAtomicDensityStyles[isCompact ? 'compact' : 'default'],
			]}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/use-tokens-typography -- Runtime density must override the mobile font shorthand, which sorts after atomic longhands.
				...(!style?.font && {
					lineHeight: isCompact ? lineHeightCompact / 14 : lineHeightBase / 14,
				}),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Minimum row height is calculated from runtime props.
				minHeight: `${(isCompact ? lineHeightCompact : lineHeightBase) * minimumRows + (isCompact ? compactVerticalPadding : verticalPadding) * 2 + borderHeight * 2}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				...style,
				maxHeight,
			}}
			{...rest}
		/>
	);
});

/**
 * __Text area__
 *
 * A text area lets users enter long form text which spans over multiple lines.
 *
 * - [Examples](https://atlassian.design/components/textarea/examples)
 * - [Code](https://atlassian.design/components/textarea/code)
 * - [Usage](https://atlassian.design/components/textarea/usage)
 */
const TextArea: React.MemoExoticComponent<
	React.ForwardRefExoticComponent<
		Omit<TextAreaProps, 'ref'> & React.RefAttributes<HTMLTextAreaElement>
	>
> = memo(
	forwardRef<HTMLTextAreaElement, TextAreaProps>(
		(props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) => (
			<InnerTextArea ref={ref} {...props} />
		),
	),
);

TextArea.displayName = 'TextArea';

export default TextArea;
