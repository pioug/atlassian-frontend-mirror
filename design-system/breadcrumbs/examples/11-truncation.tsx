import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;

export default () => (
  // with trunaction and icons
  <div>
    <Breadcrumbs testId="MyBreadcrumbsTestId">
      <BreadcrumbsItem
        truncationWidth={200}
        href="/long"
        text="Supercalifragilisticexpialidocious"
      />
      <BreadcrumbsItem truncationWidth={200} href="/short" text="Item" />
      <BreadcrumbsItem
        truncationWidth={200}
        href="/short"
        text="Another item"
      />
      <BreadcrumbsItem
        truncationWidth={200}
        href="/long"
        text="Long item name which should be truncated"
      />
      <BreadcrumbsItem
        truncationWidth={200}
        href="/item"
        iconBefore={TestIcon}
        iconAfter={TestIcon}
        text="Before and after"
      />
      <BreadcrumbsItem
        truncationWidth={200}
        href="/long"
        text="Another long item name which should be truncated"
      />
      <BreadcrumbsItem truncationWidth={200} href="/short" text="Short item" />
      <BreadcrumbsItem
        truncationWidth={200}
        href="/item"
        iconBefore={TestIcon}
        iconAfter={TestIcon}
        text="Long content, icons before and after"
      />
    </Breadcrumbs>
  </div>
);
