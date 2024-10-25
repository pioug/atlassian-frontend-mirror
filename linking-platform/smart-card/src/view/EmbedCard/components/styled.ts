// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import * as colors from '@atlaskit/theme/colors';
import { N40 } from '@atlaskit/theme/colors';
import { fontFamily } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { gs as gridSize } from '../../common/utils';
import { type FrameStyle } from '../types';


export const className = 'media-card-frame';

export interface WrapperProps {
	minWidth?: number;
	maxWidth?: number;
	isInteractive?: boolean;
	isSelected?: boolean;
	frameStyle?: FrameStyle;
	inheritDimensions?: boolean;
}

export const borderRadius = `
  border-radius: ${token('border.radius', '3px')};
`;

const wrapperBorderRadius = `
  border-radius: ${token('border.radius.200', '8px')};
`;

const contentBorderRadius = `
  border-radius: ${token('border.radius.100', '4px')};
`;

export const ellipsis = (maxWidth: string | number = '100%') => {
	const unit = typeof maxWidth === 'number' ? 'px' : '';

	return `
    max-width: ${maxWidth}${unit};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
};

export const csssize = (value: string | number = '100%') => {
	const unit = typeof value === 'number' ? 'px' : '';

	return `
    width: ${value}${unit};
    height: ${value}${unit};
  `;
};

function minWidth({ minWidth }: WrapperProps) {
	if (minWidth) {
		return `min-width: ${minWidth}px;`;
	} else {
		return '';
	}
}

function maxWidth({ maxWidth }: WrapperProps) {
	if (maxWidth) {
		return `max-width: ${maxWidth}px; margin: 0 auto;`;
	} else {
		return 'margin: 0 auto;';
	}
}

function getInteractiveStyles({ isInteractive, frameStyle }: WrapperProps) {
	return isInteractive
		? `
      &:hover {
        ${frameStyle !== 'hide' && visibleStyles}

      }
      &:active {
        background-color: ${token('color.background.selected', colors.B50)};
      }
    `
		: '';
}

function selected({ isSelected, frameStyle }: WrapperProps) {
	return isSelected && frameStyle !== 'hide'
		? `
    ${visibleStyles}
    &::after {
      cursor: pointer;
      box-shadow: 0 0 0 3px ${token('color.border.selected', colors.B100)};
      content: '';
      border: none;
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      ${wrapperBorderRadius}
    }
    `
		: isSelected && frameStyle === 'hide'
			? contentBorderRadius
			: '';
}

const height = ({ inheritDimensions }: WrapperProps) =>
	inheritDimensions ? 'height: 100%;' : `height: ${gridSize(54)}`;

const wrapperStyles = (props: WrapperProps) => `
  ${wrapperBorderRadius}
  ${minWidth(props)}
  ${maxWidth(props)}
  ${getInteractiveStyles(props)}
  ${visible(props)}
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family: ${fontFamily()};
  width: 100%;
  user-select: none;
  line-height: initial;
  transition: background 0.3s;
  position: relative;
  ${height(props)};
  ${selected(props)}

  &:after {
    content: '';
    transition: background 0.3s, box-shadow 0.3s;
    position: absolute;
    height: calc(100% + ${token('space.100', '8px')});
    ${wrapperBorderRadius}

    ${wrapperSizing(props)}
  }
`;

// if frameStyle !== 'show' then set the width of the frame to be
// 100% of the content +16px and position it left -8px to make it appear
// outside the container
const wrapperSizing = ({ frameStyle }: WrapperProps) =>
	frameStyle === 'show'
		? `
    box-sizing: border-box;
    width: 100%;`
		: `
    width: calc(100% + ${token('space.200', '16px')});
    left: ${token('space.negative.100', '-8px')};`;

const visibleStyles = `
  &:after {
    border: 1px solid ${token('color.border', N40)};
    background-color: ${token('elevation.surface.raised', 'white')};
  }
  .embed-header {
    opacity: 1;
  }`;

function visible({ frameStyle }: WrapperProps) {
	return frameStyle === 'show' ? visibleStyles : '';
}

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const LinkWrapper = styled.div`
	${(props: WrapperProps) => wrapperStyles(props)} &:hover {
		text-decoration: none;
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const Wrapper = styled.div<WrapperProps>((props) => wrapperStyles(props), {
	// We are keeping this margin as a hardcoded variable as it is not a standard token size and needs
	// to be thoroughly checked with a designer so that we do not miss an unintended visual change
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginTop: '10px',
});

export interface HeaderProps {
	frameStyle?: FrameStyle;
}

export const embedHeaderHeight = 32;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Header = styled.div(
	{
		height: `${embedHeaderHeight}px`,
		position: 'absolute',
		zIndex: 1,
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.icon', colors.N300),
		opacity: 0,
		transition: '300ms opacity cubic-bezier(0.15, 1, 0.3, 1)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ frameStyle }: HeaderProps) =>
		frameStyle === 'show'
			? `
        box-sizing: border-box;
        padding: 0 ${token('space.100', '8px')};
      `
			: '',
);

export interface PlaceholderProps {
	isPlaceholder: boolean;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const IconWrapper = styled.div(
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	csssize(16),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ isPlaceholder }: PlaceholderProps) => {
		if (isPlaceholder) {
			return `
			${/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */ ''}
      background-color: ${token('color.skeleton', colors.N30)};
    `;
		} else {
			return '';
		}
	},
	{
		marginRight: token('space.050', '4px'),
	},
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TextWrapper = styled.div(
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ isPlaceholder }: PlaceholderProps) => {
		if (isPlaceholder) {
			return `
        ${borderRadius}
        width: 125px;
        height: 12px;
${/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */ ''}
        background-color: ${token('color.skeleton', colors.N30)};
      `;
		} else {
			return '';
		}
	},
	{
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.subtlest', colors.N300),
		fontSize: '12px',
		lineHeight: '16px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	ellipsis('none'),
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TooltipWrapper = styled.div({
	overflow: 'hidden',
});

export interface ContentProps {
	isInteractive: boolean;
	/**
	 * Whether to show a scroll bar (use overflow: auto) or hide overflow (overflow:hidden).
	 * Always set to true for unresolved embeds, otherwise the connect account button may be hidden and unreachable.
	 */
	allowScrollBar: boolean;
	/**
	 * Remove the overflow: ... CSS property altogether.
	 */
	removeOverflow?: boolean;
	frameStyle?: FrameStyle;
}

// NB: `overflow` is kept as `hidden` since
// the internal contents of the `iframe` should
// manage scrolling behaviour.
// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Content = styled.div`
	${contentBorderRadius};
	border: 1px solid ${token('color.border', N40)};
	background-color: ${token('elevation.surface.raised', 'white')};
	position: absolute;
	z-index: 1;
	width: 100%;
	transition: box-shadow 0.3s;

	> .calc-height > div > div {
		left: unset !important;
		width: unset !important;
		height: unset !important;
		position: initial !important;
		padding-bottom: unset !important;
	}
	> .embed-preview > div {
		margin: 0 auto;
	}

	${({ allowScrollBar, removeOverflow }: ContentProps) => {
		if (removeOverflow) {
			return '';
		}
		return allowScrollBar ? 'overflow: auto;' : 'overflow: hidden;';
	}}

	${({ frameStyle }: ContentProps) =>
		frameStyle === 'show'
			? `
        width: calc(100% - ${token('space.200', '16px')} - 2px);
        margin: 0 ${token('space.100', '8px')} ${token('space.100', '8px')};
      `
			: ''}

  ${({ frameStyle }: ContentProps) =>
		frameStyle === 'hide'
			? 'height: 100%;'
			: `
        height: calc(100% - ${token('space.400', '32px')});
        top: ${token('space.400', '32px')};
      `}
`;

export interface ImageProps {
	size: number;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const Image = styled.img(({ size }: ImageProps) => csssize(size), borderRadius, {
	overflow: 'hidden',
});

export const maxAvatarCount = 6;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ContentWrapper = styled.div({
	display: 'flex',
	flexDirection: 'row',
	boxSizing: 'border-box',
	padding: `${token('space.100', '8px')} ${token('space.150', '12px')} ${token(
		'space.150',
		'12px',
	)} ${token('space.150', '12px')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Title = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text', colors.N900),
	fontSize: '16px',
	fontWeight: 500,
	lineHeight: 20 / 16,
	maxHeight: `${20 * 4}px`,
	overflow: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Byline = styled.div(
	{
		marginTop: token('space.050', '4px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.subtlest', colors.N300),
		fontSize: '12px',
		fontWeight: 'normal',
		lineHeight: 16 / 12,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	ellipsis('100%'),
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Description = styled.div({
	marginTop: `calc(${token('space.100', '8px')} - 1px)`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text', colors.N800),
	fontSize: '12px',
	fontWeight: 'normal',
	lineHeight: 18 / 12,
	maxHeight: `${18 * 3}px`,
	overflow: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ResolvedViewIconWrapper = styled.div({
	marginTop: token('space.050', '4px'),
});

export interface ThumbnailProps {
	src: string;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const Thumbnail = styled.div<ThumbnailProps>(borderRadius, csssize(48), (props) => ({
	float: 'right',
	margin: `${token('space.050', '4px')} 0 ${token(
		'space.150',
		'12px',
	)} ${token('space.150', '12px')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.skeleton', colors.N30),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundImage: `url(${props.src})`,
	backgroundSize: 'cover',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const UsersWrapper = styled.div({
	marginTop: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ActionsWrapper = styled.div({
	marginTop: token('space.100', '8px'),
	textAlign: 'right',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		marginTop: token('space.050', '4px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> * + *': {
		marginLeft: token('space.050', '4px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AlertWrapper = styled.div({
	position: 'absolute',
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	overflow: 'hidden',
	pointerEvents: 'none',
	zIndex: maxAvatarCount + 1,
});
