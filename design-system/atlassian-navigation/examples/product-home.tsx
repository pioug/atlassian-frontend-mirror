import React from 'react';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

import { AtlassianNavigation, ProductHome } from '../src';

const Home = () => (
  <ProductHome
    href="#"
    siteTitle="Hello"
    icon={AtlassianIcon}
    logo={AtlassianLogo}
  />
);

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={Home}
    primaryItems={[]}
  />
);
