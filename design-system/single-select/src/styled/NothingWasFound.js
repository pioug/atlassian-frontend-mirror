import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const NothingWasFoundElement = styled.div`
  padding: 6px ${3 * gridSize()}px;
`;

NothingWasFoundElement.displayName = 'NothingWasFoundElement';

export default NothingWasFoundElement;
