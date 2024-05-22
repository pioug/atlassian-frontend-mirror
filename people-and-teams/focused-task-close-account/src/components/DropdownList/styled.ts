import styled from '@emotion/styled';
import gridSizeTimes from '../../util/gridSizeTimes';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AccessibleSitesList = styled.ul({
  listStyle: 'none',
  paddingLeft: 0,
  fontWeight: 600,
  marginLeft: `${gridSizeTimes(1)}px`,
  '> li': {
    marginTop: 0,
  },
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AccessibleSitesListFootnote = styled.div({
  paddingLeft: 0,
  marginLeft: `${gridSizeTimes(1)}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ButtonWrapper = styled.div({
  padding: `0 ${gridSizeTimes(1)}px`,
});
