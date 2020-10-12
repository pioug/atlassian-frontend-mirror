/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

const HEADER_HEIGHT = gridSize() * 7;
const HEADER_TITLE_BORDER_BOTTOM = 2;

export const HeaderContainer = styled.div`
  height: ${HEADER_HEIGHT}px;
  background-color: ${colors.N10};
  border-bottom: ${HEADER_TITLE_BORDER_BOTTOM}px solid ${colors.N30};
  justify-content: space-between;
  position: relative;
`;

export const CloseButtonContainer = styled.div`
  position: absolute;
  right: ${gridSize()}px;
  top: 50%;
  transform: translateY(-50%);
`;

export const BackButtonContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${gridSize()}px;
`;

export const HeaderTitle = styled.div`
  color: ${colors.N500};
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: ${gridSize() * 7}px;
  width: 100%;
  display: inline-block;
  vertical-align: middle;
`;
