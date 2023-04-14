import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { B50, N300, N800, N20, B400 } from '@atlaskit/theme/colors';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { fontSizeSmall, fontSize } from '@atlaskit/theme';

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
  margin: 0 calc(-1 * ${token('space.200', '16px')});
  cursor: pointer;
`;

const listItemBoxShadow = css`
  box-shadow: inset 2px 0px 0px ${token('color.border.selected', B400)};
`;

const listItemActive = css`
  background-color: ${token('color.background.neutral.subtle.hovered', N20)};
`;

const listItemSelected = css`
  background-color: ${token('color.background.selected', B50)};
`;

export const composeListItemStyles = (active = false, selected = false) => {
  const hasShadow = active || selected;

  return css`
    ${listItemBaseStyles};
    ${active && listItemActive};
    ${selected && listItemSelected};
    ${hasShadow && listItemBoxShadow};
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
  white-space: nowrap;
`;

export const itemIconStyles = css`
  min-width: ${token('space.200', '16px')};
  margin-top: 3px;
  margin-right: ${token('space.150', '12px')};
`;

export const imgStyles = css`
  max-width: ${token('space.200', '16px')};
`;
