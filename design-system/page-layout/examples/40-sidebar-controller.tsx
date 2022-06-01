import React from 'react';

import { ButtonItem, Section } from '@atlaskit/menu';
import {
  Header,
  NavigationHeader,
  NestableNavigationContent,
  SideNavigation,
} from '@atlaskit/side-navigation';

import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  usePageLayoutResize,
} from '../src';

import { SlotLabel } from './common';

const SidebarControls = () => {
  const { collapseLeftSidebar } = usePageLayoutResize();
  return <ButtonItem onClick={collapseLeftSidebar}>Collapse</ButtonItem>;
};

const SidebarControllerExample = () => {
  return (
    <PageLayout>
      <Content>
        <LeftSidebar width={450}>
          <SideNavigation label="Project navigation">
            <NavigationHeader>
              <Header description="Sidebar header description">
                Sidebar Header
              </Header>
            </NavigationHeader>
            <NestableNavigationContent initialStack={[]}>
              <Section>
                <SidebarControls />
              </Section>
            </NestableNavigationContent>
          </SideNavigation>
        </LeftSidebar>
        <Main>
          <SlotLabel>Main Content</SlotLabel>
        </Main>
      </Content>
    </PageLayout>
  );
};

export default SidebarControllerExample;
