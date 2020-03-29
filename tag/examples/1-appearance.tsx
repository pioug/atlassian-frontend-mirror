import React from 'react';
import Avatar from '@atlaskit/avatar';
import Tag from '../src';

export default () => (
  <div>
    <Tag text="Base Tag" appearance="rounded" />
    <Tag
      appearance="rounded"
      text="Avatar Before"
      elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
    />
    <Tag text="Linked Tag" href="/components/tag" appearance="rounded" />
    <Tag
      text="Removable button"
      removeButtonText="Remove"
      appearance="rounded"
    />
  </div>
);
