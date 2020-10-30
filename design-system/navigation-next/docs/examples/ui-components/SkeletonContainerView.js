import React from 'react';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

import { SkeletonContainerView } from '../../../src';

export default () => (
  <div
    css={{
      backgroundColor: colors.N20,
      boxSizing: 'border-box',
      paddingBottom: '48px',
      width: '240px ',
    }}
  >
    <SkeletonContainerView />
  </div>
);
