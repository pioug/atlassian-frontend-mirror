import React, { Fragment } from 'react';

import HomeView from './home';
import IssuesView from './issues';
import SortableIssuesView from './sortable-issues';

const ProjectViews = () => (
  <Fragment>
    <HomeView />
    <IssuesView />
    <SortableIssuesView />
  </Fragment>
);

export default ProjectViews;
