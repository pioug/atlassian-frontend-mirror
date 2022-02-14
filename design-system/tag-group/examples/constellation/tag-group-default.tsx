/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Tag, { SimpleTag } from '@atlaskit/tag';

import TagGroup from '../../src';

const layoutStyles = css({
  display: 'flex',
  padding: '24px 0',
  gap: 24,
  flexDirection: 'column',
});

export default () => (
  <div css={layoutStyles}>
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
