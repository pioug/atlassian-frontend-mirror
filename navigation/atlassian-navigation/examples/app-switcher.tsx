import React from 'react';

import { AppSwitcher, AtlassianNavigation } from '../src';

const DefaultAppSwitcher = () => <AppSwitcher tooltip="Switch to..." />;

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    renderAppSwitcher={DefaultAppSwitcher}
    primaryItems={[]}
  />
);
