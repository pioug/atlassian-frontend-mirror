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

/**
 * __Skeleton switcher button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents the AppSwitcher button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SkeletonSwitcherButton = ({
  label = '',
}: SkeletonSwitcherButtonProps) => (
  <SkeletonIconButton>
    <AppSwitcherIcon label={label} />
  </SkeletonIconButton>
);
