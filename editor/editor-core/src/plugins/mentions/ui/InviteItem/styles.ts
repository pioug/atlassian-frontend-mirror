import { css } from '@emotion/react';
import { N30, N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export interface MentionItemStyleProps {
  selected?: boolean;
}

export interface NameSectionStyleProps {
  restricted?: boolean;
}

export const ROW_SIDE_PADDING = 14;
export const rowStyle = css`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  padding: 6px ${ROW_SIDE_PADDING}px;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

export const AVATAR_HEIGHT = 36;
export const avatarStyle = css`
  position: relative;
  flex: initial;
  opacity: inherit;
  width: 36px;
  height: ${AVATAR_HEIGHT}px;

  > span {
    width: 24px;
    height: 24px;
    padding: 6px;
  }
`;

export const nameSectionStyle = css`
  flex: 1;
  min-width: 0;
  margin-left: 14px;
  color: ${token('color.text.subtle', N300)};
  opacity: inherit;
`;

export const mentionItemStyle = css`
  background-color: transparent;
  display: block;
  overflow: hidden;
  list-style-type: none;
  cursor: pointer;
`;

export const mentionItemSelectedStyle = css`
  background-color: ${token('color.background.neutral.subtle.hovered', N30)};
`;

export const capitalizedStyle = css`
  text-transform: capitalize;
`;
