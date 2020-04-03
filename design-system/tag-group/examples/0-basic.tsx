import React from 'react';
import Tag from '@atlaskit/tag';

import TagGroup from '../src';

export default () => (
  <div>
    <TagGroup>
      <Tag text="Base Tag" />
      <Tag text="Linked Tag" href="/components/tag" />
      <Tag text="Rounded Tag" appearance="rounded" />
      <Tag text="Removable button" removeButtonText="Aria label" />
    </TagGroup>
    <TagGroup alignment="end">
      <Tag text="Base Tag" />
      <Tag text="Linked Tag" href="/components/tag" />
      <Tag text="Rounded Tag" appearance="rounded" />
      <Tag text="Removable button" removeButtonText="Aria label" />
    </TagGroup>
  </div>
);
