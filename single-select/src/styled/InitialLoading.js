import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

const InitialLoadingElement = styled.div`
  padding: 6px ${multiply(gridSize, 3)}px;
`;

InitialLoadingElement.displayName = 'InitialLoadingElement';

export default InitialLoadingElement;
