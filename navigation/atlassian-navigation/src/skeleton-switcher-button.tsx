import React from 'react';

import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import { SkeletonIconButton } from './components/SkeletonIconButton';

export type SkeletonSwitcherButtonProps = {
  /**
   *  Describes the specific role of this navigation component for users viewing the page with a screen
   *  reader. Differentiates from other navigation buttons on a page.
   */
  label: string;
};

export const SkeletonSwitcherButton = ({
  label = '',
}: SkeletonSwitcherButtonProps) => (
  <SkeletonIconButton>
    <AppSwitcherIcon label={label} />
  </SkeletonIconButton>
);
