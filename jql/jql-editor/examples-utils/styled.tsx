import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

export const Container = styled.div({
  padding: `${token('space.1000', '80px')} ${token('space.600', '64px')}`,
  backgroundColor: token('elevation.surface', 'white'),
  height: '100vh',
  width: '100vw',
  boxSizing: 'border-box',
});
