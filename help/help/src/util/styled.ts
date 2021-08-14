/** @jsx jsx */

import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { keyframes } from '@emotion/core';
import { WHATS_NEW_ITEM_TYPES } from '../model/WhatsNew';

export const DividerLine = styled.div`
  background-color: ${colors.N30A};
  height: 2px;
  width: 100%;
  padding: 0 ${2 * gridSize()}px;
  margin-top: ${gridSize() * 2}px;
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
  background-color: ${colors.N30};
  background-image: linear-gradient(
    to right,
    ${colors.N30} 10%,
    ${colors.N40} 20%,
    ${colors.N30} 30%
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
  background-color: ${colors.N30};
  background-image: linear-gradient(
    to right,
    ${colors.N30} 10%,
    ${colors.N40} 20%,
    ${colors.N30} 30%
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
  height: ${gridSize() * 4}px;
  width: ${gridSize() * 4}px;
  border-radius: 50%;
  background-color: ${({ type }) => {
    switch (type) {
      case WHATS_NEW_ITEM_TYPES.IMPROVEMENT:
        return colors.Y200;

      case WHATS_NEW_ITEM_TYPES.NEW_FEATURE:
        return colors.G300;

      case WHATS_NEW_ITEM_TYPES.FIX:
        return colors.B500;

      case WHATS_NEW_ITEM_TYPES.EXPERIMENT:
        return colors.P500;

      case WHATS_NEW_ITEM_TYPES.REMOVED:
        return colors.N700;

      default:
        return colors.N400;
    }
  }};

  & > img {
    width: ${gridSize() * 2}px;
    height: ${gridSize() * 2}px;
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
