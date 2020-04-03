import React from 'react';
import { LayoutManager, NavigationProvider } from '../../../src';

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={() => null}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      <div css={{ padding: '32px 40px' }}>Page content goes here.</div>
    </LayoutManager>
  </NavigationProvider>
);
