import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => (
  // with onClick handler and no href
  <div>
    <Breadcrumbs>
      <BreadcrumbsItem
        onClick={() => console.log('Item1 click')}
        text="Item1 with onClick"
      />
      <BreadcrumbsItem
        onClick={() => console.log('Item2 Click')}
        text="Item2 with onClick"
      />
    </Breadcrumbs>
  </div>
);
