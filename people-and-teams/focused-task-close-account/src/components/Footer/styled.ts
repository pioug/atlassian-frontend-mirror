import styled from '@emotion/styled';
import gridSizeTimes from '../../util/gridSizeTimes';

export const FooterOuter = styled.div({
  display: 'flex',
  width: '100%',
  maxWidth: '640px',
  '@media screen and (max-width: 640px)': {
    justifyContent: 'space-evenly',
    paddingBottom: `${gridSizeTimes(3)}px`,
    alignItems: 'center',
  },
  justifyContent: 'space-between',
  marginTop: `${gridSizeTimes(4)}px`,
});
