import React from 'react';

import Tag, { SimpleTag } from '@atlaskit/tag';

import TagGroup from '../../src';

export default () => (
  <div css={{ '> *': { margin: '24px 0' } }}>
    <TagGroup>
      <SimpleTag text="Tag" />
      <SimpleTag text="Tag" />
      <SimpleTag text="Tag" />
      <SimpleTag text="Tag" />
    </TagGroup>
    <TagGroup>
      <SimpleTag text="Tag link" href="/components/tag-group" />
      <SimpleTag text="Tag link" href="/components/tag-group" />
      <SimpleTag text="Tag link" href="/components/tag-group" />
      <SimpleTag text="Tag link" href="/components/tag-group" />
    </TagGroup>
    <TagGroup>
      <SimpleTag text="Rounded tag" appearance="rounded" />
      <SimpleTag text="Rounded tag" appearance="rounded" />
      <SimpleTag text="Rounded tag" appearance="rounded" />
      <SimpleTag text="Rounded tag" appearance="rounded" />
    </TagGroup>
    <TagGroup>
      <Tag text="Removable tag" removeButtonLabel="Remove" />
      <Tag text="Removable tag" removeButtonLabel="Remove" />
      <Tag text="Removable tag" removeButtonLabel="Remove" />
      <Tag text="Removable tag" removeButtonLabel="Remove" />
    </TagGroup>
  </div>
);
