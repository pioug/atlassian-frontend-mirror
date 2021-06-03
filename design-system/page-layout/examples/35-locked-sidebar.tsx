import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { ButtonItem, LinkItem, PopupMenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
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
  RightSidebar,
  useLeftSidebarFlyoutLock,
} from '../src';

const PopupMenu = ({ closePopupMenu }: { closePopupMenu: () => void }) => {
  useLeftSidebarFlyoutLock();
  return (
    <PopupMenuGroup>
      <Section title="Starred">
        <ButtonItem onClick={closePopupMenu}>Navigation System</ButtonItem>
      </Section>
      <Section hasSeparator>
        <ButtonItem onClick={closePopupMenu}>Create project</ButtonItem>
      </Section>
    </PopupMenuGroup>
  );
};

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closePopupMenu = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Popup
      placement="bottom-start"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      content={() => <PopupMenu closePopupMenu={closePopupMenu} />}
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          testId="popup-trigger"
          isSelected={isOpen}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          iconAfter={<MoreIcon label="more" />}
        />
      )}
    />
  );
};

const App = () => {
  return (
    <PageLayout>
      <Content>
        <LeftSidebar width={450} testId="left-sidebar">
          <SideNavigation label="Project navigation" testId="side-navigation">
            <NavigationHeader>
              <Header description="Sidebar header description">
                Sidebar Header
              </Header>
            </NavigationHeader>
            <NestableNavigationContent initialStack={[]}>
              <Section>
                <LinkItem iconAfter={<Menu />}>Popup</LinkItem>
              </Section>
            </NestableNavigationContent>
          </SideNavigation>
        </LeftSidebar>
        <Main>
          <div>
            <h3 css={{ textAlign: 'center' }}>Main Content</h3>
          </div>
        </Main>
        <RightSidebar testId="right-sidebar">
          <SideNavigation label="Aside">
            <NavigationHeader>
              <Header>Hello world</Header>
            </NavigationHeader>
          </SideNavigation>
        </RightSidebar>
      </Content>
    </PageLayout>
  );
};

export default App;
