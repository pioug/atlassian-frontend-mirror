import { css } from '@emotion/react';

// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { rootContainerStyles } from '../link-picker/styled';

/** Link Picker loader / skeleton will be taller in height when displayText field is shown */
// See lazy-load-height example to verify these
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_DISPLAYTEXT = 142;
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_DISPLAYTEXT = 220;

const rootContainerStylesForLoader = css`
  ${rootContainerStyles}
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const rootContainerStylesForLoaderWithDisplaytext = css`
  ${rootContainerStylesForLoader}
  min-height: ${LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_DISPLAYTEXT}px;
`;

/** Link Picker loader / skeleton will be shorter in height when displayText field isn't shown */
export const rootContainerStylesForLoaderWithoutDisplaytext = css`
  ${rootContainerStylesForLoader}
  min-height: ${LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_DISPLAYTEXT}px;
`;
