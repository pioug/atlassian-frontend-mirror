/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';

import { AtlassianIcon } from '@atlaskit/logo';
import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';

import Page from '@atlaskit/page';
import Tooltip from '@atlaskit/tooltip';
import Button, { ButtonGroup } from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import { Checkbox } from '@atlaskit/checkbox';
import { Label } from '@atlaskit/field-base';
import { AkSearch } from '@atlaskit/quick-search';

import Navigation, {
  AkNavigationItemGroup,
  AkSearchDrawer,
  AkNavigationItem,
  AkCustomDrawer,
  AkCreateDrawer,
  AkContainerTitle,
  presetThemes,
} from '../src';

const items = ['cat', 'dog', 'fish', 'lizard'];

const NavigationTitle = () => (
  <Tooltip key="1" position="right" content="Header tooltip text">
    <AkContainerTitle
      icon={<AtlassianIcon label="Atlassian" />}
      text="NavTitle"
    />
  </Tooltip>
);

const NavOptionsGroup = ({ compactItems, showIcon }) => (
  <Fragment>
    <AkNavigationItemGroup title="All Nav Item Options">
      <AkNavigationItem
        icon={
          showIcon ? <AtlassianIcon label="Atlassian" size="small" /> : null
        }
        isCompact={compactItems}
        text="Auto focused item"
        autoFocus
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="Basic Item"
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="Selected Item"
        isSelected
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="Basic Link"
        href="/examples/core/navigation/basic"
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="text"
        caption="a caption"
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="With Icon"
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="With drop icon"
        isDropdownTrigger
        dropIcon={<AtlassianIcon label="Atlassian" />}
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="On Click"
        onClick={e => console.log('click event', e)}
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="On key down"
        onKeyDown={e => console.log('key down', e)}
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="With Mouse Events"
        onMouseEnter={e => console.log('mouse enter', e)}
        onMouseLeave={e => console.log('mouse leave', e)}
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="With subtext"
        subText="Subtly rendered"
      />
      <AkNavigationItem
        icon={showIcon ? <AtlassianIcon label="Atlassian" /> : null}
        isCompact={compactItems}
        text="With text after"
        textAfter="Afterthoughts"
      />
    </AkNavigationItemGroup>
    <AkNavigationItemGroup title="Second Group">
      <AkNavigationItem text="Second Group Filler" />
    </AkNavigationItemGroup>
  </Fragment>
);

const AdditionalGroups = () => (
  <Fragment>
    <AkNavigationItemGroup title="Has Separator" hasSeparator>
      <AkNavigationItem text="Inside Separated Group" />
    </AkNavigationItemGroup>
    <AkNavigationItemGroup>
      <AkNavigationItem text="Item Group without heading" />
    </AkNavigationItemGroup>
  </Fragment>
);

const CreateDrawer = ({ drawerIsOpen, closeDrawer }) => (
  <AkCreateDrawer
    backIcon={<ArrowLeft label="Back" />}
    isOpen={drawerIsOpen}
    onBackButton={closeDrawer}
    primaryIcon={null}
    header="Welcome to a create drawer"
  >
    Some Content
  </AkCreateDrawer>
);

class CustomDrawer extends Component {
  state = {
    width: 'narrow',
    iconOffset: 70,
  };

  setIconOffset = e =>
    e.target.value && this.setState({ iconOffset: e.target.value });

  setWidthNarrow = () => this.setState({ width: 'narrow' });

  setWidthWide = () => this.setState({ width: 'wide' });

  setWidthFull = () => this.setState({ width: 'full' });

  render() {
    const { drawerIsOpen, closeDrawer } = this.props;
    const { width, iconOffset } = this.state;

    return (
      <AkCustomDrawer
        backIcon={<ArrowLeft label="Back" />}
        primaryIcon={<AtlassianIcon label="Back" />}
        isOpen={drawerIsOpen}
        iconOffset={iconOffset || 0}
        width={width}
        onBackButton={closeDrawer}
        header="Let's explore a custom drawer"
      >
        <h3>Width:</h3>
        <ButtonGroup>
          <Button onClick={this.setWidthNarrow}>Narrow</Button>
          <Button onClick={this.setWidthWide}>Wide</Button>
          <Button onClick={this.setWidthFull}>Full</Button>
        </ButtonGroup>
        <h3>Set iconOffset</h3>
        <Label htmlFor="icon-offset" label="Stateless Text Input Example" />
        <TextField
          id="icon-offset"
          type="number"
          onChange={this.setIconOffset}
          value={iconOffset}
          width="small"
        />
      </AkCustomDrawer>
    );
  }
}

class SearchDrawer extends Component {
  state = {
    value: '',
  };

  render() {
    const { drawerIsOpen, closeDrawer } = this.props;

    return (
      <AkSearchDrawer
        backIcon={<ArrowLeft label="Back" />}
        primaryIcon={null}
        isOpen={drawerIsOpen}
        onBackButton={closeDrawer}
      >
        <AkSearch
          onSearchClear={() => this.setState({ value: '' })}
          onInput={e => this.setState({ value: e.target.value })}
          value={this.state.value}
        >
          {items
            .filter(item => item.includes(this.state.value))
            .map(item => (
              <AkNavigationItem key={item} text={item} />
            ))}
        </AkSearch>
      </AkSearchDrawer>
    );
  }
}

