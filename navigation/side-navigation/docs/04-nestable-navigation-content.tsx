import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Used as the container for navigation items with nested views.
  If you have no need for nested views you'll want to check out the [navigation content](/packages/navigation/side-navigation/docs/navigation-content) component instead!

  Nested views are enabled by composing [nesting item](/packages/navigation/side-navigation/docs/nesting-item) components inside this one.

  ${code`highlight=1-4,10-11,15-16
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
      Component={require('../examples/00-nested-side-navigation').default}
      source={require('!!raw-loader!../examples/00-nested-side-navigation')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/NestableNavigationContent')}
    />
  )}

  ## Custom children

  Sometimes you'll want to use components that aren't supplied by this library,
  and that's great!
  However you'll need to know that when you do if you don't opt into our "should I render" hook -
  your element will be rendered on _every_ nested view,
  which may or may not be what you want to happen.

  When writing a leaf node component,
  you'll want to conditionally return \`null\`:

  ${code`
import { useShouldNestedElementRender } from '@atlaskit/side-navigation';

const CustomLeafNode = props => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return null;
  }
  return <div>hello world</div>;
);
  `}

  When writing a wrapping component,
  you'll want to conditionally return \`children\`:

  ${code`
import { useShouldNestedElementRender } from '@atlaskit/side-navigation';

const CustomWrapper = props => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return props.children;
  }
  return <div>{props.children}</div>;
);
  `}

  You can see an example of this below.

  ${(
    <Example
      title=""
      Component={require('../examples/custom-nested-children').default}
      source={require('!!raw-loader!../examples/custom-nested-children')}
    />
  )}
`;
