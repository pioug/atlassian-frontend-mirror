/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useRef } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { cssMap, cx, jsx } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { useId } from '@atlaskit/ds-lib/use-id';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import {
	SplitButtonContext,
	useSplitButtonContext,
} from '../../containers/split-button/split-button-context';
import {
	type Appearance,
	type CommonBaseProps,
	type CommonButtonProps,
	type Spacing,
} from '../types';

import blockEvents from './block-events';
import renderLoadingOverlay from './loading-overlay';

const LOADING_LABEL = ', Loading';

export type ControlledEvents<TagName extends HTMLElement> = Pick<
	React.DOMAttributes<TagName>,
	| 'onMouseDownCapture'
	| 'onMouseUpCapture'
	| 'onKeyDownCapture'
	| 'onKeyUpCapture'
	| 'onTouchStartCapture'
	| 'onTouchEndCapture'
	| 'onPointerDownCapture'
	| 'onPointerUpCapture'
	| 'onClickCapture'
	| 'onMouseOver'
	| 'onMouseOut'
	| 'onMouseMove'
	| 'onFocus'
	| 'onBlur'
	| 'onMouseDown'
	| 'onMouseUp'
	| 'onKeyDown'
	| 'onKeyUp'
	| 'onTouchStart'
	| 'onTouchEnd'
	| 'onPointerDown'
	| 'onPointerUp'
> &
	Pick<CommonButtonProps<TagName>, 'onClick'>;

type ButtonBaseProps<TagName extends HTMLElement> = CommonBaseProps &
	Pick<
		CommonButtonProps<TagName>,
		'autoFocus' | 'isDisabled' | 'isSelected' | 'testId' | 'analyticsContext' | 'interactionName'
	> & {
		appearance?: Appearance;
		isLoading?: boolean;
		isIconButton?: boolean;
		isCircle?: boolean;
		hasIconBefore?: boolean;
		hasIconAfter?: boolean;
		shouldFitContainer?: boolean;
		spacing?: Spacing;
		// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
		ariaLabel?: string;
		// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
		ariaLabelledBy?: string;
		children: React.ReactNode;
		ref: React.Ref<TagName>;
		type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
		componentName?: string;
		role?: string;
		iconButtonRef?: React.Ref<HTMLButtonElement>;
		tooltipRef?: React.Ref<HTMLButtonElement>;
		onMouseOver?: React.MouseEventHandler<HTMLButtonElement> | React.MouseEventHandler<TagName>;
		onMouseOutonMouseOver?: React.MouseEventHandler<HTMLButtonElement>;
		onMouseMoveonMouseOver?: React.MouseEventHandler<HTMLButtonElement>;
		onMouseDownonMouseOver?: React.MouseEventHandler<HTMLButtonElement>;
		onMouseMove?: React.MouseEventHandler<HTMLButtonElement>;
		onFocus?: React.FocusEventHandler<HTMLButtonElement>;
		onBlur?: React.FocusEventHandler<HTMLButtonElement>;
		onClick?:
			| ((e: React.MouseEvent<TagName>, analyticsEvent: UIAnalyticsEvent) => void)
			| undefined;
	} & ControlledEvents<TagName>;

