import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { multiply, divide } from '@atlaskit/theme/math';

const TRANSITION_DURATION = '0.25s ease-in-out';

type Appearance = 'warning' | 'error' | 'announcement' | undefined;

interface VisibilityProps {
  bannerHeight: number;
  isOpen?: boolean;
}

interface AppearanceProp {
  appearance: Appearance;
}

/* Container */
export const getMaxHeight = ({ appearance }: AppearanceProp) =>
  appearance === 'announcement' ? '88px' : '52px';

export const backgroundColor = themed('appearance', {
  error: { light: colors.R400, dark: colors.R300 },
  warning: { light: colors.Y300, dark: colors.Y300 },
  announcement: { light: colors.N500, dark: colors.N500 },
});

export const Container = styled.div<AppearanceProp>`
  max-height: ${getMaxHeight};
  overflow: ${({ appearance }) =>
    appearance === 'announcement' ? 'scroll' : 'visible'};
  background-color: ${backgroundColor};
`;

export const testErrorBackgroundColor = colors.R400;
export const testErrorTextColor = colors.N0;

export const textColor = themed('appearance', {
  error: { light: colors.N0, dark: colors.DN40 },
  warning: { light: colors.N700, dark: colors.DN40 },
  announcement: { light: colors.N0, dark: colors.N0 },
});

export const Content = styled.div<AppearanceProp>`
  align-items: center;
  background-color: ${backgroundColor};
  color: ${textColor};
  display: flex;
  fill: ${backgroundColor};
  font-weight: 500;
  justify-content: center;
  padding: ${multiply(gridSize, 1.5)}px;
  text-align: center;
  ${'' /* transition: color ${TRANSITION_DURATION}; */}

  margin: auto;
  ${({ appearance }) =>
    appearance === 'announcement'
      ? 'max-width: 876px;'
      : ''} transition: color ${TRANSITION_DURATION};

  a,
  a:visited,
  a:hover,
  a:active,
  a:focus {
    color: ${textColor};
    text-decoration: underline;
  }
`;

export const Icon = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
`;

const textOverflow = ({ appearance }: AppearanceProp) =>
  appearance === 'announcement'
    ? ''
    : css`
        text-overflow: ellipsis;
        white-space: nowrap;
      `;

export const Visibility = styled.div`
  max-height: ${(props: VisibilityProps) =>
    props.isOpen ? props.bannerHeight : 0}px;
  overflow: hidden;
  transition: max-height ${TRANSITION_DURATION};
`;

export const Text = styled.span`
  flex: 0 1 auto;
  padding: ${divide(gridSize, 2)}px;
  ${textOverflow};
  overflow: hidden;
`;
