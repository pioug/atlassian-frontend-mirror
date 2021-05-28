// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import Tooltip from '@atlaskit/tooltip';

import { Gap } from '../examples-util/helpers';
import Avatar, { AvatarItem } from '../src';

export default () => (
  <div style={{ padding: 20, width: 200 }}>
    <Tooltip content="John Smith (approved)">
      <Avatar
        name="John Smith"
        onClick={() => {}}
        testId="accessible-avatar-1"
        status="approved"
        label="John Smith (approved)"
      />
    </Tooltip>
    <Gap />
    <Tooltip content="John Smith, ACME co. (approved)">
      <AvatarItem
        avatar={<Avatar status="approved" />}
        onClick={() => {}}
        testId="accessible-avatar-1"
        primaryText="John Smith"
        secondaryText="ACME co."
        label="John Smith, ACME co. (approved)"
      />
    </Tooltip>
  </div>
);
