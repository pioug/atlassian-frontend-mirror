import React from 'react';

const AsyncCustomOption = React.lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/custom-option" */ './main'
  ).then((module) => {
    return {
      default: module.CustomOption,
    };
  }),
);

export default AsyncCustomOption;
