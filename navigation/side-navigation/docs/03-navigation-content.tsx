import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Used as the container for navigation items.
  This is useful for a single level navigation with no need for nested views.
  If you have a need for that -
  you'll want to check out the [nestable navigation content](/packages/navigation/side-navigation/docs/nestable-navigation-content) component!

  ${code`highlight=1,7,11
import { NavigationContent } from '@atlaskit/side-navigation';

<NavigationHeader label="project">
  <NavigationHeader>
    <Header>Money machine</Header>
  </NavigationHeader>
  <NavigationContent>
    <Section>
      <ButtonItem>Print money</ButtonItem>
    </Section>
  </NavigationContent>
</NavigationHeader>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/navigation-content').default}
      source={require('!!raw-loader!../examples/navigation-content')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/NavigationContent')}
    />
  )}
`;
