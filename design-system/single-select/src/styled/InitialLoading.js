import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const InitialLoadingElement = styled.div`
  padding: 6px ${gridSize() * 3}px;
`;

InitialLoadingElement.displayName = 'InitialLoadingElement';

export default InitialLoadingElement;
