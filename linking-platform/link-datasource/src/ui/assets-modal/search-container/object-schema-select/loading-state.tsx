/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Skeleton } from '@atlaskit/linking-common';

export const AssetsObjectSchemaSelectSkeleton = () => (
  <Skeleton
    width="100%"
    height="40px"
    testId="assets-datasource-modal--object-schema-select-skeleton"
  />
);
