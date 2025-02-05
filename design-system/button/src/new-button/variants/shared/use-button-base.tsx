import React, { useRef } from 'react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { useId } from '@atlaskit/ds-lib/use-id';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import {
	SplitButtonContext,
	useSplitButtonContext,
} from '../../containers/split-button/split-button-context';
import { type Appearance, type CommonButtonProps, type Spacing } from '../types';

import blockEvents from './block-events';
import { LOADING_LABEL } from './constants';
import renderLoadingOverlay from './loading-overlay';

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
> &
	Pick<CommonButtonProps<TagName>, 'onClick'>;

export type UseButtonBaseArgs<TagName extends HTMLElement> = {
	ref: React.Ref<TagName>;
	/**
	 * The type of button. Used to pass action subject context to analytics.
	 */
	buttonType: 'button' | 'link';
	isIconButton?: boolean;
	isCircle?: boolean;
	hasIconBefore?: boolean;
	hasIconAfter?: boolean;
	shouldFitContainer?: boolean;
	appearance?: Appearance;
	children: React.ReactNode;
	spacing?: Spacing;
	isLoading?: boolean;
	ariaLabel?: string;
	ariaLabelledBy?: string;
} & Pick<
	CommonButtonProps<TagName>,
	'analyticsContext' | 'autoFocus' | 'interactionName' | 'isDisabled' | 'isSelected' | 'testId'
> &
	ControlledEvents<TagName>;

type XCSS = ReturnType<typeof xcss>;

export type UseButtonBaseReturn<TagName extends HTMLElement> = {
	xcss: XCSS | Array<XCSS | false | undefined>;
	ref(node: TagName | null): void;
	children: React.ReactNode;
	isDisabled: boolean;
	'aria-label'?: string;
	'aria-labelledby'?: string;
} & ControlledEvents<TagName>;

// If updating `buttonStyles`, also update `buttonStylesWithRem`.
const buttonStyles = xcss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	width: 'auto',
	maxWidth: '100%',
	position: 'relative',
	alignItems: 'baseline',
	justifyContent: 'center',
	columnGap: 'space.050',
	borderRadius: 'border.radius.100',
	borderWidth: 'border.width.0',
	flexShrink: 0,
	height: `${32 / 14}em`,
	font: 'font.body',
	fontWeight: 'font.weight.medium',
	paddingBlock: 'space.075',
	paddingInlineEnd: 'space.150',
	paddingInlineStart: 'space.150',
	textAlign: 'center',
	transition: 'background 0.1s ease-out',
	verticalAlign: 'middle',
	'::after': {
		borderRadius: 'inherit',
		inset: 'space.0',
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		pointerEvents: 'none',
		position: 'absolute',
	},
});

const buttonStylesWithRem = xcss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	width: 'auto',
	maxWidth: '100%',
	position: 'relative',
	alignItems: 'baseline',
	justifyContent: 'center',
	columnGap: 'space.050',
	borderRadius: 'border.radius.100',
	borderWidth: 'border.width.0',
	flexShrink: 0,
	height: '2rem',
	font: 'font.body',
	fontWeight: 'font.weight.medium',
	paddingBlock: 'space.075',
	paddingInlineEnd: 'space.150',
	paddingInlineStart: 'space.150',
	textAlign: 'center',
	transition: 'background 0.1s ease-out',
	verticalAlign: 'middle',
	'::after': {
		borderRadius: 'inherit',
		inset: 'space.0',
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		pointerEvents: 'none',
		position: 'absolute',
	},
});

const defaultInteractiveStyles = xcss({
	':hover': {
		background: token('color.background.neutral.hovered', '#091e4214'),
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text', colors.N500),
	},
	':active': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		background: token('color.background.neutral.pressed', colors.B75),
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text', colors.B400),
	},
});

const defaultInteractiveRefreshedStyles = xcss({
	':hover': {
		background: token('color.background.neutral.subtle.hovered'),
		color: 'color.text.subtle',
	},
	':active': {
		background: token('color.background.neutral.subtle.pressed'),
		color: 'color.text.subtle',
	},
});

const defaultStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
	background: token('color.background.neutral', colors.N20A),
	// @ts-expect-error — using tokens for explicit fallback usage.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values --  -- Ignored via go/DSP-18766
	color: token('color.text', colors.N500),
	':visited': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text', colors.N500),
	},
});

const defaultRefreshedStyles = xcss({
	background: token('color.background.neutral.subtle'),
	color: 'color.text.subtle',
	'::after': {
		content: '""',
		borderColor: 'color.border',
	},
	':visited': {
		color: 'color.text.subtle',
	},
});

const primaryStyles = xcss({
	background: token('color.background.brand.bold', '#0052CC'),
	// @ts-expect-error
	color: token('color.text.inverse'),
	':visited': {
		// @ts-expect-error
		color: token('color.text.inverse'),
	},
});

const primaryInteractiveStyles = xcss({
	':hover': {
		// @ts-expect-error
		color: token('color.text.inverse'),
		background: token('color.background.brand.bold.hovered', '#0065FF'),
	},
	':active': {
		// @ts-expect-error
		color: token('color.text.inverse'),
		background: token('color.background.brand.bold.pressed', '#0747A6'),
	},
});

const warningStyles = xcss({
	background: token('color.background.warning.bold', '#FFAB00'),
	// @ts-expect-error
	color: token('color.text.warning.inverse', '#172B4D'),
	':visited': {
		// @ts-expect-error
		color: token('color.text.warning.inverse', '#172B4D'),
	},
});

const warningInteractiveStyles = xcss({
	':hover': {
		// @ts-expect-error
		color: token('color.text.warning.inverse', '#172B4D'),
		background: token('color.background.warning.bold.hovered', '#FFC400'),
	},
	':active': {
		// @ts-expect-error
		color: token('color.text.warning.inverse', '#172B4D'),
		background: token('color.background.warning.bold.pressed', '#FF991F'),
	},
});

const dangerStyles = xcss({
	background: token('color.background.danger.bold', '#DE350B'),
	color: 'color.text.inverse',
	':visited': {
		color: 'color.text.inverse',
	},
});

const dangerInteractiveStyles = xcss({
	':hover': {
		color: 'color.text.inverse',
		background: token('color.background.danger.bold.hovered', '#FF5630'),
	},
	':active': {
		color: 'color.text.inverse',
		background: token('color.background.danger.bold.pressed', '#BF2600'),
	},
});

const discoveryStyles = xcss({
	background: token('color.background.discovery.bold', '#5243AA'),
	color: 'color.text.inverse',
	':visited': {
		color: 'color.text.inverse',
	},
});

const discoveryInteractiveStyles = xcss({
	':hover': {
		color: 'color.text.inverse',
		background: token('color.background.discovery.bold.hovered', '#8777D9'),
	},
	':active': {
		color: 'color.text.inverse',
		background: token('color.background.discovery.bold.pressed', '#5243AA'),
	},
});

const subtleStyles = xcss({
	background: token('color.background.neutral.subtle', 'transparent'),
	// @ts-expect-error
	color: token('color.text', '#42526E'),
	':visited': {
		// @ts-expect-error
		color: token('color.text', '#42526E'),
	},
});

const subtleRefreshedStyles = xcss({
	background: token('color.background.neutral.subtle', 'transparent'),
	color: 'color.text.subtle',
	':visited': {
		color: 'color.text.subtle',
	},
});

const subtleInteractiveStyles = xcss({
	':hover': {
		background: token('color.background.neutral.subtle.hovered', '#091e4214'),
		// @ts-expect-error
		color: token('color.text', '#42526E'),
	},
	':active': {
		background: token('color.background.neutral.subtle.pressed', '#B3D4FF'),
		// @ts-expect-error
		color: token('color.text', '#42526E'),
	},
});

