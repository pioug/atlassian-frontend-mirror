import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Used to create a nested view inside a [nestable navigation content](/packages/navigation/side-navigation/docs/nestable-navigation-content) component.
  Will only work inside one - if you render it outside you'll get an error.
  You can infinitely nest nesting items,
  but the rule of thumb is try and limit nesting to three layers.

  Will render its children when the view is active,
  else will render itself as a button item waiting to be interacted with.
  Once interacted,
  the nested view will be shown.

  ${code`highlight=7,11
import {
  NestableNavigationContent,
  NestingItem
} from '@atlaskit/side-navigation';

<NavigationHeader label="project">
  <NavigationHeader>
    <Header>Money machine</Header>
  </NavigationHeader>
  <NestableNavigationContent>
    <Section>
      <NestingItem title="Print money">
        <Section>
          <ButtonItem>Money printed</ButtonItem>
        </Section>
      </NestingItem>
    </Section>
  </NestableNavigationContent>
</NavigationHeader>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/nesting-item').default}
      source={require('!!raw-loader!../examples/nesting-item')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/NestingItem/hack-for-ert')}
    />
  )}
`;
