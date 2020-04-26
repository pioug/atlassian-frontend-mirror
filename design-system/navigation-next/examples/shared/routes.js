/* eslint-disable react/no-multi-comp */

import React, { Component, Fragment } from 'react';

import { Link } from 'react-router-dom';

import { withNavigationViewController } from '../../src';

import ShortcutsPlugin from './shortcuts-plugin';

class SetActiveViewBase extends Component {
  componentDidMount() {
    const { id, navigationViewController } = this.props;
    const { containerViewId, productViewId } = navigationViewController.state;
    if (id !== containerViewId && id !== productViewId) {
      navigationViewController.setView(id);
    }
  }

  render() {
    return null;
  }
}
const SetActiveView = withNavigationViewController(SetActiveViewBase);

/**
 * Root-level routes
 */
export const DashboardsView = () => (
  <Fragment>
    <SetActiveView id="root/index" />
    <h1>Dashboards</h1>
    <p>Hello here are your dashboards.</p>
  </Fragment>
);

export const ProjectsView = () => (
  <Fragment>
    <SetActiveView id="root/index" />
    <h1>Projects</h1>
    <p>Hello here are your projects.</p>
    <h3>
      <Link to="/projects/endeavour">Endeavour</Link>
    </h3>
  </Fragment>
);

export const SearchIssuesView = () => (
  <Fragment>
    <SetActiveView id="root/issues" />
    <h1>Search issues</h1>
    <p>Hello search for your issues here.</p>
  </Fragment>
);

export const IssuesView = ({ match }) => (
  <Fragment>
    <SetActiveView id="container/project/index" />
    <h1>Issue - {match && match.params && match.params.issueId}</h1>
    <p>Issue content</p>
  </Fragment>
);

export const FiltersView = ({ match }) => (
  <Fragment>
    <SetActiveView id="root/issues" />
    <h1>Filter - {match && match.params && match.params.filterId}</h1>
    <p>Filter content</p>
  </Fragment>
);

/**
 * Container-level routes
 */
export class BacklogView extends Component {
  render() {
    return (
      <Fragment>
        <SetActiveView id="container/project/index" />
        <h1>Backlog</h1>
        <p>Hello this is the backlog.</p>
        <p>
          <Link to="/">Go back home</Link>
        </p>
        <ShortcutsPlugin />
      </Fragment>
    );
  }
}

export const routes = [
  {
    path: '/projects/:projectId',
    component: BacklogView,
  },
  {
    path: '/projects',
    component: ProjectsView,
  },
  {
    path: '/issues/:issueId',
    component: IssuesView,
  },
  {
    path: '/filters/:filterId',
    component: FiltersView,
  },
  {
    path: '/',
    component: DashboardsView,
  },
];
