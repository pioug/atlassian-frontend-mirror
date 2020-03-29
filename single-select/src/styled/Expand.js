import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

const Expand = styled.div`
  align-items: center;
  display: flex;
  flex: 0 0 ${multiply(gridSize, 3)}px;
  justify-content: center;
  margin: 0 ${gridSize}px;
`;

Expand.displayName = 'SingleSelectExpand';

export default Expand;
