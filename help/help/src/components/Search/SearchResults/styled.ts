/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const SearchResultsContainer = styled.div({
  position: 'absolute',
  height: '100%',
  width: '100%',
  top: 0,
  backgroundColor: token('elevation.surface', '#FFFFFF'),
  flex: 1,
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  overflowY: 'auto',
  zIndex: 10,
  padding: `0 ${token('space.200', '16px')}`,
});

export const SearchResultsList = styled.div({
  paddingTop: token('space.300', '24px'),
  position: 'relative',
});

export const SearchResultEmptyMessageImage = styled.div({
  padding: `${token('space.300', '24px')} ${token(
    'space.300',
    '24px',
  )} 0 ${token('space.300', '24px')}`,
  textAlign: 'center',
});

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

export const SearchResultSearchExternalSiteContainer = styled.div({
  padding: token('space.300', '24px'),
  textAlign: 'center',
  p: {
    color: token('color.text.subtlest', colors.N200),
  },
});
