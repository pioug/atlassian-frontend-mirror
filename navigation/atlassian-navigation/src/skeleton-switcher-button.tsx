import React from 'react';

import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import { SkeletonIconButton } from './components/SkeletonIconButton';

export const SkeletonSwitcherButton = ({ label = '' }: { label: string }) => (
  <SkeletonIconButton>
    <AppSwitcherIcon label={label} />
  </SkeletonIconButton>
);
