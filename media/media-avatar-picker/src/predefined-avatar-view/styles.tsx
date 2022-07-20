import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { B200 } from '@atlaskit/theme/colors';
import { css } from '@emotion/react';

export interface AvatarImageProps {
  isSelected: boolean;
}

const avatarImageStyles = (props: AvatarImageProps) => css`
  border-radius: ${borderRadius()};
  cursor: pointer;
  ${props.isSelected
    ? ` box-shadow: 0px 0px 0px 1px white, 0px 0px 0px 3px ${B200}; `
    : ''};
`;

export const largeAvatarImageStyles = (props: AvatarImageProps) => css`
  ${avatarImageStyles(props)}
  width: ${gridSize() * 9}px;
  height: ${gridSize() * 9}px;
`;

export const smallAvatarImageStyles = (props: AvatarImageProps) => css`
  ${avatarImageStyles(props)}
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
