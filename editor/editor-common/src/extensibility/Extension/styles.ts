import { css } from '@emotion/react';

import { B200, N20, N20A, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { BODIED_EXT_PADDING, EXTENSION_PADDING } from '../../styles';

export { EXTENSION_PADDING as padding, BODIED_EXT_PADDING };

export const wrapperDefault = css({
  background: token('color.background.neutral', N20),
  borderRadius: token('border.radius', '3px'),
  position: 'relative',
  verticalAlign: 'middle',
  '.ProseMirror-selectednode > span > & > .extension-overlay': {
    boxShadow: `inset 0px 0px 0px 2px ${token('color.border.selected', B200)}`,
    opacity: 1,
  },
  '&.with-overlay': {
    '.extension-overlay': {
      background: token('color.background.neutral.hovered', N20A),
      color: 'transparent',
    },
    '&:hover .extension-overlay': {
      opacity: 1,
    },
  },
});

export const overlay = css({
  borderRadius: token('border.radius', '3px'),
  position: 'absolute',
  width: '100%',
  height: '100%',
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.3s',
});

export const placeholderFallback = css({
  display: 'inline-flex',
  alignItems: 'center',
  '& > img': {
    margin: `0 ${token('space.050', '4px')}`,
  },
  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
  /* stylelint-disable-next-line */
  label: 'placeholder-fallback',
});

export const placeholderFallbackParams = css({
  display: 'inline-block',
  maxWidth: '200px',
  marginLeft: token('space.050', '4px'),
  color: token('color.text.subtlest', N70),
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

export const styledImage = css({
  maxHeight: '16px',
  maxWidth: '16px',
  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
  /* stylelint-disable-next-line */
  label: 'lozenge-image',
});

export const lozengeWrapper = css({
  display: 'flex',
  justifyContent: 'left',
  width: '100%',
  marginLeft: token('space.050', '4px'),
  marginBottom: token('space.negative.050', '-4px'),
});
