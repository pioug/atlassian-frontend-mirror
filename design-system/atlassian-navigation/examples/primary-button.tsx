import React from 'react';

import { AtlassianNavigation, PrimaryButton } from '../src';

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    primaryItems={[
      <PrimaryButton>Explore</PrimaryButton>,
      <PrimaryButton>Issues</PrimaryButton>,
      <PrimaryButton>Services</PrimaryButton>,
    ]}
  />
);
