import { css } from 'styled-components';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N30A } from '@atlaskit/theme/colors';
import { codeFontFamily } from '@atlaskit/theme/constants';

export const codeMarkSharedStyles = css`
  span.code {
    font-size: ${relativeFontSizeToBase16(13.712)};
    font-weight: normal;
    padding: 2px 0px 2px 0px;
    background-color: ${N30A};
    box-decoration-break: clone;
    border-radius: 3px;
    border-style: none;
    font-family: ${codeFontFamily()};
    white-space: pre-wrap;
    margin: 0 4px 0 4px;
    box-shadow: -4px 0 0 0 ${N30A}, 4px 0 0 0 ${N30A};

    &::before,
    &::after {
      vertical-align: text-top;
      display: inline-block;
      content: '';
    }
  }
`;
