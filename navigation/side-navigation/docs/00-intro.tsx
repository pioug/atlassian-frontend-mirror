import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`

  ## Documentation

  All the documentation can be found in the **sidebar nav links**  👈

  - [Side navigation](side-navigation/docs/side-navigation)
  - [Navigation header](side-navigation/docs/navigation-header)
  - [Navigation content](side-navigation/docs/navigation-content)
  - [Nestable navigation content](side-navigation/docs/nestable-navigation-content)
  - [Navigation footer](side-navigation/docs/navigation-content)
  - [Loading states](side-navigation/docs/loading-states)
  - [Button item](side-navigation/docs/button-item)
  - [Custom item](side-navigation/docs/custom-item)
  - [Go back item](side-navigation/docs/go-back-item)
  - [Link item](side-navigation/docs/link-item)
  - [Nesting item](side-navigation/docs/nesting-item)
  - [Heading item](side-navigation/docs/heading-item)
  - [Section](side-navigation/docs/section)
  - [Skeleton item](side-navigation/docs/skeleton-item)
  - [Skeleton heading item](side-navigation/docs/skeleton-heading-item)

  ## Usage

  ${code`
import {
  SideNavigation,
  Section,
  NavigationHeader,
  Header,
  NestableNavigationContent,
  ButtonItem,
  NestingItem,
  Footer,
  NavigationFooter,
} from '@atlaskit/side-navigation';

<SideNavigation label="project">
  <NavigationHeader>
    <Header>NXTGen Industries</Header>
  </NavigationHeader>
  <NestableNavigationContent>
    <Section>
      <ButtonItem>Your work</ButtonItem>
      <NestingItem title="Filters">
        <Section>
          <ButtonItem>Search issues</ButtonItem>
        </Section>
      </NestingItem>
    </Section>
  </NestableNavigationContent>
  <NavigationFooter>
    <Footer>You're in a next-gen project</Footer>
  </NavigationFooter>
</SideNavigation>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/00-nested-side-navigation').default}
      source={require('!!raw-loader!../examples/00-nested-side-navigation')}
      packageName="@atlaskit/sidebar-navigation"
    />
  )}
`;
