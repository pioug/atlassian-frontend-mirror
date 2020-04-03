import { codeFontFamily, colors } from '@atlaskit/theme';
import { css } from 'styled-components';
import { relativeSize } from '../consts';

export const codeMarkSharedStyles = css`
  span.code {
    font-size: ${relativeSize(0.857)}px;
    font-weight: normal;
    padding: 2px 0px 2px 0px;
    background-color: ${colors.N30A};
    box-decoration-break: clone;
    border-radius: 3px;
    border-style: none;
    font-family: ${codeFontFamily()};
    white-space: pre-wrap;
    margin: 0 4px 0 4px;
    box-shadow: -4px 0 0 0 ${colors.N30A}, 4px 0 0 0 ${colors.N30A};

    &::before,
    &::after {
      vertical-align: text-top;
      display: inline-block;
      content: '';
    }
  }
`;
