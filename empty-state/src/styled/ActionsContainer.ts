import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: ${5 * gridSize()}px;
  margin-bottom: ${gridSize()}px;
`;

export default ActionsContainer;
