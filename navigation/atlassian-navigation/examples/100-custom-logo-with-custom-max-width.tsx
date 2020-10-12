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
    logoMaxWidth={300}
  />
);

export default () => (
  <>
    <AtlassianNavigation
      label="site"
      renderProductHome={CustomHome}
      primaryItems={[]}
    />
    <p>
      You can override the max width of a logo with the `logoMaxWidth` prop.
    </p>
  </>
);
