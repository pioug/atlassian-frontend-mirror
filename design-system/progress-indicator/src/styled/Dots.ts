import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import { DotsAppearance, Spacing, Size } from '../components/Dots';

const colorMap = {
  default: themed({ light: colors.N50, dark: colors.DN70 }),
  help: themed({ light: colors.P75, dark: colors.DN70 }),
  inverted: themed({ light: 'rgba(255, 255, 255, 0.4)', dark: colors.DN300A }),
  primary: themed({ light: colors.B75, dark: colors.DN70 }),
};
const selectedColorMap = {
  default: themed({ light: colors.N900, dark: colors.DN600 }),
  help: themed({ light: colors.P400, dark: colors.P300 }),
  inverted: themed({ light: colors.N0, dark: colors.DN30 }),
  primary: themed({ light: colors.B400, dark: colors.B100 }),
};
const outlineColorMap = {
  default: themed({ light: colors.B75, dark: colors.B200 }),
  help: themed({ light: colors.P75, dark: colors.P75 }),
  inverted: themed({ light: colors.B200, dark: colors.B75 }),
  primary: themed({ light: colors.B75, dark: colors.B75 }),
};
const sizes = {
  small: 4,
  default: 8,
  large: 12,
};
const spacingDivision = {
  comfortable: 2,
  cozy: 4,
  compact: 8,
};

const getDimensions = ({ gutter, size }: IndicatorButtonProps) => {
  const val = sizes[size];
  const margin = val / spacingDivision[gutter];
  const hitslop = val + margin * 2;

  return css`
    height: ${val}px;
    margin-left: ${margin}px;
    margin-right: ${margin}px;
    position: relative;
    width: ${val}px;

    &::before {
      content: '';
      display: block;
      height: ${hitslop}px;
      left: -${margin}px;
      position: absolute;
      top: -${margin}px;
      width: ${hitslop}px;
    }
  `;
};
const getColor = ({ appearance, selected }: IndicatorButtonProps) =>
  selected ? selectedColorMap[appearance] : colorMap[appearance];

const commonRules = css<IndicatorButtonProps>`
  ${getDimensions} background-color: ${getColor};
  border-radius: 50%;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

interface IndicatorButtonProps {
  selected: boolean;
  appearance: DotsAppearance;
  gutter: Spacing;
  size: Size;
}

export const IndicatorButton = styled.button<IndicatorButtonProps>`
  ${commonRules} border: 0;
  cursor: pointer;
  outline: 0;
  padding: 0;

  ${p =>
    p.selected
      ? css`
          &:focus {
            box-shadow: 0 0 0 2px ${outlineColorMap[p.appearance]};
          }
        `
      : null};
`;
export const IndicatorDiv = styled.div<IndicatorButtonProps>`
  ${commonRules};
`;
