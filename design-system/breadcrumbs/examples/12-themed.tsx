import React from 'react';

import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

const ThemedBreadCrumbs = () => (
  <AtlaskitThemeProvider mode="dark">
    <Breadcrumbs testId="MyBreadcrumbsTestId">
      <BreadcrumbsItem href="/item" text="item 1" />
      <BreadcrumbsItem href="/item" text="item 2" />
    </Breadcrumbs>
  </AtlaskitThemeProvider>
);

export default ThemedBreadCrumbs;
