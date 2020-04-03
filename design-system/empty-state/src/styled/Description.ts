import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N800 } from '@atlaskit/theme/colors';

const Description = styled.p`
  color: ${N800};
  margin-top: 0;
  margin-bottom: ${gridSize() * 3}px;
`;

export default Description;
