import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const ElemBefore = styled.div`
  display: flex;
  padding-right: ${gridSize}px;
`;

ElemBefore.displayName = 'TriggerElemBefore';

export default ElemBefore;
