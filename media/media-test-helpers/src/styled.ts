import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

export const LocaleSelectorWrapper = styled.div`
  position: fixed;
  right: 20px;
  top: 20px;
  width: 200px;
  border: 1px solid ${token('color.border', '#ccc')};
  padding: 10px;
  border-radius: 3px;
  background-color: ${token('elevation.surface', 'white')};

  h2 {
    margin-bottom: 10px;
  }
`;
