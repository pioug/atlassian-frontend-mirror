import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

import PageHeader from '../src';

const breadcrumbs = (
  <Breadcrumbs onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </Breadcrumbs>
);

export default () => (
  <PageHeader breadcrumbs={breadcrumbs}>
    Title describing the content
  </PageHeader>
);
