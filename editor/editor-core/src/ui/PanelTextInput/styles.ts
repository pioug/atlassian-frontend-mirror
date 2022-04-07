import { css } from '@emotion/react';
import { N400, N800 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

// Normal .className gets overridden by input[type=text] hence this hack to produce input.className
export const panelTextInput = css`
  input& {
    background: transparent;
    border: 0;
    border-radius: 0;
    box-sizing: content-box;
    color: ${N400};
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
      color: ${N800};
      opacity: 0.5;
    }
  }
`;

export const panelTextInputWithCustomWidth = (width: number) => css`
  input& {
    width: ${width}px;
  }
`;
