/** @jsx jsx */

import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';

type HelpBodyProps = {
  isOverlayVisible?: boolean;
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

type HomeProps = {
  isOverlayFullyVisible?: boolean;
  isOverlayVisible?: boolean;
};

export const Home = styled.div<HomeProps>`
  display: ${(props) => (props.isOverlayFullyVisible ? 'none' : 'block')};
  height: 100%;
  overflow: ${(props) => (props.isOverlayVisible ? 'hidden' : 'auto')};
  padding: ${gridSize() * 2}px;
  box-sizing: border-box;
`;
