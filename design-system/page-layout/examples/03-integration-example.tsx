/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import {
  AtlassianNavigation,
  Create,
  Help,
  PrimaryButton,
  ProductHome,
} from '@atlaskit/atlassian-navigation';
import { ConfluenceIcon, ConfluenceLogo } from '@atlaskit/logo';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import {
  Header,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  SideNavigation,
} from '@atlaskit/side-navigation';

import { Content, LeftSidebar, Main, PageLayout, TopNavigation } from '../src';

export default function ProductLayout() {
  return (
    <PageLayout>
      <TopNavigation
        isFixed={true}
        id="confluence-navigation"
        skipLinkTitle="Confluence Navigation"
      >
        <TopNavigationContents />
      </TopNavigation>
      <Content testId="content">
        <LeftSidebar
          isFixed={false}
          width={450}
          id="project-navigation"
          skipLinkTitle="Project Navigation"
          testId="left-sidebar"
        >
          <SideNavigationContent />
        </LeftSidebar>
        <Main id="main-content" skipLinkTitle="Main Content">
          <div
            css={{
              marginTop: '8px',
            }}
          >
            <h3 css={{ textAlign: 'center' }}>Main Content</h3>
          </div>
        </Main>
      </Content>
    </PageLayout>
  );
}

function TopNavigationContents() {
  return (
    <AtlassianNavigation
      label="site"
      moreLabel="More"
      primaryItems={[
        <PrimaryButton isHighlighted>Item 1</PrimaryButton>,
        <PrimaryButton>Item 2</PrimaryButton>,
        <PrimaryButton>Item 3</PrimaryButton>,
        <PrimaryButton>Item 4</PrimaryButton>,
      ]}
      renderProductHome={ProductHomeExample}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
    />
  );
}

const SideNavigationContent = () => {
  return (
    <SideNavigation label="Project navigation" testId="side-navigation">
      <NavigationHeader>
        <Header description="Sidebar header description">Sidebar Header</Header>
      </NavigationHeader>
      <NestableNavigationContent initialStack={[]}>
        <Section>
          <NestingItem id="1" title="Nested Item">
            <Section title="Group 1">
              <ButtonItem>Item 1</ButtonItem>
              <ButtonItem>Item 2</ButtonItem>
            </Section>
          </NestingItem>
        </Section>
      </NestableNavigationContent>
    </SideNavigation>
  );
};

/*
 * Components for composing top and side navigation
 */

export const DefaultCreate = () => (
  <Create
    buttonTooltip="Create"
    iconButtonTooltip="Create"
    onClick={() => {}}
    text="Create"
  />
);

const ProductHomeExample = () => (
  <ProductHome
    onClick={console.log}
    icon={ConfluenceIcon}
    logo={ConfluenceLogo}
    siteTitle="Product"
  />
);

export const HelpPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      placement="bottom-start"
      content={HelpPopupContent}
      isOpen={isOpen}
      onClose={onClose}
      trigger={(triggerProps) => (
        <Help
          isSelected={isOpen}
          onClick={onClick}
          tooltip="Help"
          {...triggerProps}
        />
      )}
    />
  );
};

const HelpPopupContent = () => (
  <MenuGroup>
    <Section title={'Menu Heading'}>
      <ButtonItem>Item 1</ButtonItem>
      <ButtonItem>Item 2</ButtonItem>
      <ButtonItem>Item 3</ButtonItem>
      <ButtonItem>Item 4</ButtonItem>
    </Section>
    <Section title="Menu Heading with separator" hasSeparator>
      <ButtonItem>Item 5</ButtonItem>
      <ButtonItem>Item 6</ButtonItem>
    </Section>
  </MenuGroup>
);
