import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { fontFamily } from '@atlaskit/theme/constants';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const hiddenMixin = css`
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
`;

export const TooltipContent = styled.div`
  /* CSS reset */
  font-family: ${fontFamily};
`;
