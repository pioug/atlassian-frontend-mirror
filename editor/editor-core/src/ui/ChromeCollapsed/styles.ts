import styled from 'styled-components';
import { InputHTMLAttributes, ComponentClass } from 'react';
import {
  akEditorSubtleAccent,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { borderRadius } from '@atlaskit/theme/constants';
import { N300, N50 } from '@atlaskit/theme/colors';

export const Input: ComponentClass<
  InputHTMLAttributes<{}> & {
    innerRef?: any;
  }
> = styled.input`
  /* Normal .className gets overridden by input[type=text] hence this hack to produce input.className */
  input& {
    background-color: white;
    border: 1px solid ${akEditorSubtleAccent};
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
    color: ${N300};

    &:hover {
      border-color: ${N50};
      cursor: text;
    }
  }
`;
