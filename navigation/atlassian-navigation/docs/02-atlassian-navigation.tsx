import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  The primary component that will render the horizontal navigation.
  Compose with other components like [product home](product-home),
  [create](create),
  [primary button](primary-button),
  and more to build up your navigation experience.

  ${code`
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation';

<AtlassianNavigation
  primaryItems={[
    <PrimaryButton>Issues</PrimaryButton>,
    <ExploreDropdown />,
  ]}
  renderProductHome={ProductHomeExample}
/>
  `}

  ${(
    <Example
      title="Atlassian navigation"
      Component={require('../examples/barebones.tsx').default}
      source={require('!!raw-loader!../examples/barebones.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/AtlassianNavigation')}
    />
  )}
`;