const styles = cssMap({
	base: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		width: 'auto',
		maxWidth: '100%',
		position: 'relative',
		alignItems: 'baseline',
		justifyContent: 'center',
		columnGap: token('space.050'),
		borderRadius: token('border.radius.100', '3px'),
		borderWidth: 0,
		flexShrink: 0,
		height: '2rem',
		font: token('font.body'),
		fontWeight: token('font.weight.medium'),
		paddingBlock: token('space.075'),
		paddingInlineEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		textAlign: 'center',
		transition: 'background 0.1s ease-out',
		verticalAlign: 'middle',
		'&::after': {
			borderRadius: 'inherit',
			inset: token('space.0'),
			borderStyle: 'solid',
			borderWidth: token('border.width'),
			pointerEvents: 'none',
			position: 'absolute',
		},
	},
	// Required due to Jira's AUI CSS reset: https://product-fabric.atlassian.net/browse/DSP-15687
	linkDecorationUnset: {
		textDecoration: 'none',
		'&:hover': { textDecoration: 'none' },
		'&:active': { textDecoration: 'none' },
		'&:focus': { textDecoration: 'none' },
	},
	disabled: {
		cursor: 'not-allowed',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		backgroundColor: token('color.background.disabled', 'rgba(9, 30, 66, 0.04)'),
		color: token('color.text.disabled'),
		'&:hover': {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.disabled', 'rgba(9, 30, 66, 0.04)'),
			color: token('color.text.disabled'),
		},
		'&:active': {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.disabled', 'rgba(9, 30, 66, 0.04)'),
			// @ts-expect-error
			color: token('color.text.disabled'),
		},
		'&::after': {
			content: 'none',
		},
	},
	spacingCompact: {
		columnGap: token('space.050'),
		height: '1.5rem',
		paddingBlock: token('space.025'),
		paddingInlineEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		verticalAlign: 'middle',
	},
	circle: {
		borderRadius: token('border.radius.circle'),
	},
	fullWidth: {
		width: '100%',
	},
	loading: {
		cursor: 'progress',
	},
	iconButton: {
		height: '2rem',
		width: '2rem',
		paddingInlineEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
	},
	iconButtonCompact: {
		height: '1.5rem',
		width: '1.5rem',
	},
	buttonIconBefore: {
		paddingInlineStart: token('space.100'),
	},
	buttonIconAfter: {
		paddingInlineEnd: token('space.100'),
	},
	splitButton: {
		'&:focus-visible': {
			zIndex: 100,
		},
	},
	loadingOverlay: {
		display: 'flex',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		insetBlockEnd: token('space.0'),
		insetBlockStart: token('space.0'),
		insetInlineEnd: token('space.0'),
		insetInlineStart: token('space.0'),
	},
	navigationSplitButton: {
		width: '24px',
		backgroundColor: token('color.background.neutral.subtle'),
		paddingInlineEnd: token('space.075'),
		paddingInlineStart: token('space.075'),
	},
});

const defaultStyles = cssMap({
	root: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
		backgroundColor: token('color.background.neutral', 'rgba(9, 30, 66, 0.04)'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values --  -- Ignored via go/DSP-18766
		color: token('color.text', '#42526E'),
		'&:visited': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: token('color.text', '#42526E'),
		},
		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values --  -- Ignored via go/DSP-18766
			color: token('color.text', '#42526E'),
		},
		'&:active': {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values --  -- Ignored via go/DSP-18766
			color: token('color.text', '#42526E'),
		},
		'&:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values --  -- Ignored via go/DSP-18766
			color: token('color.text', '#42526E'),
		},
	},
	rootRefreshed: {
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text.subtle'),
		'&::after': {
			content: '""',
			borderColor: token('color.border'),
		},
		'&:visited': {
			color: token('color.text.subtle'),
		},
		'&:hover': {
			color: token('color.text.subtle'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.subtle'),
		},
		'&:focus': {
			color: token('color.text.subtle'),
		},
	},
	interactive: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered', '#091e4214'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: token('color.text', '#42526E'),
		},
		'&:active': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.neutral.pressed', '#B3D4FF'),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: token('color.text', '#42526E'),
		},
	},
	interactiveRefreshed: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			color: token('color.text.subtle'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			// @ts-expect-error
			color: token('color.text.subtle'),
		},
	},
});

