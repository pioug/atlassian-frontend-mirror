import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import {
  backgroundOnLayer,
  backgroundHover,
  backgroundActive,
} from '@atlaskit/theme/colors';
import { BORDER_WIDTH, SizeType } from '@atlaskit/avatar';

const gutterUnitless = gridSize() / 2;
const gutter = `${gutterUnitless}px`;

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  line-height: 1;
  margin-left: -${gutter};
  margin-right: -${gutter};

  > * {
    margin-bottom: ${gridSize};
    padding-left: ${gutter};
    padding-right: ${gutter};
  }
`;

export const Stack = styled.div<{ size: SizeType }>`
  display: flex;
  line-height: 1;
  /* Balance the negative margin of the children */
  margin-right: ${props => BORDER_WIDTH[props.size] * 2 + gutterUnitless}px;

  > * {
    margin-right: -${props => BORDER_WIDTH[props.size] * 2 + gutterUnitless}px;
  }
`;

export function getBackgroundColor({
  isActive,
  isHover,
}: {
  isActive: boolean;
  isHover: boolean;
}) {
  let themedBackgroundColor = backgroundOnLayer;

  if (isHover) {
    themedBackgroundColor = backgroundHover;
  }

  if (isActive) {
    themedBackgroundColor = backgroundActive;
  }

  return themedBackgroundColor;
}
