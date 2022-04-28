/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';

import AtlaskitAvatarGroup from '@atlaskit/avatar-group';
import { SmartLinkSize } from '../../../../../constants';
import { AvatarGroupProps } from './types';

const MAX_COUNT = 4;

const getStyles = (size: SmartLinkSize) => {
  switch (size) {
    case SmartLinkSize.XLarge:
    case SmartLinkSize.Large:
      // Default AK small size
      return;
    case SmartLinkSize.Medium:
    case SmartLinkSize.Small:
    default:
      return css`
        li {
          span,
          svg {
            max-height: 1.25rem;
            max-width: 1.25rem;
          }
        }
      `;
  }
};

/**
 * An element that displays a group of avatars.
 * @public
 * @param {AvatarGroupProps} AvatarGroupProps - The props necessary for the AvatarGroup.
 * @see AuthorGroup
 * @see CollaboratorGroup
 */
const AvatarGroup: React.FC<AvatarGroupProps> = ({
  items = [],
  maxCount = MAX_COUNT,
  overrideCss,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-avatar-group',
}) => {
  if (!items.length) {
    return null;
  }
  return (
    <span
      css={[getStyles(size), overrideCss]}
      data-smart-element-avatar-group
      data-testid={testId}
    >
      <AtlaskitAvatarGroup
        maxCount={maxCount}
        appearance="stack"
        size="small"
        data={items}
        testId={testId}
      />
    </span>
  );
};

export default AvatarGroup;
