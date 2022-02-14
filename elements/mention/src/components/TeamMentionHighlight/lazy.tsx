import React from 'react';

export const LazyTeamMentionHighlight = React.lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_@atlassian/mention/TeamMentionHighlight" */ './'
  ).then((module) => ({
    default: module.default,
  })),
);
