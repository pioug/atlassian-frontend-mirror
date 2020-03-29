import React from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => (
  // with many items, and a maximum to display set
  <div>
    <p>Should automatically collapse if there are more than 5 items</p>
    <div>
      <Breadcrumbs maxItems={5} testId="MyBreadcrumbsTestId">
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem
          href="/packages/core/breadcrumbs"
          text="The item with testId"
          testId="myBreadcrumbsItemTestId"
        />
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
