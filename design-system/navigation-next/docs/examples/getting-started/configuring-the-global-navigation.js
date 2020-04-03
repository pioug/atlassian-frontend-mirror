import React from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import { AtlassianIcon } from '@atlaskit/logo';
import { LayoutManager, NavigationProvider } from '../../../src';

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <AtlassianIcon size="medium" />}
    onProductClick={() => {}}
  />
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={MyGlobalNavigation}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      <div css={{ padding: '32px 40px' }}>Page content goes here.</div>
    </LayoutManager>
  </NavigationProvider>
);
