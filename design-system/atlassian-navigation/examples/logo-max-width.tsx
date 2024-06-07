import React from 'react';

import {
  JiraServiceManagementIcon,
  JiraServiceManagementLogo,
} from '@atlaskit/logo';

import { AtlassianNavigation, CustomProductHome, ProductHome } from '../src';

import customIcon from './shared/assets/atlassian-icon.png';
import customLogo from './shared/assets/custom-logo-wide.png';

const Home = () => (
  <ProductHome
    href="#"
    icon={JiraServiceManagementIcon}
    logo={JiraServiceManagementLogo}
    logoMaxWidth={200}
  />
);

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
      label="example of product home with a non-default value for logoMaxWidth"
      renderProductHome={Home}
      primaryItems={[]}
      testId="product-home"
    />
    <AtlassianNavigation
      label="example of a custom product home with a non-default value for logoMaxWidth"
      renderProductHome={CustomHome}
      primaryItems={[]}
      testId="custom-product-home"
    />
  </>
);
