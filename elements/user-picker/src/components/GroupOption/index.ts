import React from 'react';

const AsyncGroupOption = React.lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/group-option" */ './main'
  ).then((module) => {
    return {
      default: module.GroupOption,
    };
  }),
);

export default AsyncGroupOption;