const primaryStyles = cssMap({
	root: {
		backgroundColor: token('color.background.brand.bold', '#0052CC'),
		color: token('color.text.inverse'),
		'&:visited': {
			color: token('color.text.inverse'),
		},
		'&:hover': {
			color: token('color.text.inverse'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
		},
		'&:focus': {
			color: token('color.text.inverse'),
		},
	},
	interactive: {
		'&:hover': {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.brand.bold.hovered', '#0065FF'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.brand.bold.pressed', '#0747A6'),
		},
	},
});

const warningStyles = cssMap({
	root: {
		backgroundColor: token('color.background.warning.bold', '#FFAB00'),
		color: token('color.text.warning.inverse', '#172B4D'),
		'&:visited': {
			color: token('color.text.warning.inverse', '#172B4D'),
		},
		'&:hover': {
			color: token('color.text.warning.inverse', '#172B4D'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.warning.inverse', '#172B4D'),
		},
		'&:focus': {
			color: token('color.text.warning.inverse', '#172B4D'),
		},
	},
	interactive: {
		'&:hover': {
			color: token('color.text.warning.inverse', '#172B4D'),
			backgroundColor: token('color.background.warning.bold.hovered', '#FFC400'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.warning.inverse', '#172B4D'),
			backgroundColor: token('color.background.warning.bold.pressed', '#FF991F'),
		},
	},
});

const dangerStyles = cssMap({
	root: {
		backgroundColor: token('color.background.danger.bold', '#DE350B'),
		color: token('color.text.inverse'),
		'&:visited': {
			color: token('color.text.inverse'),
		},
		'&:hover': {
			color: token('color.text.inverse'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
		},
		'&:focus': {
			color: token('color.text.inverse'),
		},
	},
	interactive: {
		'&:hover': {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.danger.bold.hovered', '#FF5630'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.danger.bold.pressed', '#BF2600'),
		},
	},
});

const discoveryStyles = cssMap({
	root: {
		backgroundColor: token('color.background.discovery.bold', '#5243AA'),
		color: token('color.text.inverse'),
		'&:visited': {
			color: token('color.text.inverse'),
		},
		'&:hover': {
			color: token('color.text.inverse'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
		},
		'&:focus': {
			color: token('color.text.inverse'),
		},
	},
	interactive: {
		'&:hover': {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.discovery.bold.hovered', '#8777D9'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.discovery.bold.pressed', '#5243AA'),
		},
	},
});

const subtleStyles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral.subtle', 'transparent'),
		color: token('color.text', '#42526E'),
		'&:visited': {
			color: token('color.text', '#42526E'),
		},
		'&:hover': {
			color: token('color.text', '#42526E'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text', '#42526E'),
		},
		'&:focus': {
			color: token('color.text', '#42526E'),
		},
	},
	rootRefreshed: {
		backgroundColor: token('color.background.neutral.subtle', 'transparent'),
		color: token('color.text.subtle'),
		'&:visited': {
			color: token('color.text.subtle'),
		},
		'&:hover': {
			color: token('color.text.subtle'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.subtle'),
		},
		'&:focus': {
			color: token('color.text.subtle'),
		},
	},
	interactive: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#091e4214'),
			color: token('color.text', '#42526E'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed', '#B3D4FF'),
			// @ts-expect-error
			color: token('color.text', '#42526E'),
		},
	},
	interactiveRefreshed: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#091e4214'),
			color: token('color.text.subtle'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed', '#B3D4FF'),
			// @ts-expect-error
			color: token('color.text.subtle'),
		},
	},
});

const selectedStyles = cssMap({
	root: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
		backgroundColor: token('color.background.selected', '#253858'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
		color: token('color.text.selected', '#F4F5F7'),
		'&:visited': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			color: token('color.text.selected', '#F4F5F7'),
		},
		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			color: token('color.text.selected', '#F4F5F7'),
		},
		'&:active': {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			color: token('color.text.selected', '#F4F5F7'),
		},
		'&:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			color: token('color.text.selected', '#F4F5F7'),
		},
	},
	rootRefreshed: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected', '#0052cc'),
		'&::after': {
			content: '""',
			borderColor: token('color.border.selected', '#0052cc'),
		},
		'&:visited': {
			color: token('color.text.selected', '#0052cc'),
		},
		'&:hover': {
			color: token('color.text.selected', '#0052cc'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.selected', '#0052cc'),
		},
		'&:focus': {
			color: token('color.text.selected', '#0052cc'),
		},
	},
	insideSplitButton: {
		// This is 2 so it appears above the split button divider when selected.
		// See split-button.tsx.
		// We need a local zindex just for button.
		// @ts-expect-error
		zIndex: 2,
	},
	interactive: {
		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			backgroundColor: token('color.background.selected.hovered', '#253858'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			color: token('color.text.selected', '#F4F5F7'),
		},
		'&:active': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			backgroundColor: token('color.background.selected.pressed', '#253858'),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			color: token('color.text.selected', '#F4F5F7'),
		},
	},
	// TODO: Remove me once we kill color fallbacks
	warning: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		backgroundColor: token('color.background.selected', '#FF991F'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', '#172B4D'),
		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.selected', '#FF991F'),
		},
		'&:active': {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.selected', '#FF991F'),
		},
	},
	// TODO: Remove me once we kill color fallbacks
	danger: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		backgroundColor: token('color.background.selected', '#BF2600'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', '#F4F5F7'),
		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.selected', '#BF2600'),
		},
		'&:active': {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.selected', '#BF2600'),
		},
	},
	// TODO: Remove me once we kill color fallbacks
	discovery: {
		backgroundColor: token('color.background.selected', '#403294'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', '#F4F5F7'),
		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected', '#403294'),
		},
		'&:active': {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected', '#403294'),
		},
	},
});

