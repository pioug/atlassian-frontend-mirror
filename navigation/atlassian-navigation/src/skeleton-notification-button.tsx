import React from 'react';

import NotificationIcon from '@atlaskit/icon/glyph/notification';

import { SkeletonIconButton } from './components/SkeletonIconButton';

export const SkeletonNotificationButton = ({
  label = '',
}: {
  label: string;
}) => (
  <SkeletonIconButton>
    <NotificationIcon label={label} />
  </SkeletonIconButton>
);
