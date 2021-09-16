/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => (
  // with many items, and a maximum to display set
  <div>
    <p>Should automatically collapse if there are more than 5 items</p>
    <div style={{ maxWidth: '500px', border: '1px solid black' }}>
      <p>Exactly 5 items</p>
      <Breadcrumbs maxItems={5}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
        <BreadcrumbsItem
          href="/item"
          text="A fourth item with a very long name"
        />
        <BreadcrumbsItem href="/item" text="Item 5" />
      </Breadcrumbs>
    </div>
    <div style={{ maxWidth: '500px', border: '1px solid black' }}>
      <p>6 items</p>
      <Breadcrumbs maxItems={5}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
        <BreadcrumbsItem
          href="/item"
          text="A fourth item with a very long name"
        />
        <BreadcrumbsItem href="/item" text="Item 5" />
        <BreadcrumbsItem href="/item" text="A sixth item" />
      </Breadcrumbs>
    </div>
  </div>
);
