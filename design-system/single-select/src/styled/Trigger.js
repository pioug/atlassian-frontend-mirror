import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

const Trigger = styled.div`
  align-items: center;
  display: flex;
  min-height: ${multiply(gridSize, 4.5)}px;
  outline: none;
  width: 100%;
`;

Trigger.displayName = 'SingleSelectTrigger';

export default Trigger;
