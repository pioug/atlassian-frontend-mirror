import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../../src';

const BreadcrumbsMaxItemsExample = () => {
  return (
    <Breadcrumbs maxItems={3}>
      <BreadcrumbsItem href="/item" text="Item 1" />
      <BreadcrumbsItem href="/item" text="Item 2" />
      <BreadcrumbsItem href="/item" text="Item 3" />
      <BreadcrumbsItem href="/item" text="Item 4" />
      <BreadcrumbsItem href="/item" text="Item 5" />
      <BreadcrumbsItem href="/item" text="Item 6" />
    </Breadcrumbs>
  );
};

export default BreadcrumbsMaxItemsExample;