const subtleInteractiveRefreshedStyles = xcss({
	':hover': {
		background: token('color.background.neutral.subtle.hovered', '#091e4214'),
		color: 'color.text.subtle',
	},
	':active': {
		background: token('color.background.neutral.subtle.pressed', '#B3D4FF'),
		color: 'color.text.subtle',
	},
});

// Required due to Jira's AUI CSS reset: https://product-fabric.atlassian.net/browse/DSP-15687
const linkDecorationUnsetStyles = xcss({
	textDecoration: 'none',
	':hover': { textDecoration: 'none' },
	':active': { textDecoration: 'none' },
	':focus': { textDecoration: 'none' },
});

const disabledStyles = xcss({
	cursor: 'not-allowed',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	background: token('color.background.disabled', colors.N20A),
	// @ts-expect-error
	color: token('color.text.disabled'),
	':hover': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		background: token('color.background.disabled', colors.N20A),
		// @ts-expect-error
		color: token('color.text.disabled'),
	},
	':active': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		background: token('color.background.disabled', colors.N20A),
		// @ts-expect-error
		color: token('color.text.disabled'),
	},
	'::after': {
		content: 'none',
	},
});

const selectedStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	background: token('color.background.selected', colors.N700),
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.selected', colors.N20),
	':visited': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', colors.N20),
	},
});

const selectedRefreshedStyles = xcss({
	background: token('color.background.selected'),
	color: 'color.text.selected',
	'::after': {
		content: '""',
		borderColor: 'color.border.selected',
	},
	':visited': {
		color: 'color.text.selected',
	},
});

const selectedInsideSplitButtonStyles = xcss({
	// This is 2 so it appears above the split button divider when selected.
	// See split-button.tsx.
	// @ts-expect-error — We need a local zindex just for button.
	zIndex: 2,
});

const selectedInteractiveStyles = xcss({
	':hover': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', colors.N20),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		background: token('color.background.selected.hovered', colors.N700),
	},
	':active': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', colors.N20),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		background: token('color.background.selected.pressed', colors.N700),
	},
});

// TODO: Remove me once we kill color fallbacks
const selectedWarningStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	background: token('color.background.selected', colors.Y400),
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.selected', colors.N800),
	':hover': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', colors.N20),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		background: token('color.background.selected', colors.Y400),
	},
	':active': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', colors.N20),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		background: token('color.background.selected', colors.Y400),
	},
});

// TODO: Remove me once we kill color fallbacks
const selectedDangerStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	background: token('color.background.selected', colors.R500),
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.selected', colors.N20),
	':hover': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', colors.N20),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		background: token('color.background.selected', colors.R500),
	},
	':active': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', colors.N20),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		background: token('color.background.selected', colors.R500),
	},
});

// TODO: Remove me once we kill color fallbacks
const selectedDiscoveryStyles = xcss({
	background: token('color.background.selected', '#403294'),
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.selected', colors.N20),
	':hover': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected', '#403294'),
	},
	':active': {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected', '#403294'),
	},
});

// If updating `spacingCompactStyles`, also update `spacingCompactStylesWithRem`.
const spacingCompactStyles = xcss({
	columnGap: 'space.050',
	height: `${24 / 14}em`,
	paddingBlock: 'space.025',
	paddingInlineEnd: 'space.150',
	paddingInlineStart: 'space.150',
	verticalAlign: 'middle',
});

const spacingCompactStylesWithRem = xcss({
	columnGap: 'space.050',
	height: '1.5rem',
	paddingBlock: 'space.025',
	paddingInlineEnd: 'space.150',
	paddingInlineStart: 'space.150',
	verticalAlign: 'middle',
});

