/** @jsx jsx */

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { WHATS_NEW_ITEM_TYPES } from '../model/WhatsNew';

export const DividerLine = styled.div`
  background-color: ${token('color.border', colors.N30A)};
  height: 2px;
  width: 100%;
  padding: 0 ${token('space.200', '16px')};
  margin-top: ${token('space.200', '16px')};
  box-sizing: border-box;
`;

/**
 * Loading container
 */

type LoadingRectangleProps = {
  contentWidth?: string;
  contentHeight?: string;
  marginTop?: string;
};

const shimmer = keyframes`
    0% {
        background-position: -300px 0;
    }
    100% {
        background-position: 1000px 0;
    }
`;

export const LoadingRectangle = styled.div<LoadingRectangleProps>`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  height: ${(props) => (props.contentHeight ? props.contentHeight : '1rem')};
  margin-top: ${(props) =>
    props.marginTop ? props.marginTop : gridSize() + 'px'};
  width: ${(props) => (props.contentWidth ? props.contentWidth : '100%')};
  border-radius: 2px;
  animation-duration: 1.2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${shimmer};
  animation-timing-function: linear;
  background-color: ${token('color.background.neutral', colors.N30)};
  background-image: linear-gradient(
    to right,
    ${token('color.background.neutral.subtle', colors.N30)} 10%,
    ${token('color.background.neutral', colors.N40)} 20%,
    ${token('color.background.neutral.subtle', colors.N30)} 30%
  );
  background-repeat: no-repeat;
`;

/**
 * Loading Circle
 */
type LoadingCircleProps = {
  radius?: string;
  marginTop?: string;
};

export const LoadingCircle = styled.div<LoadingCircleProps>`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  height: ${(props) => (props.radius ? props.radius : `${gridSize() * 4}px`)};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '')};
  width: ${(props) => (props.radius ? props.radius : `${gridSize() * 4}px`)};
  border-radius: 50%;
  animation-duration: 1.2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${shimmer};
  animation-timing-function: linear;
  background-color: ${token('color.background.neutral', colors.N30)};
  background-image: linear-gradient(
    to right,
    ${token('color.background.neutral.subtle', colors.N30)} 10%,
    ${token('color.background.neutral', colors.N40)} 20%,
    ${token('color.background.neutral.subtle', colors.N30)} 30%
  );
  background-repeat: no-repeat;
`;

/**
 * What's new icon
 */
type WhatsNewTypeIconProps = {
  type?: WHATS_NEW_ITEM_TYPES;
};

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
