import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N40 } from '@atlaskit/theme/colors';

export default styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid ${N40};
  padding: ${gridSize()}px 0;
`;
