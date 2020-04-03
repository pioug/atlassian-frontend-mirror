/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import styled from 'styled-components';
import AddIcon from '@atlaskit/icon/glyph/add';
import StarIcon from '@atlaskit/icon/glyph/star';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import Button from '@atlaskit/button';
import { ConfluenceIcon } from '@atlaskit/logo';
import Lorem from 'react-lorem-component';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import SearchIcon from '@atlaskit/icon/glyph/search';
import Tooltip from '@atlaskit/tooltip';
import { gridSize } from '@atlaskit/theme';

import SecondaryActions from './utils/confluence-example/SecondaryActions';
import Navigation, {
  AkContainerNavigationNested,
  AkGlobalItem,
  AkCreateDrawer,
  AkCustomDrawer,
  AkNavigationItem,
  AkSearchDrawer,
  presetThemes,
  SkeletonDefaultContainerHeader,
  SkeletonContainerItems,
} from '../src';

const SkeletonItemsWrapper = styled.div`
  padding-right: ${gridSize() * 3}px;
`;

const BackIcon = (
  <Tooltip position="right" content="Back">
    <ArrowLeftIcon label="Back icon" size="medium" />
  </Tooltip>
);

const ContainerHeaderComponent = ({ stackLength, goBackHome }) => (
  <div key={1}>
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

const GlobalSearchIcon = ({ openDrawer }) => (
  <Tooltip content="Search Icon" position="right">
    <AkGlobalItem size="medium" onClick={() => openDrawer('search')}>
      <SearchIcon />
    </AkGlobalItem>
  </Tooltip>
);

const GlobalCreateIcon = ({ openDrawer }) => (
  <Tooltip content="Create Icon" position="right">
    <AkGlobalItem size="medium" onClick={() => openDrawer('create')}>
      <AddIcon />
    </AkGlobalItem>
  </Tooltip>
);

const StarDrawerIcon = ({ openDrawer }) => (
  <Tooltip content="Custom Drawer Icon" position="right">
    <AkGlobalItem size="medium" onClick={() => openDrawer('custom')}>
      <StarIcon />
    </AkGlobalItem>
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

  getStarCustomDrawer = () => (
    <AkCustomDrawer
      backIcon={BackIcon}
      isOpen={this.state.openDrawer === 'custom'}
      key="custom"
      primaryIcon={<ConfluenceIcon label="Confluence icon" size="large" />}
      header={<SkeletonDefaultContainerHeader isAvatarHidden />}
      onBackButton={this.closeDrawer}
    >
      <SkeletonItemsWrapper>
        <SkeletonContainerItems itemTextWidth="100%" />
      </SkeletonItemsWrapper>
    </AkCustomDrawer>
  );

  getSearchDrawer = () => (
    <AkSearchDrawer
      backIcon={BackIcon}
      isOpen={this.state.openDrawer === 'search'}
      key="search"
      primaryIcon={<ConfluenceIcon label="Confluence icon" size="large" />}
      onBackButton={this.closeDrawer}
    >
      <SkeletonItemsWrapper>
        <SkeletonContainerItems itemTextWidth="100%" />
      </SkeletonItemsWrapper>
    </AkSearchDrawer>
  );

  getCreateDrawer = () => (
    <AkCreateDrawer
      backIcon={BackIcon}
      isOpen={this.state.openDrawer === 'create'}
      key="create"
      primaryIcon={<ConfluenceIcon label="Confluence icon" size="large" />}
      onBackButton={this.closeDrawer}
    >
      <SkeletonItemsWrapper>
        <SkeletonContainerItems itemTextWidth="100%" />
      </SkeletonItemsWrapper>
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
            drawers={[
              this.getSearchDrawer(),
              this.getCreateDrawer(),
              this.getStarCustomDrawer(),
            ]}
            containerTheme={presetThemes.global}
            containerHeaderComponent={() => (
              <ContainerHeaderComponent
                stackLength={this.state.stack.length}
                goBackHome={this.goBackHome}
              />
            )}
            globalPrimaryIcon={
              <ConfluenceIcon label="Confluence icon" size="large" />
            }
            globalPrimaryItemHref="//www.atlassian.com/software/confluence"
            globalPrimaryActions={[
              <StarDrawerIcon openDrawer={this.openDrawer} />,
              <GlobalSearchIcon openDrawer={this.openDrawer} />,
              <GlobalCreateIcon openDrawer={this.openDrawer} />,
            ]}
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
