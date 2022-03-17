import { css } from '@emotion/react';
import { N30 } from '@atlaskit/theme/colors';

export const triggerWrapper = css`
  display: flex;
`;

export const separator = css`
  background: ${N30};
  width: 1px;
  height: 24px;
  display: inline-block;
  margin: 0 8px;
`;

export const wrapper = css`
  display: flex;
  align-items: center;
  div {
    display: flex;
  }
`;

export const expandIconWrapper = css`
  margin-left: -8px;
`;
