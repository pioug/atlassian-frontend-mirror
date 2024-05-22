/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ExampleWrapper = styled.div({
  display: 'flex',
  position: 'relative',
  width: '100%',
  height: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ExampleDefaultContent = styled.div({
  padding: token('space.200', '16px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const FooterContent = styled.div({
  textAlign: 'center',
  fontSize: '11px',
  color: token('color.text.subtlest', colors.N200),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ControlsWrapper = styled.div({
  padding: token('space.200', '16px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HelpWrapper = styled.div({
  width: `${gridSize() * 46}px`,
  height: '100%',
  position: 'relative',
  overflowX: 'hidden',
});
