import React, { Fragment, useRef } from 'react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import * as colors from '@atlaskit/theme/colors';
import { fontSize as getFontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { useSplitButtonContext } from '../../containers/split-button/split-button-context';
import { type Appearance, type CommonButtonProps, type Spacing } from '../types';

import blockEvents from './block-events';

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
} & Pick<
	CommonButtonProps<TagName>,
	'analyticsContext' | 'autoFocus' | 'interactionName' | 'isDisabled' | 'isSelected' | 'overlay'
> &
	ControlledEvents<TagName>;

type XCSS = ReturnType<typeof xcss>;

export type UseButtonBaseReturn<TagName extends HTMLElement> = {
	xcss: XCSS | Array<XCSS | false | undefined>;
	ref(node: TagName | null): void;
	children: React.ReactNode;
	isDisabled: boolean;
} & ControlledEvents<TagName>;

const fontSize: number = getFontSize();

const buttonStyles = xcss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	width: 'auto',
	maxWidth: '100%',
	position: 'relative',
	alignItems: 'baseline',
	justifyContent: 'center',
	columnGap: 'space.050',
	background: token('color.background.neutral', colors.N20A),
	borderRadius: 'border.radius.100',
	borderWidth: 'border.width.0',
	// @ts-expect-error
	color: token('color.text', colors.N500),
	flexShrink: 0,
	height: `${32 / fontSize}em`,
	paddingInlineEnd: 'space.150',
	paddingInlineStart: 'space.150',
	textAlign: 'center',
	transition: 'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
	verticalAlign: 'middle',
	':visited': {
		// @ts-expect-error
		color: token('color.text', colors.N500),
	},
});

const baseButtonStyles = xcss({
	fontFamily: 'inherit',
	fontSize: 'inherit',
	fontStyle: 'normal',
	fontWeight: 500,
	lineHeight: `${32 / fontSize}em`,
	paddingBlock: 'space.0',
});

const tokenizedButtonStyles = xcss({
	font: token('font.body'),
	fontWeight: token('font.weight.medium'),
	paddingBlock: 'space.075',
});

