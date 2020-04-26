import styled from 'styled-components';

import { N800 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

const Description = styled.p`
  color: ${N800};
  margin-top: 0;
  margin-bottom: ${gridSize() * 3}px;
`;

export default Description;
