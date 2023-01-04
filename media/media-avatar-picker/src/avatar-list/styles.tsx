import { css } from '@emotion/react';

export const avatarListWrapperStyles = css`
  ul {
    display: flex;

    padding: 0;
    margin: 0;

    list-style-type: none;

    li {
      padding-right: 5px;
      margin: 0;
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

interface ImageProps {
  isSelected: boolean;
}

export const imageButton = ({ isSelected }: ImageProps) => css`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  ${isSelected ? ':focus { outline:none }' : ''}
`;
