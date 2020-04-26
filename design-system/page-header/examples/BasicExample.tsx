import React from 'react';

import { BreadcrumbsItem, BreadcrumbsStateless } from '@atlaskit/breadcrumbs';

import PageHeader from '../src';

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </BreadcrumbsStateless>
);

export default () => (
  <PageHeader breadcrumbs={breadcrumbs}>
    Title describing the content
  </PageHeader>
);
