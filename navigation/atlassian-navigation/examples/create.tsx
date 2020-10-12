import React from 'react';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

import { AtlassianNavigation, Create, ProductHome } from '../src';

const CreateButton = () => (
  <Create
    buttonTooltip="I'm shown on bigger viewports"
    iconButtonTooltip="I'm shown when on smaller viewports"
    text="Create"
    onClick={console.log}
  />
);

const Home = () => <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />;

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={Home}
    renderCreate={CreateButton}
    primaryItems={[]}
  />
);
