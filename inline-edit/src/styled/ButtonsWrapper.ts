import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const ButtonsWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  margin-top: ${gridSize() - 2}px;
  position: absolute;
  right: 0;
  top: 100%;
`;

ButtonsWrapper.displayName = 'ButtonsWrapper';

export default ButtonsWrapper;
