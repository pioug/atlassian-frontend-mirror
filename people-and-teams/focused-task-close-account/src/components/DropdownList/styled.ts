import styled from '@emotion/styled';
import gridSizeTimes from '../../util/gridSizeTimes';

export const AccessibleSitesList = styled.ul({
  listStyle: 'none',
  paddingLeft: 0,
  fontWeight: 600,
  marginLeft: `${gridSizeTimes(1)}px`,
  '> li': {
    marginTop: 0,
  },
});

export const AccessibleSitesListFootnote = styled.div({
  paddingLeft: 0,
  marginLeft: `${gridSizeTimes(1)}px`,
});

export const ButtonWrapper = styled.div({
  padding: `0 ${gridSizeTimes(1)}px`,
});
