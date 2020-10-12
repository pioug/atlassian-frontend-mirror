import React from 'react';

import { AtlassianNavigation, PrimaryDropdownButton } from '../src';

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    primaryItems={[
      <PrimaryDropdownButton>Explore</PrimaryDropdownButton>,
      <PrimaryDropdownButton>Issues</PrimaryDropdownButton>,
      <PrimaryDropdownButton>Services</PrimaryDropdownButton>,
    ]}
  />
);
