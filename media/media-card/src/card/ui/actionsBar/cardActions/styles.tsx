import { css } from '@emotion/react';

import { type MouseEvent, type HTMLAttributes } from 'react';
import type React from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { N500, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { borderRadius, size, center } from '@atlaskit/media-ui';
import { rgba } from '../../styles';
import { fontFamily } from '@atlaskit/theme/constants';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const wrapperStyles = css({
	boxSizing: 'border-box',
	fontFamily: fontFamily(),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'*': {
		boxSizing: 'border-box',
	},
	display: 'flex',
	position: 'relative',
	lineHeight: 0,
});

export enum CardActionIconButtonVariant {
	default = 'default',
	filled = 'filled',
}

export type CardActionButtonOwnProps = {
	variant?: CardActionIconButtonVariant;
	label?: string;
	style?: { color: string | undefined };
	onClick?: (event: React.MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent) => void;
	onMouseDown?: (event: MouseEvent<HTMLButtonElement>) => void;
	children?: React.ReactNode;
};
export type CardActionButtonProps = CardActionButtonOwnProps & HTMLAttributes<HTMLButtonElement>;

const getVariantStyles = (variant?: 'default' | 'filled'): string => {
	return variant === 'filled'
		? `
    background-color: ${token('elevation.surface.overlay', rgba(N0, 0.8))};
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: ${token('elevation.surface.overlay.hovered', rgba(N0, 0.6))}
    }
  `
		: `
    &:hover {
      background-color: ${token(
				'color.background.neutral.subtle.hovered',
				'rgba(9, 30, 66, 0.06)',
			)};
    }
  `;
};

export const cardActionButtonStyles = ({ variant }: CardActionButtonProps) =>
	css(
		{
			appearance: 'none',
			border: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		center,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderRadius,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		size(26),
		{
			color: token('color.icon', N500),
			'&:hover': {
				cursor: 'pointer',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		getVariantStyles(variant),
	);
