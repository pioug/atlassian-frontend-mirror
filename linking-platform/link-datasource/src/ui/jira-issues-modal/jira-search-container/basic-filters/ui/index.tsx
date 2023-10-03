import React from 'react';

import ProjectFilter from './containers/project';

const BasicFilterContainer = () => {
  return (
    <div data-testid="jlol-datasource-basic-filter-container">
      <ProjectFilter />
      {/* <TypeFilter />
      <StatusFilter />
      <AssigneeFilter /> */}
    </div>
  );
};

export default BasicFilterContainer;
