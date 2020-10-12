import React from 'react';

import { AtlassianNavigation, Help } from '../src';

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    renderHelp={() => <Help tooltip="Get help" />}
    primaryItems={[]}
  />
);
