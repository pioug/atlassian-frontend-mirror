import styled, { css } from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

import { flagTextColor } from '../../theme';
import { AppearanceTypes } from '../../types';
import { DEFAULT_APPEARANCE } from '../../constants';

interface GetDividerProps {
  hasDivider: boolean;
  useMidDot: boolean;
}
// Outputs the styles for actions separator: mid-dot for non-bold flags, or space for bold flags.
const getDivider = ({ hasDivider, useMidDot }: GetDividerProps) => css`
  display: ${hasDivider ? 'inline-block' : 'none'};
  content: "${useMidDot ? '\u00B7' : ''}";
  width: ${useMidDot ? multiply(gridSize, 2) : gridSize}px;
`;

export default styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: ${gridSize}px;
  transform: ${({ appearance }: { appearance: AppearanceTypes }) =>
    appearance === DEFAULT_APPEARANCE ? `translateX(-${gridSize() / 2}px)` : 0};
`;

export const Action = styled.div<GetDividerProps>`
  &::before {
    color: ${flagTextColor};
    text-align: center;
    vertical-align: middle;

    ${getDivider};
  }
`;
