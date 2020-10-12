import React from 'react';

import { AtlassianNavigation, Search } from '../src';

const onClick = (...args: any[]) => {
  console.log('search click', ...args);
};

const DefaultSearch = () => (
  <Search
    onClick={onClick}
    placeholder="Search..."
    tooltip="Search"
    label="Search"
  />
);

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    renderSearch={DefaultSearch}
    primaryItems={[]}
  />
);
