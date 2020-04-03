import styled from 'styled-components';
import { InputHTMLAttributes, ComponentClass } from 'react';
import { akEditorSubtleAccent } from '../../styles';
import { borderRadius, colors } from '@atlaskit/theme';

export const Input: ComponentClass<InputHTMLAttributes<{}> & {
  innerRef?: any;
}> = styled.input`
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
    font-size: 14px;
    width: 100%;
    font-weight: 400;
    line-height: 1.42857142857143;
    letter-spacing: -0.005em;
    color: ${colors.N300};

    &:hover {
      border-color: ${colors.N50};
      cursor: text;
    }
  }
`;
