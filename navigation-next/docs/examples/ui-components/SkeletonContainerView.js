import React from 'react';
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
