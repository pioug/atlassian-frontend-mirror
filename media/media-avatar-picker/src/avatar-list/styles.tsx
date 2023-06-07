import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { B200 } from '@atlaskit/theme/colors';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
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

const buttonBoxShadow = `box-shadow: 0px 0px 0px 1px ${token(
  'color.border.inverse',
  'white',
)}, 0px 0px 0px 3px ${token('color.border.selected', B200)};`;

export const imageButton = ({ isSelected }: ImageProps) => css`
  display: inline-flex;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  ${isSelected
    ? `${buttonBoxShadow}
      :focus {
        outline:none;
        ${buttonBoxShadow}
      }
      `
    : ':focus { box-shadow: none; }'};
`;
