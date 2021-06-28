import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../../src';

const BreadcrumbsItemTextExample = () => {
  return (
    <Breadcrumbs>
      <BreadcrumbsItem text="Atlassian" />
      <BreadcrumbsItem text="Design System" />
    </Breadcrumbs>
  );
};

export default BreadcrumbsItemTextExample;
