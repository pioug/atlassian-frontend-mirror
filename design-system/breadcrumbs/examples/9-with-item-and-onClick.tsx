import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

const clickPreventDefaultHandler = (e: React.MouseEvent) => {
  e.preventDefault();
  console.log('Click with prevent default');
};

export default () => (
  // item with href and onClick handler
  <div>
    <Breadcrumbs>
      <BreadcrumbsItem
        href="/item1"
        onClick={clickPreventDefaultHandler}
        text="Item1 with onClick which prevents default"
      />
      <BreadcrumbsItem
        href="/item2"
        onClick={clickPreventDefaultHandler}
        text="Item2 with onClick which prevents default"
      />
    </Breadcrumbs>
  </div>
);
