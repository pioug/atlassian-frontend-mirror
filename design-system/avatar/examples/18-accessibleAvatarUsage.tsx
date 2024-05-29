// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import Avatar, { AvatarItem } from '../src';

const containerStyle = {
  padding: token('space.250', '20px'),
};

export default () => (
  <>
    {/* These should be replaced by just using a Stack primitive, but can't
    because of a styling issue. See DSP-16480. */}
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
    <div style={containerStyle}>
      <h2>Non-Interactive Elements</h2>
      <Avatar
        name="John Smith"
        testId="accessible-avatar-1"
        status="approved"
      />
      <Avatar name="John Smith" testId="accessible-avatar-1" presence="busy" />
      <AvatarItem
        avatar={<Avatar name="John Smith" status="approved" />}
        testId="accessible-avatar-2"
        primaryText="John Smith"
        secondaryText="ACME co."
      />
      <AvatarItem
        avatar={<Avatar name="John Smith" presence="busy" />}
        testId="accessible-avatar-2"
        primaryText="John Smith"
        secondaryText="ACME co."
      />
    </div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
    <div style={containerStyle}>
      <h2>Interactive Elements</h2>
      <Tooltip content="John Smith (approved)">
        <Avatar
          name="John Smith"
          onClick={() => {}}
          testId="accessible-avatar-3"
          status="approved"
          label="John Smith (approved)"
        />
      </Tooltip>
      <Tooltip content="John Smith (busy)">
        <Avatar
          name="John Smith"
          onClick={() => {}}
          testId="accessible-avatar-3"
          presence="busy"
          label="John Smith (busy)"
        />
      </Tooltip>
      <Tooltip content="John Smith, ACME co. (approved)">
        <AvatarItem
          avatar={<Avatar name="John Smith" status="approved" />}
          onClick={() => {}}
          testId="accessible-avatar-4"
          primaryText="John Smith"
          secondaryText="ACME co."
          label="John Smith, ACME co. (approved)"
        />
      </Tooltip>
      <Tooltip content="John Smith, ACME co. (busy)">
        <AvatarItem
          avatar={<Avatar name="John Smith" presence="busy" />}
          onClick={() => {}}
          testId="accessible-avatar-4"
          primaryText="John Smith"
          secondaryText="ACME co."
          label="John Smith, ACME co. (busy)"
        />
      </Tooltip>
    </div>
  </>
);
