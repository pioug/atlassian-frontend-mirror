import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

export const editableCardOptionsStyles = css({
  padding: token('space.250', '20px'),
  borderBottom: `1px solid ${token('color.border', '#ccc')}`,
  maxWidth: '700px',
});

export const sliderWrapperStyles = css({
  display: 'flex',
  width: '50%',
  '> *': {
    flex: 1,
    margin: token('space.100', '8px'),
  },
});

export const editableCardContentStyles = css({
  padding: token('space.250', '20px'),
  border: '2px dashed',
  margin: `${token('space.0', '0px')} ${token('space.150', '12px')} ${token(
    'space.600',
    '48px',
  )} ${token('space.150', '12px')}`,
  overflow: 'hidden',
  background: token('color.background.accent.orange.subtlest', 'antiquewhite'),
  boxSizing: 'border-box',
});

export const optionsWrapperStyles = css({
  display: 'flex',
  '> *': {
    flex: 1,
    margin: token('space.100', '8px'),
  },
});

export const cardDimensionsWrapperStyles = css({
  margin: `${token('space.100', '8px')} ${token('space.100', '8px')} ${token(
    'space.250',
    '20px',
  )} ${token('space.100', '8px')}`,
  display: 'flex',
  '> div': {
    border: `1px solid ${token('color.border.bold', 'black')}`,
    margin: token('space.075', '6px'),
    padding: token('space.075', '6px'),
    borderRadius: '3px',
  },
});

export const flexWrapperStyles = css({
  display: 'flex',
});
export const cardPreviewWrapperStyles = css({
  flex: 1,
});

export const cardWrapperStyles = css({
  border: `1px solid ${token('color.border.bold', 'black')}`,
  padding: token('space.150', '12px'),
  margin: token('space.075', '6px'),
  flexDirection: 'column',
  width: '310px',
  height: '280px',
  overflow: 'auto',
  display: 'inline-block',
});

export const cardFlowHeaderStyles = css({
  margin: `${token('space.250', '20px')} auto`,
  padding: `${token('space.150', '12px')} ${token('space.0', '0px')}`,
});

export const externalIdentifierWrapperStyles = css({
  display: 'flex',
  justifyContent: 'space-around',
  margin: `${token('space.0', '0px')} auto`,
  h2: {
    marginBottom: token('space.150', '12px'),
  },
});

export const unhandledErrorCardWrapperStyles = css({
  padding: token('space.250', '20px'),
  '> div:first-child': {
    display: 'flex',
    marginBottom: token('space.250', '20px'),
  },
  label: {
    marginRight: token('space.250', '20px'),
  },
});

export const inlineCardVideoWrapperItemStyles = css({
  padding: token('space.150', '12px'),
  border: `1px solid ${token('color.border.bold', 'black')}`,
  margin: token('space.150', '12px'),
});

export const mediaViewerExampleColumnStyles = css({
  flex: 1,
});

export const mediaViewerExampleWrapperStyles = css({
  display: 'flex',
});

export const mediaInlineWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  margin: token('space.1000', '80px'),
});

export const mediaInlineTableStyles = css({
  width: '800px',
  'tr, td': {
    border: `1px solid ${token('color.border', '#ddd')}`,
  },
});
