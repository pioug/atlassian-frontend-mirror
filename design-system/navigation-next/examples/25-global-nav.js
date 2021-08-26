import React, { Component, Fragment } from 'react';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import {
  DropdownItem,
  DropdownItemGroup,
  DropdownMenuStateless,
} from '@atlaskit/dropdown-menu';
import CreateIcon from '@atlaskit/icon/glyph/add';
import HelpIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import StarIcon from '@atlaskit/icon/glyph/star';
import { AtlassianIcon } from '@atlaskit/logo';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

import {
  GlobalItem,
  GlobalNav,
  GlobalNavigationSkeleton,
  modeGenerator,
  ThemeProvider,
} from '../src';

class GlobalItemWithDropdown extends Component {
  state = {
    isOpen: false,
  };

  handleOpenChange = ({ isOpen }) => this.setState({ isOpen });

  render() {
    const { items, trigger: Trigger } = this.props;
    const { isOpen } = this.state;
    return (
      <DropdownMenuStateless
        boundariesElement="window"
        isOpen={isOpen}
        onOpenChange={this.handleOpenChange}
        position="right bottom"
        trigger={<Trigger isOpen={isOpen} />}
      >
        {items}
      </DropdownMenuStateless>
    );
  }
}

const ItemComponent = ({ dropdownItems: DropdownItems, ...itemProps }) => {
  if (DropdownItems) {
    return (
      <GlobalItemWithDropdown
        trigger={({ isOpen }) => (
          <GlobalItem isSelected={isOpen} {...itemProps} />
        )}
        items={<DropdownItems />}
      />
    );
  }
  return <GlobalItem {...itemProps} />;
};

const Row = (props) => (
  <div css={{ display: 'flex', flexDirection: 'row' }} {...props} />
);
const Variation = (props) => (
  <div
    css={{ display: 'flex', flexDirection: 'row', padding: '0 40px' }}
    {...props}
  />
);
const Title = (props) => (
  <div
    css={{
      fontWeight: 'bold',
      marginRight: 20,
      paddingTop: 20,
      textAlign: 'right',
      width: 80,
    }}
    {...props}
  />
);

const GlobalNavWithRegularItems = () => (
  <GlobalNav
    primaryItems={[
      {
        icon: () => <AtlassianIcon label="Atlassian" size="medium" />,
        id: 'logo',
        tooltip: 'Atlassian',
        onClick: () => console.log('Logo item clicked'),
      },
      {
        icon: StarIcon,
        id: 'star',
        tooltip: 'Starred and recent',
        onClick: () => console.log('Search item clicked'),
      },
      {
        icon: SearchIcon,
        id: 'search',
        tooltip: 'Search',
        onClick: () => console.log('Search item clicked'),
      },
      {
        icon: CreateIcon,
        id: 'create',
        tooltip: 'Create',
        onClick: () => console.log('Create item clicked'),
      },
    ]}
    secondaryItems={[
      {
        icon: HelpIcon,
        id: 'help',
        onClick: () => console.log('Help item clicked'),
        tooltip: 'Help',
      },
      {
        component: ({ className, onClick }) => (
          <span className={className}>
            <Avatar
              borderColor="transparent"
              isActive={false}
              isHover={false}
              size="small"
              onClick={onClick}
            />
          </span>
        ),
        icon: null,
        id: 'profile',
        onClick: () => console.log('Profile item clicked'),
        tooltip: 'Profile',
      },
    ]}
  />
);

