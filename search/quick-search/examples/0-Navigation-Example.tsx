import React from 'react';
import Navigation, { AkSearchDrawer } from '@atlaskit/navigation';

import BasicQuickSearch from './utils/BasicQuickSearch';

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
        <BasicQuickSearch fakeNetworkLatency={500} />
      </AkSearchDrawer>,
    ]}
  />
);
