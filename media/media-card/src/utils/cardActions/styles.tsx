import { css } from '@emotion/react';

import React, { MouseEvent, HTMLAttributes } from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { N500, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { borderRadius, size, center } from '@atlaskit/media-ui';
import { rootStyles } from '../../card/styles';
import { rgba } from '../../card/styles/mixins';

export const wrapperStyles = css`
  ${rootStyles()}
  display: flex;
  position: relative;
  line-height: 0;
`;

export enum CardActionIconButtonVariant {
  default = 'default',
  filled = 'filled',
}

export type CardActionButtonOwnProps = {
  variant?: CardActionIconButtonVariant;
  style?: { color: string | undefined };
  onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  onMouseDown?: (event: MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
};
export type CardActionButtonProps = CardActionButtonOwnProps &
  HTMLAttributes<HTMLDivElement>;

const getVariantStyles = (variant?: 'default' | 'filled'): string => {
  return variant === 'filled'
    ? `
    background-color: ${token('elevation.surface.overlay', rgba(N0, 0.8))};
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: ${token(
        'elevation.surface.overlay.hovered',
        rgba(N0, 0.6),
      )}
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

export const cardActionButtonStyles = ({
  variant,
}: CardActionButtonProps) => css`
  ${center}
  ${borderRadius}
    ${size(26)}
    color: ${token('color.icon', N500)};

  &:hover {
    cursor: pointer;
  }

  ${getVariantStyles(variant)}
`;
