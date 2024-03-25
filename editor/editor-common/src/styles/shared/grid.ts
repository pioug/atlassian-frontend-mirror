import { css } from '@emotion/react';

import { akEditorGridLineZIndex } from '@atlaskit/editor-shared-styles';
import { B200, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const GRID_GUTTER = 12;

export const gridStyles = css({
  '.gridParent': {
    width: `calc(100% + ${GRID_GUTTER * 2}px)`,
    marginLeft: token('space.negative.150', '-12px'),
    marginRight: token('space.negative.150', '-12px'),
    transform: 'scale(1)',
    zIndex: akEditorGridLineZIndex,
  },
  '.gridContainer': {
    position: 'fixed',
    height: '100vh',
    width: '100%',
    pointerEvents: 'none',
  },
  '.gridLine': {
    borderLeft: `1px solid ${token('color.border', N30A)}`,
    display: 'inline-block',
    boxSizing: 'border-box',
    height: '100%',
    // eslint-disable-next-line @atlaskit/design-system/use-tokens-space
    marginLeft: '-1px',
    transition: 'border-color 0.15s linear',
    zIndex: 0,
  },
  '.highlight': {
    borderLeft: `1px solid ${token('color.border.focused', B200)}`,
  },
});
