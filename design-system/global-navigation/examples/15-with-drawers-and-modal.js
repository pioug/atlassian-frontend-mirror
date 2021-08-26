import React, { Fragment, Component } from 'react';
import Button from '@atlaskit/button/standard-button';
import { AkFieldRadioGroup as StatelessRadioGroup } from '@atlaskit/field-radio-group';
import { AtlassianIcon } from '@atlaskit/logo';
import Modal, {
  ModalTransition,
  ModalBody,
  ModalTitle,
  ModalHeader,
  ModalFooter,
} from '@atlaskit/modal-dialog';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Checkbox } from '@atlaskit/checkbox';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import Toggle from '@atlaskit/toggle';
import Lorem from 'react-lorem-component';

import GlobalNavigation from '../src';

const DEFAULT_NOTIFICATION_COUNT = 5;

const DrawerContent = ({ drawerTitle, drawerBody }) => (
  <div>
    <h1>{drawerTitle}</h1>
    <div>{drawerBody}</div>

    <label htmlFor="textbox" css={{ display: 'block' }}>
      Type something in the textarea below and see if it is retained
      <textarea id="textbox" input="textbox" type="text" rows="50" cols="50" />
    </label>
  </div>
);

const HelpDropdown = () => (
  <DropdownItemGroup title="Heading">
    <DropdownItem>Hello it with some really quite long text here.</DropdownItem>
    <DropdownItem>Some text 2</DropdownItem>
    <DropdownItem isDisabled>Some disabled text</DropdownItem>
    <DropdownItem>Some more text</DropdownItem>
    <DropdownItem href="//atlassian.com" target="_new">
      A link item
    </DropdownItem>
  </DropdownItemGroup>
);

