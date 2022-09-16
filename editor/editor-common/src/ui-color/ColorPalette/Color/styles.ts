import { css } from '@emotion/react';

import { N0, N50, N900 } from '@atlaskit/theme/colors';

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
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
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
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
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
