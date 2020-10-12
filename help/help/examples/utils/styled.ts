/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const ExampleWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`;

export const ExampleDefaultContent = styled.div`
  padding: ${gridSize() * 2}px;
`;

export const FooterContent = styled.div`
  text-align: center;
  font-size: 11px;
  color: ${colors.N200};
`;

export const ControlsWrapper = styled.div`
  padding: ${gridSize() * 2}px;
`;

export const HelpWrapper = styled.div`
  width: ${gridSize() * 46}px;
  height: 100%;
  position: relative;
  overflow-x: hidden;
`;
