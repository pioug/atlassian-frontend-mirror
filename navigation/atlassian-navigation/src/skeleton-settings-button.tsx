import React from 'react';

import SettingsIcon from '@atlaskit/icon/glyph/settings';

import { SkeletonIconButton } from './components/SkeletonIconButton';

export type SkeletonSettingsButtonProps = {
  /**
   *  Describes the specific role of this navigation component for users viewing the page with a screen
   *  reader. Differentiates from other navigation buttons on a page.
   */
  label: string;
};

export const SkeletonSettingsButton = ({
  label = '',
}: SkeletonSettingsButtonProps) => (
  <SkeletonIconButton>
    <SettingsIcon label={label} />
  </SkeletonIconButton>
);
