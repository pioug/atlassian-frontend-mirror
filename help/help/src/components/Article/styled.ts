/** @jsx jsx */

import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ArticleContainer = styled.div({
  padding: `${token('space.200', '16px')} ${token('space.300', '24px')}`,
  position: 'absolute',
  height: '100%',
  width: '100%',
  top: 0,
  backgroundColor: token('elevation.surface', '#FFFFFF'),
  left: '100%',
  flex: 1,
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  overflowY: 'auto',
  zIndex: 2,
});
