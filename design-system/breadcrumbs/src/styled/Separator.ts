import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';

const Separator = styled.div`
  flex-shrink: 0;
  padding: 0 ${gridSize}px;
  text-align: center;
  width: ${gridSize}px;
`;

Separator.displayName = 'Separator';

export default Separator;
