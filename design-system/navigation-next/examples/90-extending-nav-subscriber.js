import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Label } from '@atlaskit/field-base';
import AddIcon from '@atlaskit/icon/glyph/add';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { JiraIcon, JiraWordmark } from '@atlaskit/logo';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import Toggle from '@atlaskit/toggle';

import {
  ContainerHeader,
  GlobalNav,
  GroupHeading,
  HeaderSection,
  Item,
  ItemAvatar,
  LayoutManager,
  MenuSection,
  NavigationProvider,
  Separator,
  UIControllerSubscriber,
  Wordmark,
} from '../src';

const gridSize = gridSizeFn();

// ==============================
// Data
// ==============================

const globalNavPrimaryItems = [
  {
    id: 'jira',
    icon: ({ label }) => <JiraIcon size="medium" label={label} />,
    label: 'Jira',
  },
  { id: 'search', icon: SearchIcon },
  { id: 'create', icon: AddIcon },
];

const globalNavSecondaryItems = [
  { id: 'icon-123', icon: QuestionCircleIcon, label: 'Help', size: 'small' },
  {
    id: 'icon-321',
    icon: () => (
      <Avatar
        borderColor="transparent"
        isActive={false}
        isHover={false}
        size="small"
      />
    ),
    label: 'Profile',
    size: 'small',
  },
];

// ==============================
// Render components
// ==============================

const GlobalNavigation = () => (
  <GlobalNav
    primaryItems={globalNavPrimaryItems}
    secondaryItems={globalNavSecondaryItems}
  />
);

const ProductNavigation = () => (
  <div data-webdriver-test-key="product-navigation">
    <HeaderSection>
      {({ className }) => (
        <div className={className}>
          <Wordmark wordmark={JiraWordmark} />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          <Item
            before={DashboardIcon}
            text="Dashboards"
            testKey="product-item-dashboards"
          />
          <Item
            before={FolderIcon}
            text="Projects"
            testKey="product-item-projects"
          />
          <Item
            before={IssuesIcon}
            text="Issues"
            testKey="product-item-issues"
          />
        </div>
      )}
    </MenuSection>
  </div>
);
const ContainerNavigation = () => (
  <div data-webdriver-test-key="container-navigation">
    <HeaderSection>
      {({ css }) => (
        <div
          data-webdriver-test-key="container-header"
          css={{
            ...css,
            paddingBottom: gridSize * 2.5,
          }}
        >
          <ContainerHeader
            before={(itemState) => (
              <ItemAvatar
                itemState={itemState}
                appearance="square"
                size="large"
              />
            )}
            text="My software project"
            subText="Software project"
          />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          <Item
            before={BacklogIcon}
            text="Backlog"
            isSelected
            testKey="container-item-backlog"
          />
          <Item
            before={BoardIcon}
            text="Active sprints"
            testKey="container-item-sprints"
          />
          <Item
            before={GraphLineIcon}
            text="Reports"
            testKey="container-item-reports"
          />
          <Separator />
          <GroupHeading>Shortcuts</GroupHeading>
          <Item before={ShortcutIcon} text="Project space" />
          <Item before={ShortcutIcon} text="Project repo" />
        </div>
      )}
    </MenuSection>
  </div>
);

// ==============================
// Collapse Status Listener
// ==============================

function NOOP() {}

const withNavState = (Comp) => (props) => (
  <UIControllerSubscriber>
    {(nav) => <Comp navState={nav.state} {...props} />}
  </UIControllerSubscriber>
);

class CollapseStatus extends React.Component {
  static defaultProps = {
    onResizeEnd: NOOP,
    onResizeStart: NOOP,
  };

  componentDidUpdate(prevProps) {
    const { onResizeStart, onResizeEnd } = this.props;
    const { isResizing, productNavWidth } = this.props.navState;

    // manual resize
    if (isResizing && !prevProps.navState.isResizing) {
      onResizeStart(productNavWidth);
    }
    if (!isResizing && prevProps.navState.isResizing) {
      onResizeEnd(productNavWidth);
    }
  }

  render() {
    return null;
  }
}
const CollapseStatusListener = withNavState(CollapseStatus);

// ==============================
// Nav Implementation
// ==============================

const Logger = (p) => (
  <div
    {...p}
    css={{
      background: 'Wheat',
      borderRadius: 2,
      fontSize: 12,
      padding: 10,
      marginTop: 16,
      position: 'relative',
      width: 180,
    }}
  />
);

