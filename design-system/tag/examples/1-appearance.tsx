import React from 'react';

import Avatar from '@atlaskit/avatar';

import RemovableTag from '../src/tag/removable-tag';
import Tag from '../src/tag/simple-tag';

export default () => (
  <div id="appearance">
    <Tag text="Base Tag" appearance="rounded" />
    <Tag
      appearance="rounded"
      text="Avatar Before"
      elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
    />
    <RemovableTag
      appearance="rounded"
      text="Avatar Before"
      testId="avatarTag"
      elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
    />
    <Tag text="Linked Tag" href="/components/tag" appearance="rounded" />
  </div>
);
