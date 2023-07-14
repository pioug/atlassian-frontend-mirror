import React from 'react';

import { IconButtonSkeleton } from '../IconButton/skeleton';

// Not exported to consumers, only used in NavigationSkeleton
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ProfileSkeleton = () => (
  <IconButtonSkeleton marginLeft={6} marginRight={6} size={26} />
);
