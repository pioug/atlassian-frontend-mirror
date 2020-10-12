import React from 'react';

import { gridSize } from '@atlaskit/theme/constants';

import { IconButtonSkeleton } from '../IconButton/skeleton';

export const SignInSkeleton = () => (
  <IconButtonSkeleton marginLeft={6} marginRight={6} size={gridSize() * 4.75} />
);
