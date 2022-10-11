import { css } from '@emotion/react';

import React, { MouseEvent, HTMLAttributes } from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { N500, N0 } from '@atlaskit/theme/colors';
import { borderRadius, size, center } from '@atlaskit/media-ui';
import { rootStyles } from '../../card/styles';

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
    background: ${N0};
    margin-right: 8px;
    opacity: 0.8;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      opacity: 0.6;
    }
  `
    : `
    &:hover {
      background-color: rgba(9, 30, 66, 0.06);
    }
  `;
};

export const cardActionButtonStyles = ({
  variant,
}: CardActionButtonProps) => css`
  ${center}
  ${borderRadius}
    ${size(26)}
    color: ${N500};

  &:hover {
    cursor: pointer;
  }

  ${getVariantStyles(variant)}
`;
