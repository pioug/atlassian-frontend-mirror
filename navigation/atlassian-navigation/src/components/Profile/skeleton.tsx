import React from 'react';

import { gridSize } from '@atlaskit/theme/constants';

import { IconButtonSkeleton } from '../IconButton/skeleton';

// Not exported to consumers, only used in NavigationSkeleton
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ProfileSkeleton = () => (
  <IconButtonSkeleton marginLeft={6} marginRight={6} size={gridSize() * 3.25} />
);