const circleStyles = xcss({ borderRadius: 'border.radius.circle' });
const fullWidthStyles = xcss({ width: '100%' });
const loadingStyles = xcss({ cursor: 'progress' });
// If updating `iconButtonStyles`, also update `iconButtonStylesWithRem`.
const iconButtonStyles = xcss({
	height: `${32 / 14}em`,
	width: `${32 / 14}em`,
	paddingInlineEnd: 'space.0',
	paddingInlineStart: 'space.0',
});
const iconButtonStylesWithRem = xcss({
	height: '2rem',
	width: '2rem',
	paddingInlineEnd: 'space.0',
	paddingInlineStart: 'space.0',
});
// If updating `iconButtonCompactStyles`, also update `iconButtonCompactStylesWithRem`.
const iconButtonCompactStyles = xcss({
	width: `${24 / 14}em`,
	height: `${24 / 14}em`,
});
const iconButtonCompactStylesWithRem = xcss({
	width: '1.5rem',
	height: '1.5rem',
});
const buttonIconBeforeStyles = xcss({ paddingInlineStart: 'space.100' });
const buttonIconAfterStyles = xcss({ paddingInlineEnd: 'space.100' });
const splitButtonStyles = xcss({ ':focus-visible': { zIndex: 'card' } });

const navigationSplitButtonStyles = xcss({
	width: '24px',
	backgroundColor: 'color.background.neutral.subtle',
	paddingInlineEnd: 'space.075',
	paddingInlineStart: 'space.075',
});
const loadingOverlayStyles = xcss({
	display: 'flex',
	position: 'absolute',
	alignItems: 'center',
	justifyContent: 'center',
	insetBlockEnd: 'space.0',
	insetBlockStart: 'space.0',
	insetInlineEnd: 'space.0',
	insetInlineStart: 'space.0',
});

/**
 * __Use button base__
 *
 * A React hook that accepts a set of common Button props,
 * and processes them to return consistent base props for usage
 * across various Button components.
 *
 * It also:
 * - Implements auto focus when enabled.
 * - Appends the `onClick` event with UFO analytics tracking.
 *
 * @private
 */
