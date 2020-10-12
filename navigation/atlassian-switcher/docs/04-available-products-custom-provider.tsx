import React from 'react';
import { md, code, Example } from '@atlaskit/docs';

export default md`

  The list of available products used to build the switcher is usually fetched from an endpoint
  relative to the product. When there is need to use a different endpoint, the switcher accepts a
  custom provider through the optional prop \`availableProductsDataProvider\`.


  ### Creating a custom provider

  ${code`
import { createAvailableProductsProvider } from '@atlaskit/atlassian-switcher/create-custom-provider';

const customAvailableProductsDataProvider = createAvailableProductsProvider(
  'https://api-private.atlassian.com/available-products/api/available-products'
);
  `}

  ### Passing the custom provider to the switcher

  ${code`
<AtlassianSwitcher
  product="bitbucket"
  availableProductsDataProvider={customAvailableProductsDataProvider}
  disableCustomLinks
  disableRecentContainers
  disableSwitchToHeading
/>
  `}

  ### Passing the custom provider to the prefetch trigger

  ${code`
  <AtlassianSwitcherPrefetchTrigger
    availableProductsDataProvider={customAvailableProductsDataProvider}
  >
    <Button type="button" onClick={this.openDrawer}>
      Open drawer
    </Button>
  </AtlassianSwitcherPrefetchTrigger>
  `}

  ### Example

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={
        require('../examples/42-with-prefetch-and-custom-provider').default
      }
      title="Switcher with prefetch and custom provider"
      source={require('!!raw-loader!../examples/42-with-prefetch-and-custom-provider')}
    />
  )}

  `;
