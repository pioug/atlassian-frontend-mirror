import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const Trigger = styled.div`
  align-items: center;
  display: flex;
  min-height: ${gridSize() * 4.5}px;
  outline: none;
  width: 100%;
`;

Trigger.displayName = 'SingleSelectTrigger';

export default Trigger;
