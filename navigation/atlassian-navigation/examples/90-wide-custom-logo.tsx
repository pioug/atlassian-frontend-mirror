import React from 'react';

import { AtlassianNavigation, CustomProductHome } from '../src';

import customIcon from './shared/assets/atlassian-icon.png';
import customLogo from './shared/assets/custom-logo-wide.png';

const CustomHome = () => (
  <CustomProductHome
    href="#"
    iconAlt="Atlassian Documentation"
    iconUrl={customIcon}
    logoAlt="Atlassian Documentation"
    logoUrl={customLogo}
  />
);

export default () => (
  <>
    <AtlassianNavigation
      label="site"
      renderProductHome={CustomHome}
      primaryItems={[]}
    />
    <p>Custom logos will get a default max width of 260px applied.</p>
  </>
);
