import { css } from '@emotion/react';

import {
  akEditorFloatingDialogZIndex,
  akEditorMobileMaxWidth,
  akEditorSwoopCubicBezier,
  akEditorToolbarKeylineHeight,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 868;

const toolbarLineHeight = 56;

// box-shadow is overriden by the mainToolbar
const mainToolbarWithKeyline = css({
  boxShadow: `0 ${akEditorToolbarKeylineHeight}px 0 0 ${token(
    'color.background.accent.gray.subtlest',
    '#F1F2F4',
  )}`,
});

const mainToolbarTwoLineStyle = css({
  [`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
    flexWrap: 'wrap',
    height: `calc(${toolbarLineHeight}px * 2)`,
  },
});

const mainToolbar = css({
  position: 'relative',
  alignItems: 'center',
  boxShadow: 'none',
  transition: `box-shadow 200ms ${akEditorSwoopCubicBezier}`,
  zIndex: akEditorFloatingDialogZIndex,
  display: 'flex',
  height: `${toolbarLineHeight}px`,
  flexShrink: 0,
  backgroundColor: token('elevation.surface', 'white'),
  '& object': {
    height: '0 !important',
  },
  [`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
    display: 'grid',
    height: `calc(${toolbarLineHeight}px * 2)`,
  },
});

export const mainToolbarStyle = (
  showKeyline: boolean,
  twoLineEditorToolbar: boolean,
) => [
  mainToolbar,
  showKeyline && mainToolbarWithKeyline,
  twoLineEditorToolbar && mainToolbarTwoLineStyle,
];

export const mainToolbarIconBeforeStyle = css({
  margin: token('space.200', '16px'),
  height: token('space.400', '32px'),
  width: token('space.400', '32px'),
  [`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
    gridColumn: 1,
    gridRow: 1,
  },
});

const mainToolbarFirstChild = css({
  display: 'flex',
  flexGrow: 1,
  [`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
    gridColumn: 1,
    gridRow: 1,
  },
});

const mainToolbarFirstChildTowLine = css({
  [`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
    flex: '1 1 100%',
    height: `${toolbarLineHeight}px`,
    justifyContent: 'flex-end',
    minWidth: 'fit-content',
  },
});

export const mainToolbarFirstChildStyle = (twoLineEditorToolbar: boolean) => [
  mainToolbarFirstChild,
  twoLineEditorToolbar && mainToolbarFirstChildTowLine,
];

const mainToolbarSecondChild = css({
  minWidth: 'fit-content',
});

const mainToolbarSecondChildTwoLine = css({
  [`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
    display: 'flex',
    flexGrow: 1,
    flex: '1 1 100%',
    margin: 'auto',
    height: `${toolbarLineHeight}px`,
    minWidth: 0,
  },
});

export const mainToolbarSecondChildStyle = (twoLineEditorToolbar: boolean) => [
  mainToolbarSecondChild,
  twoLineEditorToolbar && mainToolbarSecondChildTwoLine,
];

export const nonCustomToolbarWrapperStyle = css({
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
});

export const customToolbarWrapperStyle = css({
  alignItems: 'center',
  display: 'flex',
});
