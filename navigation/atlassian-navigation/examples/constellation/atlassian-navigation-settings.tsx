import React from 'react';

import { AtlassianNavigation, Settings } from '../../src';

const DefaultSettings = () => <Settings tooltip="Product settings" />;

const SettingsExample = () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    renderSettings={DefaultSettings}
    primaryItems={[]}
  />
);

export default SettingsExample;