/**
 * __button base__
 *
 * - Implements auto focus when enabled.
 * - Appends the `onClick` event with UFO analytics tracking.
 *
 * @private
 */
const ButtonBase = React.forwardRef(
	(
		{
			appearance: propAppearance,
			autoFocus = false,
			isDisabled: propIsDisabled = false,
			isLoading = false,
			isSelected: propIsSelected = false,
			isIconButton = false,
			isCircle = false,
			hasIconBefore = false,
			hasIconAfter = false,
			shouldFitContainer = false,
			spacing: propSpacing = 'default',
			ariaLabel,
			ariaLabelledBy,
			children,
			interactionName,
			onClick,
			onMouseDown,
			onMouseDownCapture,
			onMouseUp,
			onMouseUpCapture,
			onKeyDown,
			onKeyDownCapture,
			onKeyUp,
			onKeyUpCapture,
			onTouchStart,
			onTouchStartCapture,
			onTouchEnd,
			onTouchEndCapture,
			onPointerDown,
			onPointerDownCapture,
			onPointerUp,
			onPointerUpCapture,
			onClickCapture,
			testId,
			analyticsContext,
			componentName,
			role,
			onMouseOver,
			onMouseOut,
			onFocus,
			onBlur,
			onMouseMove,
			type,
			...unsafeRest
		}: ButtonBaseProps<HTMLButtonElement>,
		ref: React.Ref<HTMLButtonElement>,
	): JSX.Element => {
		const localRef = useRef<HTMLButtonElement | null>(null);
		const splitButtonContext = useSplitButtonContext();
		const loadingLabelId = useId();

		const isSplitButton = Boolean(splitButtonContext);
		const isNavigationSplitButton = splitButtonContext?.isNavigationSplitButton || false;
		const isDefaultAppearanceSplitButton = splitButtonContext?.appearance === 'default';
		const appearance =
			isDefaultAppearanceSplitButton && fg('platform-component-visual-refresh')
				? 'subtle'
				: propAppearance || splitButtonContext?.appearance || 'default';

		const spacing = splitButtonContext?.spacing || propSpacing;
		const isDisabled = splitButtonContext?.isDisabled || propIsDisabled;
		const isInteractive = !isDisabled && !isLoading;
		// Also treat loading buttons as disabled
		const isEffectivelyDisabled = isDisabled || isLoading;
		const isSelected = propIsSelected && !isDisabled;

		useAutoFocus(localRef, autoFocus);

		// @ts-expect-error
		const { className: _className, css: _css, as: _as, style: _style, ...saferRest } = unsafeRest;

		return (
			<Pressable
				{...saferRest}
				componentName={componentName || 'button'}
				analyticsContext={analyticsContext}
				role={role}
				ref={mergeRefs([localRef, ref])}
				xcss={cx(
					styles.base,
					appearance === 'default' &&
						(fg('platform-component-visual-refresh')
							? defaultStyles.rootRefreshed
							: defaultStyles.root),
					appearance === 'default' &&
						isInteractive &&
						(fg('platform-component-visual-refresh')
							? defaultStyles.interactiveRefreshed
							: defaultStyles.interactive),
					appearance === 'primary' && primaryStyles.root,
					appearance === 'primary' && isInteractive && primaryStyles.interactive,
					appearance === 'warning' && warningStyles.root,
					appearance === 'warning' && isInteractive && warningStyles.interactive,
					appearance === 'danger' && dangerStyles.root,
					appearance === 'danger' && isInteractive && dangerStyles.interactive,
					appearance === 'discovery' && discoveryStyles.root,
					appearance === 'discovery' && isInteractive && discoveryStyles.interactive,
					appearance === 'subtle' &&
						(fg('platform-component-visual-refresh')
							? subtleStyles.rootRefreshed
							: subtleStyles.root),
					appearance === 'subtle' &&
						isInteractive &&
						(fg('platform-component-visual-refresh')
							? subtleStyles.interactiveRefreshed
							: subtleStyles.interactive),
					styles.linkDecorationUnset,
					isSelected &&
						(fg('platform-component-visual-refresh')
							? selectedStyles.rootRefreshed
							: selectedStyles.root),
					isSelected && isSplitButton && selectedStyles.insideSplitButton,
					isSelected && isInteractive && selectedStyles.interactive,
					// TODO: remove me once we kill color fallbacks
					isSelected && appearance === 'danger' && selectedStyles.danger,
					// TODO: remove me once we kill color fallbacks
					isSelected && appearance === 'warning' && selectedStyles.warning,
					// TODO: remove me once we kill color fallbacks
					isSelected && appearance === 'discovery' && selectedStyles.discovery,
					isDisabled && styles.disabled,
					isCircle && !isSplitButton && styles.circle,
					spacing === 'compact' && styles.spacingCompact,
					hasIconBefore && styles.buttonIconBefore,
					shouldFitContainer && styles.fullWidth,
					hasIconAfter && styles.buttonIconAfter,
					isIconButton && styles.iconButton,
					isIconButton && spacing === 'compact' && styles.iconButtonCompact,
					isLoading && styles.loading,
					isSplitButton && styles.splitButton,
					isNavigationSplitButton && styles.navigationSplitButton,
				)}
				isDisabled={isEffectivelyDisabled}
				aria-label={
					isLoading && ariaLabel && !ariaLabelledBy ? `${ariaLabel} ${LOADING_LABEL}` : ariaLabel
				}
				aria-labelledby={
					isLoading && ariaLabelledBy ? `${ariaLabelledBy} ${loadingLabelId}` : ariaLabelledBy
				}
				onClick={onClick}
				{...blockEvents(isEffectivelyDisabled, {
					onMouseDownCapture,
					onMouseUpCapture,
					onKeyDownCapture,
					onKeyUpCapture,
					onTouchStartCapture,
					onTouchEndCapture,
					onPointerDownCapture,
					onPointerUpCapture,
					onClickCapture,
				})}
				testId={testId}
				onMouseOver={onMouseOver}
				onFocus={onFocus}
				onMouseMove={onMouseMove}
				onBlur={onBlur}
				type={type}
				interactionName={interactionName}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onKeyDown={onKeyDown}
				onMouseOut={onMouseOut}
				onKeyUp={onKeyUp}
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
				onPointerDown={onPointerDown}
				onPointerUp={onPointerUp}
			>
				<SplitButtonContext.Provider value={undefined}>
					{children}
					{isLoading && (
						<span css={styles.loadingOverlay}>
							{renderLoadingOverlay({
								spacing: spacing,
								appearance: appearance,
								isDisabled: isDisabled,
								isSelected: isSelected,
								testId,
							})}
						</span>
					)}
					{isLoading && (ariaLabelledBy || !ariaLabel) && (
						<VisuallyHidden id={loadingLabelId}>{LOADING_LABEL}</VisuallyHidden>
					)}
				</SplitButtonContext.Provider>
			</Pressable>
		);
	},
);

export default ButtonBase;
