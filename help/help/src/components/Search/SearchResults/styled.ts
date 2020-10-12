/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const SearchResultsContainer = styled.div`
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
  z-index: 10;
  padding: 0 ${2 * gridSize()}px;
`;

export const SearchResultsList = styled.div`
  padding-top: ${3 * gridSize()}px;
  position: relative;
`;

export const SearchResultEmptyMessageImage = styled.div`
  padding: ${3 * gridSize()}px ${3 * gridSize()}px 0 ${3 * gridSize()}px;
  text-align: center;
`;

export const SearchResultEmptyMessageText = styled.div`
  padding: ${3 * gridSize()}px ${3 * gridSize()}px 0 ${3 * gridSize()}px;
  text-align: center;

  p {
    color: ${colors.N200};
  }
`;

export const SearchResultSearchExternalSiteContainer = styled.div`
  padding: ${3 * gridSize()}px;
  text-align: center;

  p {
    color: ${colors.N200};
  }
`;