class GlobalNavWithDrawers extends Component {
  state = {
    isCreateModalOpen: false,
    isSearchDrawerOpen: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyboardShortcut);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyboardShortcut);
  }

  handleKeyboardShortcut = (e) => {
    if (e.key === '\\') {
      if (this.state.isSearchDrawerOpen) return this.closeSearchDrawer();

      return this.openSearchDrawer();
    }
    return null;
  };

  openCreateModal = () => this.setState({ isCreateModalOpen: true });

  closeCreateModal = () => this.setState({ isCreateModalOpen: false });

  openSearchDrawer = () => this.setState({ isSearchDrawerOpen: true });

  closeSearchDrawer = () => {
    this.setState({ isSearchDrawerOpen: false });
  };

  secondaryAction = ({ target }) => console.log(target.innerText);

  onCloseComplete = (node) => console.log('onCloseComplete', node);

  renderCreateDrawerContents = () => (
    <DrawerContent
      drawerTitle="Create drawer"
      drawerBody="You can toggle between a search drawer and the search modal"
    />
  );

  renderSearchDrawerContents = () => (
    <DrawerContent
      drawerTitle="Controlled Search drawer"
      drawerBody="Can be controlled by passing the onSearchClick prop"
    />
  );

  renderStarredDrawerContents = () => (
    <DrawerContent
      drawerTitle="Starred drawer"
      drawerBody="Can be controlled by passing the onStarredClick prop"
    />
  );

  renderHelpDrawerContents = () => (
    <DrawerContent
      drawerTitle="Help drawer"
      drawerBody="Can be controlled by passing the onHelpClick prop"
    />
  );

  renderNotificationDrawerContents = () => (
    <DrawerContent
      drawerTitle="Notification drawer"
      drawerBody="Resets notification count in `onNotificationDrawerOpen` callback"
    />
  );

  renderSettingsDrawerContents = () => (
    <DrawerContent
      drawerTitle="Settings drawer"
      drawerBody="Can be controlled by passing the onSettingsClick prop"
    />
  );

  renderRecentDrawerContents = () => (
    <DrawerContent
      drawerTitle="Recent drawer"
      drawerBody="Can be controlled by passing the onRecentClick prop"
    />
  );

  render() {
    const {
      createItemOpens,
      helpItemOpens,
      notificationCount,
      onNotificationDrawerOpen,
      isRecentDrawerFocusLockEnabled,
      isStarredDrawerFocusLockEnabled,
      isSearchDrawerFocusLockEnabled,
      isCreateDrawerFocusLockEnabled,
      isNotificationDrawerFocusLockEnabled,
      isHelpDrawerFocusLockEnabled,
      isSettingsDrawerFocusLockEnabled,
      unmountOnExit,
    } = this.props;

    return (
      <Fragment>
        <GlobalNavigation
          // Product
          productIcon={() => <AtlassianIcon label="Atlassian" size="medium" />}
          onProductClick={() => console.log('product clicked')}
          // Starred
          starredDrawerContents={this.renderStarredDrawerContents}
          onStarredDrawerCloseComplete={this.onCloseComplete}
          shouldStarredDrawerUnmountOnExit={unmountOnExit}
          isStarredDrawerFocusLockEnabled={isStarredDrawerFocusLockEnabled}
          // Create
          onCreateClick={
            createItemOpens === 'modal' ? this.openCreateModal : null
          }
          onCreateDrawerCloseComplete={this.onCloseComplete}
          createDrawerContents={this.renderCreateDrawerContents}
          shouldCreateDrawerUnmountOnExit={unmountOnExit}
          isCreateDrawerFocusLockEnabled={isCreateDrawerFocusLockEnabled}
          // Search
          onSearchClick={this.openSearchDrawer}
          searchTooltip="Search (\)"
          isSearchDrawerOpen={this.state.isSearchDrawerOpen}
          searchDrawerContents={this.renderSearchDrawerContents}
          onSearchDrawerClose={this.closeSearchDrawer}
          onSearchDrawerCloseComplete={this.onCloseComplete}
          shouldSearchDrawerUnmountOnExit={unmountOnExit}
          isSearchDrawerFocusLockEnabled={isSearchDrawerFocusLockEnabled}
          // Notifications
          notificationDrawerContents={this.renderNotificationDrawerContents}
          onNotificationDrawerOpen={onNotificationDrawerOpen}
          onNotificationDrawerCloseComplete={this.onCloseComplete}
          notificationCount={notificationCount}
          shouldNotificationDrawerUnmountOnExit={unmountOnExit}
          isNotificationDrawerFocusLockEnabled={
            isNotificationDrawerFocusLockEnabled
          }
          // Help
          helpItems={HelpDropdown}
          helpDrawerContents={this.renderHelpDrawerContents}
          onHelpDrawerCloseComplete={this.onCloseComplete}
          shouldHelpDrawerUnmountOnExit={unmountOnExit}
          isHelpDrawerFocusLockEnabled={isHelpDrawerFocusLockEnabled}
          enableHelpDrawer={helpItemOpens === 'drawer'}
          // Settings
          settingsDrawerContents={this.renderSettingsDrawerContents}
          onSettingsDrawerCloseComplete={this.onCloseComplete}
          shouldSettingsDrawerUnmountOnExit={unmountOnExit}
          isSettingsDrawerFocusLockEnabled={isSettingsDrawerFocusLockEnabled}
          // Recent drawer
          recentDrawerContents={this.renderRecentDrawerContents}
          onRecentDrawerCloseComplete={this.onCloseComplete}
          shouldRecentDrawerUnmountOnExit={unmountOnExit}
          isRecentDrawerFocusLockEnabled={isRecentDrawerFocusLockEnabled}
          // define drawer back icon
          drawerBackIcon={CrossIcon}
        />
        <ModalTransition>
          {this.state.isCreateModalOpen && (
            <Modal onClose={this.closeCreateModal}>
              <ModalHeader>
                <ModalTitle>Modal Title</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Lorem count={2} />
              </ModalBody>
              <ModalFooter>
                <Button appearance="subtle" onClick={this.secondaryAction}>
                  Secondary Action
                </Button>
                <Button
                  appearance="primary"
                  autoFocus
                  onClick={this.closeCreateModal}
                >
                  Close
                </Button>
              </ModalFooter>
            </Modal>
          )}
        </ModalTransition>
      </Fragment>
    );
  }
}
// Need two components because both have state
// eslint-disable-next-line react/no-multi-comp
// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component {
  state = {
    createItemOpens: 'modal',
    helpItemOpens: 'menu',
    notificationCount: DEFAULT_NOTIFICATION_COUNT,
    shouldUnmountOnExit: false,
    isRecentDrawerFocusLockEnabled: true,
    isStarredDrawerFocusLockEnabled: true,
    isSearchDrawerFocusLockEnabled: true,
    isCreateDrawerFocusLockEnabled: true,
    isNotificationDrawerFocusLockEnabled: true,
    isHelpDrawerFocusLockEnabled: true,
    isSettingsDrawerFocusLockEnabled: true,
  };

  handleCreateChange = (e) => {
    this.setState({ createItemOpens: e.currentTarget.value });
  };

  handleHelpChange = (e) => {
    this.setState({ helpItemOpens: e.currentTarget.value });
  };

  toggleUnmountBehaviour = () => {
    this.setState(({ shouldUnmountOnExit: unmountOnExitValue }) => ({
      shouldUnmountOnExit: !unmountOnExitValue,
    }));
  };

  clearNotificationCount = () => this.setState({ notificationCount: 0 });

  resetNotificationCount = () =>
    this.setState({ notificationCount: DEFAULT_NOTIFICATION_COUNT });

  // eslint-disable-next-line no-undef
  toggleFocusLock = (ev) => {
    const propName = `is${ev.target.id}FocusLockEnabled`;
    this.setState((state) => ({
      [propName]: !state[propName],
    }));
  };

  renderGlobalNavigation = () => {
    const {
      createItemOpens,
      helpItemOpens,
      notificationCount,
      shouldUnmountOnExit,
      isRecentDrawerFocusLockEnabled,
      isStarredDrawerFocusLockEnabled,
      isSearchDrawerFocusLockEnabled,
      isCreateDrawerFocusLockEnabled,
      isNotificationDrawerFocusLockEnabled,
      isHelpDrawerFocusLockEnabled,
      isSettingsDrawerFocusLockEnabled,
    } = this.state;
    return (
      <GlobalNavWithDrawers
        createItemOpens={createItemOpens}
        helpItemOpens={helpItemOpens}
        notificationCount={notificationCount}
        onNotificationDrawerOpen={this.clearNotificationCount}
        unmountOnExit={shouldUnmountOnExit}
        isRecentDrawerFocusLockEnabled={isRecentDrawerFocusLockEnabled}
        isStarredDrawerFocusLockEnabled={isStarredDrawerFocusLockEnabled}
        isSearchDrawerFocusLockEnabled={isSearchDrawerFocusLockEnabled}
        isCreateDrawerFocusLockEnabled={isCreateDrawerFocusLockEnabled}
        isNotificationDrawerFocusLockEnabled={
          isNotificationDrawerFocusLockEnabled
        }
        isHelpDrawerFocusLockEnabled={isHelpDrawerFocusLockEnabled}
        isSettingsDrawerFocusLockEnabled={isSettingsDrawerFocusLockEnabled}
      />
    );
  };

  render() {
    const {
      createItemOpens,
      helpItemOpens,
      notificationCount,
      shouldUnmountOnExit,
    } = this.state;
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={this.renderGlobalNavigation}
          productNavigation={() => null}
          containerNavigation={() => null}
        >
          <div css={{ padding: '32px 40px' }}>
            <div>
              <StatelessRadioGroup
                items={[
                  {
                    value: 'modal',
                    label: 'Modal',
                    isSelected: createItemOpens === 'modal',
                  },
                  {
                    value: 'drawer',
                    label: 'Drawer',
                    isSelected: createItemOpens === 'drawer',
                  },
                ]}
                label="Create item opens a:"
                onRadioChange={this.handleCreateChange}
              />
            </div>
            <div>
              <StatelessRadioGroup
                items={[
                  {
                    value: 'menu',
                    label: 'Menu',
                    isSelected: helpItemOpens === 'menu',
                  },
                  {
                    value: 'drawer',
                    label: 'Drawer',
                    isSelected: helpItemOpens === 'drawer',
                  },
                ]}
                label="Help opens a:"
                onRadioChange={this.handleHelpChange}
              />
            </div>
            <div css={{ display: 'block', paddingTop: '1rem' }}>
              <Toggle
                isChecked={!shouldUnmountOnExit}
                onChange={this.toggleUnmountBehaviour}
              />{' '}
              Retain drawer contents after closing the drawer.
            </div>
            <h6>Toggle focus lock for:</h6>
            <div
              css={{ display: 'flex', flexDirection: 'row', marginTop: '1rem' }}
            >
              <Checkbox
                label="Recent drawer"
                id="RecentDrawer"
                value="column"
                onChange={this.toggleFocusLock}
                defaultChecked
              />
              <Checkbox
                label="Star drawer"
                id="StarredDrawer"
                value="column"
                onChange={this.toggleFocusLock}
                defaultChecked
              />
              <Checkbox
                label="Search drawer"
                id="SearchDrawer"
                value="column"
                onChange={this.toggleFocusLock}
                defaultChecked
              />
              <Checkbox
                label="Create drawer"
                id="CreateDrawer"
                value="row"
                onChange={this.toggleFocusLock}
                defaultChecked
              />
              <Checkbox
                label="Notification drawer"
                id="NotificationDrawer"
                value="row"
                onChange={this.toggleFocusLock}
                defaultChecked
              />
              <Checkbox
                label="Help drawer"
                id="HelpDrawer"
                value="row"
                onChange={this.toggleFocusLock}
                defaultChecked
              />
              <Checkbox
                label="Settings drawer"
                id="SettingsDrawer"
                value="row"
                onChange={this.toggleFocusLock}
                defaultChecked
              />
            </div>
            <p>
              <Button
                isDisabled={notificationCount === DEFAULT_NOTIFICATION_COUNT}
                onClick={this.resetNotificationCount}
              >
                Reset notifications count
              </Button>
            </p>
          </div>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
