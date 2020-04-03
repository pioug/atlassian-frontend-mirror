import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

const NothingWasFoundElement = styled.div`
  padding: 6px ${multiply(gridSize, 3)}px;
`;

NothingWasFoundElement.displayName = 'NothingWasFoundElement';

export default NothingWasFoundElement;
