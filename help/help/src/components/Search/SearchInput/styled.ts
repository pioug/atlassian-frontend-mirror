/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';

export const SearchInputContainer = styled.div`
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  width: 100%;
  box-sizing: border-box;
`;

export const SearchIconContainer = styled.div`
  width: ${gridSize() * 3}px;
  height: ${gridSize() * 3}px;
  padding-left: ${gridSize() / 2}px;

  & > span {
    padding-left: ${gridSize() / 2}px;
    height: ${gridSize() * 3}px;
    width: ${gridSize() * 3}px;
    box-sizing: border-box;
  }
`;

export const CloseButtonAndSpinnerContainer = styled.div`
  font-size: 0;
  padding-right: ${gridSize()}px;
  position: relative;
  white-space: nowrap;

  & > span {
    padding-right: ${gridSize() / 2}px;
  }

  & > button,
  & > span {
    display: inline-block;
    vertical-align: middle;
  }
`;
