import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`

  ## Documentation

  All the documentation can be found in the **sidebar nav links** 👈

  - [Atlassian navigation](atlassian-navigation/docs/atlassian-navigation)
  - [Product home](atlassian-navigation/docs/product-home)
  - [App switcher](atlassian-navigation/docs/app-switcher)
  - [Create](atlassian-navigation/docs/create)
  - [Primary actions](atlassian-navigation/docs/primary-actions)
  - [Secondary actions](atlassian-navigation/docs/secondary-actions)
  - [Theming](atlassian-navigation/docs/theming)
  - [Overflow menu](atlassian-navigation/docs/overflow-menu)
  - [Migrating from navigation-next](atlassian-navigation/docs/migrating-from-navigation-next)

  ## Usage

  ${code`
import React, { useState } from 'react';
import { AtlassianNavigation, ProductHome, PrimaryButton } from '../src';

const AtlassianHome = () => (
  <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />
);

<AtlassianNavigation
  renderProductHome={AtlassianHome}
  primaryItems={[
    <PrimaryButton>Issues</PrimaryButton>
  ]}
/>
  `}

  ${(
    <Example
      title="Atlassian navigation"
      Component={require('../examples/barebones.tsx').default}
      source={require('!!raw-loader!../examples/barebones.tsx')}
    />
  )}
`;
