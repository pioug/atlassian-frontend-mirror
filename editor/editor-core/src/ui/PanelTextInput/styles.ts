import { css } from '@emotion/react';
import { N400, N100 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// Normal .className gets overridden by input[type=text] hence this hack to produce input.className
export const panelTextInput = css`
  input& {
    background: transparent;
    border: 0;
    border-radius: 0;
    box-sizing: content-box;
    color: ${token('color.text.subtle', N400)};
    flex-grow: 1;
    font-size: ${relativeFontSizeToBase16(13)};
    line-height: 20px;
    padding: 0;
    min-width: 145px;

    /* Hides IE10+ built-in [x] clear input button */
    &::-ms-clear {
      display: none;
    }

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${token('color.text.subtlest', N100)};
    }
  }
`;

export const panelTextInputWithCustomWidth = (width: number) => css`
  input& {
    width: ${width}px;
  }
`;
