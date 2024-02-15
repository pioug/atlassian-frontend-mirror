import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const Container = styled.div`
  padding: 100px 50px;
  background-color: ${token('elevation.surface', 'white')};
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
`;
