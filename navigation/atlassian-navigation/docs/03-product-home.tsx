import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  To be composed with [Atlassian navigation](atlassian-navigation).
  Will render the logo or icon for the consuming product while handling responsive viewports.

  Defining navigation for a product that does not have a logo inside [\`@atlaskit/logo\`](/packages/design-system/logo) or wanting to use a custom logo?
  You'll want to create use the **custom product home** component further below.

  ${code`
import { ProductHome } from '@atlaskit/atlassian-navigation';
import { AtlassianLogo, AtlassianIcon } from '@atlaskit/logo';

<ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />
`}

  ${(
    <Example
      title="Product home"
      Component={require('../examples/product-home.tsx').default}
      source={require('!!raw-loader!../examples/product-home.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/ProductHome/product-home')}
    />
  )}

  ## Custom product home

  If you're making a custom product that doesn't have a readily available logo you'll want to use the custom product home component.

  Are you defining navigation for a product that exists inside [\`@atlaskit/logo\`](/packages/design-system/logo)?
  You'll want to use the **product home component** above.

  ${code`
import { CustomProductHome } from '@atlaskit/atlassian-navigation';
import icon from './shared/assets/atlassian-icon.png';
import logo from './shared/assets/atlassian-logo.png';

export default () => (
  <CustomProductHome
    href="#"
    iconAlt="Atlassian"
    iconUrl={icon}
    logoAlt="Atlassian"
    logoUrl={logo}
  />
);
`}

  ${(
    <Example
      title="Custom product home"
      Component={require('../examples/custom-product-home.tsx').default}
      source={require('!!raw-loader!../examples/custom-product-home.tsx')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/ProductHome/custom-product-home')}
    />
  )}
`;
