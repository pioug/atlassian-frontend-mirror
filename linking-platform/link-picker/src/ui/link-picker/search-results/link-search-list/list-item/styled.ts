import { css } from '@emotion/react';

import { B100, B400, B50, N20, N200, N300, N800 } from '@atlaskit/theme/colors';
import { fontSize, fontSizeSmall } from '@atlaskit/theme/constants';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { token } from '@atlaskit/tokens';

export const relativeFontSizeToBase16 = (px: number | string) => {
  if (typeof px === 'string') {
    px = parseInt(px);
  }
  if (isNaN(px)) {
    throw new Error(`Invalid font size: '${px}'`);
  }
  return `${px / 16}rem`;
};

const listItemBaseStyles = css({
  display: 'flex',
  paddingTop: token('space.100', '8px'),
  paddingBottom: token('space.100', '8px'),
  paddingLeft: `clamp( ${token(
    'space.100',
    '8px',
  )}, var(--link-picker-padding-left), 100% )`,
  paddingRight: `clamp( ${token(
    'space.100',
    '8px',
  )}, var(--link-picker-padding-right), 100% )`,
  margin: 0,
  cursor: 'pointer',
});

const listItemFocusStyles = css({
  '&:focus': {
    outline: 'none',
    boxShadow: `0 0 0 2px ${token('color.border.focused', B100)} inset`,
    textDecoration: 'none',
  },
});

const listItemBoxShadow = css({
  boxShadow: `inset 2px 0px 0px ${token('color.border.selected', B400)}`,
});

const listItemActive = css({
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N20),
  },
  listItemBoxShadow,
});

const listItemSelected = css(
  {
    backgroundColor: token('color.background.selected', B50),
  },
  listItemBoxShadow,
);

export const composeListItemStyles = (selected = false) => {
  return css(
    listItemBaseStyles,
    !selected && listItemActive,
    selected && listItemSelected,
    listItemFocusStyles,
  );
};

export const itemNameStyles = css({
  overflow: 'hidden',
  alignContent: 'center',
});

export const listItemNameStyles = css({
  color: token('color.text', N800),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: '20px',
});

export const listItemContextStyles = css({
  color: token('color.text', N300),
  fontSize: relativeFontSizeToBase16(fontSizeSmall()),
  lineHeight: `${fontSize()}px`,
  display: 'flex',
});

export const listItemContainerStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const listItemContainerInnerStyles = css({
  color: token('color.text.subtlest', N200),
  whiteSpace: 'nowrap',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const itemIconStyles = css({
  minWidth: token('space.200', '16px'),
  marginTop: token('space.050', '4px'),
  marginRight: token('space.150', '12px'),
});

export const imgStyles = css({
  maxWidth: token('space.200', '16px'),
});
