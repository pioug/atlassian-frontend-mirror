/** @jsx jsx */
import { jsx } from '@emotion/react';

import Spinner from '@atlaskit/spinner';

import {
  rootContainerStylesForLoaderWithDisplaytext,
  rootContainerStylesForLoaderWithoutDisplaytext,
} from './styled';

/**
 * Loader / skeleton for the Link Picker. Takes displayText prop - when no displayText is given the height of the skeleton
 * is shorter to prevent jump when loading in Link Picker.
 */
export const LoaderFallback = ({
  hideDisplayText,
}: {
  hideDisplayText?: boolean;
}) => (
  <div
    css={
      hideDisplayText
        ? rootContainerStylesForLoaderWithoutDisplaytext
        : rootContainerStylesForLoaderWithDisplaytext
    }
    data-testid="link-picker-root-loader-boundary-ui"
  >
    <Spinner testId="link-picker.component-loading-indicator" size="medium" />
  </div>
);
