import { css } from '@emotion/react';

export const RECENT_SEARCH_WIDTH_IN_PX = 420;
export const RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX = 360;
export const RECENT_SEARCH_HEIGHT_IN_PX = 360;

export const inputWrapper = css`
  display: flex;
  line-height: 0;
  padding: 5px 0;
  align-items: center;
`;

export const container = css`
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0;

  width: ${RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX}px;
  line-height: initial;
`;

export const containerWithProvider = css`
  width: ${RECENT_SEARCH_WIDTH_IN_PX}px;
`;
