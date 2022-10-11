/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import AtlaskitAvatarGroup from '@atlaskit/avatar-group';
import { SmartLinkSize } from '../../../../../constants';
import { AvatarGroupProps } from './types';

const MAX_COUNT = 4;

const getStyles = (size: SmartLinkSize) => {
  const styles = css`
    display: inline-flex;
  `;
  switch (size) {
    case SmartLinkSize.XLarge:
    case SmartLinkSize.Large:
      // Default AK small size
      return styles;
    case SmartLinkSize.Medium:
    case SmartLinkSize.Small:
    default:
      return css`
        ${styles}
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
 * A base element that displays a group of avatars.
 * @internal
 * @param {AvatarGroupProps} AvatarGroupProps - The props necessary for the AvatarGroup.
 * @see AuthorGroup
 * @see CollaboratorGroup
 */
const AvatarGroup: React.FC<AvatarGroupProps> = ({
  items = [],
  maxCount = MAX_COUNT,
  name,
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
      data-fit-to-content
      data-smart-element={name}
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
