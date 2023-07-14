import React from 'react';

import { AtlassianNavigation, CustomProductHome } from '../../src';
import customIcon from '../shared/assets/atlassian-icon.png';
import customLogo from '../shared/assets/custom-logo-wide.png';

const CustomHome = () => (
  <CustomProductHome
    href="#"
    iconAlt="Atlassian Documentation"
    iconUrl={customIcon}
    logoAlt="Atlassian Documentation"
    logoUrl={customLogo}
    logoMaxWidth={300}
  />
);

const CustomHomeExample = () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={CustomHome}
    primaryItems={[]}
  />
);

export default CustomHomeExample;
