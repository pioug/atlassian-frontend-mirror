import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;

export default () => (
  <div>
    <Breadcrumbs testId="BreadcrumbsTestId" maxItems={2}>
      <BreadcrumbsItem href="/item" text="No icon" />
      <BreadcrumbsItem href="/item" iconBefore={TestIcon} text="Before" />
      <BreadcrumbsItem href="/item" iconAfter={TestIcon} text="After" />
    </Breadcrumbs>
  </div>
);
