/* eslint-disable @atlaskit/ui-styling-standard/no-dynamic-styles */

import { styled } from '@compiled/react';

import { N30 } from '@atlaskit/theme/colors';
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
	marginTop: token('space.050', '4px'),
	marginRight: 0,
	marginBottom: token('space.150', '12px'),
	marginLeft: token('space.150', '12px'),
	backgroundColor: token('color.skeleton', N30),
	backgroundSize: 'cover',
	backgroundImage: (props: ThumbnailProps) => `url(${props.src})`,
});
