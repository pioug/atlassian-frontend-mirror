/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { keyframes } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { WHATS_NEW_ITEM_TYPES } from '../model/WhatsNew';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const DividerLine = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.border', colors.N30A),
	height: '2px',
	width: '100%',
	padding: `0 ${token('space.200', '16px')}`,
	marginTop: token('space.200', '16px'),
	boxSizing: 'border-box',
});

/**
 * Loading container
 */

type LoadingRectangleProps = {
	contentWidth?: string;
	contentHeight?: string;
	marginTop?: string;
};

const shimmer = keyframes({
	'0%': {
		backgroundPosition: '-300px 0',
	},
	'100%': {
		backgroundPosition: '1000px 0',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const LoadingRectangle = styled.div<LoadingRectangleProps>((props) => ({
	display: 'inline-block',
	verticalAlign: 'middle',
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: props.contentHeight ? props.contentHeight : '1rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	marginTop: props.marginTop ? props.marginTop : gridSize() + 'px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: props.contentWidth ? props.contentWidth : '100%',
	borderRadius: '2px',
	animationDuration: '1.2s',
	animationFillMode: 'forwards',
	animationIterationCount: 'infinite',
	animationName: shimmer,
	animationTimingFunction: 'linear',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.neutral', colors.N30),
	backgroundImage: `linear-gradient( to right, ${token(
		'color.background.neutral.subtle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		colors.N30,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	)} 10%, ${token('color.background.neutral', colors.N40)} 20%, ${token(
		'color.background.neutral.subtle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		colors.N30,
	)} 30% )`,
	backgroundRepeat: 'no-repeat',
}));

/**
 * Loading Circle
 */
type LoadingCircleProps = {
	radius?: string;
	marginTop?: string;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const LoadingCircle = styled.div<LoadingCircleProps>((props) => ({
	display: 'inline-block',
	verticalAlign: 'middle',
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	height: props.radius ? props.radius : `${gridSize() * 4}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginTop: props.marginTop ? props.marginTop : '',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	width: props.radius ? props.radius : `${gridSize() * 4}px`,
	borderRadius: '50%',
	animationDuration: '1.2s',
	animationFillMode: 'forwards',
	animationIterationCount: 'infinite',
	animationName: shimmer,
	animationTimingFunction: 'linear',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.neutral', colors.N30),
	backgroundImage: `linear-gradient( to right, ${token(
		'color.background.neutral.subtle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		colors.N30,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	)} 10%, ${token('color.background.neutral', colors.N40)} 20%, ${token(
		'color.background.neutral.subtle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		colors.N30,
	)} 30% )`,
	backgroundRepeat: 'no-repeat',
}));

/**
 * What's new icon
 */
type WhatsNewTypeIconProps = {
	type?: WHATS_NEW_ITEM_TYPES;
};

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewTypeIcon = styled.div<WhatsNewTypeIconProps>`
	display: inline-block;
	vertical-align: middle;
	position: relative;
	height: ${token('space.200', '16px')};
	width: ${token('space.200', '16px')};
	border-radius: 2px;
	background-color: ${({ type }) => {
		switch (type) {
			case WHATS_NEW_ITEM_TYPES.IMPROVEMENT:
				return token('color.icon.warning', colors.Y200);

			case WHATS_NEW_ITEM_TYPES.NEW_FEATURE:
				return token('color.icon.success', colors.G300);

			case WHATS_NEW_ITEM_TYPES.FIX:
				return token('color.icon.information', colors.B500);

			case WHATS_NEW_ITEM_TYPES.EXPERIMENT:
				return token('color.icon.discovery', colors.P500);

			case WHATS_NEW_ITEM_TYPES.REMOVED:
				return token('color.icon.disabled', colors.N700);

			default:
				return token('color.icon', colors.N400);
		}
	}};

	& > img {
		width: calc(100% - ${gridSize() / 2}px);
		height: calc(100% - ${gridSize() / 2}px);
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		& > svg {
			height: 100%;
			width: 100%;
		}
	}
`;
