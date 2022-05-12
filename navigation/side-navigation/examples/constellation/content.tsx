import React from 'react';

import {
  ButtonItem,
  Header,
  NavigationContent,
  NavigationHeader,
  Section,
  SideNavigation,
} from '../../src';
import AppFrame from '../common/app-frame';

const ContentExample = () => {
  return (
    <AppFrame hideAppBar>
      <SideNavigation label="project">
        <NavigationHeader>
          <Header>Money machine</Header>
        </NavigationHeader>
        <NavigationContent showTopScrollIndicator>
          <Section>
            <ButtonItem>Print money</ButtonItem>
          </Section>
        </NavigationContent>
      </SideNavigation>
    </AppFrame>
  );
};

export default ContentExample;
