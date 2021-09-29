/** @jsx jsx */

import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { fontSizeSmall, gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const truncate = (width: string = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

export const WhatsNewResultsListContainer = styled.div`
  position: relative;
`;

export const WhatsNewResultsListGroupWrapper = styled.div`
  padding: ${gridSize()}px 0 0 0;
`;

export const WhatsNewResultsListGroupTitle = styled.div`
  color: ${colors.N200};
  font-size: ${fontSizeSmall()}px;
  font-weight: bold;
  padding: 0 ${gridSize()}px ${gridSize()}px ${gridSize()}px;
  text-transform: uppercase;
`;

export const ToggleShowWhatsNewResultsContainer = styled.div`
  padding: ${gridSize()}px 0;
  span {
    margin: 0;
  }
`;
