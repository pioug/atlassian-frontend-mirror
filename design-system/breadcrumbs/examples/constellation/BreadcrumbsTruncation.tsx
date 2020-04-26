import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../../src';

export default () => (
  <Breadcrumbs>
    <BreadcrumbsItem
      truncationWidth={200}
      href="/long"
      text="Supercalifragilisticexpialidocious"
    />
    <BreadcrumbsItem href="/short" text="Item" />
    <BreadcrumbsItem href="/short" text="Another item" />
    <BreadcrumbsItem
      truncationWidth={200}
      href="/long"
      text="Another long item name which should be truncated"
    />
    <BreadcrumbsItem href="/short" text="Another item" />
    <BreadcrumbsItem href="/short" text="Another item" />
    <BreadcrumbsItem href="/short" text="Another item" />
    <BreadcrumbsItem
      href="/long"
      text="This will only truncate if it cannot fit on a line"
    />
  </Breadcrumbs>
);
