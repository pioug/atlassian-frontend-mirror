import styled from 'styled-components';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { N0 } from '@atlaskit/theme/colors';
import { e200 } from '@atlaskit/theme/elevation';

const gridSizeUnitless = gridSize();

const ButtonWrapper = styled.div`
  ${e200};
  background-color: ${N0};
  border-radius: ${gridSizeUnitless / 2 - 1}px;
  box-sizing: border-box;
  font-size: ${fontSize()}px;
  width: ${gridSizeUnitless * 4}px;
  z-index: 200;

  &:last-child {
    margin-left: ${gridSizeUnitless / 2}px;
  }
`;

ButtonWrapper.displayName = 'ButtonWrapper';

export default ButtonWrapper;
