import { css } from '@emotion/react';
import {
  akEditorSubtleAccent,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { borderRadius } from '@atlaskit/theme/constants';
import { N300, N50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const inputStyle = css`
  /* Normal .className gets overridden by input[type=text] hence this hack to produce input.className */
  input& {
    background-color: ${token('color.background.input', 'white')};
    border: 1px solid ${token('color.border.input', akEditorSubtleAccent)};
    border-radius: ${borderRadius()}px;
    box-sizing: border-box;
    height: 40px;
    padding-left: 20px;
    padding-top: 12px;
    padding-bottom: 12px;
    font-size: ${relativeFontSizeToBase16(14)};
    width: 100%;
    font-weight: 400;
    line-height: 1.42857142857143;
    letter-spacing: -0.005em;
    color: ${token('color.text.subtlest', N300)};

    &:hover {
      background-color: ${token('color.background.input.hovered', 'white')};
      border-color: ${token('color.border.input', N50)};
      cursor: text;
    }
  }
`;
