/** @jsx jsx */
import { jsx } from '@emotion/react';
import Spinner from '@atlaskit/spinner';

import { rootContainerStylesForLoader } from '../link-picker/styled';

export const LoaderFallback = (
  <div
    css={rootContainerStylesForLoader}
    data-testid="link-picker-root-loader-boundary-ui"
  >
    <Spinner testId="link-picker.component-loading-indicator" size="medium" />
  </div>
);
