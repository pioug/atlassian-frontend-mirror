import styled, { css } from 'styled-components';

export const RECENT_SEARCH_WIDTH_IN_PX = 420;
export const RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX = 360;
export const RECENT_SEARCH_HEIGHT_IN_PX = 360;

export const InputWrapper = `
  display: flex;
  line-height: 0;
  padding: 5px 0;
  align-items: center;
`;

export const UrlInputWrapper = styled.div`
  ${InputWrapper}
`;

export const Container = styled.div`
  width: ${RECENT_SEARCH_WIDTH_IN_PX}px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0;

  ${({ provider }: { provider: boolean }) =>
    css`
      width: ${provider
        ? RECENT_SEARCH_WIDTH_IN_PX
        : RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX}px;
    `};
  line-height: 2;
`;
