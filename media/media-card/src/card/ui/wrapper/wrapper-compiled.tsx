/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css, cssMap } from '@compiled/react';
import { newFileExperienceClassName } from '../../cardConstants';
import { type WrapperProps } from './types';
import { VcMediaWrapperProps } from '@atlaskit/react-ufo/vc-media';

import { N0, N100, N20, N60A, N90A, B100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { getDefaultCardDimensions } from '../../../utils/cardDimensions';
import { getCSSUnitValue } from '../../../utils/getCSSUnitValue';
import { type Breakpoint } from '../common';
import { fg } from '@atlaskit/platform-feature-flags';
import UFOCustomData from '@atlaskit/react-ufo/custom-data';

const LOCAL_WIDTH_VARIABLE = '--media-wrapper-width';
const LOCAL_HEIGHT_VARIABLE = '--media-wrapper-height';

const wrapperStyles = css({
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
	borderRadius: token('radius.small', '3px'),
	width: `var(${LOCAL_WIDTH_VARIABLE})`,
	height: `var(${LOCAL_HEIGHT_VARIABLE})`,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:hover .media-card-blanket': {
		backgroundColor: token('color.blanket', N90A),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:hover .media-card-actions-bar, &:focus-within .media-card-actions-bar': {
		opacity: 1,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'button:focus + &': {
		outline: `solid ${token('border.width.focused')} ${token('color.border.focused', B100)}`,
	},
});

const backgroundStyle = css({
	backgroundColor: token('color.background.neutral', N20),
});

const cursorStyleMap = cssMap({
	pointer: {
		cursor: 'pointer',
	},
	wait: {
		cursor: 'wait',
	},
});

const shadowStyleMap = cssMap({
	withOverlay: {
		boxShadow: `${token('elevation.shadow.raised', `0 1px 1px ${N60A}, 0 0 1px 0 ${N60A}`)}`,
	},
	selected: {
		boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
	},
	selectedWithOverlay: {
		boxShadow: `0 0 0 1px ${token('color.border.selected')}, ${token('elevation.shadow.raised', `0 1px 1px ${N60A}, 0 0 1px 0 ${N60A}`)}`,
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
		backgroundColor: token('color.background.input', N0),
		color: token('color.icon.subtle', N100),
	},
});

const tooltipStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > div': {
		width: '100%',
		height: '100%',
	},
});

const getResponsiveStyles = (breakpoint: Breakpoint) => {
	// dynamically setting the properties to avoid ratcheting build errors. These need to be removed however for the compiled transformation.
	return breakpoint === 'small'
		? { ['fontSize']: '11px', ['lineHeight']: '14px' }
		: { ['fontSize']: '14px', ['lineHeight']: '22px' };
};

export const Wrapper = (props: WrapperProps) => {
	const {
		testId,
		dimensions,
		appearance,
		onClick,
		onMouseEnter,
		innerRef,
		breakpoint,
		mediaCardCursor,
		disableOverlay,
		selected,
		displayBackground,
		isPlayButtonClickable,
		isTickBoxSelectable,
		shouldDisplayTooltip,
	} = props;

	const defaultImageCardDimensions = getDefaultCardDimensions(appearance);

	const width = getCSSUnitValue(dimensions?.width || defaultImageCardDimensions.width);
	const height = getCSSUnitValue(dimensions?.height || defaultImageCardDimensions.height);

	const wrapperShadowKey = getShadowKey(disableOverlay, selected);

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
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
				wrapperStyles,
				displayBackground && backgroundStyle,
				mediaCardCursor && cursorStyleMap[mediaCardCursor],
				wrapperShadowKey && shadowStyleMap[wrapperShadowKey],
				selected && hideNativeBrowserTextSelectionStyles,
				isPlayButtonClickable && clickableButtonPlayButtonStyles,
				isTickBoxSelectable && selectableTickboxStyle,
				shouldDisplayTooltip && tooltipStyle,
			]}
			ref={innerRef}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			{...VcMediaWrapperProps}
		>
			{fg('platform_media_add_ufo_custom_data') ? (
				<UFOCustomData data={{ hasMediaComponent: true }} />
			) : null}
			{props.children}
		</div>
	);
};

Wrapper.displayName = 'NewFileExperienceWrapper';
