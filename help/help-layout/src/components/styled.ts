/** @jsx jsx */

import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

export const Section = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const DividerLine = styled.div`
  background-color: ${colors.N30A};
  height: 2px;
  width: 100%;
  padding: 0 ${2 * gridSize()}px;
  margin-top: ${gridSize() * 2}px;
  box-sizing: border-box;
`;

const FOOTER_BORDER_TOP = 2;
export const HelpFooter = styled.div`
  padding: ${gridSize()}px 0;
  box-sizing: border-box;
  background-color: ${colors.N10};
  border-top: ${FOOTER_BORDER_TOP}px solid ${colors.N30};
  justify-content: space-between;
`;

/**
 * Loading
 */

export const LoadingContainer = styled.div`
  padding: ${2 * gridSize()}px;
  height: 100%;
`;

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
