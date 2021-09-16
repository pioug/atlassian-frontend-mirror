import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => (
  // with many items, inside a container
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  <div style={{ maxWidth: '500px', border: '1px solid black' }}>
    <Breadcrumbs testId="BreadcrumbsTestId">
      <BreadcrumbsItem href="/item" text="Item" />
      <BreadcrumbsItem href="/item" text="Another item" />
      <BreadcrumbsItem href="/item" text="A third item" />
      <BreadcrumbsItem
        href="/item"
        text="A fourth item with a very long name"
      />
      <BreadcrumbsItem href="/item" text="Yet another item" />
      <BreadcrumbsItem href="/item" text="An item" />
      <BreadcrumbsItem href="/item" text="The next item" />
      <BreadcrumbsItem href="/item" text="The item after the next item" />
      <BreadcrumbsItem href="/item" text="The ninth item" />
      <BreadcrumbsItem href="/item" text="Item ten" />
      <BreadcrumbsItem href="/item" text="The last item" />
    </Breadcrumbs>
  </div>
);
