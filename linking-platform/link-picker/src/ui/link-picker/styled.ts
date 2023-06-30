import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const LINK_PICKER_WIDTH_IN_PX = 342;

/**
 * Half padding on the top as the form field has a `gridSize()` margin top that cannot be overridden
 */
export const rootContainerStyles = css`
  width: ${LINK_PICKER_WIDTH_IN_PX}px;
  padding: ${token('space.100', '8px')} ${token('space.200', '16px')}
    ${token('space.200', '16px')};
  box-sizing: border-box;
  line-height: initial;
`;

export const tabsWrapperStyles = css`
  margin-top: ${token('space.150', '12px')};
  margin-left: calc(-1 * ${token('space.100', '8px')});
  margin-right: calc(-1 * ${token('space.100', '8px')});
`;

export const flexColumnStyles = css`
  display: flex;
  flex-direction: column;
`;

export const formFooterMargin = css`
  margin-top: ${token('space.200', '16px')};
`;
