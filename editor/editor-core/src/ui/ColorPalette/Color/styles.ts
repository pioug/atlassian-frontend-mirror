import { css } from '@emotion/react';
import { N900, N0, N50 } from '@atlaskit/theme/colors';

export const buttonStyle = css`
  height: 26px;
  width: 26px;
  background: ${N900};
  padding: 0;
  border-radius: 4px;
  border: 1px solid ${N0};
  cursor: pointer;
  display: block;
`;

export const buttonWrapperStyle = css`
  border: 1px solid transparent;
  margin: 1px;
  font-size: 0;
  display: flex;
  align-items: center;
  padding: 1px;
  border-radius: 6px;
  &:hover {
    border-color: ${N50};
  }
`;
