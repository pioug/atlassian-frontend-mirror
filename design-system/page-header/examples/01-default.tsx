import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import __noop from '@atlaskit/ds-lib/noop';

import PageHeader from '../src';

const breadcrumbs = (
  <Breadcrumbs onExpand={__noop}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </Breadcrumbs>
);

const PageHeaderDefaultExample = () => (
  <div data-testid="page-header">
    <PageHeader breadcrumbs={breadcrumbs}>
      Title describing what content to expect on the page
    </PageHeader>
    <div>This is some page content underneath.</div>
  </div>
);

export default PageHeaderDefaultExample;
