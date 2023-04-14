import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { N500 } from '@atlaskit/theme/colors';

const LINK_PICKER_WIDTH_IN_PX = 342;

// See lazy-load-height example to verify these
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_DISPLAYTEXT = 142;
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_DISPLAYTEXT = 220;

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

/** Styles for skeleton element when Link Picker loading */
const rootContainerStylesForLoader = css`
  ${rootContainerStyles}
  display: flex;
  align-items: center;
  justify-content: center;
`;

/** Link Picker loader / skeleton will be taller in height when displayText field is shown */
export const rootContainerStylesForLoaderWithDisplaytext = css`
  ${rootContainerStylesForLoader}
  min-height: ${LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_DISPLAYTEXT}px;
`;

/** Link Picker loader / skeleton will be shorter in height when displayText field isn't shown */
export const rootContainerStylesForLoaderWithoutDisplaytext = css`
  ${rootContainerStylesForLoader}
  min-height: ${LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_DISPLAYTEXT}px;
`;

export const searchIconStyles = css`
  margin-left: ${token('space.050', '4px')};
  color: ${token('color.icon', N500)};
  cursor: default;
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
