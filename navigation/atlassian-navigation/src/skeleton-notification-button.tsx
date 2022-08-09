import React from 'react';

import NotificationIcon from '@atlaskit/icon/glyph/notification';

import { SkeletonIconButton } from './components/SkeletonIconButton';

export type SkeletonNotificationButtonProps = {
  /**
   *  Describes the specific role of this navigation component for users viewing the page with a screen
   *  reader. Differentiates from other navigation buttons on a page.
   */
  label: string;
};

/**
 * __Skeleton Notification button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents the Notification button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SkeletonNotificationButton = ({
  label = '',
}: SkeletonNotificationButtonProps) => (
  <SkeletonIconButton>
    <NotificationIcon label={label} />
  </SkeletonIconButton>
);
