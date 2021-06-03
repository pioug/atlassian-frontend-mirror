/* eslint-disable react/no-multi-comp */

import React, { Fragment, PureComponent } from 'react';

import { Link, Route, withRouter } from 'react-router-dom';

import Avatar from '@atlaskit/avatar';
import Drawer from '@atlaskit/drawer';
import AddIcon from '@atlaskit/icon/glyph/add';
import ChevronDown from '@atlaskit/icon/glyph/chevron-down';
import LinkIcon from '@atlaskit/icon/glyph/link';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { JiraIcon } from '@atlaskit/logo';

import {
  ConnectedItem,
  ContainerHeader,
  GlobalNav,
  ItemAvatar,
  Switcher,
} from '../../src';

export const GlobalLink = ({ className, to, onClick, children }) => {
  return (
    <Link className={className} to={to} onClick={onClick}>
      {children}
    </Link>
  );
};

const globalNavPrimaryItems = ({ onSearchClick }) => [
  {
    id: 'jira',
    icon: ({ label }) => <JiraIcon size="medium" label={label} />,
    label: 'Jira',
    to: '/',
    component: GlobalLink,
  },
  { id: 'search', icon: SearchIcon, onClick: onSearchClick },
  { id: 'create', icon: AddIcon },
];

const globalNavSecondaryItems = [
  { id: 'help', icon: QuestionCircleIcon, label: 'Help', size: 'small' },
  {
    icon: () => <Avatar borderColor="transparent" size="small" />,
    label: 'Profile',
    size: 'small',
    id: 'profile',
  },
];

// ==============================
// Simple global navigation
// ==============================

export class DefaultGlobalNavigation extends PureComponent {
  state = {
    isOpen: false,
  };

  componentDidMount = () => {
    window.addEventListener('keydown', this.handleKeyDown);
  };

  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.handleKeyDown);
  };

  handleKeyDown = ({ key }) => {
    if (key === '/' && !this.state.isOpen) {
      this.toggleSearch();
    }
  };

  toggleSearch = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };

  render() {
    const { isOpen } = this.state;
    return (
      <Fragment>
        <GlobalNav
          primaryItems={globalNavPrimaryItems({
            onSearchClick: this.toggleSearch,
          })}
          secondaryItems={globalNavSecondaryItems}
        />
        <SearchDrawer onClose={this.toggleSearch} isOpen={isOpen}>
          <h2>Test Drawer</h2>
        </SearchDrawer>
      </Fragment>
    );
  }
}
export const SearchDrawer = ({ children, isOpen, onClose }) => (
  <Drawer onClose={onClose} isOpen={isOpen}>
    {children}
  </Drawer>
);

// ==============================
// Project Switcher
// ==============================
const SwitcherBefore = (itemState) => (
  <ItemAvatar itemState={itemState} appearance="square" size="large" />
);
class ProjectSwitcherBase extends PureComponent {
  state = {
    selected: this.props.defaultSelected,
  };

  getTarget = () => {
    const { isSelected } = this.props;
    const { selected } = this.state;

    return (
      <ContainerHeader
        before={SwitcherBefore}
        after={ChevronDown}
        text={selected.text}
        subText={selected.subText}
        isSelected={isSelected}
      />
    );
  };

  onSwitch = (selected) => {
    const { location, history } = this.props;
    if (selected.pathname === location.pathname) return;
    history.push(selected.pathname);
    this.setState({ selected });
  };

  render() {
    const { options } = this.props;
    const { selected } = this.state;

    return (
      <div style={{ paddingBottom: 20 }}>
        <Switcher
          onChange={this.onSwitch}
          create={{
            onClick: () => {
              // eslint-disable-next-line
              const boardName = window.prompt(
                'What would you like to call your new board?',
              );
              if (boardName && boardName.length)
                console.log(`You created the board "${boardName}"`);
            },
            text: 'Create board',
          }}
          options={options}
          isMulti={false}
          hideSelectedOptions
          target={this.getTarget()}
          value={selected}
        />
      </div>
    );
  }
}
export const ProjectSwitcher = withRouter(ProjectSwitcherBase);

export const LinkItem = ({
  itemComponent: Component = ConnectedItem,
  to,
  ...props
}) => {
  return (
    <Route
      render={({ location: { pathname } }) => (
        <Component
          after={() => <LinkIcon size="small" />}
          component={({
            children,
            className,
            innerRef,
            dataset,
            draggableProps,
          }) => (
            <Link
              className={className}
              to={to}
              onClick={props.onClick}
              innerRef={innerRef}
              {...dataset}
              {...draggableProps}
            >
              {children}
            </Link>
          )}
          isSelected={pathname === to}
          {...props}
        />
      )}
    />
  );
};
