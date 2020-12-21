import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;

export default () => (
  // with icons
  <div>
    <p>Using itemBefore and itemAfter API</p>
    <Breadcrumbs testId="BreadcrumbsTestId">
      <BreadcrumbsItem href="/item" text="No icon" />
      <BreadcrumbsItem href="/item" iconBefore={TestIcon} text="Before" />
      <BreadcrumbsItem href="/item" iconAfter={TestIcon} text="After" />
      <BreadcrumbsItem
        href="/item"
        iconBefore={TestIcon}
        iconAfter={TestIcon}
        text="Before and after"
      />
      <BreadcrumbsItem
        href="/item"
        iconBefore={TestIcon}
        iconAfter={TestIcon}
        text="Long content, icons before and after"
      />
    </Breadcrumbs>
  </div>
);
