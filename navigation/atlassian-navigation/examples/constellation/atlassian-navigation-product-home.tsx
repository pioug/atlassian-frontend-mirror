import React from 'react';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

import { AtlassianNavigation, ProductHome } from '../../src';

const AtlassianHome = () => (
  <ProductHome
    href="#"
    siteTitle="Hello"
    icon={AtlassianIcon}
    logo={AtlassianLogo}
  />
);

const ProductHomeExample = () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={AtlassianHome}
    primaryItems={[]}
  />
);

export default ProductHomeExample;
