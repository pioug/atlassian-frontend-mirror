import React from 'react';
import AtlaskitAvatarGroup from '@atlaskit/avatar-group';
import { SmartLinkSize } from '../../../../../constants';
import { AvatarGroupProps } from './types';

const MAX_COUNT = 4;

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  items = [],
  maxCount = MAX_COUNT,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-avatar-group',
}) => {
  if (!items.length) {
    return null;
  }
  return (
    <AtlaskitAvatarGroup
      maxCount={maxCount}
      appearance="stack"
      size="small"
      data={items}
      testId={testId}
    />
  );
};

export default AvatarGroup;
