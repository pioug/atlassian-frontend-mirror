import React from 'react';
import Navigation, { AkSearchDrawer } from '@atlaskit/navigation';

import { QuickSearch } from '../src';

const noop = () => {};

export default () => (
  <Navigation
    drawers={[
      <AkSearchDrawer
        backIcon={null}
        isOpen
        key="search"
        onBackButton={noop}
        primaryIcon={null}
      >
        <QuickSearch
          isLoading={false}
          inputControls={<button>Test Button</button>}
          children={null}
        />
      </AkSearchDrawer>,
    ]}
  />
);
