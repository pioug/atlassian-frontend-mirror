/** @jsx jsx */

import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

type HelpBodyProps = {
  isOverlayVisible?: boolean;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HelpBodyContainer = styled.div<HelpBodyProps>({
  flexGrow: 1,
  minHeight: 0,
  position: 'relative',
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
  alignContent: 'stretch',
  alignItems: 'flex-start',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HelpBody = styled.div<HelpBodyProps>({
  width: '100%',
  boxSizing: 'border-box',
  order: 0,
  flex: '1 1 auto',
  alignSelf: 'auto',
  position: 'relative',
  overflowX: 'hidden',
  overflowY: 'auto',
});

type HomeProps = {
  isOverlayFullyVisible?: boolean;
  isOverlayVisible?: boolean;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Home = styled.div<HomeProps>((props) => ({
  display: props.isOverlayFullyVisible ? 'none' : 'block',
  height: '100%',
  overflow: props.isOverlayVisible ? 'hidden' : 'auto',
  padding: token('space.200', '16px'),
  boxSizing: 'border-box',
}));
