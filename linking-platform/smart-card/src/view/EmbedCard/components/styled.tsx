/* eslint-disable @atlaskit/ui-styling-standard/no-dynamic-styles */

import { styled } from '@compiled/react';

import { B100, B50, N30, N300, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { FrameStyle } from '../types';

export const className = 'media-card-frame';
export const embedHeaderHeight = 32;

export interface WrapperProps {
	minWidth?: number;
	maxWidth?: number;
	isInteractive?: boolean;
	isSelected?: boolean;
	frameStyle?: FrameStyle;
	inheritDimensions?: boolean;
	className?: string;
}

export interface HeaderProps {
	frameStyle?: FrameStyle;
}

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

export interface ImageProps {
	size: number;
}

export interface ThumbnailProps {
	src: string;
}

export interface PlaceholderProps {
	isPlaceholder: boolean;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/ui-styling-standard/no-exported-styles
export const LinkWrapper = styled.div({
	borderRadius: (props: WrapperProps) =>
		props.isSelected && props.frameStyle === 'hide'
			? token('border.radius.100', '4px')
			: token('border.radius.200', '8px'),
	minWidth: (props: WrapperProps) => (props.minWidth ? `${props.minWidth}px` : ''),
	maxWidth: (props: WrapperProps) => (props.maxWidth ? `${props.maxWidth}px` : ''),
	'&:hover': {
		'&::after': {
			border: (props: WrapperProps) =>
				props.isInteractive && props.frameStyle !== 'hide'
					? `1px solid ${token('color.border', N40)}`
					: '',
			backgroundColor: (props: WrapperProps) =>
				props.isInteractive && props.frameStyle !== 'hide'
					? token('elevation.surface.raised', 'white')
					: '',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.embed-header': {
			opacity: (props: WrapperProps) =>
				props.isInteractive && props.frameStyle !== 'hide' ? 1 : 0,
		},
		textDecoration: 'none',
	},
	'&:active': {
		backgroundColor: (props: WrapperProps) =>
			props.isInteractive ? token('color.background.selected', B50) : '',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.embed-header': {
		opacity: (props: WrapperProps) =>
			props.frameStyle === 'show' || (props.isSelected && props.frameStyle !== 'hide') ? 1 : 0,
	},
	margin: '0 auto',
	display: 'inline-flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
	fontFamily: token('font.family.body'),
	width: '100%',
	userSelect: 'none',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 'initial',
	transition: 'background 0.3s',
	position: 'relative',
	height: (props: WrapperProps) => (props.inheritDimensions ? '100%' : '432px'),
	'&::after': {
		content: '',
		transition: `background 0.3s, box-shadow 0.3s`,
		position: 'absolute',
		height: `calc(100% + ${token('space.100', '8px')})`,
		borderRadius: token('border.radius.200', '8px'),
		boxSizing: (props: WrapperProps) => (props.frameStyle === 'show' ? 'border-box' : undefined),
		width: (props: WrapperProps) =>
			props.frameStyle === 'show' ? '100%' : `calc(100% + ${token('space.200', '16px')})`,
		left: (props: WrapperProps) =>
			props.frameStyle !== 'show'
				? token('space.negative.100', '-8px')
				: props.isSelected
					? 0
					: 'inherit',
		border: (props: WrapperProps) =>
			props.frameStyle === 'show' || (props.isSelected && props.frameStyle !== 'hide')
				? `1px solid ${token('color.border', N40)}`
				: 'inherit',
		backgroundColor: (props: WrapperProps) =>
			props.frameStyle === 'show' || (props.isSelected && props.frameStyle !== 'hide')
				? token('elevation.surface.raised', 'white')
				: 'inherit',
		cursor: (props: WrapperProps) =>
			props.isSelected && props.frameStyle !== 'hide' ? 'pointer' : 'inherit',
		boxShadow: (props: WrapperProps) =>
			props.isSelected && props.frameStyle !== 'hide'
				? `0 0 0 3px ${token('color.border.selected', B100)}`
				: 'inherit',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/ui-styling-standard/no-exported-styles
export const Wrapper = styled.div({
	borderRadius: (props: WrapperProps) =>
		props.isSelected && props.frameStyle === 'hide'
			? token('border.radius.100', '4px')
			: token('border.radius.200', '8px'),
	minWidth: (props: WrapperProps) => (props.minWidth ? `${props.minWidth}px` : ''),
	maxWidth: (props: WrapperProps) => (props.maxWidth ? `${props.maxWidth}px` : ''),
	'&:hover': {
		'&::after': {
			border: (props: WrapperProps) =>
				props.isInteractive && props.frameStyle !== 'hide'
					? `1px solid ${token('color.border', N40)}`
					: '',
			backgroundColor: (props: WrapperProps) =>
				props.isInteractive && props.frameStyle !== 'hide'
					? token('elevation.surface.raised', 'white')
					: '',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.embed-header': {
			opacity: (props: WrapperProps) =>
				props.isInteractive && props.frameStyle !== 'hide' ? 1 : 0,
		},
	},
	'&:active': {
		backgroundColor: (props: WrapperProps) =>
			props.isInteractive ? token('color.background.selected', B50) : '',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.embed-header': {
		opacity: (props: WrapperProps) =>
			props.frameStyle === 'show' || (props.isSelected && props.frameStyle !== 'hide') ? 1 : 0,
	},
	margin: '0 auto',
	display: 'inline-flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
	fontFamily: token('font.family.body'),
	width: '100%',
	userSelect: 'none',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 'initial',
	transition: 'background 0.3s',
	position: 'relative',
	height: (props: WrapperProps) => (props.inheritDimensions ? '100%' : '432px'),
	'&::after': {
		content: '',
		transition: `background 0.3s, box-shadow 0.3s`,
		position: 'absolute',
		height: `calc(100% + ${token('space.100', '8px')})`,
		borderRadius: token('border.radius.200', '8px'),
		boxSizing: (props: WrapperProps) => (props.frameStyle === 'show' ? 'border-box' : undefined),
		width: (props: WrapperProps) =>
			props.frameStyle === 'show' ? '100%' : `calc(100% + ${token('space.200', '16px')})`,
		left: (props: WrapperProps) =>
			props.frameStyle !== 'show'
				? token('space.negative.100', '-8px')
				: props.isSelected
					? 0
					: 'inherit',
		border: (props: WrapperProps) =>
			props.frameStyle === 'show' || (props.isSelected && props.frameStyle !== 'hide')
				? `1px solid ${token('color.border', N40)}`
				: 'inherit',
		backgroundColor: (props: WrapperProps) =>
			props.frameStyle === 'show' ? token('elevation.surface.raised', 'white') : 'inherit',
		cursor: (props: WrapperProps) =>
			props.isSelected && props.frameStyle !== 'hide' ? 'pointer' : 'inherit',
		boxShadow: (props: WrapperProps) =>
			props.isSelected && props.frameStyle !== 'hide'
				? `0 0 0 3px ${token('color.border.selected', B100)}`
				: 'inherit',
	},
	// We are keeping this margin as a hardcoded variable as it is not a standard token size and needs
	// to be thoroughly checked with a designer so that we do not miss an unintended visual change
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
	marginTop: '10px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/ui-styling-standard/no-exported-styles
export const Header = styled.div({
	height: `32px`,
	position: 'absolute',
	zIndex: 1,
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.icon', N300),
	opacity: 0,
	transition: '300ms opacity cubic-bezier(0.15, 1, 0.3, 1)',
	boxSizing: (props: HeaderProps) => (props.frameStyle === 'show' ? 'border-box' : ''),
	padding: (props: HeaderProps) =>
		props.frameStyle === 'show' ? `0 ${token('space.100', '8px')}` : '',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/ui-styling-standard/no-exported-styles
export const IconWrapper = styled.div({
	borderRadius: token('border.radius', '3px'),
	width: '16px',
	height: '16px',
	marginRight: token('space.050', '4px'),
	backgroundColor: (props: PlaceholderProps) =>
		props.isPlaceholder ? token('color.skeleton', N30) : '',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/ui-styling-standard/no-exported-styles
export const TextWrapper = styled.div({
	borderRadius: (props: PlaceholderProps) =>
		props.isPlaceholder ? token('border.radius', '3px') : '',
	width: (props: PlaceholderProps) => (props.isPlaceholder ? '125px' : ''),
	height: (props: PlaceholderProps) => (props.isPlaceholder ? '12px' : ''),
	backgroundColor: (props: PlaceholderProps) =>
		props.isPlaceholder ? token('color.skeleton', N30) : '',
	color: token('color.text.subtlest', N300),
	font: token('font.body.UNSAFE_small'),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/ui-styling-standard/no-exported-styles
export const TooltipWrapper = styled.div({
	overflow: 'hidden',
});

// NB: `overflow` is kept as `hidden` since
// the internal contents of the `iframe` should
// manage scrolling behaviour.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/ui-styling-standard/no-exported-styles
export const Content = styled.div({
	borderRadius: token('border.radius.100', '4px'),
	border: `1px solid ${token('color.border', N40)}`,
	backgroundColor: token('elevation.surface.raised', 'white'),
	position: 'absolute',
	zIndex: 1,
	transition: 'box-shadow 0.3s',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'> .embed-preview > div': {
		margin: '0 auto',
	},
	overflow: (props: ContentProps) =>
		!props.removeOverflow ? (props.allowScrollBar ? 'auto' : 'hidden') : '',
	width: (props: ContentProps) =>
		props.frameStyle === 'show' ? `calc(100% - ${token('space.200', '16px')} - 2px)` : '100%',
	margin: (props: ContentProps) =>
		props.frameStyle === 'show'
			? `0 ${token('space.100', '8px')} ${token('space.100', '8px')}`
			: '',
	height: (props: ContentProps) =>
		props.frameStyle === 'hide' ? `100%;` : `calc(100% - ${token('space.400', '32px')})`,
	top: (props: ContentProps) => (props.frameStyle !== 'hide' ? token('space.400', '32px') : ''),
});

const getSizeWithUnit = (value: string | number = '100%') => {
	const unit = typeof value === 'number' ? 'px' : '';
	return `${value}${unit}`;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/ui-styling-standard/no-exported-styles
export const Image = styled.img({
	borderRadius: token('border.radius', '3px'),
	overflow: 'hidden',
	width: (props: ImageProps) => getSizeWithUnit(props.size),
	height: (props: ImageProps) => getSizeWithUnit(props.size),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/ui-styling-standard/no-exported-styles
export const Thumbnail = styled.div({
	borderRadius: token('border.radius', '3px'),
	width: '48px',
	height: '48px',
	float: 'right',
	margin: `${token('space.050', '4px')} 0 ${token('space.150', '12px')} ${token('space.150', '12px')}`,
	backgroundColor: token('color.skeleton', N30),
	backgroundSize: 'cover',
	backgroundImage: (props: ThumbnailProps) => `url(${props.src})`,
});
