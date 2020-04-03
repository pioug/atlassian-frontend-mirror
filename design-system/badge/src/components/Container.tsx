import styled from 'styled-components';

import { ThemeTokens } from '../theme';

const Container = styled.span<ThemeTokens>`
  ${props => `
    background-color: ${props.backgroundColor};
    color: ${props.textColor};
  `};
  border-radius: 2em;
  display: inline-block;
  font-size: 12px;
  font-weight: normal;
  line-height: 1;
  min-width: 1px;
  padding: 0.16666666666667em 0.5em;
  text-align: center;
`;

export default Container;
