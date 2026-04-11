/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css, cssMap } from '@compiled/react';
import { newFileExperienceClassName } from '../../cardConstants';
import { type WrapperProps } from './types';
import { VcMediaWrapperProps } from '@atlaskit/react-ufo/vc-media';

import { token } from '@atlaskit/tokens';

import { getDefaultCardDimensions } from '../../../utils/cardDimensions';
import { getCSSUnitValue } from '../../../utils/getCSSUnitValue';
import { type Breakpoint } from '../common';
import UFOCustomData from '@atlaskit/react-ufo/custom-data';
import { fg } from '@atlaskit/platform-feature-flags';

export const LOCAL_WIDTH_VARIABLE = '--media-wrapper-width';
export const LOCAL_HEIGHT_VARIABLE = '--media-wrapper-height';

const wrapperStyles = cssMap({
	default: {
		boxSizing: 'border-box',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'*': {
			boxSizing: 'border-box',
		},
		position: 'relative',
		fontFamily: token('font.family.body'),
		maxWidth: '100%',
		maxHeight: '100%',
		// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
		borderRadius: token('radius.large', '3px'),
		width: `var(${LOCAL_WIDTH_VARIABLE})`,
		height: `var(${LOCAL_HEIGHT_VARIABLE})`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover .media-card-blanket': {
			backgroundColor: token('color.blanket'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover .media-card-actions-bar, &:focus-within .media-card-actions-bar': {
			opacity: 1,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'button:focus + &': {
			outline: `solid ${token('border.width.focused')} ${token('color.border.focused')}`,
		},
	},
});

const backgroundStyle = css({
	backgroundColor: token('color.background.neutral'),
});

const resetButtonStyle = css({
	all: 'unset',
	display: 'block',
});

// Fix for Renderer context: editor-common's [data-node-type='media'] > div
// selector doesn't match <button>, so we replicate those styles here.
const rendererMediaButtonFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-node-type="media"] > &': {
		position: 'absolute',
		height: '100%',
	},
});

const shadowStyleMap = cssMap({
	withOverlay: {
		boxShadow: `${token('elevation.shadow.raised')}`,
	},
	selected: {
		boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
	},
	selectedWithOverlay: {
		boxShadow: `0 0 0 1px ${token('color.border.selected')}, ${token('elevation.shadow.raised')}`,
	},
});

const getShadowKey = (disableOverlay: boolean, selected: boolean) => {
	if (!disableOverlay && selected) {
		return 'selectedWithOverlay';
	}

	if (!disableOverlay) {
		return 'withOverlay';
	}

	if (selected) {
		return 'selected';
	}

	return '';
};

const hideNativeBrowserTextSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&::selection,*::selection': {
		backgroundColor: 'transparent',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-moz-selection,*::-moz-selection': {
		backgroundColor: 'transparent',
	},
});

const clickableButtonPlayButtonStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:hover .media-card-play-button .play-icon-background': {
		width: '56px',
		height: '56px',
	},
});

const selectableTickboxStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:hover .media-card-tickbox': {
		backgroundColor: token('color.background.input'),
		color: token('color.icon.subtle'),
	},
});

const tooltipStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > div': {
		width: '100%',
		height: '100%',
	},
});

// These styles target data attributes to enable the exclusion from TTVC metric calculation.
const cursorStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-cursor="pointer"]': {
		cursor: 'pointer',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-cursor="wait"]': {
		cursor: 'wait',
	},
});

const getResponsiveStyles = (breakpoint: Breakpoint) => {
	// dynamically setting the properties to avoid ratcheting build errors. These need to be removed however for the compiled transformation.
	return breakpoint === 'small'
		? { ['fontSize']: '11px', ['lineHeight']: '14px' }
		: { ['fontSize']: '14px', ['lineHeight']: '22px' };
};

export const Wrapper: {
	(props: WrapperProps): JSX.Element;
	displayName: string;
} = (props: WrapperProps): JSX.Element => {
	const {
		testId,
		dimensions,
		appearance,
		onClick,
		onMouseEnter,
		innerRef,
		breakpoint,
		disableOverlay,
		selected,
		displayBackground,
		isPlayButtonClickable,
		isTickBoxSelectable,
		shouldDisplayTooltip,
		ariaLabel,
	} = props;

	const defaultImageCardDimensions = getDefaultCardDimensions(appearance);

	const width = getCSSUnitValue(dimensions?.width || defaultImageCardDimensions.width);
	const height = getCSSUnitValue(dimensions?.height || defaultImageCardDimensions.height);

	const wrapperShadowKey = getShadowKey(disableOverlay, selected);

	return fg('platform_media_a11y_suppression_fixes') ? (
		<button
			id="newFileExperienceWrapper"
			type="button"
			aria-label={ariaLabel}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={newFileExperienceClassName}
			data-testid={testId}
			style={
				{
					[LOCAL_WIDTH_VARIABLE]: width,
					[LOCAL_HEIGHT_VARIABLE]: height,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					...getResponsiveStyles(breakpoint),
				} as React.CSSProperties
			}
			css={[
				resetButtonStyle,
				wrapperStyles.default,
				rendererMediaButtonFix,
				cursorStyle,
				displayBackground && backgroundStyle,
				wrapperShadowKey && shadowStyleMap[wrapperShadowKey],
				selected && hideNativeBrowserTextSelectionStyles,
				isPlayButtonClickable && clickableButtonPlayButtonStyles,
				isTickBoxSelectable && selectableTickboxStyle,
				shouldDisplayTooltip && tooltipStyle,
			]}
			ref={innerRef as any}
			onClick={onClick as any}
			onMouseEnter={onMouseEnter as any}
			onFocus={(ev) =>
				onMouseEnter && onMouseEnter(ev as unknown as React.MouseEvent<HTMLDivElement>)
			}
			{...VcMediaWrapperProps}
		>
			<UFOCustomData data={{ hasMediaComponent: true }} />
			{props.children}
		</button>
	) : (
		// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
		<div
			id="newFileExperienceWrapper"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={newFileExperienceClassName}
			data-testid={testId}
			style={
				{
					[LOCAL_WIDTH_VARIABLE]: width,
					[LOCAL_HEIGHT_VARIABLE]: height,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					...getResponsiveStyles(breakpoint),
				} as React.CSSProperties
			}
			css={[
				wrapperStyles.default,
				cursorStyle,
				displayBackground && backgroundStyle,
				wrapperShadowKey && shadowStyleMap[wrapperShadowKey],
				selected && hideNativeBrowserTextSelectionStyles,
				isPlayButtonClickable && clickableButtonPlayButtonStyles,
				isTickBoxSelectable && selectableTickboxStyle,
				shouldDisplayTooltip && tooltipStyle,
			]}
			ref={innerRef}
			onClick={onClick}
			// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
			onMouseEnter={onMouseEnter}
			{...VcMediaWrapperProps}
		>
			<UFOCustomData data={{ hasMediaComponent: true }} />
			{props.children}
		</div>
	);
};

Wrapper.displayName = 'NewFileExperienceWrapper';
