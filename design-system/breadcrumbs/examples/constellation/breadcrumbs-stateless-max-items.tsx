import React from 'react';

import { BreadcrumbsItem, BreadcrumbsStateless } from '../../src';

export default function Example() {
  return (
    <BreadcrumbsStateless maxItems={5}>
      <BreadcrumbsItem href="/item" text="Item 1" />
      <BreadcrumbsItem href="/item" text="Item 2" />
      <BreadcrumbsItem href="/item" text="Item 3" />
      <BreadcrumbsItem href="/item" text="Item 4" />
      <BreadcrumbsItem href="/item" text="Item 5" />
    </BreadcrumbsStateless>
  );
}
