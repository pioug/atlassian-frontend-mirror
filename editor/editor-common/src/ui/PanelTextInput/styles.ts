import { css } from '@emotion/react';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { B100, N100, N30, N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// Normal .className gets overridden by input[type=text] hence this hack to produce input.className
export const panelTextInput = css`
  input& {
    background: transparent;
    border: 2px solid ${token('color.border', N30)};
    border-radius: 0;
    box-sizing: content-box;
    color: ${token('color.text.subtle', N400)};
    flex-grow: 1;
    font-size: ${relativeFontSizeToBase16(13)};
    line-height: 20px;
    padding: ${token('space.075', '6px')} ${token('space.400', '32px')}
      ${token('space.075', '6px')} ${token('space.100', '8px')};
    min-width: 145px;

    /* Hides IE10+ built-in [x] clear input button */
    &::-ms-clear {
      display: none;
    }

    &:focus {
      outline: none;
      border-color: ${token('color.border.focused', B100)};
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