const useButtonBase = <TagName extends HTMLElement>({
	appearance: propAppearance = 'default',
	autoFocus = false,
	isDisabled: propIsDisabled = false,
	isLoading = false,
	isSelected: propIsSelected = false,
	// TODO: Separate Icon Button styling from button base
	isIconButton = false,
	isCircle = false,
	// TODO: Separate icon slot styling from button base
	hasIconBefore = false,
	hasIconAfter = false,
	children,
	onClick,
	onMouseDownCapture,
	onMouseUpCapture,
	onKeyDownCapture,
	onKeyUpCapture,
	onTouchStartCapture,
	onTouchEndCapture,
	onPointerDownCapture,
	onPointerUpCapture,
	onClickCapture,
	ref,
	shouldFitContainer = false,
	spacing: propSpacing = 'default',
	testId,
	ariaLabel,
	ariaLabelledBy,
}: UseButtonBaseArgs<TagName>): UseButtonBaseReturn<TagName> => {
	const localRef = useRef<TagName | null>(null);
	const splitButtonContext = useSplitButtonContext();
	const loadingLabelId = useId();

	const isSplitButton = Boolean(splitButtonContext);
	const isNavigationSplitButton = splitButtonContext?.isNavigationSplitButton || false;

	const isDefaultAppearanceSplitButton = splitButtonContext?.appearance === 'default';
	const appearance =
		isDefaultAppearanceSplitButton && fg('platform-component-visual-refresh')
			? 'subtle'
			: splitButtonContext?.appearance || propAppearance;
	const spacing = splitButtonContext?.spacing || propSpacing;
	const isDisabled = splitButtonContext?.isDisabled || propIsDisabled;
	const isInteractive = !isDisabled && !isLoading;
	// Also treat loading buttons as disabled
	const isEffectivelyDisabled = isDisabled || isLoading;
	const isSelected = propIsSelected && !isDisabled;

	useAutoFocus(localRef, autoFocus);

	return {
		ref: mergeRefs([localRef, ref]),
		xcss: [
			fg('platform_dst_button_replace_em_with_rem') ? buttonStylesWithRem : buttonStyles,
			appearance === 'default' &&
				(fg('platform-component-visual-refresh') ? defaultRefreshedStyles : defaultStyles),
			appearance === 'default' &&
				isInteractive &&
				(fg('platform-component-visual-refresh')
					? defaultInteractiveRefreshedStyles
					: defaultInteractiveStyles),
			appearance === 'primary' && primaryStyles,
			appearance === 'primary' && isInteractive && primaryInteractiveStyles,
			appearance === 'warning' && warningStyles,
			appearance === 'warning' && isInteractive && warningInteractiveStyles,
			appearance === 'danger' && dangerStyles,
			appearance === 'danger' && isInteractive && dangerInteractiveStyles,
			appearance === 'discovery' && discoveryStyles,
			appearance === 'discovery' && isInteractive && discoveryInteractiveStyles,
			appearance === 'subtle' &&
				(fg('platform-component-visual-refresh') ? subtleRefreshedStyles : subtleStyles),
			appearance === 'subtle' &&
				isInteractive &&
				(fg('platform-component-visual-refresh')
					? subtleInteractiveRefreshedStyles
					: subtleInteractiveStyles),
			linkDecorationUnsetStyles,
			isSelected &&
				(fg('platform-component-visual-refresh') ? selectedRefreshedStyles : selectedStyles),
			isSelected && isSplitButton && selectedInsideSplitButtonStyles,
			isSelected && isInteractive && selectedInteractiveStyles,
			// TODO: remove me once we kill color fallbacks
			isSelected && appearance === 'danger' && selectedDangerStyles,
			// TODO: remove me once we kill color fallbacks
			isSelected && appearance === 'warning' && selectedWarningStyles,
			// TODO: remove me once we kill color fallbacks
			isSelected && appearance === 'discovery' && selectedDiscoveryStyles,
			isDisabled && disabledStyles,
			isCircle && !isSplitButton && circleStyles,
			spacing === 'compact' &&
				(fg('platform_dst_button_replace_em_with_rem')
					? spacingCompactStylesWithRem
					: spacingCompactStyles),
			hasIconBefore && buttonIconBeforeStyles,
			hasIconAfter && buttonIconAfterStyles,
			isIconButton &&
				(fg('platform_dst_button_replace_em_with_rem')
					? iconButtonStylesWithRem
					: iconButtonStyles),
			isIconButton &&
				spacing === 'compact' &&
				(fg('platform_dst_button_replace_em_with_rem')
					? iconButtonCompactStylesWithRem
					: iconButtonCompactStyles),
			shouldFitContainer && fullWidthStyles,
			isLoading && loadingStyles,
			isSplitButton && splitButtonStyles,
			isNavigationSplitButton && navigationSplitButtonStyles,
		],
		isDisabled: isEffectivelyDisabled,
		children: (
			<SplitButtonContext.Provider value={undefined}>
				{children}
				{isLoading ? (
					<Box as="span" xcss={loadingOverlayStyles}>
						{renderLoadingOverlay({
							spacing,
							appearance,
							isDisabled,
							isSelected,
							testId,
						})}
					</Box>
				) : null}
				{isLoading && ((children && !ariaLabel && !ariaLabelledBy) || ariaLabelledBy) && (
					<VisuallyHidden id={loadingLabelId}>{LOADING_LABEL}</VisuallyHidden>
				)}
			</SplitButtonContext.Provider>
		),
		'aria-label':
			isLoading && ariaLabel && !ariaLabelledBy ? `${ariaLabel} ${LOADING_LABEL}` : ariaLabel,
		'aria-labelledby':
			isLoading && ariaLabelledBy ? `${ariaLabelledBy} ${loadingLabelId}` : ariaLabelledBy,
		...blockEvents(isEffectivelyDisabled, {
			onClick,
			onMouseDownCapture,
			onMouseUpCapture,
			onKeyDownCapture,
			onKeyUpCapture,
			onTouchStartCapture,
			onTouchEndCapture,
			onPointerDownCapture,
			onPointerUpCapture,
			onClickCapture,
		}),
	};
};

export default useButtonBase;
