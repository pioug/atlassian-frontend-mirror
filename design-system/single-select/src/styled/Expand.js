import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const Expand = styled.div`
  align-items: center;
  display: flex;
  flex: 0 0 ${3 * gridSize()}px;
  justify-content: center;
  margin: 0 ${gridSize}px;
`;

Expand.displayName = 'SingleSelectExpand';

export default Expand;
