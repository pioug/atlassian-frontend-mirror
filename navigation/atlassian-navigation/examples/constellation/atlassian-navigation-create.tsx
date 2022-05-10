import React from 'react';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

import { AtlassianNavigation, Create, ProductHome } from '../../src';

const CreateButton = () => (
  <Create
    buttonTooltip="Create a new page"
    iconButtonTooltip="Create a new page"
    text="Create"
    href="#"
  />
);

const Home = () => <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />;

const CreateButtonExample = () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={Home}
    renderCreate={CreateButton}
    primaryItems={[]}
  />
);

export default CreateButtonExample;
