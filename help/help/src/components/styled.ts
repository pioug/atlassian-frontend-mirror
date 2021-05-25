/** @jsx jsx */

import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

type HelpBodyProps = {
  isArticleVisible?: boolean;
};

export const HelpBodyContainer = styled.div<HelpBodyProps>`
  flex-grow: 1;
  min-height: 0;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: flex-start;
`;

export const HelpBody = styled.div<HelpBodyProps>`
  width: 100%;
  box-sizing: border-box;
  order: 0;
  flex: 1 1 auto;
  align-self: auto;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
`;

type DefaultContentProps = {
  isArticleFullyVisible?: boolean;
  isArticleVisible?: boolean;
};

export const DefaultContent = styled.div<DefaultContentProps>`
  display: ${(props) => (props.isArticleFullyVisible ? 'none' : 'block')};
  height: 100%;
  overflow: ${(props) => (props.isArticleVisible ? 'hidden' : 'auto')};
`;

export const DividerLine = styled.div`
  background-color: ${colors.N30A};
  height: 2px;
  width: 100%;
  padding: 0 ${2 * gridSize()}px;
  margin-top: ${gridSize() * 2}px;
  box-sizing: border-box;
`;
