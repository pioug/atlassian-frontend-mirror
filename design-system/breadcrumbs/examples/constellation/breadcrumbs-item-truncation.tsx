import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../../src';

export default function Example() {
  return (
    <Breadcrumbs>
      <BreadcrumbsItem text="Confluence" />
      <BreadcrumbsItem
        truncationWidth={100}
        text="The new Confluence experience will soon be on for everyone"
      />
    </Breadcrumbs>
  );
}
