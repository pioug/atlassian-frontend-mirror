import styled from 'styled-components';
import { borderRadius } from '@atlaskit/media-ui';
import { rgba } from '../../../styles/mixins';
import { N0, N400 } from '@atlaskit/theme/colors';
import { getTitleBoxHeight, responsiveSettings } from '../common';
import { Breakpoint } from '../Breakpoint';

const height = 3;
const padding = 1;
const width = 95; // %
const left = (100 - width) / 2; // %

const smallSizeSettings = { marginBottom: 4 };
const largeSizeSettings = { marginBottom: 12 };

export function generateResponsiveStyles(
  breakpoint: Breakpoint,
  positionBottom: boolean,
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
    bottom: ${marginBottom}px
  `;
}

export type StyledBarProps = {
  progress: number;
  breakpoint: Breakpoint;
  positionBottom: boolean;
};

export const StyledBar = styled.div`
  ${({ progress, breakpoint, positionBottom }: StyledBarProps) => `
    ${borderRadius}
    overflow: hidden;
    position: absolute;
    width: ${width}%;
    left: ${left}%;
    background-color: ${rgba(N0, 0.8)};
    height: ${height + padding * 2}px;
    padding: ${padding}px;

    ::before {
      content: '';
      width: ${progress}%;
      height: 100%;
      background-color: ${N400};
      ${borderRadius}
      display: block;
    }

    ${generateResponsiveStyles(breakpoint, positionBottom)}
`}
`;

StyledBar.displayName = 'StyledProgressBar';
