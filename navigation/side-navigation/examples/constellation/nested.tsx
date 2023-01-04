/* eslint-disable @repo/internal/react/use-primitives */
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
          <Header>Money machine</Header>
        </NavigationHeader>
        <NestableNavigationContent>
          <Section>
            <NestingItem id="" title="Print money">
              <Section>
                <ButtonItem>Money printed</ButtonItem>
              </Section>
            </NestingItem>
          </Section>
        </NestableNavigationContent>
      </SideNavigation>
    </AppFrame>
  );
};

export default NestedExample;
