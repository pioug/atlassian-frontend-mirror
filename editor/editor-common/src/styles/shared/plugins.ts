import { css } from '@emotion/react';

import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const buttonGroupStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  '& > div': {
    display: 'flex',
  },
});

// This style is copied to packages/editor/editor-plugin-ai/src/ui/components/AtlassianIntelligenceToolbarButton/styles.tsx
// If you make change here, change in above file as well.
export const separatorStyles = css({
  background: token('color.border', N30),
  width: '1px',
  height: '24px',
  display: 'inline-block',
  margin: `0 ${token('space.100', '8px')}`,
  userSelect: 'none',
});

// This style is copied to packages/editor/editor-plugin-ai/src/ui/components/AtlassianIntelligenceToolbarButton/styles.tsx
// If you make change here, change in above file as well.
export const wrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  '> div, > span': {
    display: 'flex',
  },
  '> div > div': {
    display: 'flex',
  },
  marginLeft: 0,
  minWidth: 'auto',
});

export const triggerWrapperStyles = css({
  display: 'flex',
});
