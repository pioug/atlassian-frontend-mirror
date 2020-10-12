import React from 'react';

import SettingsIcon from '@atlaskit/icon/glyph/settings';

import { SkeletonIconButton } from './components/SkeletonIconButton';

export const SkeletonSettingsButton = ({ label = '' }: { label: string }) => (
  <SkeletonIconButton>
    <SettingsIcon label={label} />
  </SkeletonIconButton>
);
