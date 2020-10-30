import React from 'react';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

import { Group, Item } from '../../../src';
import { CONTENT_NAV_WIDTH } from '../../../src/common/constants';

export default () => (
  <div
    css={{
      backgroundColor: colors.N20,
      boxSizing: 'border-box',
      padding: '8px',
      width: `${CONTENT_NAV_WIDTH}px`,
    }}
  >
    <Group heading="Group heading" hasSeparator>
      <Item text="Item" />
      <Item text="Item" />
      <Item text="Item" />
    </Group>
  </div>
);
