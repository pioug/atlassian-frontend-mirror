import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const LocaleSelectorWrapper = styled.div`
  position: fixed;
  right: ${token('space.250', '20px')};
  top: ${token('space.250', '20px')};
  width: 200px;
  border: 1px solid ${token('color.border', '#ccc')};
  padding: 10px;
  border-radius: 3px;
  background-color: ${token('elevation.surface', 'white')};

  h2 {
    margin-bottom: 10px;
  }
`;