const defaultInteractiveStyles = xcss({
	':hover': {
		background: token('color.background.neutral.hovered', '#091e4214'),
		// @ts-expect-error
		color: token('color.text', colors.N500),
		transitionDuration: '0s, 0.15s',
	},
	':active': {
		background: token('color.background.neutral.pressed', colors.B75),
		// @ts-expect-error
		color: token('color.text', colors.B400),
		transitionDuration: '0s, 0s',
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

const linkStyles = xcss({
	// @ts-expect-error
	color: token('color.link', colors.B400),
	background: token('color.background.neutral.subtle', 'transparent'),
	textDecoration: 'none',
	':hover': {
		// @ts-expect-error
		color: token('color.link', colors.B300),
		background: token('color.background.neutral.subtle', 'transparent'),
	},
	':active': {
		// @ts-expect-error
		color: token('color.link.pressed'),
		background: token('color.background.neutral.subtle', 'transparent'),
	},
	':visited': {
		// @ts-expect-error
		color: token('color.link', colors.B400),
	},
});

const subtleLinkStyles = xcss({
	// @ts-expect-error
	color: token('color.text.subtle', colors.N200),
	background: token('color.background.neutral.subtle', 'transparent'),
	textDecoration: 'none',
	':hover': {
		// @ts-expect-error
		color: token('color.text.subtle', colors.N90),
		background: token('color.background.neutral.subtle', 'transparent'),
	},
	':active': {
		// @ts-expect-error
		color: token('color.text', colors.N400),
		background: token('color.background.neutral.subtle', 'transparent'),
	},
	':visited': {
		// @ts-expect-error
		color: token('color.text.subtle', colors.N200),
	},
});

// Required due to Jira's AUI CSS reset: https://product-fabric.atlassian.net/browse/DSP-15687
const linkDecorationUnsetStyles = xcss({
	textDecoration: 'none',
	':hover': { textDecoration: 'none' },
	':active': { textDecoration: 'none' },
	':focus': { textDecoration: 'none' },
});

const linkDecorationStyles = xcss({
	':hover': { textDecoration: 'underline' },
	':focus': { textDecoration: 'underline' },
});

const disabledStyles = xcss({
	background: token('color.background.disabled', colors.N20A),
	// @ts-expect-error
	color: token('color.text.disabled'),
	':hover': {
		background: token('color.background.disabled', colors.N20A),
		// @ts-expect-error
		color: token('color.text.disabled'),
	},
	':active': {
		background: token('color.background.disabled', colors.N20A),
		// @ts-expect-error
		color: token('color.text.disabled'),
	},
});

const selectedStyles = xcss({
	background: token('color.background.selected', colors.N700),
	// @ts-expect-error
	color: token('color.text.selected', colors.N20),
	':visited': {
		// @ts-expect-error
		color: token('color.text.selected', colors.N20),
	},
});

const selectedInteractiveStyles = xcss({
	':hover': {
		// @ts-expect-error
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected.hovered', colors.N700),
	},
	':active': {
		// @ts-expect-error
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected.pressed', colors.N700),
	},
});

// TODO: Remove me once we kill color fallbacks
const selectedWarningStyles = xcss({
	background: token('color.background.selected', colors.Y400),
	// @ts-expect-error
	color: token('color.text.selected', colors.N800),
	':hover': {
		// @ts-expect-error
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected', colors.Y400),
	},
	':active': {
		// @ts-expect-error
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected', colors.Y400),
	},
});

// TODO: Remove me once we kill color fallbacks
const selectedDangerStyles = xcss({
	background: token('color.background.selected', colors.R500),
	// @ts-expect-error
	color: token('color.text.selected', colors.N20),
	':hover': {
		// @ts-expect-error
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected', colors.R500),
	},
	':active': {
		// @ts-expect-error
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected', colors.R500),
	},
});

// TODO: Remove me once we kill color fallbacks
const selectedDiscoveryStyles = xcss({
	background: token('color.background.selected', '#403294'),
	// @ts-expect-error
	color: token('color.text.selected', colors.N20),
	':hover': {
		// @ts-expect-error
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected', '#403294'),
	},
	':active': {
		// @ts-expect-error
		color: token('color.text.selected', colors.N20),
		background: token('color.background.selected', '#403294'),
	},
});

const spacingCompactStyles = xcss({
	columnGap: 'space.050',
	height: `${24 / fontSize}em`,
	paddingInlineEnd: 'space.150',
	paddingInlineStart: 'space.150',
	verticalAlign: 'middle',
});

const baseSpacingCompactStyles = xcss({
	lineHeight: `${24 / fontSize}em`,
});

const tokenizedSpacingCompactStyles = xcss({
	paddingBlock: 'space.025',
});

const spacingNoneStyles = xcss({
	columnGap: 'space.0',
	height: 'auto',
	lineHeight: 'inherit',
	paddingInlineEnd: 'space.0',
	paddingInlineStart: 'space.0',
	verticalAlign: 'baseline',
});

const tokenizedSpacingNoneStyles = xcss({
	paddingBlock: 'space.0',
});

const circleStyles = xcss({ borderRadius: 'border.radius.circle' });
const fullWidthStyles = xcss({ width: '100%' });
const loadingOverlayStyles = xcss({ cursor: 'progress' });
const nonInteractiveStyles = xcss({ cursor: 'not-allowed' });
const iconButtonStyles = xcss({
	height: `${32 / fontSize}em`,
	width: `${32 / fontSize}em`,
	paddingInlineEnd: 'space.0',
	paddingInlineStart: 'space.0',
});
const iconButtonCompactStyles = xcss({
	width: `${24 / fontSize}em`,
	height: `${24 / fontSize}em`,
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
const overlayStyles = xcss({
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
	isSelected = false,
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
	overlay,
	ref,
	shouldFitContainer = false,
	spacing: propSpacing = 'default',
}: UseButtonBaseArgs<TagName>): UseButtonBaseReturn<TagName> => {
	const localRef = useRef<TagName | null>(null);
	const splitButtonContext = useSplitButtonContext();

	const isSplitButton = Boolean(splitButtonContext);
	const isNavigationSplitButton = splitButtonContext?.isNavigationSplitButton || false;

	const appearance = splitButtonContext?.appearance || propAppearance;
	const spacing = splitButtonContext?.spacing || propSpacing;
	const isDisabled = splitButtonContext?.isDisabled || propIsDisabled;
	const hasOverlay = Boolean(overlay);
	const isInteractive = !isDisabled && !isLoading && !hasOverlay;
	const isEffectivelyDisabled = isDisabled || Boolean(overlay);

	useAutoFocus(localRef, autoFocus);

	return {
		ref: mergeRefs([localRef, ref]),
		xcss: [
			getBooleanFF('platform.design-system-team.button-tokenised-typography-styles')
				? tokenizedButtonStyles
				: baseButtonStyles,
			buttonStyles,
			appearance === 'default' && isInteractive && defaultInteractiveStyles,
			appearance === 'primary' && primaryStyles,
			appearance === 'primary' && isInteractive && primaryInteractiveStyles,
			appearance === 'warning' && warningStyles,
			appearance === 'warning' && isInteractive && warningInteractiveStyles,
			appearance === 'danger' && dangerStyles,
			appearance === 'danger' && isInteractive && dangerInteractiveStyles,
			appearance === 'discovery' && discoveryStyles,
			appearance === 'discovery' && isInteractive && discoveryInteractiveStyles,
			appearance === 'subtle' && subtleStyles,
			appearance === 'subtle' && isInteractive && subtleInteractiveStyles,
			appearance === 'link' && linkStyles,
			appearance === 'subtle-link' && subtleLinkStyles,
			!isSelected && (appearance === 'link' || appearance === 'subtle-link')
				? linkDecorationStyles
				: linkDecorationUnsetStyles,
			isSelected && selectedStyles,
			isSelected && isInteractive && selectedInteractiveStyles,
			// TODO: remove me once we kill color fallbacks
			isSelected && appearance === 'danger' && selectedDangerStyles,
			// TODO: remove me once we kill color fallbacks
			isSelected && appearance === 'warning' && selectedWarningStyles,
			// TODO: remove me once we kill color fallbacks
			isSelected && appearance === 'discovery' && selectedDiscoveryStyles,
			isDisabled && disabledStyles,
			isCircle && !isSplitButton && circleStyles,
			spacing === 'compact' && spacingCompactStyles,
			spacing === 'compact' &&
				(getBooleanFF('platform.design-system-team.button-tokenised-typography-styles')
					? tokenizedSpacingCompactStyles
					: baseSpacingCompactStyles),
			spacing === 'none' && spacingNoneStyles,
			spacing === 'none' &&
				getBooleanFF('platform.design-system-team.button-tokenised-typography-styles') &&
				tokenizedSpacingNoneStyles,
			spacing !== 'none' && hasIconBefore && buttonIconBeforeStyles,
			spacing !== 'none' && hasIconAfter && buttonIconAfterStyles,
			isIconButton && iconButtonStyles,
			isIconButton && spacing === 'compact' && iconButtonCompactStyles,
			shouldFitContainer && fullWidthStyles,
			isLoading && loadingOverlayStyles,
			(isDisabled || (hasOverlay && !isLoading)) && nonInteractiveStyles,
			isSplitButton && splitButtonStyles,
			isNavigationSplitButton && navigationSplitButtonStyles,
		],
		// Consider overlay buttons to be effectively disabled
		isDisabled: isEffectivelyDisabled,
		children: (
			<Fragment>
				{children}
				{overlay ? (
					<Box as="span" xcss={overlayStyles}>
						{overlay}
					</Box>
				) : null}
			</Fragment>
		),
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
