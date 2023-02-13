import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { css } from '@emotion/react';

const avatarImageStyles = () => css`
  border-radius: ${borderRadius()};
  cursor: pointer;
`;

export const largeAvatarImageStyles = () => css`
  ${avatarImageStyles()}
  width: ${gridSize() * 9}px;
  height: ${gridSize() * 9}px;
`;

export const smallAvatarImageStyles = () => css`
  ${avatarImageStyles()}
  width: ${gridSize() * 5}px;
  height: ${gridSize() * 5}px;
`;

export const predefinedAvatarViewWrapperStyles = css`
  ul {
    display: flex;
    flex-flow: row wrap;
    width: 353px;
    max-height: 294px;
    overflow-y: auto;

    padding: 0;
    margin: 0;

    list-style-type: none;

    li {
      padding-right: 4px;
      padding-left: 4px;
      padding-bottom: 8px;
      margin: 0;
    }
  }

  .header {
    display: flex;
    align-items: center;

    padding-top: 4px;
    padding-bottom: 8px;

    .description {
      padding-left: 8px;
    }

    .back-button {
      width: 32px;
      height: 32px;
      border-radius: 16px;

      align-items: center;
      justify-content: center;

      margin: 0;
      padding: 0;
    }
  }

  /* hide tickbox and file type icon in overlay
   * because those are not necessary for avatars */

  .tickbox {
    visibility: hidden;
  }

  .file-type-icon {
    visibility: hidden;
  }
`;
