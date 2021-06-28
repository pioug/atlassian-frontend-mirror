import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

import PageHeader from '../../src';

const breadcrumbs = (
  <Breadcrumbs onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </Breadcrumbs>
);

const PageHeaderDefaultExample = () => {
  return (
    <PageHeader breadcrumbs={breadcrumbs}>
      Title describing what content to expect on the page
    </PageHeader>
  );
};

export default PageHeaderDefaultExample;
