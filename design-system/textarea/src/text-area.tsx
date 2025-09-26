/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useRef } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { B200, N0, N10, N20, N200, N30, N70, N900, R400 } from '@atlaskit/theme/colors';
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
const transitionDuration = '0.2s';
const borderWidth = 2;

const baseStyles = css({
	display: 'block',
	boxSizing: 'border-box',
	width: '100%',
	minWidth: '0px',
	maxWidth: '100%',
	margin: 0,
	position: 'relative',
	flex: '1 1 100%',

	borderRadius: token('radius.small', '3px'),
	borderWidth: token('border.width'),
	color: token('color.text', N900),
	font: token('font.body'),
	outline: 'none',
	overflow: 'auto',
	transition: `background-color ${transitionDuration} ease-in-out,
               border-color ${transitionDuration} ease-in-out`,
	wordWrap: 'break-word',
	'&:disabled': {
		color: token('color.text.disabled', N70),
		cursor: 'not-allowed',
		// Safari puts on some difficult to remove styles, mainly for disabled inputs
		// but we want full control so need to override them in all cases
		WebkitOpacity: '1',
		WebkitTextFillColor: 'unset',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-ms-clear': {
		display: 'none',
	},
	'&:invalid': {
		boxShadow: 'none',
	},

	// border and background styles
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&[data-invalid]:focus': {
		backgroundColor: token('color.background.input.pressed', N0),
		borderColor: token('color.border.focused', B200),
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.focused', B200)}`,
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&[data-invalid]:not(:focus)': {
		backgroundColor: token('color.background.input', N10),
		borderColor: token('color.border.danger', R400),
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.danger', R400)}`,
	},

	// hover styles
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:hover:not(:read-only):not(:focus)': {
		'&:disabled': {
			backgroundColor: token('color.background.disabled', N20),
		},
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-invalid]': {
			backgroundColor: token('color.background.input.hovered', N30),
			borderColor: token('color.border.danger', R400),
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.danger', R400)}`,
		},
	},

	// placeholder styles
	'&::placeholder': {
		color: token('color.text.subtlest', N200),
	},
	'&:disabled::placeholder': {
		color: token('color.text.disabled', N70),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	'&[data-compact]': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: lineHeightCompact / 14,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:not([data-compact])': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: lineHeightBase / 14,
	},
});

const appearanceStyles = cssMap({
	standard: {
		borderStyle: 'solid',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-compact]': {
			paddingTop: token('space.025'),
			paddingBottom: token('space.025'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingLeft: '7px',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingRight: '7px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([data-compact])': {
			paddingTop: token('space.075'),
			paddingBottom: token('space.075'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingLeft: '7px',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingRight: '7px',
		},
		'&:focus': {
			backgroundColor: token('color.background.input.pressed'),
			borderColor: token('color.border.focused'),
			boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.focused')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not(:focus)': {
			backgroundColor: token('color.background.input'),
			borderColor: token('color.border.input'),
		},
		// Disabled background and border styles should not be applied to components that
		// have either no background or transparent background to begin with
		'&:disabled:focus': {
			backgroundColor: token('color.background.disabled'),
			borderColor: token('color.border.focused'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:disabled:not(:focus)': {
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-compact]': {
			paddingTop: token('space.025'),
			paddingBottom: token('space.025'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingLeft: '7px',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingRight: '7px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([data-compact])': {
			paddingTop: token('space.075'),
			paddingBottom: token('space.075'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingRight: '7px',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingLeft: '7px',
		},
		'&:focus': {
			backgroundColor: token('color.background.input.pressed'),
			borderColor: token('color.border.focused'),
			boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.focused')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not(:focus)': {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:hover:not(:read-only):not(:focus)': {
			backgroundColor: token('color.background.input.hovered'),
			borderColor: token('color.border.input'),
		},
	},
	none: {
		borderStyle: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-compact]': {
			paddingTop: token('space.025'),
			paddingRight: token('space.075'),
			paddingBottom: token('space.025'),
			paddingLeft: token('space.075'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([data-compact])': {
			paddingTop: token('space.075'),
			paddingRight: token('space.075'),
			paddingBottom: token('space.075'),
			paddingLeft: token('space.075'),
		},
		'&:focus': {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
			boxShadow: `inset 0 0 0 ${token('border.width')} transparent`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not(:focus)': {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:hover:not(:read-only):not(:focus)': {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
		},
	},
});

const fontStyles = cssMap({
	default: {
		fontFamily: token('font.family.body'),
	},
	monospace: {
		fontFamily: token('font.family.code'),
		'@media (min-width: 30rem)': {
			font: token('font.body'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			fontFamily: `${token('font.family.code')} !important`,
		},
	},
	large: {
		font: token('font.body.large'),
		'@media (min-width: 30rem)': {
			font: token('font.body'),
		},
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
			// @ts-ignore
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

	const controlProps = {
		'data-invalid': isInvalid ? isInvalid : undefined,
		'data-compact': isCompact ? isCompact : undefined,
		'data-testid': testId ? testId : undefined,
	};

	const compactMinHeightStyles = css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
		'&[data-compact]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			minHeight: `${lineHeightCompact * minimumRows + compactVerticalPadding * 2 + borderHeight * 2}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([data-compact])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			minHeight: `${lineHeightBase * minimumRows + verticalPadding * 2 + borderHeight * 2}px`,
		},
	});

	return (
		<textarea
			{...controlProps}
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
				baseStyles,
				appearanceStyles[appearance],
				fg('platform_design_system_team_safari_input_fix') && fontStyles['large'],
				fontStyles[isMonospaced ? 'monospace' : 'default'],
				resizeStyles[resize],
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				compactMinHeightStyles,
			]}
			style={{
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
const TextArea = memo(
	forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
		props: TextAreaProps,
		ref: React.Ref<HTMLTextAreaElement>,
	) {
		return <InnerTextArea ref={ref} {...props} />;
	}),
);

TextArea.displayName = 'TextArea';

export default TextArea;
