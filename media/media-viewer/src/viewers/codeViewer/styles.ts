import { css } from '@emotion/react';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

export const codeViewWrapperStyles = css`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: ${token('elevation.surface', colors.N20)};
  overflow: auto;
`;

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const codeViewerHeaderBarStyles = css`
  height: 75px;
  background-color: #1d2125;
`;
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

export const codeViewerHTMLStyles = css`
  display: flex;
  line-height: 20px;
  overflow-x: auto;
  white-space: pre;
  font-size: 12px;
  padding: ${token('space.100', '8px')};
`;
