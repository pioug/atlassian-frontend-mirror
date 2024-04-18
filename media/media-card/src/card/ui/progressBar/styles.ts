import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/media-ui';
import { rgba } from '../styles';
import { N0 } from '@atlaskit/theme/colors';
import { Breakpoint, getTitleBoxHeight, responsiveSettings } from '../common';
import { StyledBarProps } from './types';

const height = 3;
const padding = 1;
const width = 95; // %
const left = (100 - width) / 2; // %

const smallSizeSettings = { marginBottom: 4 };
const largeSizeSettings = { marginBottom: 12 };

export function generateResponsiveStyles(
  breakpoint: Breakpoint,
  positionBottom: boolean,
  showOnTop: boolean,
  multiplier: number = 1,
) {
  const setting =
    breakpoint === Breakpoint.SMALL ? smallSizeSettings : largeSizeSettings;
  const marginPositionBottom =
    responsiveSettings[breakpoint].titleBox.verticalPadding;
  const marginBottom =
    setting.marginBottom * multiplier +
    (positionBottom ? marginPositionBottom : getTitleBoxHeight(breakpoint));
  return `
    ${showOnTop ? 'top' : 'bottom'}: ${marginBottom}px
  `;
}

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const getStyledBarStylesBasedOnProps = ({
  progress,
  breakpoint,
  positionBottom,
  showOnTop,
}: StyledBarProps) => `
${borderRadius}
overflow: hidden;
position: absolute;
width: ${width}%;
left: ${left}%;
background-color: ${rgba(N0, 0.8)};
height: ${height + padding * 2}px;
padding: ${padding}px;
box-sizing: border-box;

::before {
  content: '';
  width: ${progress}%;
  height: 100%;
  background-color: #44546F;
  ${borderRadius}
  display: block;
}
${generateResponsiveStyles(breakpoint, positionBottom, showOnTop)}
`;
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

export const styledBarStyles = (props: StyledBarProps) => {
  return css(getStyledBarStylesBasedOnProps(props));
};

styledBarStyles.displayName = 'StyledProgressBar';
