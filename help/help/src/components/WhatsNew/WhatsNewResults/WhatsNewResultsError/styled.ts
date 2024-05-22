/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const SearchResultEmptyMessageImage = styled.div({
  padding: `${token('space.300', '24px')} ${token(
    'space.300',
    '24px',
  )} 0 ${token('space.300', '24px')}`,
  textAlign: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const SearchResultEmptyMessageText = styled.div({
  padding: `${token('space.300', '24px')} ${token(
    'space.300',
    '24px',
  )} 0 ${token('space.300', '24px')}`,
  textAlign: 'center',
  p: {
    color: token('color.text.subtlest', colors.N200),
  },
});
