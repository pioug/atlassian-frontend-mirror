import React from 'react';

import { AtlassianNavigation, Settings } from '../src';

const DefaultSettings = () => <Settings tooltip="Product settings" />;

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    renderSettings={DefaultSettings}
    primaryItems={[]}
  />
);
