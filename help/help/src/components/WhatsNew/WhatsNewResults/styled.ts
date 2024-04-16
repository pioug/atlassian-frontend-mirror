/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const WhatsNewResultsContainer = styled.div({
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
  zIndex: 1,
  padding: token('space.200', '16px'),
});

export const SelectContainer = styled.div({
  width: `${19 * gridSize()}px`,
});

export const WhatsNewResultsListContainer = styled.div({
  paddingTop: token('space.100', '8px'),
});

export const WhatsNewResultsListTitleContainer = styled.div({
  padding: `0 ${token('space.100', '8px')}`,
});
