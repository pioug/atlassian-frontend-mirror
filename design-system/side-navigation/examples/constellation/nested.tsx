import React from 'react';

import {
  ButtonItem,
  Header,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  Section,
  SideNavigation,
} from '../../src';
import AppFrame from '../common/app-frame';

const NestedExample = () => {
  return (
    <AppFrame shouldHideAppBar>
      <SideNavigation label="project">
        <NavigationHeader>
          <Header>Designing web navigation</Header>
        </NavigationHeader>
        <NestableNavigationContent>
          <Section>
            <NestingItem id="component-menu" title="Navigation components">
              <Section>
                <ButtonItem>Side navigation</ButtonItem>
              </Section>
            </NestingItem>
          </Section>
        </NestableNavigationContent>
      </SideNavigation>
    </AppFrame>
  );
};

export default NestedExample;
