import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../../src';

export default function Example() {
  return (
    <Breadcrumbs>
      <BreadcrumbsItem text="Atlassian" />
      <BreadcrumbsItem text="Design System" />
    </Breadcrumbs>
  );
}
