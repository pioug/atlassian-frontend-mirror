import React from 'react';

import { AtlassianNavigation, PrimaryDropdownButton } from '../../src';

const PrimaryDropdownExample = () => (
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

export default PrimaryDropdownExample;
