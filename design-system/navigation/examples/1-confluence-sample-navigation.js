/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import AddIcon from '@atlaskit/icon/glyph/add';
import AddonIcon from '@atlaskit/icon/glyph/addon';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import Button from '@atlaskit/button';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { ConfluenceIcon, ConfluenceWordmark, JiraIcon } from '@atlaskit/logo';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import DiscoverIcon from '@atlaskit/icon/glyph/discover';
import EditorAlignLeftIcon from '@atlaskit/icon/glyph/editor/align-left';
import EditorFeedbackIcon from '@atlaskit/icon/glyph/editor/feedback';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import Lorem from 'react-lorem-component';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import SearchIcon from '@atlaskit/icon/glyph/search';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import Tooltip from '@atlaskit/tooltip';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import WorldIcon from '@atlaskit/icon/glyph/world';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import { AkSearch } from '@atlaskit/quick-search';

import { getProvided } from '../src/theme/util';
import SecondaryActions from './utils/confluence-example/SecondaryActions';
import Navigation, {
  AkContainerLogo,
  AkContainerNavigationNested,
  AkCreateDrawer,
  AkNavigationItemGroup,
  AkNavigationItem,
  AkSearchDrawer,
  presetThemes,
} from '../src';

const BackIcon = (
  <Tooltip position="right" content="Back">
    <ArrowLeftIcon label="Back icon" size="medium" />
  </Tooltip>
);

const ContainerHeaderComponent = ({ stackLength, goBackHome }) => (
  <div>
    <AkContainerLogo>
      <ConfluenceWordmark />
    </AkContainerLogo>
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
    stack: [
      [
        <AkNavigationItem
          text="Activity"
          icon={<DiscoverIcon label="Activity icon" size="medium" />}
          isSelected
          key="activity"
        />,
        <AkNavigationItem
          text="Your work"
          icon={<TrayIcon label="Your work icon" size="medium" />}
          key="your-work"
        />,
        <AkNavigationItem
          text="Spaces"
          icon={<FolderIcon label="Spaces icon" size="medium" />}
          key="spaces"
        />,
        <AkNavigationItem
          text="People"
          icon={<PeopleIcon label="People icon" size="medium" />}
          key="people"
        />,
        <AkNavigationItem
          action={
            <Button
              appearance="subtle"
              iconBefore={<ChevronRightIcon label="add" size="medium" />}
              spacing="none"
            />
          }
          text="Add-ons"
          onClick={() => this.addOnsNestedNav()}
          icon={<AddonIcon label="Add-ons icon" size="medium" />}
          key="add-ons"
        />,
        <AkNavigationItem
          text="Settings"
          icon={<SettingsIcon label="Settings icon" size="medium" />}
          key="settings"
        />,
        <AkNavigationItemGroup title="New Confluence Experience" key="new-exp">
          <AkNavigationItem
            icon={<EditorFeedbackIcon label="Feedback icon" size="medium" />}
            text="Give feedback"
            key="feedback"
          />
          <AkNavigationItem
            icon={
              <CrossCircleIcon
                secondaryColor={({ theme }) =>
                  getProvided(theme).background.primary
                }
                label="Opt icon"
                size="medium"
              />
            }
            text="Opt out for now"
            key="opt-out"
          />
        </AkNavigationItemGroup>,
        <AkNavigationItemGroup title="My Spaces" key="my-spaces">
          <AkNavigationItem
            icon={<ConfluenceIcon label="Confluence icon" size="medium" />}
            text="Confluence ADG 3"
            key="adg3"
          />
          <AkNavigationItem
            icon={<WorldIcon label="World icon" size="medium" />}
            text="Atlaskit"
            key="atlaskit"
          />
        </AkNavigationItemGroup>,
      ],
    ],
    width: this.props.width,
  };

  // eslint-disable-next-line no-undef
  menuTimeoutId;

  componentWillUnmount() {
    clearTimeout(this.menuTimeoutId);
  }

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

  getSearchDrawer = () => (
    <AkSearchDrawer
      backIcon={BackIcon}
      isOpen={this.state.openDrawer === 'search'}
      key="seach"
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

  addOnsNestedNav = () => {
    this.setState({
      stack: [
        ...this.state.stack,
        [
          <AkNavigationItem
            icon={<CalendarIcon label="Calendar" />}
            text="Calendars"
          />,
          <AkNavigationItem
            icon={<QuestionIcon label="Question" />}
            text="Questions"
          />,
        ],
      ],
    });
  };

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