class ExampleNav extends Component {
  state = {
    isOpen: true,
    openDrawer: false,
    showIcon: false,
    compactItems: false,
    value: '',
    containerThemeName: 'container',
    globalThemeName: 'global',
    width: 304,
  };

  closeDrawer = () => this.setState({ openDrawer: false });

  openSearchDrawer = () => this.setState({ openDrawer: 'searchDrawer' });

  openCreateDrawer = () => this.setState({ openDrawer: 'createDrawer' });

  openCustomDrawer = () => this.setState({ openDrawer: 'customDrawer' });

  toggleNavCollapse = () => this.setState({ isOpen: !this.state.isOpen });

  // eslint-disable-next-line no-undef
  setCompact = e => this.setState({ compactItems: e.target.checked });

  // eslint-disable-next-line no-undef
  setShowIcon = e => this.setState({ showIcon: e.target.checked });

  handleResize = pr => this.setState(pr);

  render() {
    const {
      isOpen,
      openDrawer,
      compactItems,
      showIcon,
      width,
      globalThemeName,
      containerThemeName,
    } = this.state;

    return (
      <Page
        navigation={
          <Navigation
            globalTheme={presetThemes[globalThemeName]}
            containerTheme={presetThemes[containerThemeName]}
            isOpen={isOpen}
            width={width}
            onResize={this.handleResize}
            globalPrimaryIcon={
              <AtlassianIcon size="xlarge" label="Atlassian" />
            }
            globalPrimaryItemHref="/components/navigation"
            globalSearchIcon={
              <Tooltip key="1" position="right" content="Let's Search">
                <SearchIcon label="search" />
              </Tooltip>
            }
            globalCreateIcon={
              <Tooltip key="1" position="right" content="Create Stuff">
                <CreateIcon label="search" />
              </Tooltip>
            }
            onSearchDrawerOpen={this.openSearchDrawer}
            onCreateDrawerOpen={this.openCreateDrawer}
            drawers={[
              <SearchDrawer
                key="searchDrawer"
                drawerIsOpen={openDrawer === 'searchDrawer'}
                closeDrawer={this.closeDrawer}
              />,
              <CreateDrawer
                key="createDrawer"
                drawerIsOpen={openDrawer === 'createDrawer'}
                closeDrawer={this.closeDrawer}
              />,
              <CustomDrawer
                key="customDrawer"
                drawerIsOpen={openDrawer === 'customDrawer'}
                closeDrawer={this.closeDrawer}
              />,
            ]}
            containerHeaderComponent={NavigationTitle}
          >
            <NavOptionsGroup compactItems={compactItems} showIcon={showIcon} />
            <AdditionalGroups />
            <Filler />
          </Navigation>
        }
      >
        <div>
          This Example includes almost every feature we have in navigation to
          allow you to explore. We recomend digging in to its code to find out
          how something was implemented.
        </div>
        <Button onClick={this.openCustomDrawer}>Open Custom Drawer</Button>
        <div>
          <Checkbox
            value="compact"
            name="compact"
            label="compact items"
            onChange={this.setCompact}
          />
        </div>
        <div>
          <Checkbox
            value="icons"
            name="icons"
            label="show icons"
            onChange={this.setShowIcon}
          />
        </div>
        <h3>Change the Theme</h3>
        <h4>Global Theme</h4>
        <ButtonGroup>
          {Object.keys(presetThemes).map(t => (
            <Button
              isSelected={t === globalThemeName}
              onClick={() => this.setState({ globalThemeName: t })}
              key={t}
            >
              {t}
            </Button>
          ))}
        </ButtonGroup>
        <h4>Container Theme</h4>
        <ButtonGroup>
          {Object.keys(presetThemes).map(t => (
            <Button
              isSelected={t === containerThemeName}
              onClick={() => this.setState({ containerThemeName: t })}
              key={t}
            >
              {t}
            </Button>
          ))}
        </ButtonGroup>
      </Page>
    );
  }
}

export default ExampleNav;

const Filler = () => (
  <AkNavigationItemGroup title="items to ensure scroll">
    <AkNavigationItem text="April is the cruellest month, breeding" />
    <AkNavigationItem text="Lilacs out of the dead land, mixing" />
    <AkNavigationItem text="Memory and desire, stirring" />
    <AkNavigationItem text="Dull roots with spring rain." />
    <AkNavigationItem text="Winter kept us warm, covering" />
    <AkNavigationItem text="Earth in forgetful snow, feeding" />
    <AkNavigationItem text="A little life with dried tubers." />
    <AkNavigationItem text="Summer surprised us, coming over the Starnbergersee" />
    <AkNavigationItem text="With a shower of rain; we stopped in the colonnade," />
    <AkNavigationItem text="And went on in sunlight, into the Hofgarten," />
    <AkNavigationItem text="And drank coffee, and talked for an hour." />
    <AkNavigationItem text="Bin gar keine Russin, stamm’ aus Litauen, echt deutsch." />
    <AkNavigationItem text="And when we were children, staying at the arch-duke’s," />
    <AkNavigationItem text="My cousin’s, he took me out on a sled," />
    <AkNavigationItem text="And I was frightened. He said, Marie," />
    <AkNavigationItem text="Marie, hold on tight. And down we went." />
    <AkNavigationItem text="In the mountains, there you feel free." />
    <AkNavigationItem text="I read, much of the night, and go south in the winter." />
  </AkNavigationItemGroup>
);
