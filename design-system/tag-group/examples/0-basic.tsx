import React from 'react';

import Tag, { SimpleTag } from '@atlaskit/tag';

import TagGroup from '../src';

export default () => (
  <div>
    <TagGroup>
      <SimpleTag text="Base Tag" testId="standard" />
      <SimpleTag text="Linked Tag" href="/components/tag" />
      <SimpleTag text="Rounded Tag" appearance="rounded" />
      <Tag text="Removable button" removeButtonLabel="Aria label" />
    </TagGroup>
    <TagGroup alignment="end">
      <SimpleTag text="Base Tag" />
      <SimpleTag text="Linked Tag" href="/components/tag" />
      <SimpleTag text="Rounded Tag" appearance="rounded" />
      <Tag text="Removable button" removeButtonLabel="Aria label" />
    </TagGroup>
  </div>
);
