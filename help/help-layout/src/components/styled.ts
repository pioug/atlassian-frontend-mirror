/** @jsx jsx */

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${token('elevation.surface', '#FFFFFF')};
`;

export const Section = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const DividerLine = styled.div`
  background-color: ${token('color.border', colors.N30A)};
  height: 2px;
  width: 100%;
  padding: 0 ${token('space.200', '16px')};
  margin-top: ${token('space.200', '16px')};
  box-sizing: border-box;
`;

const FOOTER_BORDER_TOP = 2;
export const HelpFooter = styled.div`
  padding: ${token('space.100', '8px')} 0;
  box-sizing: border-box;
  background-color: ${token('color.background.neutral', colors.N10)};
  border-top: ${FOOTER_BORDER_TOP}px solid ${token('color.border', colors.N30)};
  justify-content: space-between;
`;

/**
 * Loading
 */

export const LoadingContainer = styled.div`
  padding: ${token('space.200', '16px')};
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
    props.marginTop ? props.marginTop : token('space.100', '8px')};
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
