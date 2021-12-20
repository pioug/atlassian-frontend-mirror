import React from 'react';

const AsyncEmailOption = React.lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/email-option" */ './main'
  ).then((module) => {
    return {
      default: module.EmailOption,
    };
  }),
);

export default AsyncEmailOption;
