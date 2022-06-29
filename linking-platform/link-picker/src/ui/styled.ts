import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { N500 } from '@atlaskit/theme/colors';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { typography } from '@atlaskit/theme';
import { gridSize } from '@atlaskit/theme/constants';

const LINK_PICKER_WIDTH_IN_PX = 342;

export const recentListStyles = css`
  width: ${LINK_PICKER_WIDTH_IN_PX}px;
`;

export const containerStyles = css`
  padding: ${gridSize() * 2}px;
  width: 100%;
  overflow: hidden;
  line-height: initial;
  box-sizing: border-box;
`;

export const searchIconStyles = css`
  margin-left: ${gridSize() / 2}px;
  color: ${token('color.icon', N500)};
  cursor: default;
`;

export const listTitleStyles = css`
  ${typography.h100()}
  text-transform: uppercase;
  margin-bottom: ${gridSize() / 2}px;
`;
