import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Breadcrumbs testId="BreadcrumbsTestId">
        <BreadcrumbsItem href="/item" text="item1" />
        <BreadcrumbsItem href="/item" text="item2" />
        <BreadcrumbsItem href="/item" text="item3" />
      </Breadcrumbs>

      <div style={{ marginLeft: token('space.050', '4px') }}>
        <AtlassianIcon label="Test icon" />
      </div>
    </div>
  </div>
);