const ResizeBox = ({ pending, width }) => (
  <div
    css={{
      alignItems: 'center',
      background: 'PaleVioletRed',
      borderRadius: 2,
      boxSizing: 'border-box',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontSize: 18,
      height: 200,
      justifyContent: 'center',
      padding: 10,
      transition: 'width 220ms cubic-bezier(0.2, 0, 0, 1)',
      width,
    }}
  >
    <div>
      My width is <code>{width}px</code>
    </div>
    <div style={{ fontSize: 12 }}>{pending ? '(resize pending)' : '・'}</div>
  </div>
);

function makeKey() {
  return Math.random().toString(36).substr(2, 9);
}

// eslint-disable-next-line react/no-multi-comp
class ExtendingNavSubscriber extends React.Component {
  state = {
    callStack: [],
    boxWidth: 'auto',
    resizePending: false,
    isFlyoutAvailable: true,
    isAlternateFlyoutBehaviourEnabled: false,
  };

  componentDidMount() {
    this.updateWidth();
  }

  onEmit = (name) => (value) => {
    const callStack = this.state.callStack.slice(0);
    const key = makeKey();
    callStack.push({ key, name, value });
    this.setState({ callStack });
  };

  getStack = () => {
    const { callStack } = this.state;
    const total = 10;
    const len = callStack.length;
    return len < total ? callStack : callStack.slice(len - total, len);
  };

  onCollapseStart = () => {
    this.onEmit('onCollapseStart')();
    this.makePending();
  };

  onCollapseEnd = () => {
    this.onEmit('onCollapseEnd')();
    this.updateWidth();
  };

  onExpandStart = () => {
    if (this.props.navState.isResizing) return; // ignore expand events when resizing
    this.onEmit('onExpandStart')();
    this.makePending();
  };

  onExpandEnd = () => {
    if (this.props.navState.isResizing) return; // ignore expand events when resizing
    this.onEmit('onExpandEnd')();
    this.updateWidth();
  };

  onResizeEnd = () => {
    this.onEmit('onResizeEnd')();
    this.updateWidth();
  };

  onResizeStart = () => {
    this.onEmit('onResizeStart')();
    this.makePending();
  };

  updateWidth = () => {
    const { isCollapsed, productNavWidth } = this.props.navState;
    const less = (isCollapsed ? 0 : productNavWidth) + 64;
    const boxWidth = window.innerWidth - less - 32;
    this.setState({ boxWidth, resizePending: false });
  };

  makePending = () => {
    this.setState({ resizePending: true });
  };

  onFlyoutToggle = () => {
    this.setState((state) => ({ isFlyoutAvailable: !state.isFlyoutAvailable }));
  };

  onAlternateBehaviourToggle = () => {
    this.setState((state) => ({
      isAlternateFlyoutBehaviourEnabled: !state.isAlternateFlyoutBehaviourEnabled,
    }));
  };

  render() {
    const {
      boxWidth,
      resizePending,
      isFlyoutAvailable,
      isAlternateFlyoutBehaviourEnabled,
    } = this.state;
    const lastTen = this.getStack();

    return (
      <LayoutManager
        globalNavigation={GlobalNavigation}
        productNavigation={ProductNavigation}
        containerNavigation={ContainerNavigation}
        onCollapseStart={this.onCollapseStart}
        onCollapseEnd={this.onCollapseEnd}
        onExpandStart={this.onExpandStart}
        onExpandEnd={this.onExpandEnd}
        experimental_flyoutOnHover={isFlyoutAvailable}
        experimental_alternateFlyoutBehaviour={
          isAlternateFlyoutBehaviourEnabled
        }
        experimental_fullWidthFlyout={false}
      >
        <CollapseStatusListener
          onResizeEnd={this.onResizeEnd}
          onResizeStart={this.onResizeStart}
        />
        <div>
          <ResizeBox width={boxWidth} pending={resizePending} />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <Label label="Toggle flyout on hover (experimental)" />
              <Toggle
                isChecked={isFlyoutAvailable}
                onChange={this.onFlyoutToggle}
              />
              <Label label="Toggle alternate hover behaviour (experimental)" />
              <Toggle
                isChecked={isAlternateFlyoutBehaviourEnabled}
                onChange={this.onAlternateBehaviourToggle}
              />
            </div>
            <Logger>
              <button
                style={{ position: 'absolute', right: 10, top: 10 }}
                onClick={() => this.setState({ callStack: [] })}
              >
                Clear
              </button>
              {lastTen.length ? (
                lastTen.map((e) => (
                  <div key={e.key}>
                    <code>
                      {e.name}({e.value})
                    </code>
                  </div>
                ))
              ) : (
                <div>Events logged here...</div>
              )}
            </Logger>
          </div>
        </div>
      </LayoutManager>
    );
  }
}

const ExtendedNavSubscriber = withNavState(ExtendingNavSubscriber);
export default () => (
  <NavigationProvider>
    <ExtendedNavSubscriber />
  </NavigationProvider>
);
