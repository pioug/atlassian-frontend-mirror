/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ExampleWrapper = styled.div({
  display: 'flex',
  position: 'relative',
  width: '100%',
  height: '100%',
});

export const ExampleDefaultContent = styled.div({
  padding: token('space.200', '16px'),
});

export const FooterContent = styled.div({
  textAlign: 'center',
  fontSize: '11px',
  color: token('color.text.subtlest', colors.N200),
});

export const ButtonsWrapper = styled.div({
  padding: token('space.200', '16px'),
  boxSizing: 'border-box',
  display: 'inline-block',
  width: '100%',
});

export const ControlsWrapper = styled.div({
  padding: token('space.200', '16px'),
  boxSizing: 'border-box',
  display: 'inline-block',
  width: '50%',
});

export const HelpWrapper = styled.div({
  width: `${gridSize() * 46}px`,
  height: '100%',
  position: 'relative',
  overflowX: 'hidden',
  backgroundColor: token('elevation.surface', colors.N200),
});

export const HelpContainer = styled.div({
  display: 'inline-block',
  height: '100%',
  verticalAlign: 'top',
  padding: token('space.200', '16px'),
  boxSizing: 'border-box',
  backgroundColor: token('color.background.neutral.bold', colors.N200),
});
