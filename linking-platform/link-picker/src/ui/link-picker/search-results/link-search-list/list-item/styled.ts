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

const listItemBaseStyles = css`
  display: flex;
  padding: ${token('space.100', '8px')} ${token('space.200', '16px')};
  margin: 0;
  cursor: pointer;
`;

const listItemFocusStyles = css`
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${token('color.border.focused', B100)} inset;
    text-decoration: none;
  }
`;

const listItemBoxShadow = css`
  box-shadow: inset 2px 0px 0px ${token('color.border.selected', B400)};
`;

const listItemActive = css`
  &:hover {
    background-color: ${token('color.background.neutral.subtle.hovered', N20)};
    ${listItemBoxShadow};
  }
`;

const listItemSelected = css`
  background-color: ${token('color.background.selected', B50)};
  ${listItemBoxShadow};
`;

export const composeListItemStyles = (selected = false) => {
  return css`
    ${listItemBaseStyles};
    ${!selected && listItemActive};
    ${selected && listItemSelected};
    ${listItemFocusStyles};
  `;
};

export const itemNameStyles = css`
  overflow: hidden;
`;

export const listItemNameStyles = css`
  color: ${token('color.text', N800)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
`;

export const listItemContextStyles = css`
  color: ${token('color.text', N300)};
  font-size: ${relativeFontSizeToBase16(fontSizeSmall())};
  line-height: ${fontSize()}px;
  display: flex;
`;

export const listItemContainerStyles = css`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const listItemContainerInnerStyles = css`
  color: ${token('color.text.subtlest', N200)};
  white-space: nowrap;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const itemIconStyles = css`
  min-width: ${token('space.200', '16px')};
  margin-top: 3px;
  margin-right: ${token('space.150', '12px')};
`;

export const imgStyles = css`
  max-width: ${token('space.200', '16px')};
`;
