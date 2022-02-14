import React from 'react';

const AsyncNoAccessTooltip = React.lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_@atlaskit/mention/no-access-tooltip" */ './main'
  ).then((module) => {
    return {
      default: module.NoAccessTooltip,
    };
  }),
);

export default AsyncNoAccessTooltip;