const ExampleDropdown = () => (
  <DropdownItemGroup title="Heading">
    <DropdownItem onClick={() => console.log('Dropdown item clicked')}>
      Dropdown item with onClick
    </DropdownItem>
    <DropdownItem href="//atlassian.com" target="_new">
      Dropdown item with href
    </DropdownItem>
  </DropdownItemGroup>
);
const GlobalNavWithDropdowns = () => (
  <GlobalNav
    // eslint-disable-next-line no-undef
    itemComponent={ItemComponent}
    primaryItems={[]}
    secondaryItems={[
      {
        dropdownItems: ExampleDropdown,
        icon: HelpIcon,
        id: 'help',
        onClick: () => console.log('Help item clicked'),
        tooltip: 'Regular item opening a dropdown',
      },
      {
        component: ({ className, onClick }) => (
          <span className={className}>
            <Avatar
              borderColor="transparent"
              isActive={false}
              isHover={false}
              size="small"
              onClick={onClick}
            />
          </span>
        ),
        dropdownItems: ExampleDropdown,
        icon: null,
        id: 'profile',
        onClick: () => console.log('Profile item clicked'),
        tooltip: 'Item with an avatar opening a dropdown',
      },
    ]}
  />
);

// eslint-disable-next-line react/no-multi-comp
class GlobalNavWithModalsAndDrawers extends Component {
  state = {
    isModalOpen: false,
    isDrawerOpen: false,
  };

  openModal = () => this.setState({ isModalOpen: true });

  closeModal = () => this.setState({ isModalOpen: false });

  openDrawer = () => this.setState({ isDrawerOpen: true });

  closeDrawer = () => this.setState({ isDrawerOpen: false });

  render() {
    const { isModalOpen, isDrawerOpen } = this.state;
    return (
      <Fragment>
        <GlobalNav
          // eslint-disable-next-line no-undef
          itemComponent={ItemComponent}
          primaryItems={[
            { component: () => null, icon: () => null, id: 'logo' },
            {
              icon: CreateIcon,
              id: 'create',
              tooltip: 'Open a modal',
              onClick: this.openModal,
            },
            {
              icon: SearchIcon,
              id: 'search',
              tooltip: 'Open a drawer',
              onClick: this.openDrawer,
            },
          ]}
          secondaryItems={[
            {
              dropdownItems: () => (
                <DropdownItemGroup title="Heading">
                  <DropdownItem onClick={this.openModal}>
                    Open a modal
                  </DropdownItem>
                  <DropdownItem onClick={this.openDrawer}>
                    Open a drawer
                  </DropdownItem>
                </DropdownItemGroup>
              ),
              icon: HelpIcon,
              id: 'help',
              tooltip: 'Open dropdown',
            },
          ]}
        />

        <ModalTransition>
          {isModalOpen && (
            <Modal onClose={this.closeModal}>
              <ModalHeader>
                <ModalTitle>Modal Title</ModalTitle>
              </ModalHeader>
              <ModalBody>Modal content</ModalBody>
              <ModalFooter>
                <Button
                  onClick={this.closeModal}
                  autoFocus
                  appearance="primary"
                >
                  Close
                </Button>
              </ModalFooter>
            </Modal>
          )}
        </ModalTransition>

        <Drawer onClose={this.closeDrawer} isOpen={isDrawerOpen} width="wide">
          <code>Drawer contents</code>
        </Drawer>
      </Fragment>
    );
  }
}

const customMode = modeGenerator({
  product: {
    text: colors.N0,
    background: colors.G500,
  },
});

export default () => (
  <Row>
    <Variation>
      <Title>Regular items:</Title>
      <GlobalNavWithRegularItems />
    </Variation>
    <Variation>
      <Title>Opening a dropdown:</Title>
      <GlobalNavWithDropdowns />
    </Variation>
    <Variation>
      <Title>Opening modals and drawers</Title>
      <GlobalNavWithModalsAndDrawers />
    </Variation>
    <Variation>
      <Title>Global nav skeleton</Title>
      <GlobalNavigationSkeleton />
    </Variation>
    <Variation>
      <Title>Global nav skeleton with theming</Title>

      <ThemeProvider
        theme={(theme) => ({ ...theme, mode: customMode, context: 'product' })}
      >
        <GlobalNavigationSkeleton />
      </ThemeProvider>
    </Variation>
  </Row>
);
