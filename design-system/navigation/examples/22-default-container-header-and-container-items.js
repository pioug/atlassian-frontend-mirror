/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import AddIcon from '@atlaskit/icon/glyph/add';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import Button from '@atlaskit/button';
import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import EditorAlignLeftIcon from '@atlaskit/icon/glyph/editor/align-left';
import Lorem from 'react-lorem-component';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import SearchIcon from '@atlaskit/icon/glyph/search';
import Tooltip from '@atlaskit/tooltip';
import { AkSearch } from '@atlaskit/quick-search';

import SecondaryActions from './utils/confluence-example/SecondaryActions';
import Navigation, {
  AkContainerNavigationNested,
  AkCreateDrawer,
  AkNavigationItemGroup,
  AkNavigationItem,
  AkSearchDrawer,
  presetThemes,
  SkeletonDefaultContainerHeader,
  SkeletonContainerItems,
} from '../src';

const BackIcon = (
  <Tooltip position="right" content="Back">
    <ArrowLeftIcon label="Back icon" size="medium" />
  </Tooltip>
);

const ContainerHeaderComponent = ({ stackLength, goBackHome }) => (
  <div>
    <SkeletonDefaultContainerHeader />
    {stackLength > 1 ? (
      <AkNavigationItem
        icon={<ArrowLeftIcon label="Add-ons icon" />}
        onClick={() => goBackHome()}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            goBackHome();
          }
        }}
        text="Add-ons"
      />
    ) : null}
  </div>
);

const GlobalCreateIcon = ({ openDrawer }) => (
  <Tooltip position="right" content="Create">
    <AddIcon
      label="Create icon"
      secondaryColor="inherit"
      size="medium"
      onClick={() => openDrawer('create')}
    />
  </Tooltip>
);

const GlobalSearchIcon = ({ openDrawer }) => (
  <Tooltip position="right" content="Search">
    <SearchIcon
      label="Search icon"
      secondaryColor="inherit"
      size="medium"
      onClick={() => openDrawer('search')}
    />
  </Tooltip>
);

export default class ConfluenceHome extends Component {
  state = {
    isOpen: true,
    menuLoading: true,
    openDrawer: null,
    stack: [<SkeletonContainerItems />],
    width: this.props.width,
  };

  // eslint-disable-next-line no-undef
  menuTimeoutId;

  componentWillUnmount() {
    clearTimeout(this.menuTimeoutId);
  }

  getSearchDrawer = () => (
    <AkSearchDrawer
      backIcon={BackIcon}
      isOpen={this.state.openDrawer === 'search'}
      key="search"
      onBackButton={this.closeDrawer}
      primaryIcon={<ConfluenceIcon label="Confluence icon" size="large" />}
    >
      <AkSearch placeholder="Search..." onKeyDown={() => {}}>
        <AkNavigationItemGroup title="RECENTLY VIEWED">
          <AkNavigationItem
            icon={<EditorAlignLeftIcon label="Editor icon" />}
            text="Article 1"
          />
          <AkNavigationItem
            icon={<EditorAlignLeftIcon label="Editor icon" />}
            text="Article 2"
          />
        </AkNavigationItemGroup>
        <AkNavigationItemGroup title="RECENT SPACES">
          <AkNavigationItem
            icon={<ConfluenceIcon label="Confluence icon" />}
            text="Confluence"
          />
          <AkNavigationItem icon={<JiraIcon label="Jira icon" />} text="Jira" />
        </AkNavigationItemGroup>
      </AkSearch>
    </AkSearchDrawer>
  );

  getCreateDrawer = () => (
    <AkCreateDrawer
      backIcon={BackIcon}
      isOpen={this.state.openDrawer === 'create'}
      key="create"
      onBackButton={this.closeDrawer}
      primaryIcon={<ConfluenceIcon label="Confluence icon" size="large" />}
    >
      <AkNavigationItem text="Item outside a group" />
      <AkNavigationItemGroup title="Create item group">
        <AkNavigationItem
          icon={<ConfluenceIcon label="Confluence icon" />}
          text="Item with an icon"
        />
        <AkNavigationItem
          icon={<JiraIcon label="Jira icon" />}
          text="A really, really, quite long, actually super long container name"
        />
      </AkNavigationItemGroup>
    </AkCreateDrawer>
  );

  openDrawer = name => {
    console.log(`on ${name} drawer open called`);

    this.setState({
      openDrawer: name,
    });
  };

  closeDrawer = () => {
    this.setState({
      openDrawer: null,
    });
  };

  resize = resizeState => {
    console.log('onResize called');
    this.setState({
      isOpen: resizeState.isOpen,
      width: resizeState.width,
    });
  };

  goBackHome = () => {
    if (this.state.stack.length <= 1) {
      return false;
    }

    const stack = this.state.stack.slice(0, this.state.stack.length - 1);
    return this.setState({ stack });
  };

  timerMenu = () => {
    this.menuTimeoutId = setTimeout(
      () => this.setState({ menuLoading: false }),
      2000,
    );
  };

  render() {
    return (
      <Page
        navigation={
          <Navigation
            drawers={[this.getSearchDrawer(), this.getCreateDrawer()]}
            containerTheme={presetThemes.global}
            containerHeaderComponent={() => (
              <ContainerHeaderComponent
                stackLength={this.state.stack.length}
                goBackHome={this.goBackHome}
              />
            )}
            globalCreateIcon={<GlobalCreateIcon openDrawer={this.openDrawer} />}
            globalPrimaryIcon={
              <ConfluenceIcon label="Confluence icon" size="large" />
            }
            globalPrimaryItemHref="//www.atlassian.com/software/confluence"
            globalSearchIcon={<GlobalSearchIcon openDrawer={this.openDrawer} />}
            globalSecondaryActions={
              <SecondaryActions
                timerMenu={this.timerMenu}
                menuLoading={this.state.menuLoading}
              />
            }
            isOpen={this.state.isOpen}
            onResize={this.resize}
            onResizeStart={e => console.log('resizeStart', e)}
            width={this.state.width}
            hasScrollHintTop
          >
            <AkContainerNavigationNested stack={this.state.stack} />
          </Navigation>
        }
      >
        <Grid layout="fixed">
          <GridColumn medium={12}>
            <Button>Raise feedback</Button>
            <h1>Activity</h1>
            <br />
            <Button>Create Space</Button>
            <br />
            <h4>All updates</h4>
            <br />
            <Lorem count="5" />
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}
