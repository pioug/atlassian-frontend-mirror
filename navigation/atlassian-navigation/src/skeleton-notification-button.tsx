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

export const SkeletonNotificationButton = ({
  label = '',
}: SkeletonNotificationButtonProps) => (
  <SkeletonIconButton>
    <NotificationIcon label={label} />
  </SkeletonIconButton>
);
