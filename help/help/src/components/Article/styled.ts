/** @jsx jsx */

import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

type ArticleContainerProps = {
  isSearchVisible: boolean;
};

export const ArticleContainer = styled.div<ArticleContainerProps>`
  padding: ${gridSize() * 2}px ${gridSize() * 3}px;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: #ffffff;
  left: 100%;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
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
