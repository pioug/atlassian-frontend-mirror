import React from 'react';

import Avatar from '@atlaskit/avatar';
import HelpIcon from '@atlaskit/icon/glyph/question';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { AtlassianIcon } from '@atlaskit/logo';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

import { GlobalItem } from '../../../src';

export default () => (
  <div
    css={{
      alignItems: 'center',
      backgroundColor: colors.B500,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 8px',
      width: '56px',
    }}
  >
    <GlobalItem icon={() => <AtlassianIcon size="medium" />} />
    <GlobalItem icon={SearchIcon} />
    <GlobalItem icon={HelpIcon} size="small" />
    <GlobalItem
      icon={() => <Avatar borderColor="transparent" size="small" />}
      size="small"
    />
  </div>
);
