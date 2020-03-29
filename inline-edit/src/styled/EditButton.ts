import styled from 'styled-components';
import { B100, N0 } from '@atlaskit/theme/colors';

const EditButton = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  display: inline-block;
  line-height: 1;
  margin: 0;
  padding: 0;
  outline: 0;

  &:focus + div {
    border: 2px solid ${B100};
    background: ${N0};
  }
`;

EditButton.displayName = 'EditButton';

export default EditButton;
