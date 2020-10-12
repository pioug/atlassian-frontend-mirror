import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Header for the side navigation that is composed of navigation header and header components.
  By default it will _not be interactive_ -
  however you can pass in your own custom component to make it interactive.

  ${code`
import { NavigationHeader, Header } from '@atlaskit/side-navigation';

<NavigationHeader>
  <Header>My header</Header>
</NavigationHeader>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/navigation-header.tsx').default}
      source={require('!!raw-loader!../examples/navigation-header.tsx')}
    />
  )}

  ${(
    <Props
      heading="Navigation header props"
      props={require('!!extract-react-types-loader!../src/components/NavigationHeader')}
    />
  )}

  ${(
    <Props
      heading="Header props"
      props={require('!!extract-react-types-loader!../src/components/Header')}
    />
  )}
`;
