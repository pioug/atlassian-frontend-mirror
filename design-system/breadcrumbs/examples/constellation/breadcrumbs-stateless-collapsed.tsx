import React from 'react';

import { BreadcrumbsItem, BreadcrumbsStateless } from '../../src';

export default function Example() {
  return (
    <BreadcrumbsStateless itemsBeforeCollapse={3} itemsAfterCollapse={2}>
      <BreadcrumbsItem href="/item" text="Item 1" />
      <BreadcrumbsItem href="/item" text="Item 2" />
      <BreadcrumbsItem href="/item" text="Item 3" />
      <BreadcrumbsItem href="/item" text="Item 4" />
      <BreadcrumbsItem href="/item" text="Item 5" />
      <BreadcrumbsItem href="/item" text="Item 6" />
      <BreadcrumbsItem href="/item" text="Item 7" />
      <BreadcrumbsItem href="/item" text="Item 8" />
      <BreadcrumbsItem href="/item" text="Item 9" />
      <BreadcrumbsItem href="/item" text="Item 10" />
    </BreadcrumbsStateless>
  );
}
