/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';

export const WhatsNewResultsContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: #ffffff;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
  padding: ${2 * gridSize()}px;
`;

export const SelectContainer = styled.div`
  width: ${19 * gridSize()}px;
`;

export const WhatsNewResultsListContainer = styled.div`
  padding-top: ${gridSize() * 2}px;
`;

export const WhatsNewResultsListTitleContainer = styled.div`
  padding: 0 ${gridSize()}px;
`;
