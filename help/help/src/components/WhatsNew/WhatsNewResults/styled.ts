/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const WhatsNewResultsContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: ${token('elevation.surface', '#FFFFFF')};
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
  padding: ${token('space.200', '16px')};
`;

export const SelectContainer = styled.div`
  width: ${19 * gridSize()}px;
`;

export const WhatsNewResultsListContainer = styled.div`
  padding-top: ${token('space.100', '8px')};
`;

export const WhatsNewResultsListTitleContainer = styled.div`
  padding: 0 ${token('space.100', '8px')};
`;
