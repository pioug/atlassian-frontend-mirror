import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const Content = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  margin: ${gridSize}px 6px;
  white-space: nowrap;
`;

Content.displayName = 'SingleSelectContent';

export default Content;
