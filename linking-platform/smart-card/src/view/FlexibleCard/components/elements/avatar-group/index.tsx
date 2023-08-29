/** @jsx jsx */
import React, { useMemo } from 'react';
import { css, jsx } from '@emotion/react';

import AtlaskitAvatarGroup from '@atlaskit/avatar-group';
import { SmartLinkSize } from '../../../../../constants';
import { AvatarGroupProps } from './types';
import { messages } from '../../../../../messages';
import { useIntl, IntlShape } from 'react-intl-next';
import { ElementName } from '../../../../../constants';
import { getFormattedMessageAsString } from '../../utils';

const MAX_COUNT = 4;

const getStyles = (size: SmartLinkSize) => {
  const styles = css`
    display: inline-flex;
    ul,
    ul {
      margin-right: 0.5rem;
      margin-top: 0;
    }
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

const getPersonNameWithPrefix = (
  elementName: ElementName,
  personName: string,
  intl: IntlShape,
): string | null => {
  switch (elementName) {
    case ElementName.AssignedToGroup:
      return getFormattedMessageAsString(
        intl,
        messages.assigned_to,
        personName,
      );
    case ElementName.OwnedByGroup:
      return getFormattedMessageAsString(intl, messages.owned_by, personName);
    case ElementName.AuthorGroup:
      return getFormattedMessageAsString(intl, messages.created_by, personName);
    default:
      return personName;
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
  showNamePrefix = false,
}) => {
  const intl = useIntl();

  const data = useMemo(() => {
    if (name && showNamePrefix) {
      return items.map((person) => {
        return {
          ...person,
          name: getPersonNameWithPrefix(name, person.name, intl) || person.name,
        };
      });
    }
    return items;
  }, [name, items, showNamePrefix, intl]);

  if (!data.length) {
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
        data={data}
        testId={testId}
      />
    </span>
  );
};

export default AvatarGroup;
